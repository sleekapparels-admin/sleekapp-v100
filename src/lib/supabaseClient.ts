/**
 * TEMPORARY WORKAROUND - Loosely typed Supabase client wrapper
 * 
 * This re-exports the Supabase client with 'any' typing to bypass
 * the [_ in never]: never issue in the auto-generated types file.
 * 
 * Delete this file once backend types regenerate correctly.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Export with 'any' type to bypass broken Database type
export const supabase = createClient<any>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
