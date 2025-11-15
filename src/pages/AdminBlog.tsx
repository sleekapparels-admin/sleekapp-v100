import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  published: boolean;
  published_at: string | null;
  views_count: number;
  created_at: string;
}

const AdminBlog = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error("Access denied. Admin only.");
      navigate("/");
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchPosts();
    }
  }, [isAdmin]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, category, published, published_at, views_count, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (postId: string, currentStatus: boolean) => {
    try {
      const post = posts.find(p => p.id === postId);
      
      const { error } = await supabase
        .from("blog_posts")
        .update({ 
          published: !currentStatus,
          published_at: !currentStatus ? new Date().toISOString() : null
        })
        .eq("id", postId);

      if (error) throw error;
      
      // Log admin action
      const { logAdminAction } = await import('@/lib/auditLog');
      await logAdminAction({
        action: !currentStatus ? 'blog_post_published' : 'blog_post_unpublished',
        resourceType: 'blog_post',
        resourceId: postId,
        details: { title: post?.title || 'Unknown' },
      });
      
      toast.success(!currentStatus ? "Post published" : "Post unpublished");
      fetchPosts();
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast.error("Failed to update post status");
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const post = posts.find(p => p.id === postId);
      
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;
      
      // Log admin action
      const { logAdminAction } = await import('@/lib/auditLog');
      await logAdminAction({
        action: 'blog_post_deleted',
        resourceType: 'blog_post',
        resourceId: postId,
        details: { title: post?.title || 'Unknown' },
      });
      
      toast.success("Post deleted");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Blog Management</h1>
            <p className="text-muted-foreground">Create and manage your blog content</p>
          </div>
          <Button onClick={() => navigate("/admin/blog/new")}>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="py-20 text-center">
              <p className="text-muted-foreground mb-4">No blog posts yet</p>
              <Button onClick={() => navigate("/admin/blog/new")}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      <div className="flex gap-2 mt-3">
                        <Badge variant="outline">{post.category}</Badge>
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                        <span className="flex items-center text-xs text-muted-foreground">
                          <Eye className="w-3 h-3 mr-1" />
                          {post.views_count} views
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePublish(post.id, post.published)}
                      >
                        {post.published ? "Unpublish" : "Publish"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deletePost(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminBlog;
