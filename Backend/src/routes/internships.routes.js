import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

async function getStudentId(profileId) {
  const { data, error } = await supabaseAdmin.from('students').select('id').eq('profile_id', profileId).maybeSingle();
  if (error) throw error;
  return data?.id;
}

async function getStaffId(profileId) {
  const { data, error } = await supabaseAdmin.from('staff').select('id').eq('profile_id', profileId).maybeSingle();
  if (error) throw error;
  return data?.id;
}

// Vagas abertas disponíveis para estudantes autenticados.
router.get('/', async (req, res) => {
  if (req.profile.role !== 'student' && req.profile.role !== 'staff') {
    return res.status(403).json({ error: 'Perfil sem permissão.' });
  }
  const { data, error } = await supabaseAdmin
    .from('internships')
    .select('id, title, description, required_hours, start_date, end_date, vacancies, location, area, status, created_at')
    .eq('status', 'open')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ internships: data });
});

// Vagas pertencentes ao servidor autenticado.
router.get('/mine', async (req, res) => {
  if (req.profile.role !== 'staff') return res.status(403).json({ error: 'Apenas servidores podem acessar esta rota.' });
  try {
    const staffId = await getStaffId(req.profile.id);
    if (!staffId) return res.status(403).json({ error: 'Cadastro de servidor não encontrado.' });
    const { data, error } = await supabaseAdmin.from('internships')
      .select('*').eq('staff_id', staffId).order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ internships: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Criação de vaga: o staff_id é sempre obtido da sessão, nunca do navegador.
router.post('/', async (req, res) => {
  if (req.profile.role !== 'staff') return res.status(403).json({ error: 'Apenas servidores podem ofertar estágios.' });
  const { title, description, required_hours, start_date, end_date, vacancies, location, area } = req.body || {};
  if (!title?.trim() || !description?.trim() || !start_date || !end_date || !location?.trim() || !area?.trim()) {
    return res.status(400).json({ error: 'Preencha título, descrição, datas, local e área.' });
  }
  if (!Number.isInteger(Number(required_hours)) || Number(required_hours) <= 0 ||
      !Number.isInteger(Number(vacancies)) || Number(vacancies) <= 0 || end_date < start_date) {
    return res.status(400).json({ error: 'A carga horária e a quantidade de vagas devem ser números inteiros positivos, e o período deve ser válido.' });
  }
  try {
    const staffId = await getStaffId(req.profile.id);
    if (!staffId) return res.status(403).json({ error: 'Cadastro de servidor não encontrado.' });
    const { data, error } = await supabaseAdmin.from('internships').insert({
      staff_id: staffId,
      title: title.trim(),
      description: description.trim(),
      required_hours: Number(required_hours),
      start_date,
      end_date,
      vacancies: Number(vacancies),
      location: location.trim(),
      area: area.trim(),
      status: 'open'
    }).select().single();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json({ internship: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Inscrição de estudante em uma vaga aberta.
router.post('/:id/applications', async (req, res) => {
  if (req.profile.role !== 'student') return res.status(403).json({ error: 'Apenas estudantes podem se candidatar.' });
  try {
    const studentId = await getStudentId(req.profile.id);
    if (!studentId) return res.status(403).json({ error: 'Cadastro de estudante não encontrado.' });

    const { data: internship, error: internshipError } = await supabaseAdmin
      .from('internships').select('id, status, vacancies').eq('id', req.params.id).maybeSingle();
    if (internshipError || !internship) return res.status(404).json({ error: 'Vaga não encontrada.' });
    if (internship.status !== 'open' || internship.vacancies < 1) {
      return res.status(409).json({ error: 'Esta vaga não está recebendo inscrições.' });
    }

    const { data, error } = await supabaseAdmin.from('applications').insert({
      internship_id: internship.id,
      student_id: studentId,
      status: 'pending',
      message: req.body?.message || null
    }).select().single();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json({ application: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
