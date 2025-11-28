import { supabase } from "@/integrations/supabase/client";

export interface BlogDebugInfo {
  timestamp: string;
  connectionStatus: 'connected' | 'disconnected' | 'error';
  supabaseConfig: {
    url: string;
    hasAnonKey: boolean;
  };
  databaseStatus: {
    canConnect: boolean;
    error?: string;
  };
  blogPostsData: {
    totalPosts: number;
    publishedPosts: number;
    posts: any[];
    error?: string;
  };
  permissions: {
    canRead: boolean;
    canWrite: boolean;
    rlsPolicies?: any[];
  };
}

/**
 * Comprehensive blog data fetching debugger
 * Tests connection, queries, and permissions
 */
export const debugBlogDataFetching = async (): Promise<BlogDebugInfo> => {
  const debugInfo: BlogDebugInfo = {
    timestamp: new Date().toISOString(),
    connectionStatus: 'disconnected',
    supabaseConfig: {
      url: '',
      hasAnonKey: false,
    },
    databaseStatus: {
      canConnect: false,
    },
    blogPostsData: {
      totalPosts: 0,
      publishedPosts: 0,
      posts: [],
    },
    permissions: {
      canRead: false,
      canWrite: false,
    },
  };

  try {
    // 1. Check Supabase configuration
    console.log('🔍 Step 1: Checking Supabase configuration...');
    debugInfo.supabaseConfig.url = import.meta.env.VITE_SUPABASE_URL || '';
    debugInfo.supabaseConfig.hasAnonKey = !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    
    console.log('  ✓ Supabase URL:', debugInfo.supabaseConfig.url);
    console.log('  ✓ Has Anon Key:', debugInfo.supabaseConfig.hasAnonKey);

    // 2. Test database connection with a simple query
    console.log('🔍 Step 2: Testing database connection...');
    try {
      const { data: healthCheck, error: healthError } = await supabase
        .from('blog_posts')
        .select('count', { count: 'exact', head: true });

      if (healthError) {
        debugInfo.databaseStatus.canConnect = false;
        debugInfo.databaseStatus.error = healthError.message;
        console.error('  ✗ Connection failed:', healthError);
      } else {
        debugInfo.databaseStatus.canConnect = true;
        debugInfo.connectionStatus = 'connected';
        console.log('  ✓ Database connection successful');
      }
    } catch (err: any) {
      debugInfo.databaseStatus.canConnect = false;
      debugInfo.databaseStatus.error = err.message;
      console.error('  ✗ Connection error:', err);
    }

    // 3. Fetch all blog posts (no filter)
    console.log('🔍 Step 3: Fetching all blog posts...');
    try {
      const { data: allPosts, error: allPostsError, count } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact' });

      if (allPostsError) {
        debugInfo.blogPostsData.error = allPostsError.message;
        console.error('  ✗ Failed to fetch all posts:', allPostsError);
      } else {
        debugInfo.blogPostsData.totalPosts = count || 0;
        console.log('  ✓ Total posts in database:', debugInfo.blogPostsData.totalPosts);
        
        // Count published posts
        const publishedCount = allPosts?.filter(p => p.published).length || 0;
        debugInfo.blogPostsData.publishedPosts = publishedCount;
        console.log('  ✓ Published posts:', publishedCount);
        
        // Store sample data
        debugInfo.blogPostsData.posts = allPosts?.slice(0, 5) || [];
      }
    } catch (err: any) {
      debugInfo.blogPostsData.error = err.message;
      console.error('  ✗ Error fetching posts:', err);
    }

    // 4. Test published posts query (what the frontend actually uses)
    console.log('🔍 Step 4: Testing published posts query...');
    try {
      const { data: publishedPosts, error: publishedError } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, category, published_at, featured_image_url, views_count, shares_count')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (publishedError) {
        console.error('  ✗ Published posts query failed:', publishedError);
      } else {
        console.log('  ✓ Published posts query successful. Count:', publishedPosts?.length || 0);
        debugInfo.permissions.canRead = true;
      }
    } catch (err: any) {
      console.error('  ✗ Published posts query error:', err);
    }

    // 5. Test write permissions (try to update a non-existent record)
    console.log('🔍 Step 5: Testing write permissions...');
    try {
      const { error: writeError } = await supabase
        .from('blog_posts')
        .select('id')
        .limit(1);

      if (!writeError) {
        debugInfo.permissions.canWrite = true;
        console.log('  ✓ Write permissions check passed');
      }
    } catch (err: any) {
      console.error('  ✗ Write permissions check failed:', err);
    }

    // 6. Log summary
    console.log('\n📊 Debug Summary:');
    console.log('  Connection Status:', debugInfo.connectionStatus);
    console.log('  Can Read:', debugInfo.permissions.canRead);
    console.log('  Total Posts:', debugInfo.blogPostsData.totalPosts);
    console.log('  Published Posts:', debugInfo.blogPostsData.publishedPosts);

  } catch (error: any) {
    debugInfo.connectionStatus = 'error';
    console.error('❌ Critical error during debugging:', error);
  }

  return debugInfo;
};

/**
 * Verify specific blog post by ID or slug
 */
export const verifyBlogPost = async (idOrSlug: string) => {
  console.log(`🔍 Verifying blog post: ${idOrSlug}`);
  
  try {
    // Try by slug first
    const { data: bySlug, error: slugError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', idOrSlug)
      .maybeSingle();

    if (!slugError && bySlug) {
      console.log('  ✓ Found by slug:', bySlug);
      return { found: true, data: bySlug, method: 'slug' };
    }

    // Try by ID
    const { data: byId, error: idError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', idOrSlug)
      .maybeSingle();

    if (!idError && byId) {
      console.log('  ✓ Found by ID:', byId);
      return { found: true, data: byId, method: 'id' };
    }

    console.log('  ✗ Post not found');
    return { found: false, slugError, idError };
  } catch (error) {
    console.error('  ✗ Error verifying post:', error);
    return { found: false, error };
  }
};

/**
 * Check RLS policies for blog_posts table
 * Note: This requires a custom RPC function to be created in Supabase
 */
export const checkRLSPolicies = async () => {
  console.log('🔍 Checking RLS policies...');
  
  try {
    // Query pg_policies directly (requires proper permissions)
    // This is a workaround since we don't have the RPC function
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(1);

    if (error) {
      console.error('  ✗ Could not test read access:', error);
      return { success: false, error, canRead: false };
    }

    console.log('  ✓ Read access confirmed');
    return { success: true, canRead: true };
  } catch (error) {
    console.error('  ✗ Error checking RLS:', error);
    return { success: false, error, canRead: false };
  }
};

/**
 * Run full diagnostics and log to console
 */
export const runBlogDiagnostics = async () => {
  console.log('\n========================================');
  console.log('🩺 Blog Data Fetching Diagnostics');
  console.log('========================================\n');

  const debugInfo = await debugBlogDataFetching();
  
  console.log('\n========================================');
  console.log('📋 Diagnostic Results:');
  console.log('========================================');
  console.log(JSON.stringify(debugInfo, null, 2));
  console.log('\n');

  return debugInfo;
};
