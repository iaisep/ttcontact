
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Alternative text for the image */
  alt: string;
  /** URL of the image */
  src: string;
  /** Optional fallback/placeholder image URL */
  fallbackSrc?: string;
  /** Optional width in pixels */
  width?: number;
  /** Optional height in pixels */
  height?: number;
  /** Whether to show loading state */
  showSkeleton?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * Responsive image component with loading and error handling
 */
const Image = React.forwardRef<HTMLImageElement, ImageProps>((
  { 
    alt, 
    src, 
    fallbackSrc = "/placeholder.svg", 
    width, 
    height, 
    showSkeleton = true,
    className,
    ...props 
  }, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden", 
        isLoading && showSkeleton ? "bg-muted" : "",
        className
      )}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        aspectRatio: width && height ? `${width} / ${height}` : 'auto'
      }}
    >
      {isLoading && showSkeleton && (
        <Skeleton
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        />
      )}
      <img
        ref={ref}
        alt={alt}
        src={hasError ? fallbackSrc : src}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "object-cover w-full h-full transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        width={width}
        height={height}
        {...props}
      />
    </div>
  );
});

Image.displayName = "Image";

export default Image;
