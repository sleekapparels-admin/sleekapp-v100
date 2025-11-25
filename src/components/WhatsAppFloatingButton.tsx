import { MessageCircle } from "lucide-react";

export const WhatsAppFloatingButton = () => {
  const whatsappNumber = "8801861011367";
  const message = encodeURIComponent("Hi Sleek Apparels! I'm interested in manufacturing custom apparel. Can we discuss?");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-2xl transition-all hover:scale-110 animate-bounce-subtle group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
      
      {/* Tooltip */}
      <span className="absolute left-full ml-3 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat on WhatsApp
      </span>

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
      `}</style>
    </a>
  );
};
