import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Save, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BlogEditorProps {
  postId?: string;
  onSave?: () => void;
}

export const BlogEditor = ({ postId, onSave }: BlogEditorProps) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!postId) { // Only auto-generate slug for new posts
      setSlug(generateSlug(value));
    }
  };

  const generateAIOutline = async () => {
    if (!title) {
      toast.error('Please enter a title first');
      return;
    }

    try {
      setAiGenerating(true);
      
      const { data, error } = await supabase.functions.invoke('ai-blog-assistant', {
        body: { action: 'generate_outline', topic: title }
      });

      if (error) throw error;

      if (data.content) {
        setContent(data.content);
        toast.success('AI outline generated! Edit and expand as needed.');
      }
    } catch (error: any) {
      console.error('Error generating outline:', error);
      toast.error('Failed to generate outline');
    } finally {
      setAiGenerating(false);
    }
  };

  const generateAIContent = async () => {
    if (!content) {
      toast.error('Generate an outline first');
      return;
    }

    try {
      setAiGenerating(true);
      
      const { data, error } = await supabase.functions.invoke('ai-blog-assistant', {
        body: { action: 'write_content', outline: content }
      });

      if (error) throw error;

      if (data.content) {
        setContent(data.content);
        toast.success('AI content generated! Review and edit before publishing.');
      }
    } catch (error: any) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content');
    } finally {
      setAiGenerating(false);
    }
  };

  const saveBlogPost = async (publish: boolean = false) => {
    if (!title || !content || !category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);

      const postData = {
        title,
        slug,
        excerpt: excerpt || content.substring(0, 200),
        content,
        category,
        meta_title: metaTitle || title,
        meta_description: metaDescription || excerpt,
        meta_keywords: metaKeywords,
        featured_image_url: featuredImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
        published: publish,
        published_at: publish ? new Date().toISOString() : null,
      };

      let error;
      if (postId) {
        ({ error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', postId));
      } else {
        ({ error } = await supabase
          .from('blog_posts')
          .insert(postData));
      }

      if (error) throw error;

      toast.success(publish ? 'Blog post published!' : 'Blog post saved as draft');
      onSave?.();
    } catch (error: any) {
      console.error('Error saving blog post:', error);
      toast.error('Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Blog Post Editor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title *</Label>
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter blog post title"
            />
          </div>

          <div>
            <Label>URL Slug *</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              placeholder="url-friendly-slug"
            />
          </div>

          <div>
            <Label>Category *</Label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Manufacturing, Quality, Guides"
            />
          </div>

          <div>
            <Label>Excerpt</Label>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short summary of the post (150-200 characters)"
              rows={3}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Content *</Label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={generateAIOutline}
                  disabled={aiGenerating || !title}
                >
                  {aiGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  AI Outline
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={generateAIContent}
                  disabled={aiGenerating || !content}
                >
                  {aiGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  AI Write
                </Button>
              </div>
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post content here... Use the AI buttons to generate outline and content."
              rows={15}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {content.split(' ').length} words
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO Optimization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Meta Title</Label>
            <Input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="SEO title (defaults to post title)"
              maxLength={60}
            />
            <p className="text-xs text-muted-foreground mt-1">{metaTitle.length}/60 characters</p>
          </div>

          <div>
            <Label>Meta Description</Label>
            <Textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="SEO description (defaults to excerpt)"
              rows={3}
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground mt-1">{metaDescription.length}/160 characters</p>
          </div>

          <div>
            <Label>Keywords (comma-separated)</Label>
            <Input
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
              placeholder="apparel, manufacturing, bangladesh"
            />
          </div>

          <div>
            <Label>Featured Image URL</Label>
            <Input
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          onClick={() => saveBlogPost(false)}
          disabled={saving || aiGenerating}
          variant="outline"
          className="flex-1"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Draft
        </Button>
        <Button
          onClick={() => saveBlogPost(true)}
          disabled={saving || aiGenerating}
          className="flex-1"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
          Publish
        </Button>
      </div>
    </div>
  );
};