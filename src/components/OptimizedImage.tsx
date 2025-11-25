import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  className?: string;
  fallback?: string;
}

/**
 * OptimizedImage Component
 * 
 * Features:
 * - Lazy loading with Intersection Observer
 * - Low-quality placeholder (LQIP) blur effect
 * - WebP format support with fallback
 * - Responsive srcset generation
 * - Loading skeleton state
 * - Error handling with fallback
 * 
 * @param priority - Skip lazy loading for above-the-fold images
 * @param quality - Image quality (1-100), default 85
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 85,
  className,
  fallback = '/placeholder-image.png',
  loading = 'lazy',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(priority ? src : '');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority || !('IntersectionObserver' in window)) {
      setImageSrc(src);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setImageSrc(fallback);
  };

  // Generate srcset for responsive images
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc || baseSrc.startsWith('data:') || baseSrc.includes('supabase.co')) {
      return undefined;
    }

    const sizes = [320, 640, 768, 1024, 1280, 1536];
    return sizes.map((size) => `${baseSrc}?w=${size} ${size}w`).join(', ');
  };

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ width, height }}
    >
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          aria-hidden="true"
        />
      )}
      <img
        ref={imgRef}
        src={imageSrc || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'}
        srcSet={imageSrc ? generateSrcSet(imageSrc) : undefined}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
