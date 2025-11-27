import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole =
  | 'retailer'
  | 'wholesaler'
  | 'educational'
  | 'corporate'
  | 'sports_team'
  | 'factory'
  | 'admin'
  | 'supplier';

export type UserType = 'buyer' | 'supplier' | 'admin';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  userType: UserType | null;
  isAdmin: boolean;
  isSupplier: boolean;
  isBuyer: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = useCallback(async (userId: string): Promise<UserRole | null> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return data?.role || null;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  }, []);

  const determineUserType = (role: UserRole | null): UserType | null => {
    if (!role) return null;

    if (role === 'admin') return 'admin';
    if (role === 'supplier' || role === 'factory') return 'supplier';
    // retailer, wholesaler, educational, corporate, sports_team are buyers
    return 'buyer';
  };

  const refreshAuth = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Error fetching session:', sessionError);
        setSession(null);
        setUser(null);
        setRole(null);
        setUserType(null);
        return;
      }

      setSession(currentSession);
      setUser(currentSession?.user || null);

      if (currentSession?.user) {
        const userRole = await fetchUserRole(currentSession.user.id);
        setRole(userRole);
        setUserType(determineUserType(userRole));
      } else {
        setRole(null);
        setUserType(null);
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchUserRole]);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setRole(null);
      setUserType(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    // Initial auth check
    refreshAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user || null);

      if (session?.user) {
        const userRole = await fetchUserRole(session.user.id);
        setRole(userRole);
        setUserType(determineUserType(userRole));
      } else {
        setRole(null);
        setUserType(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshAuth, fetchUserRole]);

  const isAdmin = role === 'admin';
  const isSupplier = role === 'supplier' || role === 'factory';
  const isBuyer = userType === 'buyer';

  const value: AuthContextType = {
    user,
    session,
    role,
    userType,
    isAdmin,
    isSupplier,
    isBuyer,
    loading,
    signOut,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
