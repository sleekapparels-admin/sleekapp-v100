import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const industryFacts = [
  "🌍 Bangladesh manufactures for 80% of top global brands",
  "🏬 Processing 1000 units? That's enough to stock 5 retail locations!",
  "🏭 Our factories produce 50,000+ pieces monthly",
  "💡 Custom apparel has 3x higher profit margins than generic items",
  "🎯 70% of successful fashion brands start with Bangladesh manufacturing",
  "⚡ We've completed 5000+ custom orders with 98% satisfaction",
  "🌱 Bangladesh is the world's 2nd largest apparel exporter",
  "📈 Custom manufacturing reduces your inventory risk by 60%",
];

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export const LoadingOverlay = ({ isVisible, message = "Loop is generating your custom quote..." }: LoadingOverlayProps) => {
  const [currentFact, setCurrentFact] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % industryFacts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center"
        >
          <div className="max-w-md mx-auto px-6 text-center space-y-6">
            {/* Animated Logo/Icon */}
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-20 h-20 mx-auto bg-gradient-to-r from-primary to-primary/60 rounded-full flex items-center justify-center shadow-2xl"
            >
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </motion.div>

            {/* Loading Message */}
            <div className="space-y-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {message}
              </h3>
              
              {/* Animated dots */}
              <div className="flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [0, -10, 0],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                ))}
              </div>
            </div>

            {/* Rotating Industry Facts */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFact}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20"
              >
                <p className="text-sm font-medium">{industryFacts[currentFact]}</p>
              </motion.div>
            </AnimatePresence>

            {/* Progress indicator */}
            <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-primary to-primary/60"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
