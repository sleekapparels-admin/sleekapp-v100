import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Eye, Share2 } from "lucide-react";
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

interface BlogPostCardProps {
  post: BlogPost;
}

export const BlogPostCard = ({ post }: BlogPostCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-card-hover transition-all duration-300 group">
      <div className="aspect-video overflow-hidden bg-muted">
        <LazyImage
          src={post.featured_image_url}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <CardHeader>
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="text-xs font-semibold text-primary px-3 py-1 bg-primary/10 rounded-full">
            {post.category}
          </span>
          <span className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(post.published_at).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </span>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {post.views_count}
            </span>
            <span className="flex items-center">
              <Share2 className="w-3 h-3 mr-1" />
              {post.shares_count}
            </span>
          </div>
        </div>
        <CardTitle className="text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
        <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary-dark" asChild>
          <Link to={`/blog/${post.slug}`}>
            Read Full Article →
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
