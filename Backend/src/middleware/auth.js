import { supabaseAdmin } from '../config/supabase.js';

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token não informado.' });

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ error: 'Sessão inválida ou expirada.' });

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('id', data.user.id)
    .maybeSingle();

  if (profileError || !profile) return res.status(403).json({ error: 'Perfil não encontrado.' });
  req.user = data.user;
  req.profile = profile;
  next();
}
