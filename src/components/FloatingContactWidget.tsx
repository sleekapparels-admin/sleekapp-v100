import { useState } from "react";
import { MessageCircle, X, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const FloatingContactWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Contact Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-2xl transition-all hover:scale-110 animate-bounce-subtle"
        aria-label="Open contact options"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Contact Options Card */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-72 shadow-2xl animate-slide-up border-2 border-primary/20">
          <CardContent className="p-4 space-y-3">
            <div className="text-sm font-semibold mb-3 text-foreground">Get in Touch</div>
            
            <Button
              asChild
              variant="outline"
              className="w-full justify-start gap-3"
            >
              <a
                href="https://wa.me/8801861011367?text=Hi%2C%20I%27d%20like%20to%20inquire%20about%20your%20manufacturing%20services."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 text-green-600" />
                WhatsApp Chat
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full justify-start gap-3"
            >
              <a href="mailto:inquiry@sleekapparels.com">
                <Mail className="h-4 w-4 text-primary" />
                Email Us
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full justify-start gap-3"
            >
              <a href="tel:+8801861011367">
                <Phone className="h-4 w-4 text-primary" />
                Call +880-186-1011-367
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.2s ease-out;
        }
      `}</style>
    </>
  );
};
