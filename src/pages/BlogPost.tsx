import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { SEO } from "@/components/SEO";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SocialShareButtons } from "@/components/blog/SocialShareButtons";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Calendar, Eye, Share2 } from "lucide-react";
import { LazyImage } from "@/components/LazyImage";
import DOMPurify from "dompurify";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  published_at: string;
  featured_image_url: string;
  meta_title: string | null;
  meta_description: string | null;
  views_count: number;
  shares_count: number;
  tags: any;
}

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error) throw error;
      
      setPost(data);

      // Increment view count
      if (data?.id) {
        await supabase.rpc('increment_blog_post_views', { post_id_param: data.id });
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const seoConfig = {
    title: post.meta_title || `${post.title} | Sleek Apparels Blog`,
    description: post.meta_description || post.excerpt,
    canonical: `https://sleekapparels.com/blog/${post.slug}`,
    ogTitle: post.meta_title || post.title,
    ogDescription: post.meta_description || post.excerpt,
    ogImage: post.featured_image_url,
    ogType: 'article',
  };

  return (
    <>
      <SEO 
        config={seoConfig} 
        publishedTime={post.published_at}
        modifiedTime={post.published_at}
      />

      <div className="min-h-screen bg-background">
        <Navbar />
        <Breadcrumb />

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Button variant="ghost" className="mb-6" asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          {/* Category & Meta */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-sm font-semibold text-primary px-3 py-1 bg-primary/10 rounded-full">
              {post.category}
            </span>
            <span className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(post.published_at).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
            <span className="flex items-center text-sm text-muted-foreground">
              <Eye className="w-4 h-4 mr-1" />
              {post.views_count} views
            </span>
            <span className="flex items-center text-sm text-muted-foreground">
              <Share2 className="w-4 h-4 mr-1" />
              {post.shares_count} shares
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Social Share */}
          <div className="mb-8">
            <SocialShareButtons 
              postId={post.id}
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
            />
          </div>

          {/* Featured Image */}
          <div className="aspect-video w-full overflow-hidden rounded-lg mb-12 shadow-card">
            <LazyImage
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(post.content, {
                ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'ul', 'ol', 'li', 'blockquote', 'img', 'code', 'pre', 'hr', 'span', 'div'],
                ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'target', 'rel', 'title']
              })
            }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">TAGS</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-muted text-sm rounded-full text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share Again at Bottom */}
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-lg font-semibold mb-4">Share This Article</h3>
            <SocialShareButtons 
              postId={post.id}
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
            />
          </div>
        </article>

        <Footer />
        <FloatingContactWidget />
      </div>
    </>
  );
};

export default BlogPost;
