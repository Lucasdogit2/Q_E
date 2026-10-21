import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './src/config/supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota de Teste da Conexão com o Banco
app.get('/api/teste-banco', async (req, res) => {
  try {
    // Tenta fazer um teste simples de consulta
    const { data, error } = await supabase.from('estudantes').select('id').limit(1);

    if (error) {
      return res.status(400).json({ status: 'Erro', detalhe: error.message });
    }

    return res.json({ status: 'Sucesso!', mensagem: 'Conectado ao Supabase com sucesso!', dados: data });
  } catch (err) {
    return res.status(500).json({ status: 'Erro no Servidor', detalhe: err.message });
  }
});

app.listen(PORT, () => {
  console.log(` Servidor Express rodando na porta ${PORT}`);
});