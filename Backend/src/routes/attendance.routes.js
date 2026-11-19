import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

function isValidDateOnly(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

async function getStaffId(profileId) {
  const { data, error } = await supabaseAdmin
    .from('staff').select('id').eq('profile_id', profileId).maybeSingle();
  if (error) throw error;
  return data?.id;
}

async function getOwnedApplication(applicationId, staffId, includeStatus = false) {
  let query = supabaseAdmin.from('applications')
    .select(`id${includeStatus ? ', status' : ''}, internship:internships!inner(staff_id)`)
    .eq('id', applicationId);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  if (!data) return { missing: true };
  if (data.internship.staff_id !== staffId) return { forbidden: true };
  return { application: data };
}

// Progresso disponível somente ao estudante autenticado.
router.get('/progress/mine', async (req, res) => {
  if (req.profile.role !== 'student') {
    return res.status(403).json({ error: 'Apenas estudantes podem consultar o progresso.' });
  }
  try {
    const { data: student, error: studentError } = await supabaseAdmin
      .from('students').select('id').eq('profile_id', req.profile.id).maybeSingle();
    if (studentError) throw studentError;
    if (!student) return res.status(403).json({ error: 'Cadastro de estudante não encontrado.' });

    const { data, error } = await supabaseAdmin
      .from('internship_progress').select('*').eq('student_id', student.id);
    if (error) throw error;
    return res.json({ progress: data });
  } catch (error) {
    console.error('Erro ao consultar progresso:', error);
    return res.status(500).json({ error: 'Não foi possível consultar o progresso do estágio.' });
  }
});

// Histórico de frequência de uma inscrição administrada pelo servidor autenticado.
router.get('/:applicationId', async (req, res) => {
  if (req.profile.role !== 'staff') {
    return res.status(403).json({ error: 'Apenas servidores podem consultar frequência.' });
  }
  try {
    const staffId = await getStaffId(req.profile.id);
    if (!staffId) return res.status(403).json({ error: 'Cadastro de servidor não encontrado.' });

    const ownership = await getOwnedApplication(req.params.applicationId, staffId);
    if (ownership.missing) return res.status(404).json({ error: 'Inscrição não encontrada.' });
    if (ownership.forbidden) return res.status(403).json({ error: 'Você não administra esta inscrição.' });

    const { data, error } = await supabaseAdmin.from('attendance')
      .select('id, attendance_date, status, hours_worked, notes')
      .eq('application_id', req.params.applicationId)
      .order('attendance_date', { ascending: false });
    if (error) throw error;
    return res.json({ attendance: data });
  } catch (error) {
    console.error('Erro ao consultar frequência:', error);
    return res.status(500).json({ error: 'Não foi possível consultar a frequência.' });
  }
});

// Registra ou corrige a frequência de uma data, sem permitir acesso a vagas de outro servidor.
router.post('/:applicationId', async (req, res) => {
  if (req.profile.role !== 'staff') {
    return res.status(403).json({ error: 'Apenas servidores podem registrar frequência.' });
  }

  const { attendance_date, status, hours_worked, notes } = req.body || {};
  const hours = typeof hours_worked === 'number' ? hours_worked : Number(hours_worked);
  if (!isValidDateOnly(attendance_date) || !['present', 'absent'].includes(status) ||
      !Number.isFinite(hours) || hours < 0 || (status === 'absent' && hours !== 0) ||
      (notes !== undefined && notes !== null && typeof notes !== 'string')) {
    return res.status(400).json({
      error: 'Informe uma data válida, presença/falta e horas não negativas. Faltas devem ter zero hora.'
    });
  }

  try {
    const staffId = await getStaffId(req.profile.id);
    if (!staffId) return res.status(403).json({ error: 'Cadastro de servidor não encontrado.' });

    const ownership = await getOwnedApplication(req.params.applicationId, staffId, true);
    if (ownership.missing) return res.status(404).json({ error: 'Inscrição não encontrada.' });
    if (ownership.forbidden) return res.status(403).json({ error: 'Você não administra esta inscrição.' });
    if (ownership.application.status !== 'approved') {
      return res.status(409).json({ error: 'A frequência só pode ser registrada para inscrições aprovadas.' });
    }

    const { data, error } = await supabaseAdmin.from('attendance').upsert({
      application_id: req.params.applicationId,
      attendance_date,
      status,
      hours_worked: status === 'absent' ? 0 : hours,
      recorded_by: staffId,
      notes: typeof notes === 'string' ? (notes.trim() || null) : null
    }, { onConflict: 'application_id,attendance_date' }).select().single();

    if (error) throw error;
    return res.status(200).json({ attendance: data });
  } catch (error) {
    console.error('Erro ao salvar frequência:', error);
    if (error.code === '23503') {
      return res.status(400).json({ error: 'A inscrição informada não é válida.' });
    }
    return res.status(500).json({ error: 'Não foi possível salvar a frequência.' });
  }
});

export default router;
