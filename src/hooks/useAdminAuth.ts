import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Server-side admin validation using edge function
      const { data, error } = await supabase.functions.invoke('admin-check', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Admin check failed:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(data?.isAdmin || false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  return { isAdmin, loading, checkAdminStatus };
};
