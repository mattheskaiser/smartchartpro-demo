import { clsx } from 'clsx';
import Image from 'next/image';
import React, { useState } from 'react';
import { DynamicIconAtom } from './DynamicIcon.atom';

interface AvatarAtomProps {
  src?: string | null; // Can be base64 data or URL
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  showSkeleton?: boolean; // Show loading skeleton
}

export const AvatarAtom = ({
  src,
  alt,
  size = 'md',
  className,
  showSkeleton = false,
}: AvatarAtomProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(!!src); // Only show loading if we have a src

  const dimensions = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 128,
    '2xl': 160,
    '3xl': 192,
  };

  const iconSizes = {
    sm: 'sm' as const,
    md: 'md' as const,
    lg: 'lg' as const,
    xl: 'lg' as const,
    '2xl': 'lg' as const,
    '3xl': 'lg' as const,
  };

  const pixelSize = dimensions[size];
  const showFallback = !src || imageError;

  // Check if src is base64 data
  const isBase64 = src?.startsWith('data:image');

  return (
    <div
      className={clsx(
        'relative rounded-full overflow-hidden border-2 border-gray-500/50 flex items-center justify-center',
        showSkeleton || (imageLoading && !showFallback)
          ? 'bg-gray-200 animate-pulse'
          : 'bg-gray-200',
        className
      )}
      style={{
        width: pixelSize,
        height: pixelSize,
      }}
    >
      {showSkeleton ? (
        // Skeleton loading state
        <div className="w-full h-full bg-gray-300 animate-pulse" />
      ) : showFallback ? (
        <DynamicIconAtom name="User" size={iconSizes[size]} className="text-gray-400" />
      ) : (
        <>
          {/* Show skeleton while image is loading */}
          {imageLoading && (
            <div className="absolute inset-0 w-full h-full bg-gray-300 animate-pulse" />
          )}
          <Image
            src={src}
            alt={alt}
            fill
            className={clsx(
              'object-cover transition-opacity duration-200',
              imageLoading ? 'opacity-0' : 'opacity-100'
            )}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
            onLoad={() => setImageLoading(false)}
            unoptimized={isBase64} // Only unoptimized for base64, optimize URLs
            loading="lazy" // Lazy load images for better performance
            sizes={`${pixelSize}px`} // Hint to browser about image size
          />
        </>
      )}
    </div>
  );
};
