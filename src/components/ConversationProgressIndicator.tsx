import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ConversationProgressIndicatorProps {
  extractedData: any;
}

const stages = [
  { key: 'name', label: 'Name', stage: 'name_collection' },
  { key: 'intent', label: 'Intent', stage: 'intent_inquiry' },
  { key: 'product', label: 'Product', stage: 'product_selection' },
  { key: 'quantity', label: 'Quantity', stage: 'quantity_inquiry' },
  { key: 'budget', label: 'Budget', stage: 'budget_inquiry' },
  { key: 'details', label: 'Details', stage: 'customization_inquiry' },
  { key: 'quote', label: 'Quote', stage: 'decision' },
];

export const ConversationProgressIndicator = ({ extractedData }: ConversationProgressIndicatorProps) => {
  const currentStageIndex = stages.findIndex(s => s.stage === extractedData?.stage) + 1;
  const progress = (currentStageIndex / stages.length) * 100;

  const isStageComplete = (stageKey: string) => {
    switch (stageKey) {
      case 'name': return !!extractedData?.name;
      case 'intent': return !!extractedData?.intent;
      case 'product': return !!extractedData?.productType;
      case 'quantity': return !!extractedData?.quantity;
      case 'budget': return !!extractedData?.budget_range;
      case 'details': return !!extractedData?.customization_level;
      case 'quote': return extractedData?.readyToProceed === true;
      default: return false;
    }
  };

  return (
    <div className="mb-4 px-1">
      {/* Progress Bar */}
      <div className="relative h-1.5 bg-secondary/30 rounded-full overflow-hidden mb-3">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Stage Indicators */}
      <div className="flex justify-between items-center">
        {stages.map((stage, index) => {
          const isComplete = isStageComplete(stage.key);
          const isCurrent = index === currentStageIndex - 1;

          return (
            <div key={stage.key} className="flex flex-col items-center gap-1.5 flex-1">
              <motion.div
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold
                  transition-colors duration-300
                  ${isComplete 
                    ? 'bg-primary text-primary-foreground' 
                    : isCurrent
                    ? 'bg-primary/20 text-primary border-2 border-primary'
                    : 'bg-secondary/30 text-muted-foreground'
                  }
                `}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {isComplete ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  index + 1
                )}
              </motion.div>
              <span className={`
                text-[10px] font-medium text-center
                ${isComplete ? 'text-primary' : isCurrent ? 'text-foreground' : 'text-muted-foreground'}
              `}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};