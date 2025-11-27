import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import Auth from '../Auth';
import { mockSupabase, resetMocks } from '@/test/mocks/supabase';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', async () => {
  const { mockSupabase } = await import('@/test/mocks/supabase');
  return {
    supabase: mockSupabase,
  };
});

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe.skip('Auth Component', () => {
  beforeEach(() => {
    resetMocks();
    mockNavigate.mockClear();
  });

  describe('Login Flow', () => {
    it('renders login form by default', () => {
      render(<Auth />);

      expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });

    it('successfully logs in with valid credentials', async () => {
      const user = userEvent.setup();
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: '123', email: 'test@example.com' }, session: {} },
        error: null,
      });

      render(<Auth />);

      await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/Password/i), 'Password123');
      await user.click(screen.getByRole('button', { name: /Sign In/i }));

      await waitFor(() => {
        expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'Password123',
        });
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('displays error for invalid credentials', async () => {
      const user = userEvent.setup();
      const { toast } = await import('sonner');

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' },
      });

      render(<Auth />);

      await user.type(screen.getByLabelText(/Email/i), 'wrong@example.com');
      await user.type(screen.getByLabelText(/Password/i), 'wrongpass');
      await user.click(screen.getByRole('button', { name: /Sign In/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Invalid login credentials');
      });
    });

    it('validates empty email and password', async () => {
      const user = userEvent.setup();
      const { toast } = await import('sonner');

      render(<Auth />);

      await user.click(screen.getByRole('button', { name: /Sign In/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });

    it('handles network errors gracefully', async () => {
      const user = userEvent.setup();
      const { toast } = await import('sonner');

      mockSupabase.auth.signInWithPassword.mockRejectedValue(
        new Error('Network error')
      );

      render(<Auth />);

      await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/Password/i), 'Password123');
      await user.click(screen.getByRole('button', { name: /Sign In/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Network error');
      });
    });
  });

  describe('Signup Flow', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<Auth />);

      const signupTab = screen.getByRole('tab', { name: /Sign Up/i });
      await user.click(signupTab);
    });

    it('renders signup form', () => {
      expect(screen.getByText(/Create Your Account/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
    });

    it('validates password requirements', async () => {
      const user = userEvent.setup();

      const passwordInput = screen.getByLabelText(/Password/i);
      await user.type(passwordInput, 'weak');

      await waitFor(() => {
        expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it('successfully creates account with valid data', async () => {
      const user = userEvent.setup();
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: { id: '123' }, session: {} },
        error: null,
      });

      await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Password/i), 'Password123');
      await user.type(screen.getByLabelText(/Company Name/i), 'Acme Inc');

      // Select role
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText(/Retailer/i));

      await user.click(screen.getByRole('button', { name: /Create Account/i }));

      await waitFor(() => {
        expect(mockSupabase.auth.signUp).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('handles duplicate email error', async () => {
      const user = userEvent.setup();
      const { toast } = await import('sonner');

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'User already registered' },
      });

      await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
      await user.type(screen.getByLabelText(/Email/i), 'existing@example.com');
      await user.type(screen.getByLabelText(/Password/i), 'Password123');
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText(/Retailer/i));

      await user.click(screen.getByRole('button', { name: /Create Account/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('User already registered');
      });
    });

    it('validates email format', async () => {
      const user = userEvent.setup();
      const { toast } = await import('sonner');

      await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
      await user.type(screen.getByLabelText(/Email/i), 'invalid-email');
      await user.type(screen.getByLabelText(/Password/i), 'Password123');

      await user.click(screen.getByRole('button', { name: /Create Account/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });

    it('enforces maximum field lengths', async () => {
      const user = userEvent.setup();
      const longString = 'a'.repeat(300);

      await user.type(screen.getByLabelText(/Email/i), longString);

      const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
      expect(emailInput.value.length).toBeLessThanOrEqual(255);
    });
  });

  describe('Google OAuth Flow', () => {
    it('initiates Google sign in', async () => {
      const user = userEvent.setup();
      mockSupabase.auth.signInWithOAuth.mockResolvedValue({
        data: { url: 'https://google.com/oauth' },
        error: null,
      });

      render(<Auth />);

      const googleButton = screen.getByRole('button', { name: /Continue with Google/i });
      await user.click(googleButton);

      await waitFor(() => {
        expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
          provider: 'google',
          options: expect.objectContaining({
            redirectTo: expect.stringContaining('/dashboard'),
          }),
        });
      });
    });

    it('handles OAuth errors', async () => {
      const user = userEvent.setup();
      const { toast } = await import('sonner');

      mockSupabase.auth.signInWithOAuth.mockResolvedValue({
        data: { url: null },
        error: { message: 'OAuth provider error' },
      });

      render(<Auth />);

      await user.click(screen.getByRole('button', { name: /Continue with Google/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('OAuth provider error');
      });
    });
  });

  describe.skip('Phone Verification Flow', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<Auth />);

      const signupTab = screen.getByRole('tab', { name: /Sign Up/i });
      await user.click(signupTab);
    });

    it('sends OTP to phone number', async () => {
      const user = userEvent.setup();
      const { toast } = await import('sonner');

      mockSupabase.functions.invoke.mockResolvedValue({
        data: { success: true, expiresAt: new Date().toISOString() },
        error: null,
      });

      const phoneInput = screen.getByPlaceholderText(/\+1234567890/i);
      await user.type(phoneInput, '+1234567890');

      const verifyButton = screen.getByRole('button', { name: /Send Code/i });
      await user.click(verifyButton);

      await waitFor(() => {
        expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('send-otp', {
          body: { type: 'phone', phone: '+1234567890' },
        });
        expect(toast.success).toHaveBeenCalledWith(
          expect.stringContaining('sent to your phone')
        );
      });
    });

    it('validates phone number before sending OTP', async () => {
      const user = userEvent.setup();
      const { toast } = await import('sonner');

      const verifyButton = screen.getByRole('button', { name: /Send Code/i });
      await user.click(verifyButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Please enter your phone number');
      });
    });

    it('verifies OTP code', async () => {
      const user = userEvent.setup();
      const { toast } = await import('sonner');

      // First send OTP
      mockSupabase.functions.invoke.mockResolvedValue({
        data: { success: true, expiresAt: new Date().toISOString() },
        error: null,
      });

      const phoneInput = screen.getByPlaceholderText(/\+1234567890/i);
      await user.type(phoneInput, '+1234567890');
      await user.click(screen.getByRole('button', { name: /Send Code/i }));

      await waitFor(() => {
        expect(screen.getByText(/Enter the 6-digit code/i)).toBeInTheDocument();
      });

      // Mock OTP verification
      mockSupabase.functions.invoke.mockResolvedValue({
        data: { success: true, verified: true },
        error: null,
      });

      // Enter OTP
      const otpInputs = screen.getAllByRole('textbox');
      for (let i = 0; i < 6; i++) {
        await user.type(otpInputs[i], String(i));
      }

      await waitFor(() => {
        expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('verify-otp', {
          body: { type: 'phone', phone: '+1234567890', otp: expect.any(String) },
        });
      });
    });

    it('handles invalid OTP code', async () => {
      const user = userEvent.setup();
      const { toast } = await import('sonner');

      // Send OTP first
      mockSupabase.functions.invoke.mockResolvedValueOnce({
        data: { success: true, expiresAt: new Date().toISOString() },
        error: null,
      });

      const phoneInput = screen.getByPlaceholderText(/\+1234567890/i);
      await user.type(phoneInput, '+1234567890');
      await user.click(screen.getByRole('button', { name: /Send Code/i }));

      // Mock failed verification
      mockSupabase.functions.invoke.mockResolvedValueOnce({
        data: null,
        error: { message: 'Invalid verification code' },
      });

      const otpInputs = screen.getAllByRole('textbox');
      for (let i = 0; i < 6; i++) {
        await user.type(otpInputs[i], String(i));
      }

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Invalid verification code');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles rate limiting errors', async () => {
      const user = userEvent.setup();
      const { toast } = await import('sonner');

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Too many requests', status: 429 },
      });

      render(<Auth />);

      await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/Password/i), 'Password123');
      await user.click(screen.getByRole('button', { name: /Sign In/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });

    it('prevents double submission', async () => {
      const user = userEvent.setup();
      mockSupabase.auth.signInWithPassword.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 1000))
      );

      render(<Auth />);

      await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/Password/i), 'Password123');

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);
      await user.click(submitButton);

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledTimes(1);
    });

    it('clears form errors when switching tabs', async () => {
      const user = userEvent.setup();
      const { toast } = await import('sonner');

      render(<Auth />);

      // Trigger login error
      await user.click(screen.getByRole('button', { name: /Sign In/i }));

      // Switch to signup tab
      await user.click(screen.getByRole('tab', { name: /Sign Up/i }));

      // Switch back to login tab
      await user.click(screen.getByRole('tab', { name: /Login/i }));

      // Form should be clear
      const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
      expect(emailInput.value).toBe('');
    });

    it('handles session timeout gracefully', async () => {
      const user = userEvent.setup();
      const { toast } = await import('sonner');

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Session expired' },
      });

      render(<Auth />);

      await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/Password/i), 'Password123');
      await user.click(screen.getByRole('button', { name: /Sign In/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Session expired');
      });
    });
  });
});
