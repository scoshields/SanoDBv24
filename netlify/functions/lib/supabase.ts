import { createClient } from '@supabase/supabase-js';
import { getServerEnv } from './env';

const supabaseUrl = getServerEnv('SUPABASE_URL');
const supabaseKey = getServerEnv('SUPABASE_ANON_KEY');

export const supabase = createClient(supabaseUrl, supabaseKey);