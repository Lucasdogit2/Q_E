import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabaseAdmin } from './src/config/supabase.js';
import authRoutes from './src/routes/auth.routes.js';
import internshipsRoutes from './src/routes/internships.routes.js';
import applicationsRoutes from './src/routes/applications.routes.js';
import attendanceRoutes from './src/routes/attendance.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',').map((origin) => origin.trim()).filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    const error = new Error('Origem não autorizada pelo CORS.');
    error.status = 403;
    return callback(error);
  }
}));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'Q.E. API' }));

app.get('/api/teste-banco', async (_req, res, next) => {
  try {
    const { error } = await supabaseAdmin.from('profiles').select('id').limit(1);
    if (error) return res.status(500).json({ status: 'Erro', detalhe: error.message });
    return res.json({ status: 'Sucesso', mensagem: 'Express conectado ao Supabase.' });
  } catch (error) {
    return next(error);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/internships', internshipsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/attendance', attendanceRoutes);

app.use((_req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));

app.use((err, _req, res, _next) => {
  console.error(err);
  if (res.headersSent) return;
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'A requisição excede o limite de 1 MB.' });
  }
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'O corpo da requisição contém JSON inválido.' });
  }
  return res.status(err.status || 500).json({
    error: err.status && err.status < 500 ? err.message : 'Erro interno do servidor.'
  });
});

app.listen(PORT, () => console.log(`Q.E. API rodando na porta ${PORT}`));
