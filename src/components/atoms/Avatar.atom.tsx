import { clsx } from 'clsx';
import Image from 'next/image';
import React, { useState } from 'react';
import { DynamicIconAtom } from './DynamicIcon.atom';

interface AvatarAtomProps {
  src?: string | null; // Can be base64 data or URL
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AvatarAtom = ({ src, alt, size = 'md', className }: AvatarAtomProps) => {
  const [imageError, setImageError] = useState(false);

  const dimensions = {
    sm: 32,
    md: 48,
    lg: 64,
  };

  const iconSizes = {
    sm: 'sm' as const,
    md: 'md' as const,
    lg: 'lg' as const,
  };

  const pixelSize = dimensions[size];
  const showFallback = !src || imageError;

  return (
    <div
      className={clsx(
        'relative rounded-full overflow-hidden bg-gray-200 border-2 border-gray-500/50 flex items-center justify-center',
        className
      )}
      style={{
        width: pixelSize,
        height: pixelSize,
      }}
    >
      {showFallback ? (
        <DynamicIconAtom
          name="User"
          size={iconSizes[size]}
          className="text-gray-400"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
};
