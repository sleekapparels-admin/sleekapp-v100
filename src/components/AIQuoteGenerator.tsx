import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Clock, DollarSign, Calendar, TrendingDown, Lightbulb, Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { generateAIQuote } from "@/lib/api/aiQuote";

// Client-side validation schema - email is REQUIRED
const quoteFormSchema = z.object({
  productType: z.string().min(1, "Product type is required"),
  quantity: z.number().int().min(50, "Minimum quantity is 50 pieces").max(100000, "Maximum quantity is 100,000 pieces"),
  complexityLevel: z.enum(['simple', 'medium', 'complex']).optional(),
  fabricType: z.string().max(100, "Fabric type too long").optional(),
  additionalRequirements: z.string().max(2000, "Requirements too long (max 2000 characters)").optional(),
  customerName: z.string().trim().max(100, "Name too long").optional(),
  customerEmail: z.string().email("Valid email is required").min(1, "Email is required").max(255, "Email too long"),
});

interface QuoteResult {
  quote: {
    id: string;
    total_price: number;
    estimated_delivery_days: number;
    quote_data: {
      breakdown: {
        baseUnitPrice: number;
        complexityFactor: number;
        volumeDiscount: number;
        finalUnitPrice: number;
        totalPrice: number;
      };
      timeline: {
        samplingDays: number;
        productionDays: number;
        bufferDays: number;
        totalDays: number;
        estimatedDeliveryDate: string;
      };
      moqRange: {
        min: number;
        max: number;
        requested: number;
      };
    };
    ai_suggestions: string;
  };
  timeline: Array<{
    stage: string;
    days: number;
    startDate: string;
    endDate: string;
  }>;
  aiInsights: string;
}

export const AIQuoteGenerator = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  
  const [formData, setFormData] = useState({
    productType: "",
    quantity: "",
    complexityLevel: "medium",
    fabricType: "",
    additionalRequirements: "",
    customerName: "",
    customerEmail: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filePreview, setFilePreview] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isPDF = file.type === 'application/pdf';
      const isUnder20MB = file.size <= 20 * 1024 * 1024;
      return (isImage || isPDF) && isUnder20MB;
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Some files were skipped",
        description: "Only images and PDFs under 20MB are accepted",
        variant: "destructive"
      });
    }

    setUploadedFiles(prev => [...prev, ...validFiles].slice(0, 3));
    
    // Create preview URLs for images
    validFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    console.log('Generating AI quote...');

    try {
      // Client-side validation
      const validated = quoteFormSchema.parse({
        productType: formData.productType,
        quantity: parseInt(formData.quantity),
        complexityLevel: formData.complexityLevel || 'medium',
        fabricType: formData.fabricType || undefined,
        additionalRequirements: formData.additionalRequirements || undefined,
        customerName: formData.customerName || undefined,
        customerEmail: formData.customerEmail,
      });

      console.log('Validated data:', validated);

      // Convert files to base64 for API
      const fileData = await Promise.all(
        uploadedFiles.map(async (file) => {
          return new Promise<{ name: string; type: string; data: string }>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({
                name: file.name,
                type: file.type,
                data: reader.result as string
              });
            };
            reader.readAsDataURL(file);
          });
        })
      );

      // Use the enhanced API
      const result = await generateAIQuote({
        productType: validated.productType,
        quantity: validated.quantity,
        complexityLevel: validated.complexityLevel,
        fabricType: validated.fabricType,
        additionalRequirements: validated.additionalRequirements,
        customerEmail: validated.customerEmail,
        customerName: validated.customerName,
        files: fileData.length > 0 ? fileData : undefined,
      });

      console.log('Quote generated successfully:', result);
      setQuoteResult(result);
      
      toast({
        title: "Quote Generated!",
        description: `Your instant quote for ${validated.quantity} units is ready with AI-powered insights from Bangladesh manufacturing experts`,
      });

    } catch (error) {
      console.error('Error generating quote:', error);
      
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive"
        });
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate quote. Please try again.';
        toast({
          title: "Error Generating Quote",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          AI Quote Generator
        </h1>
        <p className="text-muted-foreground">
          Get instant pricing and production timeline powered by AI
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Request a Quote</CardTitle>
            <CardDescription>Fill in your requirements for an instant AI-powered quote</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productType">Product Type *</Label>
                <Select
                  value={formData.productType}
                  onValueChange={(value) => setFormData({ ...formData, productType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="t-shirts">T-Shirts</SelectItem>
                    <SelectItem value="polo-shirts">Polo Shirts</SelectItem>
                    <SelectItem value="hoodies">Hoodies & Sweatshirts</SelectItem>
                    <SelectItem value="joggers">Joggers & Sweatpants</SelectItem>
                    <SelectItem value="sweaters">Sweaters & Cardigans</SelectItem>
                    <SelectItem value="tank-tops">Tank Tops & Vests</SelectItem>
                    <SelectItem value="jackets">Jackets & Outerwear</SelectItem>
                    <SelectItem value="athletic-wear">Athletic & Performance Wear</SelectItem>
                    <SelectItem value="corporate-uniforms">Corporate Uniforms</SelectItem>
                    <SelectItem value="school-uniforms">School Uniforms</SelectItem>
                    <SelectItem value="sports-uniforms">Sports Team Uniforms</SelectItem>
                    <SelectItem value="workwear">Workwear & Safety Apparel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (pieces) *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="50"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g., 100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="complexity">Complexity Level</Label>
                <Select
                  value={formData.complexityLevel}
                  onValueChange={(value) => setFormData({ ...formData, complexityLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple (solid colors, basic patterns)</SelectItem>
                    <SelectItem value="medium">Medium (multi-color, moderate detail)</SelectItem>
                    <SelectItem value="complex">Complex (intricate designs, jacquard)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fabricType">Fabric Type (Optional)</Label>
                <Input
                  id="fabricType"
                  value={formData.fabricType}
                  onChange={(e) => setFormData({ ...formData, fabricType: e.target.value })}
                  placeholder="e.g., 100% Cotton, Merino Wool"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Additional Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.additionalRequirements}
                  onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                  placeholder="Special finishing, packaging, certifications..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Upload Tech Pack or Reference Images (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/*,.pdf"
                    multiple
                    onChange={handleFileUpload}
                    disabled={uploadedFiles.length >= 3}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload tech pack, design mockups, or reference images
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Images or PDF • Max 3 files • 20MB each
                    </p>
                  </label>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-secondary/30 rounded">
                        {file.type.startsWith('image/') ? (
                          <ImageIcon className="h-4 w-4 text-primary" />
                        ) : (
                          <FileText className="h-4 w-4 text-primary" />
                        )}
                        <span className="text-sm flex-1 truncate">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(1)}MB
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Quote...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate AI Quote
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {quoteResult && (
          <div className="space-y-4">
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Your Instant Quote
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                  <div className="text-4xl font-bold text-primary">
                    ${quoteResult.quote.total_price.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    ${quoteResult.quote.quote_data.breakdown.finalUnitPrice.toFixed(2)} per unit
                  </div>
                  {quoteResult.quote.quote_data.breakdown.volumeDiscount < 1 && (
                    <Badge variant="secondary" className="mt-2">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      {((1 - quoteResult.quote.quote_data.breakdown.volumeDiscount) * 100).toFixed(0)}% Volume Discount Applied
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <div className="text-xs text-muted-foreground">Quantity</div>
                    <div className="text-lg font-semibold">{quoteResult.quote.quote_data.moqRange.requested} pcs</div>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <div className="text-xs text-muted-foreground">Complexity</div>
                    <div className="text-lg font-semibold capitalize">
                      {quoteResult.quote.quote_data.breakdown.complexityFactor}x
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold">Estimated Timeline</div>
                    <div className="text-2xl font-bold text-primary">
                      {quoteResult.quote.estimated_delivery_days} days
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      Estimated delivery: {quoteResult.quote.quote_data.timeline.estimatedDeliveryDate}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="h-4 w-4" />
                  Production Timeline Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quoteResult.timeline.map((stage, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-secondary/30 rounded">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{stage.stage}</div>
                        <div className="text-xs text-muted-foreground">
                          {stage.startDate} → {stage.endDate}
                        </div>
                      </div>
                      <Badge variant="outline">{stage.days} days</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {quoteResult.aiInsights && (
              <Card className="border-primary/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    AI-Powered Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm whitespace-pre-wrap">{quoteResult.aiInsights}</div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};