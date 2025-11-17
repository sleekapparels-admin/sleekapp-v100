import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageOptimizedProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  loading?: "lazy" | "eager";
}

/**
 * Ultra-lightweight image component with minimal JavaScript overhead
 */
export const LazyImageOptimized = ({
  src,
  alt,
  className = "",
  width,
  height,
  priority = false,
  loading = "lazy",
}: LazyImageOptimizedProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    if (img.complete) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{
            backgroundImage: `linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)`,
          }}
        />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "w-full h-full object-cover transition-opacity",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setIsLoaded(true)}
        loading={priority ? "eager" : loading}
        decoding="async"
        fetchPriority={priority ? "high" : "low"}
      />
    </div>
  );
};