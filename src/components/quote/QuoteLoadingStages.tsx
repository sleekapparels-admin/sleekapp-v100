import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Search, DollarSign } from "lucide-react";

interface LoadingStage {
  icon: typeof Bot;
  message: string;
  tips: string[];
  duration: number;
}

const LOADING_STAGES: LoadingStage[] = [
  {
    icon: Bot,
    message: "🤖 Reading your requirements...",
    tips: [
      "Analyzing product specifications",
      "Understanding customization needs",
      "Reviewing quantity requirements"
    ],
    duration: 2000
  },
  {
    icon: Search,
    message: "🔍 Searching current market pricing...",
    tips: [
      "Checking Bangladesh manufacturer rates...",
      "Comparing with market averages...",
      "Analyzing competitor pricing...",
      "Calculating shipping costs..."
    ],
    duration: 6000
  },
  {
    icon: DollarSign,
    message: "💰 Building your custom quote...",
    tips: [
      "Finalizing pricing calculations",
      "Preparing detailed breakdown",
      "Generating timeline estimates"
    ],
    duration: 2000
  }
];

interface QuoteLoadingStagesProps {
  onComplete?: () => void;
}

export const QuoteLoadingStages = ({ onComplete }: QuoteLoadingStagesProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const stage = LOADING_STAGES[currentStage];
    
    // Rotate tips within current stage
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % stage.tips.length);
    }, 1500);

    // Move to next stage after duration
    const stageTimeout = setTimeout(() => {
      if (currentStage < LOADING_STAGES.length - 1) {
        setCurrentStage(prev => prev + 1);
        setCurrentTip(0);
      } else if (onComplete) {
        onComplete();
      }
    }, stage.duration);

    return () => {
      clearInterval(tipInterval);
      clearTimeout(stageTimeout);
    };
  }, [currentStage, onComplete]);

  const stage = LOADING_STAGES[currentStage];
  const Icon = stage.icon;

  return (
    <Card className="border-primary/20">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Main Loading Message */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Icon className="w-8 h-8 text-primary animate-pulse" />
              <div className="absolute inset-0 animate-ping opacity-20">
                <Icon className="w-8 h-8 text-primary" />
              </div>
            </div>
            <p className="text-lg font-semibold">{stage.message}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ 
                  width: `${((currentStage + 1) / LOADING_STAGES.length) * 100}%` 
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Step {currentStage + 1} of {LOADING_STAGES.length}</span>
              <span>{Math.round(((currentStage + 1) / LOADING_STAGES.length) * 100)}%</span>
            </div>
          </div>

          {/* Rotating Tips */}
          <div className="bg-secondary/30 rounded-lg p-4 min-h-[60px] flex items-center">
            <p className="text-sm text-muted-foreground animate-fade-in">
              {stage.tips[currentTip]}
            </p>
          </div>

          {/* Stage Indicators */}
          <div className="flex justify-center gap-2">
            {LOADING_STAGES.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStage 
                    ? 'w-8 bg-primary' 
                    : index < currentStage 
                      ? 'w-2 bg-primary/50' 
                      : 'w-2 bg-secondary'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
