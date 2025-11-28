// Deno global type declarations for Supabase Edge Functions
// These functions run on Deno runtime, not Node.js

declare namespace _Deno {
  export const env: {
    get(key: string): string | undefined;
    toObject(): Record<string, string>;
  };

  export interface ConnInfo {
    readonly remoteAddr: {
      transport: "tcp" | "udp";
      hostname: string;
      port: number;
    };
  }
}

// Deno standard library types - Generic wildcard
declare module "https://deno.land/std@*/http/server.ts" {
  export function serve(
    handler: (request: Request) => Response | Promise<Response>,
    options?: {
      port?: number;
      hostname?: string;
      signal?: AbortSignal;
      onError?: (error: unknown) => Response | Promise<Response>;
      onListen?: (params: { hostname: string; port: number }) => void;
    }
  ): void;
}

// Specific version declarations
declare module "https://deno.land/std@0.207.0/http/server.ts" {
  export function serve(
    handler: (request: Request) => Response | Promise<Response>,
    options?: {
      port?: number;
      hostname?: string;
      signal?: AbortSignal;
      onError?: (error: unknown) => Response | Promise<Response>;
      onListen?: (params: { hostname: string; port: number }) => void;
    }
  ): void;
}

// Simplified Supabase types to avoid module augmentation issues
declare module "https://esm.sh/@supabase/supabase-js@*";
declare module "https://esm.sh/@supabase/supabase-js@2.45.0";

export {};
