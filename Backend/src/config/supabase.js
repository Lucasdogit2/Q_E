import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carrega as variáveis do arquivo .env
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Trava de segurança para avisar se esqueceu do .env
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERRO: SUPABASE_URL e SUPABASE_KEY não foram encontradas no arquivo .env!');
}

// Cria e exporta o cliente conectado do Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);