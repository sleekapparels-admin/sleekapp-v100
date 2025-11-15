import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Fallbacks ensure the app works even if import.meta.env is not injected
const FALLBACK_URL = 'https://zedbqixgrcvomgooqudd.supabase.co';
const FALLBACK_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplZGJxaXhncmN2b21nb29xdWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NDM3MDQsImV4cCI6MjA3NTIxOTcwNH0.3Z_fdeG3NBebuXBKLyFm4Pz7DbzNfILhMc1Lvg8TD_0';

// Prefer env values when available, otherwise use fallbacks
const SUPABASE_URL = (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_SUPABASE_URL) || FALLBACK_URL;
const SUPABASE_PUBLISHABLE_KEY = (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_SUPABASE_PUBLISHABLE_KEY) || FALLBACK_PUBLISHABLE_KEY;

export const supabaseInjected = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
