import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@/test/utils/test-utils';
import { useAdminAuth } from '../useAdminAuth';
import { mockSupabase, resetMocks } from '@/test/mocks/supabase';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('useAdminAuth Hook', () => {
  beforeEach(() => {
    resetMocks();
    mockNavigate.mockClear();
  });

  describe('Admin Status Check', () => {
    it('returns isAdmin true for valid admin user', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: {
          session: {
            user: { id: 'admin-123', email: 'admin@example.com' },
            access_token: 'valid-token',
          },
        },
        error: null,
      });

      mockSupabase.functions.invoke.mockResolvedValue({
        data: { isAdmin: true },
        error: null,
      });

      const { result } = renderHook(() => useAdminAuth());

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.isAdmin).toBe(true);
      });

      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('admin-check', {
        headers: {
          Authorization: 'Bearer valid-token',
        },
      });
    });

    it('returns isAdmin false for non-admin user', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: {
          session: {
            user: { id: 'user-123', email: 'user@example.com' },
            access_token: 'valid-token',
          },
        },
        error: null,
      });

      mockSupabase.functions.invoke.mockResolvedValue({
        data: { isAdmin: false },
        error: null,
      });

      const { result } = renderHook(() => useAdminAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.isAdmin).toBe(false);
      });
    });

    it('returns isAdmin false when no session exists', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const { result } = renderHook(() => useAdminAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.isAdmin).toBe(false);
      });

      expect(mockSupabase.functions.invoke).not.toHaveBeenCalled();
    });

    it('handles admin check errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      mockSupabase.auth.getSession.mockResolvedValue({
        data: {
          session: {
            user: { id: 'user-123' },
            access_token: 'valid-token',
          },
        },
        error: null,
      });

      mockSupabase.functions.invoke.mockResolvedValue({
        data: null,
        error: { message: 'Admin check failed' },
      });

      const { result } = renderHook(() => useAdminAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.isAdmin).toBe(false);
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Admin check failed:',
        { message: 'Admin check failed' }
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Session Validation', () => {
    it('handles expired sessions', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: {
          session: {
            user: { id: 'user-123' },
            access_token: 'expired-token',
          },
        },
        error: null,
      });

      mockSupabase.functions.invoke.mockResolvedValue({
        data: null,
        error: { message: 'Session expired', status: 401 },
      });

      const { result } = renderHook(() => useAdminAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.isAdmin).toBe(false);
      });
    });

    it('handles network errors during admin check', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      mockSupabase.auth.getSession.mockResolvedValue({
        data: {
          session: {
            user: { id: 'user-123' },
            access_token: 'valid-token',
          },
        },
        error: null,
      });

      mockSupabase.functions.invoke.mockRejectedValue(
        new Error('Network error')
      );

      const { result } = renderHook(() => useAdminAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.isAdmin).toBe(false);
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error checking admin status:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Re-check Admin Status', () => {
    it('allows manual re-check of admin status', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: {
          session: {
            user: { id: 'user-123' },
            access_token: 'valid-token',
          },
        },
        error: null,
      });

      mockSupabase.functions.invoke.mockResolvedValue({
        data: { isAdmin: false },
        error: null,
      });

      const { result } = renderHook(() => useAdminAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Update mock to return admin status
      mockSupabase.functions.invoke.mockResolvedValue({
        data: { isAdmin: true },
        error: null,
      });

      // Manually trigger recheck
      result.current.checkAdminStatus();

      await waitFor(() => {
        expect(result.current.isAdmin).toBe(true);
      });

      expect(mockSupabase.functions.invoke).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('handles null user in session', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: {
          session: {
            user: null,
            access_token: 'token',
          },
        },
        error: null,
      });

      const { result } = renderHook(() => useAdminAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.isAdmin).toBe(false);
      });
    });

    it('handles malformed admin check response', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: {
          session: {
            user: { id: 'user-123' },
            access_token: 'valid-token',
          },
        },
        error: null,
      });

      mockSupabase.functions.invoke.mockResolvedValue({
        data: { /* missing isAdmin field */ },
        error: null,
      });

      const { result } = renderHook(() => useAdminAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.isAdmin).toBe(false);
      });
    });

    it('handles concurrent admin checks', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: {
          session: {
            user: { id: 'user-123' },
            access_token: 'valid-token',
          },
        },
        error: null,
      });

      mockSupabase.functions.invoke.mockImplementation(
        () => new Promise(resolve => 
          setTimeout(() => resolve({ data: { isAdmin: true }, error: null }), 100)
        )
      );

      const { result } = renderHook(() => useAdminAuth());

      // Trigger multiple checks
      result.current.checkAdminStatus();
      result.current.checkAdminStatus();
      result.current.checkAdminStatus();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should handle gracefully without race conditions
      expect(result.current.isAdmin).toBe(true);
    });

    it('handles session errors', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: { message: 'Failed to get session' },
      });

      const { result } = renderHook(() => useAdminAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.isAdmin).toBe(false);
      });
    });
  });

  describe('Security', () => {
    it('uses server-side validation for admin check', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: {
          session: {
            user: { id: 'user-123' },
            access_token: 'valid-token',
          },
        },
        error: null,
      });

      mockSupabase.functions.invoke.mockResolvedValue({
        data: { isAdmin: true },
        error: null,
      });

      renderHook(() => useAdminAuth());

      await waitFor(() => {
        expect(mockSupabase.functions.invoke).toHaveBeenCalledWith(
          'admin-check',
          expect.objectContaining({
            headers: expect.objectContaining({
              Authorization: expect.stringContaining('Bearer'),
            }),
          })
        );
      });
    });

    it('does not trust client-side admin flags', async () => {
      // Even if somehow session had admin flag, we should check server
      mockSupabase.auth.getSession.mockResolvedValue({
        data: {
          session: {
            user: { id: 'user-123', user_metadata: { isAdmin: true } },
            access_token: 'valid-token',
          },
        },
        error: null,
      });

      mockSupabase.functions.invoke.mockResolvedValue({
        data: { isAdmin: false },
        error: null,
      });

      const { result } = renderHook(() => useAdminAuth());

      await waitFor(() => {
        expect(result.current.isAdmin).toBe(false);
      });

      // Should always call server function regardless of client data
      expect(mockSupabase.functions.invoke).toHaveBeenCalled();
    });
  });
});
