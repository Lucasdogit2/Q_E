import { Router } from 'express';
import { supabaseAdmin, supabaseAuth } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Cadastro público apenas para estudantes. Contas staff devem ser provisionadas por um administrador.
router.post('/register', async (req, res) => {
  const { full_name, email, password, registration, course, academic_year } = req.body || {};
  if (!full_name?.trim() || !email?.trim() || !password || !registration || !course?.trim() || !Number.isInteger(Number(academic_year)) || Number(academic_year) < 1) {
    return res.status(400).json({ error: 'Preencha nome, e-mail, senha, matrícula, curso e ano/período.' });
  }
  if (password.length < 8) return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres.' });
  if (!/^\d{13}$/.test(String(registration))) {
    return res.status(400).json({ error: 'A matrícula deve conter exatamente 13 números.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@aluno\.ifap\.edu\.br$/.test(normalizedEmail)) {
    return res.status(400).json({ error: 'O cadastro de estudante aceita somente e-mails institucionais @aluno.ifap.edu.br.' });
  }

  const { data, error } = await supabaseAuth.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: { full_name: full_name.trim() },
      emailRedirectTo: (process.env.FRONTEND_URL || 'http://localhost:5173').split(',')[0].trim()
    }
  });
  if (error) return res.status(400).json({ error: error.message });
  if (!data.user) return res.status(400).json({ error: 'Não foi possível criar a conta.' });
  if (Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return res.status(409).json({ error: 'Este e-mail já possui cadastro no sistema de autenticação. Tente entrar ou use a recuperação de senha.' });
  }

  const userId = data.user.id;
  try {
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: userId, full_name: full_name.trim(), email: normalizedEmail, role: 'student'
    });
    if (profileError) throw profileError;

    const { error: studentError } = await supabaseAdmin.from('students').insert({
      profile_id: userId,
      registration: String(registration),
      course: course.trim(),
      academic_year: Number(academic_year)
    });
    if (studentError) throw studentError;

    return res.status(201).json({
      message: 'Cadastro realizado. Se a confirmação de e-mail estiver habilitada, confirme seu endereço antes de entrar.'
    });
  } catch (err) {
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return res.status(400).json({ error: err.message || 'Erro ao salvar o perfil do estudante.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email?.trim() || !password) return res.status(400).json({ error: 'Informe e-mail e senha.' });

  const { data, error } = await supabaseAuth.auth.signInWithPassword({
    email: email.trim().toLowerCase(), password
  });
  if (error) return res.status(401).json({ error: error.message });

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles').select('id, full_name, email, role').eq('id', data.user.id).maybeSingle();
  if (profileError || !profile) return res.status(403).json({ error: 'Perfil não encontrado para esta conta.' });

  return res.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    user: profile
  });
});

router.get('/me', requireAuth, (req, res) => res.json({ user: req.profile }));

export default router;
