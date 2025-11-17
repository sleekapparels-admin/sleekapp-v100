import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DelayedLazyVideoProps {
  // Deprecated: use webmSrc/mp4Src instead. Kept for backward compatibility
  src?: string;
  webmSrc?: string;
  mp4Src?: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  delayMs?: number;
  width?: number;
  height?: number;
}

export const DelayedLazyVideo = ({
  src,
  webmSrc,
  mp4Src,
  poster,
  className,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  delayMs = 2000,
  width = 1920,
  height = 1080
}: DelayedLazyVideoProps) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Delay video loading to prioritize critical content
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  const handleVideoError = () => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({ event: 'hero_video_error' });
    }
  };

  const handleVideoLoad = () => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({ event: 'hero_video_loaded' });
    }
  };

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {shouldLoad ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ background: 'linear-gradient(180deg, #0f172a, #111827)' }}
          width={width}
          height={height}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          preload="metadata"
          {...(poster ? { poster } : {})}
          onError={handleVideoError}
          onLoadedData={handleVideoLoad}
          aria-hidden="true"
        >
          {webmSrc && <source src={webmSrc} type="video/webm" />}
          {mp4Src && <source src={mp4Src} type="video/mp4" />}
          {!webmSrc && !mp4Src && src?.endsWith('.webm') && (
            <source src={src} type="video/webm" />
          )}
          {!webmSrc && !mp4Src && src?.endsWith('.mp4') && (
            <source src={src} type="video/mp4" />
          )}
        </video>
      ) : (
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ background: 'linear-gradient(180deg, #0f172a, #111827)' }}
        />
      )}
    </div>
  );
};
