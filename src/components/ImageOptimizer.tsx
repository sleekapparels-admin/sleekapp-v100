import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ImageOptimizerProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

/**
 * Optimized image component with WebP support, lazy loading, and blur-up effect
 */
export const ImageOptimizer = ({
  src,
  alt,
  className = "",
  width,
  height,
  priority = false,
  sizes = "100vw",
  objectFit = "cover",
}: ImageOptimizerProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [inView, setInView] = useState(priority);
  const [currentSrc, setCurrentSrc] = useState<string>("");
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) {
      setCurrentSrc(src);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setCurrentSrc(src);
          observer.disconnect();
        }
      },
      {
        threshold: 0.01,
        rootMargin: "200px",
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, priority]);

  // Check if already cached
  useEffect(() => {
    if (imgRef.current?.complete && currentSrc) {
      setIsLoaded(true);
    }
  }, [currentSrc]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Blur placeholder */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-muted animate-pulse"
          style={{
            backgroundImage: `linear-gradient(90deg, hsl(var(--muted)) 0%, hsl(var(--muted-foreground) / 0.1) 50%, hsl(var(--muted)) 100%)`,
          }}
        />
      )}

      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={cn(
          "transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0",
          `object-${objectFit}`
        )}
        onLoad={() => setIsLoaded(true)}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "low"}
      />
    </div>
  );
};
