import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Copy, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const ProductDescriptionGenerator = () => {
  const [productType, setProductType] = useState('');
  const [material, setMaterial] = useState('');
  const [features, setFeatures] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const generateDescription = async () => {
    if (!productType) {
      toast.error('Please enter a product type');
      return;
    }

    try {
      setGenerating(true);
      
      const { data, error } = await supabase.functions.invoke('generate-product-description', {
        body: {
          product_type: productType,
          material: material || 'Cotton blend',
          features: features.split(',').map(f => f.trim()).filter(f => f),
          target_audience: targetAudience || 'B2B buyers'
        }
      });

      if (error) throw error;

      if (data.content) {
        setGeneratedContent(data.content);
        toast.success('Product description generated!');
      }
    } catch (error: any) {
      console.error('Error generating description:', error);
      toast.error('Failed to generate description');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Product Description Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Product Type *</Label>
              <Input
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                placeholder="e.g., Custom T-Shirt"
              />
            </div>

            <div>
              <Label>Material</Label>
              <Input
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g., 100% Organic Cotton"
              />
            </div>
          </div>

          <div>
            <Label>Key Features (comma-separated)</Label>
            <Input
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="e.g., Custom printing, Multiple colors, Eco-friendly"
            />
          </div>

          <div>
            <Label>Target Audience</Label>
            <Input
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g., Fashion brands, Startups, Corporate clients"
            />
          </div>

          <Button
            onClick={generateDescription}
            disabled={generating || !productType}
            className="w-full"
          >
            {generating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
            Generate Description
          </Button>
        </CardContent>
      </Card>

      {generatedContent && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Product Title</Label>
                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(generatedContent.title)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <h3 className="text-xl font-bold">{generatedContent.title}</h3>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Description</Label>
                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(generatedContent.description)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="whitespace-pre-wrap">{generatedContent.description}</p>
              </div>
            </div>

            <div>
              <Label>Feature Bullets</Label>
              <ul className="space-y-2 mt-2">
                {generatedContent.features.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 p-3 bg-secondary rounded-lg">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Meta Description (SEO)</Label>
                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(generatedContent.meta_description)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm">{generatedContent.meta_description}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {generatedContent.meta_description.length}/160 characters
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};