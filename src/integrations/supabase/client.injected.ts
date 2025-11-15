import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Fallbacks ensure the app works even if import.meta.env is not injected
const FALLBACK_URL = 'https://eqpftggctumujhutomom.supabase.co';
const FALLBACK_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxcGZ0Z2djdHVtdWpodXRvbW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjc5NzAsImV4cCI6MjA3ODc0Mzk3MH0.7KkuzAPJlU7PR6lOIKi_zZi31oUhWk_MGUzYhxGYehw';

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
