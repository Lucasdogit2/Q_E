import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Configure SUPABASE_URL e SUPABASE_ANON_KEY no arquivo Backend/.env antes de iniciar o servidor.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
