import { createClient } from '@supabase/supabase-js';
import { getEnvVar } from './env';

const supabaseUrl = getEnvVar('SUPABASE_URL');
const supabaseKey = getEnvVar('SUPABASE_ANON_KEY');

export const supabase = createClient(supabaseUrl, supabaseKey);