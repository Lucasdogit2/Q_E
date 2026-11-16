import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/progress/mine', async (req, res) => {
  if (req.profile.role !== 'student') return res.status(403).json({ error: 'Apenas estudantes podem consultar o progresso.' });
  const { data: student, error: studentError } = await supabaseAdmin
    .from('students').select('id').eq('profile_id', req.profile.id).maybeSingle();
  if (studentError || !student) return res.status(403).json({ error: 'Cadastro de estudante não encontrado.' });

  const { data, error } = await supabaseAdmin
    .from('internship_progress').select('*').eq('student_id', student.id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ progress: data });
});

router.get('/:applicationId', async (req, res) => {
  if (req.profile.role !== 'staff') return res.status(403).json({ error: 'Apenas servidores podem consultar frequência.' });
  const { data: staff, error: staffError } = await supabaseAdmin
    .from('staff').select('id').eq('profile_id', req.profile.id).maybeSingle();
  if (staffError || !staff) return res.status(403).json({ error: 'Cadastro de servidor não encontrado.' });

  const { data: application, error: appError } = await supabaseAdmin
    .from('applications').select('id, internship:internships!inner(staff_id)')
    .eq('id', req.params.applicationId).maybeSingle();
  if (appError || !application) return res.status(404).json({ error: 'Inscrição não encontrada.' });
  if (application.internship.staff_id !== staff.id) return res.status(403).json({ error: 'Você não administra esta inscrição.' });

  const { data, error } = await supabaseAdmin.from('attendance')
    .select('id, attendance_date, status, hours_worked, notes')
    .eq('application_id', req.params.applicationId)
    .order('attendance_date', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ attendance: data });
});

router.post('/:applicationId', async (req, res) => {
  if (req.profile.role !== 'staff') return res.status(403).json({ error: 'Apenas servidores podem registrar frequência.' });
  const { attendance_date, status, hours_worked, notes } = req.body || {};
  if (!attendance_date || !['present', 'absent'].includes(status) ||
      !Number.isFinite(Number(hours_worked)) || Number(hours_worked) < 0 ||
      (status === 'absent' && Number(hours_worked) !== 0)) {
    return res.status(400).json({ error: 'Informe data, presença/falta e horas válidas. Faltas devem ter zero hora.' });
  }

  const { data: staff, error: staffError } = await supabaseAdmin
    .from('staff').select('id').eq('profile_id', req.profile.id).maybeSingle();
  if (staffError || !staff) return res.status(403).json({ error: 'Cadastro de servidor não encontrado.' });

  const { data: application, error: appError } = await supabaseAdmin
    .from('applications').select('id, status, internship:internships!inner(staff_id)')
    .eq('id', req.params.applicationId).maybeSingle();
  if (appError || !application) return res.status(404).json({ error: 'Inscrição não encontrada.' });
  if (application.internship.staff_id !== staff.id) return res.status(403).json({ error: 'Você não administra esta inscrição.' });
  if (application.status !== 'approved') return res.status(409).json({ error: 'A frequência só pode ser registrada para inscrições aprovadas.' });

  const { data, error } = await supabaseAdmin.from('attendance').upsert({
    application_id: req.params.applicationId,
    attendance_date,
    status,
    hours_worked: status === 'absent' ? 0 : Number(hours_worked),
    recorded_by: staff.id,
    notes: notes?.trim() || null
  }, { onConflict: 'application_id,attendance_date' }).select().single();

  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json({ attendance: data });
});

export default router;
