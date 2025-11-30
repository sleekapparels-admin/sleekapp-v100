import { serve } from "https://deno.land/std@0.207.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { postId, authorName, authorEmail, content } = await req.json();

    // Validate required fields
    if (!postId || !authorName || !authorEmail || !content) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize inputs
    const sanitizedContent = content.trim().slice(0, 5000); // Max 5000 characters
    const sanitizedName = authorName.trim().slice(0, 100);
    const sanitizedEmail = authorEmail.trim().toLowerCase().slice(0, 255);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if user is authenticated (optional - allows both auth and anonymous)
    let userId = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const supabaseAuth = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        {
          global: {
            headers: { Authorization: authHeader },
          },
        }
      );
      const { data: { user } } = await supabaseAuth.auth.getUser();
      userId = user?.id || null;
    }

    // Insert comment (pending approval)
    const { data: comment, error: insertError } = await supabase
      .from('blog_comments')
      .insert({
        post_id: postId,
        user_id: userId,
        author_name: sanitizedName,
        author_email: sanitizedEmail,
        content: sanitizedContent,
        approved: false, // All comments require admin approval
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting comment:', insertError);
      return new Response(
        JSON.stringify({ success: false, message: 'Failed to submit comment' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Comment submitted successfully and is pending approval',
        comment_id: comment.id
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
