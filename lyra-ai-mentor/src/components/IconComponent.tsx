
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconComponentProps {
  type: 'image' | 'lucide';
  src?: string;
  icon?: LucideIcon;
  alt?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const IconComponent: React.FC<IconComponentProps> = ({
  type,
  src,
  icon: LucideIconComponent,
  alt = '',
  className,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  if (type === 'image' && src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(sizeClasses[size], 'object-contain', className)}
      />
    );
  }

  if (type === 'lucide' && LucideIconComponent) {
    const iconSize = {
      sm: 24,
      md: 32,
      lg: 48,
      xl: 64
    };

    return (
      <LucideIconComponent
        size={iconSize[size]}
        className={cn(className)}
      />
    );
  }

  return null;
};
