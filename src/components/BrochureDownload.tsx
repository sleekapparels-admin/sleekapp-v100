import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BrochureDownloadProps {
  variant?: "card" | "inline" | "minimal";
  className?: string;
}

export const BrochureDownload = ({ variant = "card", className = "" }: BrochureDownloadProps) => {
  const handleDownload = () => {
    // Since we created a markdown file, we'll link to it for now
    // In production, this would link to an actual PDF file
    const link = document.createElement('a');
    link.href = '/SLEEK_APPARELS_COMPANY_BROCHURE.md';
    link.download = 'Sleek-Apparels-Company-Brochure.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (variant === "minimal") {
    return (
      <Button 
        onClick={handleDownload}
        variant="link" 
        className={`gap-2 ${className}`}
      >
        <Download className="h-4 w-4" />
        Download Company Brochure
      </Button>
    );
  }

  if (variant === "inline") {
    return (
      <Button 
        onClick={handleDownload}
        variant="outline" 
        size="lg"
        className={`gap-2 ${className}`}
      >
        <Download className="h-5 w-5" />
        Download Company Brochure
      </Button>
    );
  }

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="text-lg font-bold mb-1">Company Brochure</h3>
                <Badge variant="secondary" className="mb-2">PDF Document</Badge>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Complete overview of our business operations, unique selling points, manufacturing capabilities, certifications, and success stories. Perfect for partners, investors, and procurement teams.
            </p>

            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                10-12 pages • Comprehensive guide
              </div>
              <Button 
                onClick={handleDownload}
                size="sm" 
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
