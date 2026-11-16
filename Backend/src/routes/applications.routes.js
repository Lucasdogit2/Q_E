import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/mine', async (req, res) => {
  if (req.profile.role !== 'student') return res.status(403).json({ error: 'Apenas estudantes podem consultar suas inscrições.' });
  const { data: student, error: studentError } = await supabaseAdmin
    .from('students').select('id').eq('profile_id', req.profile.id).maybeSingle();
  if (studentError || !student) return res.status(403).json({ error: 'Cadastro de estudante não encontrado.' });

  const { data, error } = await supabaseAdmin.from('applications')
    .select('id, status, message, applied_at, decided_at, internship:internships(id, title, required_hours, start_date, end_date, location, area)')
    .eq('student_id', student.id).order('applied_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ applications: data });
});

router.get('/pending', async (req, res) => {
  if (req.profile.role !== 'staff') return res.status(403).json({ error: 'Apenas servidores podem consultar solicitações.' });
  const { data: staff, error: staffError } = await supabaseAdmin
    .from('staff').select('id').eq('profile_id', req.profile.id).maybeSingle();
  if (staffError || !staff) return res.status(403).json({ error: 'Cadastro de servidor não encontrado.' });

  const { data: internships, error: internshipsError } = await supabaseAdmin
    .from('internships').select('id').eq('staff_id', staff.id);
  if (internshipsError) return res.status(500).json({ error: internshipsError.message });
  const ids = (internships || []).map((item) => item.id);
  if (!ids.length) return res.json({ applications: [] });

  const { data, error } = await supabaseAdmin.from('applications')
    .select('id, status, message, applied_at, internship_id, student:students(id, registration, course, academic_year, profile:profiles(full_name, email))')
    .in('internship_id', ids).eq('status', 'pending')
    .order('applied_at', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ applications: data });
});

router.get('/approved', async (req, res) => {
  if (req.profile.role !== 'staff') return res.status(403).json({ error: 'Apenas servidores podem consultar estagiários.' });
  const { data: staff, error: staffError } = await supabaseAdmin
    .from('staff').select('id').eq('profile_id', req.profile.id).maybeSingle();
  if (staffError || !staff) return res.status(403).json({ error: 'Cadastro de servidor não encontrado.' });
  const { data: internships, error: internshipsError } = await supabaseAdmin
    .from('internships').select('id, title').eq('staff_id', staff.id);
  if (internshipsError) return res.status(500).json({ error: internshipsError.message });
  const ids = (internships || []).map(v => v.id);
  if (!ids.length) return res.json({ applications: [] });
  const { data, error } = await supabaseAdmin.from('applications')
    .select('id, internship_id, status, student:students(id, registration, course, profile:profiles(full_name))')
    .in('internship_id', ids).eq('status', 'approved');
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ applications: data });
});

// A decisão é executada no PostgreSQL em uma única transação.
// A função bloqueia a vaga antes de contar aprovações, evitando exceder vacancies.
router.patch('/:id/decision', async (req, res) => {
  if (req.profile.role !== 'staff') return res.status(403).json({ error: 'Apenas servidores podem decidir solicitações.' });
  const { status } = req.body || {};
  if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ error: 'Decisão inválida.' });

  const { data: staff, error: staffError } = await supabaseAdmin
    .from('staff').select('id').eq('profile_id', req.profile.id).maybeSingle();
  if (staffError || !staff) return res.status(403).json({ error: 'Cadastro de servidor não encontrado.' });

  const { data, error } = await supabaseAdmin.rpc('decide_application', {
    p_application_id: req.params.id,
    p_staff_id: staff.id,
    p_status: status
  });

  if (error) {
    const message = error.message || 'Não foi possível decidir esta solicitação.';
    if (message.includes('não encontrada')) return res.status(404).json({ error: message });
    if (message.includes('não é responsável')) return res.status(403).json({ error: message });
    if (message.includes('já foi analisada') || message.includes('Todas as vagas')) {
      return res.status(409).json({ error: message });
    }
    if (error.code === '22P02') return res.status(400).json({ error: 'Identificador da solicitação inválido.' });
    return res.status(500).json({ error: message });
  }

  return res.json({ application: data });
});

export default router;
