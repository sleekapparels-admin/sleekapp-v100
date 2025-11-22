import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { slideInBottom, staggerContainer } from "@/lib/animations";
import { memo } from 'react';
import { QuickReply } from '@/hooks/useConversation';

interface SmartReplyButtonsProps {
  onSelect: (reply: QuickReply | string) => void;
  replies?: QuickReply[];
}

export const SmartReplyButtons = memo(({ onSelect, replies }: SmartReplyButtonsProps) => {
  if (!replies || replies.length === 0) return null;

  return (
    <motion.div 
      className="space-y-2 pt-3"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="flex items-center gap-2"
        variants={fadeInUp}
      >
        <motion.div 
          className="bg-amber-500/10 p-1 rounded-full"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(245, 158, 11, 0.2)',
              '0 0 0 8px rgba(245, 158, 11, 0)',
              '0 0 0 0 rgba(245, 158, 11, 0)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        >
          <Lightbulb className="h-3 w-3 text-amber-600" />
        </motion.div>
        <h4 className="font-semibold text-xs">Quick Replies</h4>
      </motion.div>
      <div className="flex flex-wrap gap-1.5">
        {replies.map((reply, index) => (
          <motion.div
            key={reply.text}
            variants={fadeInUp}
            custom={index}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelect(reply)}
              className="text-xs h-auto py-2 px-3 hover:shadow-md hover:bg-primary hover:text-primary-foreground transition-all border-primary/20"
            >
              {reply.text}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});
