import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  priority?: boolean;
  sizes?: string;
  placeholderColor?: string;
}

export const LazyImage = ({ 
  src, 
  alt, 
  className = "", 
  width, 
  height, 
  placeholder = "/placeholder.svg",
  priority = false,
  sizes = "100vw",
  placeholderColor = "bg-gray-200"
}: LazyImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(priority); // Load immediately if priority
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState<string>(placeholder);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.01,
        rootMargin: '100px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    // Only mark as loaded if the actual image (not placeholder) is complete
    if (imgRef.current?.complete && imgRef.current.src !== placeholder && currentSrc !== placeholder) {
      setLoaded(true);
      setIsLoading(false);
    }
  }, [currentSrc, placeholder]);

  const handleLoad = () => {
    const actualSrc = imgRef.current?.src || '';
    setCurrentSrc(actualSrc);
    // Only set loaded if we're not showing the placeholder
    if (actualSrc !== placeholder) {
      setLoaded(true);
      setIsLoading(false);
      setError(false);
    }
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
    setCurrentSrc(placeholder);
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Placeholder */}
      {(!loaded || isLoading) && (
        <div className={cn(
          "absolute inset-0 animate-pulse bg-gradient-to-br from-muted to-muted/80",
          placeholderColor
        )}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          </div>
        </div>
      )}
      
      {/* Main Image */}
      <img
        ref={imgRef}
        src={inView ? (error ? placeholder : src) : placeholder}
        alt={alt}
        className={cn(
          "transition-all duration-700 ease-out w-full h-full object-cover",
          loaded && !error ? "opacity-100 scale-100" : "opacity-0 scale-105"
        )}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
      
      {/* Error state with fallback */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground">
          <div className="w-12 h-12 rounded-full bg-muted-foreground/10 flex items-center justify-center mb-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xs text-center px-2">Image unavailable</span>
        </div>
      )}
    </div>
  );
};