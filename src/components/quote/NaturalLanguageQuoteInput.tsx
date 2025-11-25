import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ParsedQuoteData {
  productType?: string;
  quantity?: string;
  fabricType?: string;
  complexityLevel?: string;
  additionalRequirements?: string;
}

interface NaturalLanguageQuoteInputProps {
  onParsedData: (data: ParsedQuoteData) => void;
  disabled?: boolean;
}

export const NaturalLanguageQuoteInput = ({ onParsedData, disabled }: NaturalLanguageQuoteInputProps) => {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleParse = async (retryCount = 0) => {
    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please describe what you need to manufacture",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('parse-quote-description', {
        body: { description: description.trim() }
      });

      if (error) {
        // Retry logic for transient errors
        if (retryCount < 2 && (error.message?.includes('timeout') || error.message?.includes('network'))) {
          console.log(`Retrying parse (attempt ${retryCount + 1})...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return handleParse(retryCount + 1);
        }
        throw error;
      }

      if (data?.success && data?.parsed) {
        onParsedData(data.parsed);
        toast({
          title: "✨ Got it!",
          description: "Review the pre-filled form below and adjust if needed",
        });
        setDescription("");
      } else {
        throw new Error("Failed to parse description");
      }
    } catch (error) {
      console.error('Error parsing description:', error);
      toast({
        title: "Parsing failed",
        description: retryCount > 0 
          ? "Multiple attempts failed. Please use the guided form below."
          : "Please use the guided form below instead",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Quick Quote from Description
        </CardTitle>
        <CardDescription>
          Describe what you need in plain English, and we'll fill out the form for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Example: I need 200 organic cotton hoodies with embroidered logo on the chest, shipped to USA by March 15th"
          className="min-h-[120px] resize-none"
          disabled={disabled || loading}
        />
        <div className="flex gap-3">
          <Button 
            onClick={() => handleParse(0)}
            disabled={disabled || loading || !description.trim()}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Quote from Description
              </>
            )}
          </Button>
          {description && (
            <Button 
              variant="outline" 
              onClick={() => setDescription("")}
              disabled={disabled || loading}
            >
              Clear
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          💡 Tip: Include product type, quantity, material, customizations, and destination for best results
        </p>
      </CardContent>
    </Card>
  );
};
