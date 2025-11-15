import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  objectFit?: 'cover' | 'contain' | 'fill';
}

export const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  loading = 'lazy',
  objectFit = 'cover',
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(priority ? src : '');

  useEffect(() => {
    if (!priority) {
      // Lazy load non-priority images
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
    } else {
      setIsLoaded(true);
    }
  }, [src, priority]);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted/20 animate-pulse" />
      )}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          loading={loading}
          decoding={priority ? 'sync' : 'async'}
          className={`w-full h-full transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ objectFit }}
          width={width}
          height={height}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
};
