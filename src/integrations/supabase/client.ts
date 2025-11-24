// FIREBASE VERSION - Using Firebase with Supabase-compatible adapter
import { firebaseClient } from '@/lib/firebase/supabase-adapter';

// Import the client like this:
// import { supabase } from "@/integrations/supabase/client";
// It now uses Firebase under the hood with a compatibility layer!

export const supabase = firebaseClient as any;