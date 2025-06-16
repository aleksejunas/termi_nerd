import { useState } from "react";

interface MarkdownImageProps {
  src?: string;
  alt?: string;
  title?: string;
  className?: string;
}

export function MarkdownImage({ src, alt, title, className }: MarkdownImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const placeholderSrc = "path/to/placeholder/image.png"; // Define your placeholder image path

  const handleError = () => {
    setHasError(true);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const imageSrc = hasError ? placeholderSrc : src;

  if (!src || hasError) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-800 border rounded-md my-6">
        <span className="text-gray-400">Image not available</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <img src={imageSrc} alt={alt || ""} title={title} onLoad={handleLoad} onError={handleError} className="max-w-full h-auto rounded-md border border-gray-600 transition-opacity duration-300" />
      {!isLoaded && !hasError && (
        <div className="flex items-center justify-center h-48 bg-gray-800 border border-gray-600 rounded-md animate-pulse">
          <div className="text-gray-400">Loading image...</div>
        </div>
      )}
      {alt && <div className="text-sm text-gray-400 text-center mt-2 italic">{alt}</div>}
    </div>
  );
}
