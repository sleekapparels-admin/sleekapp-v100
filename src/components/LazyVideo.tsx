import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  priority?: boolean;
  preload?: "auto" | "metadata" | "none";
  width?: number;
  height?: number;
}

export const LazyVideo = ({
  src,
  poster,
  className,
  autoPlay = false,
  loop = false,
  muted = true,
  playsInline = true,
  priority = false,
  preload = "none",
  width = 1920,
  height = 1080
}: LazyVideoProps) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(priority);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
        threshold: 0.1,
        rootMargin: '100px' // Start loading earlier for videos
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoadedData = () => {
    setLoaded(true);
    setError(false);
  };

  const handleError = () => {
    setError(true);
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Loading placeholder */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      {/* Error state */}
      {error && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-muted-foreground text-sm">Failed to load video</div>
        </div>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0"
        )}
        width={width}
        height={height}
        autoPlay={inView && autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload={inView ? preload : "none"}
        poster={poster}
        onLoadedData={handleLoadedData}
        onError={handleError}
        aria-hidden="true"
      >
        {inView && <source src={src} type="video/mp4" />}
      </video>
    </div>
  );
};