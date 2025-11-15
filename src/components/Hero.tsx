import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { trackBusinessEvent } from "@/lib/analytics";
import { Link } from "react-router-dom";
import { DelayedLazyVideo } from "@/components/DelayedLazyVideo";
import { FloatingGeometryGroup } from "@/components/FloatingGeometry";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const Hero = () => {
  const handleQuoteClick = () => {
    trackBusinessEvent.quoteRequest('hero_cta', 0);
  };

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-slate-900 -mt-16 sm:-mt-16 pt-16 sm:pt-16">
      {/* Hero Video Background with Parallax - extends behind navbar */}
      <motion.div 
        className="absolute inset-0 -top-16 sm:-top-16 z-0"
        style={{ scale: videoScale, opacity: videoOpacity }}
      >
        <DelayedLazyVideo
          webmSrc="/videos/hero-textile.webm"
          mp4Src="/videos/hero-textile.mp4"
          className="w-full h-full object-cover"
          delayMs={2000}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/70" />
      </motion.div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <FloatingGeometryGroup />
      </div>
      
      {/* Content with Parallax - reduced top padding */}
      <motion.div 
        style={{ y: contentY }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32 pb-16 sm:pb-24 lg:pb-32 z-20"
      >
        <motion.div 
          className="max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4 sm:mb-6 lg:mb-8 text-white">
            Bangladesh's First AI-Tracked Digital Sourcing Partner
            <span className="block mt-3 sm:mt-4 text-accent font-semibold px-0 py-1 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl leading-relaxed">
              From 50 Pieces | Real-Time LoopTrace™ | 10-20 Day Production
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl leading-relaxed font-light tracking-wide">
            Revolutionary transparency meets low MOQ manufacturing. Track every stage of your order with AI-powered insights—from fabric to finished product.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              asChild 
              size="lg" 
              className="font-semibold shadow-lg w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground transition-transform hover:scale-105 active:scale-95"
              onClick={handleQuoteClick}
            >
              <Link to="/quote-generator">
                Get Instant AI Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="font-semibold w-full sm:w-auto border-white text-white hover:bg-white/20 bg-white/10 transition-transform hover:scale-105 active:scale-95"
            >
              <Link to="/consultation">
                <Sparkles className="mr-2 h-5 w-5" />
                Get Expert Consultation
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-white/70 mt-4">
            Not sure where to start? <Link to="/consultation" className="text-accent hover:underline font-semibold">Talk to our CEO →</Link>
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};