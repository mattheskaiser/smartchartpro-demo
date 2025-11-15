import { clsx } from 'clsx';
import Image from 'next/image';
import React from 'react';

interface AvatarAtomProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AvatarAtom = ({ src, alt, size = 'md', className }: AvatarAtomProps) => {
  const dimensions = {
    sm: 32,
    md: 48,
    lg: 64,
  };

  const pixelSize = dimensions[size];

  return (
    <div
      className={clsx('relative rounded-full overflow-hidden bg-gray-200 border-2 border-gray-500/50', className)}
      style={{
        width: pixelSize,
        height: pixelSize,
      }}
    >
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
};
