import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StickyWhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
}

export const StickyWhatsAppButton = ({ 
  phoneNumber = "+8801861011367", 
  message = "Hello! I'm interested in learning more about Sleek Apparels manufacturing services.",
  className 
}: StickyWhatsAppButtonProps) => {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      size="lg"
      className={cn(
        "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-2xl",
        "bg-[#25D366] hover:bg-[#20BA5A] text-white",
        "flex items-center justify-center p-0",
        "animate-bounce hover:animate-none",
        "transition-all duration-300 hover:scale-110 active:scale-95",
        "group shadow-[#25D366]/50",
        "md:bottom-8 md:right-8",
        className
      )}
      aria-label="Chat on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle className="h-7 w-7 group-hover:rotate-12 transition-transform duration-300" />
      
      {/* Pulse Ring Effect */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping" />
      
      {/* Tooltip for Desktop */}
      <span className="absolute right-full mr-3 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg hidden md:block">
        Chat with us on WhatsApp
        <span className="absolute top-1/2 left-full -translate-y-1/2 border-8 border-transparent border-l-gray-900" />
      </span>
    </Button>
  );
};
