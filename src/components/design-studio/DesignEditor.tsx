import { useState, memo } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Type, Upload, Palette } from "lucide-react";

// Validation schema
const designFormSchema = z.object({
  prompt: z.string().trim().min(10, "Description too short").max(500, "Description too long"),
});

interface DesignEditorProps {
  onDesignGenerated: (design: { imageUrl: string; type: 'ai' | 'text' | 'upload' }) => void;
  onTextChange: (text: string, fontSize: number, color: string) => void;
}

export const DesignEditor = memo(({ onDesignGenerated, onTextChange }: DesignEditorProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [textDesign, setTextDesign] = useState("");
  const [textSize, setTextSize] = useState(48);
  const [textColor, setTextColor] = useState("#000000");

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "No Prompt",
        description: "Please describe what you want to generate",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const validated = designFormSchema.parse({ prompt: aiPrompt });

      const { data, error } = await supabase.functions.invoke('ai-design-generator', {
        body: {
          prompt: validated.prompt,
          stylePreferences: ['modern', 'clean', 'print-on-demand'],
          colorPalette: ['#000000', '#FFFFFF'],
          complexity: 'medium'
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to generate design');
      }

      if (!data?.pattern?.imageUrl) {
        throw new Error('No image URL received from AI generator');
      }

      onDesignGenerated({
        imageUrl: data.pattern.imageUrl,
        type: 'ai'
      });

      toast({
        title: "Design Generated Successfully!",
        description: "Your AI-powered design is ready to preview",
      });

      setAiPrompt(""); // Clear the prompt after successful generation
    } catch (error) {
      console.error('Design generation error:', error);
      
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid Input",
          description: error.errors[0].message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Generation Failed",
          description: error instanceof Error ? error.message : "Please try again with a different description.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApplyText = () => {
    if (!textDesign.trim()) {
      toast({
        title: "No Text",
        description: "Please enter some text first",
        variant: "destructive"
      });
      return;
    }
    onTextChange(textDesign, textSize, textColor);
    toast({
      title: "Text Applied",
      description: "Your text design has been applied to the garment",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Design Your Garment
        </CardTitle>
        <CardDescription>
          Create a custom design using AI or add text
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="ai" className="flex-1">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Design
            </TabsTrigger>
            <TabsTrigger value="text" className="flex-1">
              <Type className="h-4 w-4 mr-2" />
              Text
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="aiPrompt">Design Description</Label>
              <Textarea
                id="aiPrompt"
                placeholder="E.g., 'A cool mountain landscape with sunset colors' or 'Abstract geometric pattern with triangles'"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Describe what you want on your garment. Be specific for best results.
              </p>
            </div>

            <Button
              onClick={handleGenerateAI}
              disabled={loading || !aiPrompt.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Design...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate AI Design
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="text" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="textDesign">Your Text</Label>
              <Input
                id="textDesign"
                placeholder="E.g., 'Summer Vibes' or 'Team Alpha'"
                value={textDesign}
                onChange={(e) => setTextDesign(e.target.value)}
                maxLength={50}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="textSize">Font Size</Label>
                <Input
                  id="textSize"
                  type="number"
                  min="20"
                  max="80"
                  value={textSize}
                  onChange={(e) => setTextSize(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="textColor"
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-16 h-10 cursor-pointer"
                  />
                  <Input
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleApplyText}
              disabled={!textDesign.trim()}
              className="w-full"
            >
              <Type className="mr-2 h-4 w-4" />
              Apply Text to Garment
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
});

DesignEditor.displayName = 'DesignEditor';