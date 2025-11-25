import { Button } from "@/components/ui/button";
import { Share2, Facebook, Linkedin, Twitter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SocialShareButtonsProps {
  postId: string;
  title: string;
  slug: string;
  excerpt: string;
}

export const SocialShareButtons = ({ postId, title, slug, excerpt }: SocialShareButtonsProps) => {
  const { toast } = useToast();
  const url = `https://sleekapparels.com/blog/${slug}`;

  const trackShare = async (platform: string) => {
    try {
      // Track share via edge function (with rate limiting and validation)
      await supabase.functions.invoke('track-social-share', {
        body: {
          post_id: postId,
          platform,
        }
      });
    } catch (error) {
      console.error('Error tracking share:', error);
    }
  };

  const shareToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=600');
    trackShare('linkedin');
    toast({
      title: "Shared to LinkedIn!",
      description: "Thank you for sharing our article.",
    });
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=600');
    trackShare('facebook');
    toast({
      title: "Shared to Facebook!",
      description: "Thank you for sharing our article.",
    });
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=600');
    trackShare('twitter');
    toast({
      title: "Shared to Twitter!",
      description: "Thank you for sharing our article.",
    });
  };

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
    trackShare('whatsapp');
    toast({
      title: "Shared to WhatsApp!",
      description: "Thank you for sharing our article.",
    });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "Article link copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={shareToLinkedIn}
        className="gap-2 hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-colors"
      >
        <Linkedin className="h-4 w-4" />
        LinkedIn
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={shareToFacebook}
        className="gap-2 hover:bg-[#1877f2] hover:text-white hover:border-[#1877f2] transition-colors"
      >
        <Facebook className="h-4 w-4" />
        Facebook
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={shareToTwitter}
        className="gap-2 hover:bg-[#1da1f2] hover:text-white hover:border-[#1da1f2] transition-colors"
      >
        <Twitter className="h-4 w-4" />
        Twitter
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={shareToWhatsApp}
        className="gap-2 hover:bg-[#25d366] hover:text-white hover:border-[#25d366] transition-colors"
      >
        <Share2 className="h-4 w-4" />
        WhatsApp
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={copyLink}
        className="gap-2"
      >
        <Share2 className="h-4 w-4" />
        Copy Link
      </Button>
    </div>
  );
};
