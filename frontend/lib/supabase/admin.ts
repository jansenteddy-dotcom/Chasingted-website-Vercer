import { createClient } from '@supabase/supabase-js'

// Uses the service role key — bypasses Row Level Security.
// Only ever call this from Server Actions or Route Handlers, never from the browser.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
