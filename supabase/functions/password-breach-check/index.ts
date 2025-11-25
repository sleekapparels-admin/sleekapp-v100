// Deno Edge Function: password-breach-check
// Checks passwords against Have I Been Pwned (k-anonymity) without sending full password
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Allowed origins for production security
const allowedOrigins = [
  'https://sleekapparels.com',
  'https://www.sleekapparels.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'lovableproject.com', // Allow all Lovable preview domains
  'lovable.app', // Allow all deployed Lovable apps
  'netlify.app',
  'vercel.app'
];

async function sha1Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("", { headers: corsHeaders });
  }

  // Origin validation in production with proper hostname parsing
  const isDevelopment = Deno.env.get('DENO_ENV') === 'development';
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  
  if (!isDevelopment && origin) {
    try {
      const url = new URL(origin);
      const originHostname = url.hostname;
      const originHost = url.host; // Includes port if present

      const isAllowedOrigin = allowedOrigins.some(allowed => {
        // Remove protocol if present
        const allowedDomain = allowed.replace(/^https?:\/\//, '');

        // If allowed domain has a port (contains colon), match against host (with port)
        if (allowedDomain.includes(':')) {
          return originHost === allowedDomain;
        }

        // Otherwise match against hostname (subdomains allowed)
        return originHostname === allowedDomain ||
               originHostname.endsWith('.' + allowedDomain);
      });
      
      let isAllowedReferer = false;
      if (referer) {
        try {
          const refererUrl = new URL(referer);
          const refererHostname = refererUrl.hostname;
          const refererHost = refererUrl.host;

          isAllowedReferer = allowedOrigins.some(allowed => {
            const allowedDomain = allowed.replace(/^https?:\/\//, '');
            if (allowedDomain.includes(':')) {
              return refererHost === allowedDomain;
            }
            return refererHostname === allowedDomain ||
                   refererHostname.endsWith('.' + allowedDomain);
          });
        } catch {
          // Ignore invalid referer
        }
      }
      
      if (!isAllowedOrigin && !isAllowedReferer) {
        console.warn(`Unauthorized origin attempt: ${origin || referer}`);
        return new Response(
          JSON.stringify({ error: 'Unauthorized origin' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (e) {
      console.error('Invalid origin URL:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid origin' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  try {
    const { password } = await req.json();
    if (typeof password !== "string" || password.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Compute SHA-1 and query HIBP k-anonymity API
    const hash = await sha1Hex(password);
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);

    const hibpResp = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!hibpResp.ok) {
      // If HIBP is unavailable, fail closed to be safe
      return new Response(JSON.stringify({ error: "Password breach service unavailable" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const text = await hibpResp.text();
    let count = 0;
    for (const line of text.split("\n")) {
      const [hashSuffix, seen] = line.trim().split(":");
      if (hashSuffix === suffix) {
        count = parseInt(seen, 10) || 0;
        break;
      }
    }

    const pwned = count > 0;
    return new Response(JSON.stringify({ pwned, count }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (_e) {
    return new Response(JSON.stringify({ error: "Bad request" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
