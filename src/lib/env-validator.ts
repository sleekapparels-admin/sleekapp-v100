/**
 * Environment Variable Validation
 * Validates required environment variables at application startup
 */

interface EnvConfig {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_PUBLISHABLE_KEY: string;
}

class EnvironmentValidator {
  private static instance: EnvironmentValidator;
  private validated = false;
  private errors: string[] = [];

  private constructor() {}

  static getInstance(): EnvironmentValidator {
    if (!EnvironmentValidator.instance) {
      EnvironmentValidator.instance = new EnvironmentValidator();
    }
    return EnvironmentValidator.instance;
  }

  /**
   * Validates all required environment variables
   * @throws Error if any required variables are missing or invalid
   */
  validate(): void {
    if (this.validated) return;

    this.errors = [];

    // Check required Supabase variables
    this.validateRequired('VITE_SUPABASE_URL');
    this.validateRequired('VITE_SUPABASE_PUBLISHABLE_KEY');

    // Validate URL format
    this.validateUrl('VITE_SUPABASE_URL');

    // Validate key format (basic check)
    this.validateSupabaseKey('VITE_SUPABASE_PUBLISHABLE_KEY');

    if (this.errors.length > 0) {
      const errorMessage = `Environment validation failed:\n${this.errors.join('\n')}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    this.validated = true;
    console.log('✅ Environment variables validated successfully');
  }

  /**
   * Validates that a required variable exists and is not empty
   */
  private validateRequired(key: string): void {
    const value = import.meta.env[key];
    if (!value || value.trim() === '') {
      this.errors.push(`❌ Missing required environment variable: ${key}`);
    }
  }

  /**
   * Validates URL format
   */
  private validateUrl(key: string): void {
    const value = import.meta.env[key];
    if (!value) return; // Already caught by validateRequired

    try {
      new URL(value);
    } catch {
      this.errors.push(`❌ Invalid URL format for ${key}: ${value}`);
    }
  }

  /**
   * Validates Supabase key format
   */
  private validateSupabaseKey(key: string): void {
    const value = import.meta.env[key];
    if (!value) return; // Already caught by validateRequired

    // Supabase keys are typically JWT-like strings
    if (value.length < 20) {
      this.errors.push(`❌ ${key} appears to be too short (expected JWT-like key)`);
    }
  }

  /**
   * Gets the validated environment configuration
   */
  getConfig(): EnvConfig {
    if (!this.validated) {
      this.validate();
    }

    return {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    };
  }

  /**
   * Gets a specific environment variable safely
   */
  get(key: keyof EnvConfig): string {
    if (!this.validated) {
      this.validate();
    }
    return import.meta.env[key] || '';
  }

  /**
   * Checks if environment is in development mode
   */
  isDevelopment(): boolean {
    return import.meta.env.DEV;
  }

  /**
   * Checks if environment is in production mode
   */
  isProduction(): boolean {
    return import.meta.env.PROD;
  }
}

// Export singleton instance
export const env = EnvironmentValidator.getInstance();

// Auto-validate on import in production
if (import.meta.env.PROD) {
  try {
    env.validate();
  } catch (error) {
    console.error('Critical: Environment validation failed', error);
    // In production, we want to fail fast
    throw error;
  }
}
