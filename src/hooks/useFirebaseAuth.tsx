import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { authService } from '@/lib/firebase/auth';
import { firestoreService } from '@/lib/firebase/firestore';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ user: User | null; error: string | null }>;
  signInWithGoogle: () => Promise<{ user: User | null; error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch user profile from Firestore
        const { data } = await authService.getUserProfile(firebaseUser.uid);
        setProfile(data);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    loading,
    signIn: authService.signIn,
    signUp: authService.signUp,
    signInWithGoogle: authService.signInWithGoogle,
    signOut: authService.signOut,
    resetPassword: authService.resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook to get current user profile with role
export const useUserProfile = () => {
  const { user, profile, loading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const { data } = await firestoreService.getById('user_roles', user.uid);
        setUserRole(data?.role || null);
      } else {
        setUserRole(null);
      }
      setRoleLoading(false);
    };

    fetchRole();
  }, [user]);

  return {
    user,
    profile,
    role: userRole,
    loading: loading || roleLoading
  };
};
