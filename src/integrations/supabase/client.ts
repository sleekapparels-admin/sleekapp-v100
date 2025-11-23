// MIGRATED TO FIREBASE
// This file now exports Firebase client with Supabase-compatible interface
import { firebaseClient } from '@/lib/firebase/supabase-adapter';

// Import the client like this:
// import { supabase } from "@/integrations/supabase/client";
// It now uses Firebase under the hood!

export const supabase = firebaseClient as any;