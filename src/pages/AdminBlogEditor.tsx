import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabaseClient";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

const AdminBlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    featured_image_url: "",
    published: false,
    meta_title: "",
    meta_description: "",
    tags: "",
  });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error("Access denied. Admin only.");
      navigate("/");
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isEditMode && isAdmin) {
      fetchPost();
    }
  }, [id, isAdmin]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title || "",
        slug: data.slug || "",
        excerpt: data.excerpt || "",
        content: data.content || "",
        category: data.category || "",
        featured_image_url: data.featured_image_url || "",
        published: data.published || false,
        meta_title: data.meta_title || "",
        meta_description: data.meta_description || "",
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
      });
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.excerpt || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const postData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        featured_image_url: formData.featured_image_url,
        published: formData.published,
        published_at: formData.published ? new Date().toISOString() : null,
        meta_title: formData.meta_title || formData.title,
        meta_description: formData.meta_description || formData.excerpt,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
      };

      if (isEditMode) {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", id);

        if (error) throw error;
        
        // Log admin action
        const { logAdminAction } = await import('@/lib/auditLog');
        await logAdminAction({
          action: formData.published ? 'blog_post_published' : 'blog_post_updated',
          resourceType: 'blog_post',
          resourceId: id,
          details: { title: formData.title, slug: postData.slug },
        });
        
        toast.success("Post updated successfully");
      } else {
        const { data, error } = await supabase
          .from("blog_posts")
          .insert([postData])
          .select()
          .single();

        if (error) throw error;
        
        // Log admin action
        const { logAdminAction } = await import('@/lib/auditLog');
        await logAdminAction({
          action: 'blog_post_created',
          resourceType: 'blog_post',
          resourceId: data?.id,
          details: { title: formData.title, slug: postData.slug },
        });
        
        toast.success("Post created successfully");
      }

      navigate("/admin/blog");
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save post");
    } finally {
      setLoading(false);
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/blog")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Posts
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? "Edit Post" : "Create New Post"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated-from-title"
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Sustainability, Manufacturing, Style Tips"
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary of the post"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your post content here (supports HTML)"
                  rows={15}
                  required
                />
              </div>

              <div>
                <Label htmlFor="featured_image">Featured Image URL</Label>
                <Input
                  id="featured_image"
                  value={formData.featured_image_url}
                  onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="knitwear, sustainability, fashion"
                />
              </div>

              <div>
                <Label htmlFor="meta_title">SEO Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  placeholder="Defaults to post title"
                />
              </div>

              <div>
                <Label htmlFor="meta_description">SEO Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder="Defaults to excerpt"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                <Label htmlFor="published">Publish immediately</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Saving..." : isEditMode ? "Update Post" : "Create Post"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/blog")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default AdminBlogEditor;
