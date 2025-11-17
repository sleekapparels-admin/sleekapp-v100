import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function BulkGenerationTrigger() {
  useEffect(() => {
    const triggerBulkGeneration = async () => {
      toast.info("Starting bulk AI image generation for all products...");
      
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('ai_generated_image', false);
      
      if (error || !products) {
        toast.error("Failed to fetch products");
        return;
      }

      toast.success(`Found ${products.length} products needing images`);
      
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        
        try {
          toast.loading(`Generating ${i + 1}/${products.length}: ${product.title}`, {
            id: 'generation-progress'
          });

          const { data, error: genError } = await supabase.functions.invoke('generate-product-image', {
            body: {
              productId: product.id,
              title: product.title,
              category: product.category,
              description: product.description,
              colors: product.colors,
              yarn: product.yarn
            }
          });

          if (genError) throw genError;
          
          successCount++;
          toast.success(`✓ ${product.title}`, { id: `success-${i}` });
          
          // 2 second delay between requests to avoid rate limits
          if (i < products.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } catch (error: any) {
          failCount++;
          console.error(`Failed to generate image for ${product.title}:`, error);
          toast.error(`✗ ${product.title}: ${error.message}`, { id: `error-${i}` });
        }
      }

      toast.dismiss('generation-progress');
      toast.success(`🎉 Bulk generation complete! Success: ${successCount}, Failed: ${failCount}`, {
        duration: 10000
      });
    };

    triggerBulkGeneration();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
      <h1 className="text-2xl font-bold mb-2">Generating Product Images</h1>
      <p className="text-muted-foreground">This may take several minutes...</p>
      <p className="text-sm text-muted-foreground mt-2">Check the toast notifications for progress</p>
    </div>
  );
}
