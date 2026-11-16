import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabaseAdmin } from './src/config/supabase.js';
import authRoutes from './src/routes/auth.routes.js';
import internshipsRoutes from './src/routes/internships.routes.js';
import applicationsRoutes from './src/routes/applications.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',').map((origin) => origin.trim());

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origem não autorizada pelo CORS.'));
  }
}));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'Q.E. API' }));

app.get('/api/teste-banco', async (_req, res) => {
  const { error } = await supabaseAdmin.from('profiles').select('id').limit(1);
  if (error) return res.status(500).json({ status: 'Erro', detalhe: error.message });
  return res.json({ status: 'Sucesso', mensagem: 'Express conectado ao Supabase.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/internships', internshipsRoutes);
app.use('/api/applications', applicationsRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

app.listen(PORT, () => console.log(`Q.E. API rodando na porta ${PORT}`));
