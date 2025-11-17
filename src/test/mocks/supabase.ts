import { vi } from 'vitest';

export const mockSupabaseAuth = {
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  signInWithOAuth: vi.fn(),
  getSession: vi.fn(),
  getUser: vi.fn(),
  onAuthStateChange: vi.fn(() => ({
    data: { subscription: { unsubscribe: vi.fn() } },
  })),
};

export const mockSupabaseFunctions = {
  invoke: vi.fn(),
};

export const mockSupabaseFrom = vi.fn(() => ({
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn(),
  maybeSingle: vi.fn(),
}));

export const mockSupabase = {
  auth: mockSupabaseAuth,
  functions: mockSupabaseFunctions,
  from: mockSupabaseFrom,
};

export const resetMocks = () => {
  vi.clearAllMocks();
};
