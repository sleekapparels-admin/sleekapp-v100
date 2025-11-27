import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Camera, Scan, CheckCircle2, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export const AIQualityScanner = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    score: number;
    status: "pass" | "fail" | "warning";
    defects: { type: string; confidence: number; location: { x: number; y: number } }[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysisResult(null); // Reset previous result
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAnalysis = () => {
    if (!image) {
      toast.error("Please upload an image first");
      return;
    }

    setIsAnalyzing(true);

    // Simulate API delay
    setTimeout(() => {
      setIsAnalyzing(false);

      // Randomize result for demo purposes
      const score = Math.floor(Math.random() * (100 - 75) + 75); // Score between 75 and 100
      const defects = [];

      if (score < 90) {
        defects.push({
          type: "Minor Stitching Irregularity",
          confidence: 0.85,
          location: { x: 40, y: 30 } // Percentage coordinates
        });
      }

      if (score < 80) {
        defects.push({
          type: "Fabric Tension Warning",
          confidence: 0.72,
          location: { x: 60, y: 60 }
        });
      }

      setAnalysisResult({
        score,
        status: score >= 90 ? "pass" : score >= 80 ? "warning" : "fail",
        defects
      });

      toast.success("Analysis Complete");
    }, 2500);
  };

  const resetScanner = () => {
    setImage(null);
    setAnalysisResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-6 w-6 text-primary" />
          AI Quality Inspector
        </CardTitle>
        <CardDescription>
          Upload a photo from the production floor to detect defects instantly using Computer Vision.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Upload Area */}
        {!image && (
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Click to Upload Photo</p>
            <p className="text-sm text-muted-foreground/70 mt-1">or drag and drop here</p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        )}

        {/* Analysis View */}
        {image && (
          <div className="relative rounded-lg overflow-hidden border bg-black/5">
            <img src={image} alt="Production Item" className="w-full h-auto max-h-[500px] object-contain mx-auto" />

            {/* Scanning Overlay Effect */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
                <Scan className="h-16 w-16 text-primary animate-pulse" />
                <p className="text-white font-mono mt-4 text-lg animate-bounce">Analyzing Patterns...</p>
              </div>
            )}

            {/* Result Overlay */}
            {!isAnalyzing && analysisResult && (
              <>
                {/* Defect Markers */}
                {analysisResult.defects.map((defect, i) => (
                  <div
                    key={i}
                    className="absolute w-24 h-24 border-2 border-red-500 rounded-full animate-ping-slow"
                    style={{
                      top: `${defect.location.y}%`,
                      left: `${defect.location.x}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {defect.type}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Controls Overlay */}
            {!isAnalyzing && !analysisResult && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <Button onClick={simulateAnalysis} className="shadow-lg">
                  <Scan className="mr-2 h-4 w-4" /> Run AI Analysis
                </Button>
                <Button variant="outline" onClick={resetScanner} className="bg-background/80 backdrop-blur">
                  Change Photo
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Report Card */}
        {analysisResult && !isAnalyzing && (
          <div className="bg-muted/30 rounded-lg p-6 border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Quality Report</h3>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                analysisResult.status === 'pass' ? 'bg-green-100 text-green-700 border-green-200' :
                analysisResult.status === 'warning' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                'bg-red-100 text-red-700 border-red-200'
              }`}>
                {analysisResult.status === 'pass' ? <CheckCircle2 className="h-4 w-4" /> :
                 analysisResult.status === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                 <XCircle className="h-4 w-4" />}
                <span className="font-bold uppercase text-sm">{analysisResult.status}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Quality Score</span>
                  <span className="font-mono font-bold">{analysisResult.score}/100</span>
                </div>
                <Progress value={analysisResult.score} className={`h-3 ${
                  analysisResult.score > 90 ? "bg-green-100 [&>div]:bg-green-500" : 
                  analysisResult.score > 80 ? "bg-yellow-100 [&>div]:bg-yellow-500" : 
                  "bg-red-100 [&>div]:bg-red-500"
                }`} />
              </div>

              {analysisResult.defects.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Detected Issues:</p>
                  {analysisResult.defects.map((defect, i) => (
                    <div key={i} className="flex items-center justify-between bg-white p-3 rounded border text-sm">
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        {defect.type}
                      </span>
                      <span className="text-muted-foreground text-xs">{(defect.confidence * 100).toFixed(0)}% confidence</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-green-50 p-4 rounded border border-green-100 text-green-800 text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  No significant defects detected. Ready for next stage.
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <Button variant="ghost" onClick={resetScanner} size="sm">
                  Start New Scan
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
