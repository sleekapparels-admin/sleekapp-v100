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
import { supabase } from "@/integrations/supabase/client";
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
              <div className="max-w-2xl mx-auto text-center py-20">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 md:p-12 border border-purple-100">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-6">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Blog Coming Soon!</h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    We're preparing insightful articles on apparel manufacturing, sustainable fashion, 
                    startup guides, and industry trends. Subscribe to get notified when we launch.
                  </p>
                  <div className="max-w-md mx-auto">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 rounded-lg border border-input bg-background"
                      />
                      <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                        Notify Me
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Join 500+ apparel entrepreneurs getting our updates. Unsubscribe anytime.
                    </p>
                  </div>
                  <div className="mt-8 pt-8 border-t border-purple-200">
                    <p className="text-sm text-muted-foreground mb-4">While you wait, check out:</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Button variant="outline" asChild>
                        <Link to="/for-startups">
                          Startup Guide
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link to="/tech-pack-services">
                          Tech Pack Resources
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link to="/samples">
                          Sample Program
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
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
