// Temporary compatibility shim for legacy imports
// Maps `supabaseInjected` to the current generated client.
// This keeps behavior identical while we complete the migration.

export { supabase } from './client';
export { supabase as supabaseInjected } from './client';
