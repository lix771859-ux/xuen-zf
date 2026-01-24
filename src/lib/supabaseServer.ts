import { createClient } from '@supabase/supabase-js';

// Server-side client using the service role for privileged operations.
// Never expose this client in the browser.
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
);
