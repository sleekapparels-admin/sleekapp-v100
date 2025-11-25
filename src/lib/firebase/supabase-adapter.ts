/**
 * Firebase adapter that mimics Supabase client interface
 * This allows minimal changes to existing code during migration
 */

import { authService, User } from "./auth";
import { firestoreService, where, orderBy, limit as firestoreLimit } from "./firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./config";

// Mimic Supabase auth response structure
interface AuthResponse {
  data: { user: User | null; session: any };
  error: { message: string } | null;
}

interface SignUpData {
  email: string;
  password: string;
  options?: {
    data?: any;
    emailRedirectTo?: string;
  };
}

// Firebase adapter for auth
export const firebaseAuth = {
  signUp: async (credentials: SignUpData): Promise<AuthResponse> => {
    const { email, password, options } = credentials;
    const fullName = options?.data?.full_name || "";
    
    const { user, error } = await authService.signUp(email, password, fullName);
    
    if (error) {
      return { data: { user: null, session: null }, error: { message: error } };
    }
    
    // Store additional user data in profile
    if (user && options?.data) {
      await firestoreService.update("profiles", user.uid, {
        company_name: options.data.company_name || "",
        phone: options.data.phone || "",
        role: options.data.role || "buyer",
        customer_type: options.data.customer_type || "",
        expected_volume: options.data.expected_volume || "",
        product_interest: options.data.product_interest || ""
      });
    }
    
    return { data: { user, session: null }, error: null };
  },

  signInWithPassword: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const { email, password } = credentials;
    const { user, error } = await authService.signIn(email, password);
    
    if (error) {
      return { data: { user: null, session: null }, error: { message: error } };
    }
    
    return { data: { user, session: null }, error: null };
  },

  signInWithOAuth: async (options: { provider: string; options?: any }) => {
    if (options.provider === 'google') {
      const { user, error } = await authService.signInWithGoogle();
      
      if (error) {
        return { data: { user: null, session: null }, error: { message: error } };
      }
      
      return { data: { user, session: null }, error: null };
    }
    
    return { data: { user: null, session: null }, error: { message: "Provider not supported" } };
  },

  signOut: async () => {
    const { error } = await authService.signOut();
    return { error: error ? { message: error } : null };
  },

  resend: async (options: { type: string; email: string }) => {
    // Firebase sends verification email automatically on signup
    // This is a no-op for compatibility
    return { error: null };
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return authService.onAuthStateChange((user) => {
      callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', { user });
    });
  },

  getSession: async () => {
    const user = authService.getCurrentUser();
    return { data: { session: user ? { user } : null }, error: null };
  }
};

// Firebase adapter for database operations
export const firebaseDb = {
  from: (table: string) => {
    return {
      select: (columns: string = '*') => ({
        eq: (column: string, value: any) => firestoreService.queryWhere(table, column, '==', value),
        in: (column: string, values: any[]) => firestoreService.queryWhere(table, column, 'in', values),
        gte: (column: string, value: any) => firestoreService.queryWhere(table, column, '>=', value),
        lte: (column: string, value: any) => firestoreService.queryWhere(table, column, '<=', value),
        order: (column: string, options?: { ascending?: boolean }) => ({
          limit: async (count: number) => {
            const { data, error } = await firestoreService.getAll(table, [
              orderBy(column, options?.ascending ? 'asc' : 'desc'),
              firestoreLimit(count)
            ]);
            return { data, error: error ? { message: error } : null };
          },
          then: async (resolve: any) => {
            const { data, error } = await firestoreService.getAll(table, [
              orderBy(column, options?.ascending ? 'asc' : 'desc')
            ]);
            resolve({ data, error: error ? { message: error } : null });
          }
        }),
        limit: async (count: number) => {
          const { data, error } = await firestoreService.getAll(table, [firestoreLimit(count)]);
          return { data, error: error ? { message: error } : null };
        },
        single: async () => {
          const { data, error } = await firestoreService.getAll(table, [firestoreLimit(1)]);
          return { 
            data: data && data.length > 0 ? data[0] : null, 
            error: error ? { message: error } : null 
          };
        },
        then: async (resolve: any) => {
          const { data, error } = await firestoreService.getAll(table);
          resolve({ data, error: error ? { message: error } : null });
        }
      }),
      
      insert: async (data: any) => {
        const result = await firestoreService.create(table, data);
        return { 
          data: result.data, 
          error: result.error ? { message: result.error } : null 
        };
      },
      
      update: (data: any) => ({
        eq: async (column: string, value: any) => {
          // Firestore requires document ID for update
          // This is a simplified version - you may need to query first
          const result = await firestoreService.update(table, value, data);
          return { error: result.error ? { message: result.error } : null };
        }
      }),
      
      delete: () => ({
        eq: async (column: string, value: any) => {
          const result = await firestoreService.delete(table, value);
          return { error: result.error ? { message: result.error } : null };
        }
      })
    };
  }
};

// Firebase adapter for storage
export const firebaseStorage = {
  from: (bucket: string) => {
    return {
      upload: async (path: string, file: File | Blob) => {
        try {
          const storageRef = ref(storage, `${bucket}/${path}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          
          return { 
            data: { path, publicUrl: url }, 
            error: null 
          };
        } catch (error: any) {
          return { 
            data: null, 
            error: { message: error.message } 
          };
        }
      },
      
      remove: async (paths: string[]) => {
        try {
          await Promise.all(
            paths.map(path => {
              const storageRef = ref(storage, `${bucket}/${path}`);
              return deleteObject(storageRef);
            })
          );
          return { error: null };
        } catch (error: any) {
          return { error: { message: error.message } };
        }
      },
      
      getPublicUrl: (path: string) => {
        const storageRef = ref(storage, `${bucket}/${path}`);
        return { 
          data: { publicUrl: getDownloadURL(storageRef) } 
        };
      }
    };
  }
};

// Firebase adapter for functions
export const firebaseFunctions = {
  invoke: async (functionName: string, options?: { body?: any }) => {
    // Firebase functions would be called here
    // For now, return a placeholder
    console.warn(`Firebase function ${functionName} not implemented yet`);
    return { 
      data: null, 
      error: { message: "Function not implemented" } 
    };
  }
};

// Main Firebase client that mimics Supabase client
export const firebaseClient = {
  auth: firebaseAuth,
  from: firebaseDb.from,
  storage: firebaseStorage,
  functions: firebaseFunctions
};
