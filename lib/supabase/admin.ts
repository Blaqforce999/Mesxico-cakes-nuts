import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

/**
 * Service role client for privileged server-side operations (e.g. Flutterwave webhook order status updates).
 * Never import or use this on the client.
 */
export function createAdminClient() {
  return createSupabaseClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
