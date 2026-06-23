import { createClient } from '@supabase/supabase-js';
import env from './env';

if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Supabase environment variables are missing');
}

// Create supabase admin client that bypasses RLS (since this runs on a trusted backend)
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export default supabaseAdmin;
