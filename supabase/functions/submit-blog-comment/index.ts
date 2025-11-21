import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-recaptcha-token',
};

// Validation schema
const commentSchema = z.object({
  post_id: z.string().uuid("Invalid post ID"),
  author_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  author_email: z.string().email("Invalid email address").max(255),
  content: z.string().trim().min(10, "Comment must be at least 10 characters").max(1000),
  recaptcha_token: z.string().min(1, "reCAPTCHA verification required"),
});

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = Deno.env.get('RECAPTCHA_SECRET_KEY');
  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY not configured');
    return false;
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input
    const validated = commentSchema.parse(body);

    // Verify reCAPTCHA
    const isHuman = await verifyRecaptcha(validated.recaptcha_token);
    if (!isHuman) {
      return new Response(
        JSON.stringify({ error: 'reCAPTCHA verification failed. Please try again.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    // Create Supabase client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Rate limiting: Max 5 comments per IP per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const { data: recentComments, error: rateCheckError } = await supabaseAdmin
      .from('blog_comments')
      .select('id')
      .eq('author_email', validated.author_email)
      .gte('created_at', oneHourAgo);

    if (rateCheckError) {
      console.error('Rate limit check error:', rateCheckError);
    }

    if (recentComments && recentComments.length >= 5) {
      console.warn(`Rate limit exceeded for email: ${validated.author_email}`);
      return new Response(
        JSON.stringify({ error: 'Too many comments. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify post exists and is published
    const { data: post, error: postError } = await supabaseAdmin
      .from('blog_posts')
      .select('id, published')
      .eq('id', validated.post_id)
      .single();

    if (postError || !post || !post.published) {
      return new Response(
        JSON.stringify({ error: 'Blog post not found or not available for comments' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get authenticated user if present
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
        if (!authError && user) {
          userId = user.id;
        }
      } catch (e) {
        console.log('Auth token validation failed, treating as guest comment');
      }
    }

    // Insert comment (pending admin approval)
    const { data: comment, error: insertError } = await supabaseAdmin
      .from('blog_comments')
      .insert({
        post_id: validated.post_id,
        author_name: validated.author_name,
        author_email: validated.author_email,
        content: validated.content,
        user_id: userId,
        approved: false, // Requires admin approval
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting comment:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to submit comment' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Comment submitted for post ${validated.post_id} by ${validated.author_email}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Comment submitted successfully and is pending approval',
        comment_id: comment.id 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in submit-blog-comment function:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          error: 'Validation failed', 
          details: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
