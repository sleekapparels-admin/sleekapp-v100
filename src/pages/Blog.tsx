import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { SEO } from "@/components/SEO";
import { getPageSEO } from "@/lib/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Eye, Share2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { LazyImage } from "@/components/LazyImage";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  published_at: string;
  featured_image_url: string;
  views_count: number;
  shares_count: number;
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, category, published_at, featured_image_url, views_count, shares_count")
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
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
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">No blog posts available yet.</p>
              </div>
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
                          {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <CardTitle className="text-xl leading-tight line-clamp-2">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {post.views_count}
                        </span>
                        <span className="flex items-center">
                          <Share2 className="w-3 h-3 mr-1" />
                          {post.shares_count}
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
    </>
  );
};

export default Blog;
