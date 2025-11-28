import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { SEO } from "@/components/SEO";
import { getPageSEO } from "@/lib/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Eye, Share2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LazyImage } from "@/components/LazyImage";
import { BlogErrorBoundary } from "@/components/blog/BlogErrorBoundary";
import { NoBlogPosts } from "@/components/blog/NoBlogPosts";
import { toast } from "sonner";
import { runBlogDiagnostics } from "@/lib/blogDebugger";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  published_at: string | null;
  featured_image_url: string;
  views_count: number | null;
  shares_count: number | null;
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionVerified, setConnectionVerified] = useState(false);

  useEffect(() => {
    verifyConnectionAndFetchPosts();
  }, []);

  const verifyConnectionAndFetchPosts = async () => {
    try {
      // Step 1: Verify Supabase connection
      console.log('🔗 Verifying Supabase connection...');
      const { data: healthCheck, error: healthError } = await supabase
        .from('blog_posts')
        .select('count', { count: 'exact', head: true });

      if (healthError) {
        console.error('❌ Connection verification failed:', healthError);
        setError(`Database connection error: ${healthError.message}`);
        toast.error('Failed to connect to database');
        setLoading(false);
        return;
      }

      console.log('✅ Connection verified');
      setConnectionVerified(true);

      // Step 2: Fetch blog posts
      await fetchBlogPosts();
    } catch (err: any) {
      console.error('❌ Critical error:', err);
      setError(`Unexpected error: ${err.message}`);
      toast.error('An unexpected error occurred');
      setLoading(false);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      console.log('📚 Fetching blog posts...');
      
      const { data, error, status, statusText } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, category, published_at, featured_image_url, views_count, shares_count")
        .eq("published", true)
        .order("published_at", { ascending: false });

      // Log response details
      console.log('📊 Query Response:', {
        status,
        statusText,
        dataCount: data?.length || 0,
        hasError: !!error,
      });

      if (error) {
        console.error('❌ Query error:', error);
        setError(`Failed to fetch blog posts: ${error.message}`);
        toast.error(`Error: ${error.message}`);
        throw error;
      }

      // Check if data is valid
      if (!Array.isArray(data)) {
        console.warn('⚠️ Unexpected data format:', typeof data);
        setError('Received invalid data format from database');
        toast.error('Invalid data format received');
        setBlogPosts([]);
      } else {
        console.log('✅ Successfully fetched', data.length, 'blog posts');
        setBlogPosts(data);
        
        if (data.length === 0) {
          console.log('ℹ️ No published blog posts found');
        }
      }
    } catch (error: any) {
      console.error("❌ Error fetching blog posts:", error);
      setError(error.message || 'Unknown error occurred');
      
      // Run diagnostics in development
      if (import.meta.env.DEV) {
        console.log('🩺 Running diagnostics...');
        runBlogDiagnostics().then(debugInfo => {
          console.log('📋 Diagnostics complete. Check console for details.');
        });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <BlogErrorBoundary>
      <SEO config={getPageSEO('blog')} />
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-muted/50 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground">
              Insights & Stories
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Expert advice on sustainable fashion, quality manufacturing, styling tips, and industry trends from the Sleek Apparels team.
            </p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-sm text-muted-foreground">Loading blog posts...</p>
              </div>
            ) : error ? (
              <div className="max-w-2xl mx-auto py-20">
                <Card className="border-destructive/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-destructive/10 rounded-full">
                        <AlertCircle className="h-6 w-6 text-destructive" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Failed to Load Blog Posts</h3>
                        <p className="text-sm text-muted-foreground mb-4">{error}</p>
                        <div className="flex gap-3">
                          <Button onClick={verifyConnectionAndFetchPosts} size="sm">
                            Try Again
                          </Button>
                          {import.meta.env.DEV && (
                            <Button 
                              onClick={() => runBlogDiagnostics()} 
                              variant="outline" 
                              size="sm"
                            >
                              Run Diagnostics
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : blogPosts.length === 0 ? (
              <NoBlogPosts />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video overflow-hidden">
                      <LazyImage
                        src={post.featured_image_url} 
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="text-xs font-semibold text-primary px-2 py-1 bg-primary/10 rounded-full">
                          {post.category}
                        </span>
                        <span className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not published'}
                        </span>
                      </div>
                      <CardTitle className="text-xl leading-tight line-clamp-2">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {post.views_count || 0}
                        </span>
                        <span className="flex items-center">
                          <Share2 className="w-3 h-3 mr-1" />
                          {post.shares_count || 0}
                        </span>
                      </div>
                      <Button variant="ghost" className="p-0 h-auto" asChild>
                        <Link to={`/blog/${post.slug}`}>
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
        <FloatingContactWidget />
      </div>
    </BlogErrorBoundary>
  );
};

export default Blog;
