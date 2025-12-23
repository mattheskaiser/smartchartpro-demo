'use client';

import { TextAtom } from './Text.atom';
import { DynamicIconAtom } from './DynamicIcon.atom';
import { formatShiftTime } from '@/hooks/useShiftTemplates';

interface ShiftBadgeProps {
  name: string;
  startTime: string;
  endTime: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  showTime?: boolean;
  className?: string;
}

export function ShiftBadgeAtom({
  name,
  startTime,
  endTime,
  color = '#3B82F6',
  size = 'md',
  showTime = true,
  className = '',
}: ShiftBadgeProps) {
  const getShiftIcon = (shiftName: string) => {
    const lowerName = shiftName.toLowerCase();
    if (lowerName.includes('morning') || lowerName.includes('day')) return 'Sun';
    if (lowerName.includes('evening') || lowerName.includes('afternoon')) return 'Sunset';
    if (lowerName.includes('night') || lowerName.includes('overnight')) return 'Moon';
    return 'Clock';
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'sm' as const,
    md: 'sm' as const,
    lg: 'md' as const,
  };

  return (
    <div
      className={`
                inline-flex items-center gap-2 rounded-full font-medium
                ${sizeClasses[size]}
                ${className}
            `}
      style={{
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}40`,
      }}
    >
      <DynamicIconAtom name={getShiftIcon(name)} size={iconSizes[size]} />
      <span>{name}</span>
      {showTime && <span className="opacity-75">{formatShiftTime(startTime, endTime)}</span>}
    </div>
  );
}
