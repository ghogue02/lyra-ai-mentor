import React from 'react';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/useResponsive';

interface MobileResponsiveWrapperProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full';
  padding?: 'none' | 'small' | 'medium' | 'large';
  safeArea?: boolean;
}

export const MobileResponsiveWrapper: React.FC<MobileResponsiveWrapperProps> = ({
  children,
  className,
  maxWidth = '4xl',
  padding = 'medium',
  safeArea = true,
}) => {
  const { isMobile } = useResponsive();

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: '',
    small: 'p-2 md:p-4',
    medium: 'p-4 md:p-6',
    large: 'p-6 md:p-8',
  };

  return (
    <div
      className={cn(
        'w-full mx-auto',
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        safeArea && isMobile && 'safe-top safe-bottom',
        className
      )}
    >
      {children}
    </div>
  );
};

interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  fullScreenOnMobile?: boolean;
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  className,
  fullScreenOnMobile = false,
}) => {
  const { isMobile } = useResponsive();

  return (
    <div
      className={cn(
        'transition-all duration-200',
        isMobile && fullScreenOnMobile && 'mobile-fullscreen',
        className
      )}
    >
      {children}
    </div>
  );
};

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'small' | 'medium' | 'large';
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'medium',
}) => {
  const gapClasses = {
    small: 'gap-2 md:gap-3',
    medium: 'gap-3 md:gap-4 lg:gap-6',
    large: 'gap-4 md:gap-6 lg:gap-8',
  };

  const gridCols = cn(
    'grid',
    cols.mobile === 1 && 'grid-cols-1',
    cols.mobile === 2 && 'grid-cols-2',
    cols.tablet === 2 && 'md:grid-cols-2',
    cols.tablet === 3 && 'md:grid-cols-3',
    cols.desktop === 3 && 'lg:grid-cols-3',
    cols.desktop === 4 && 'lg:grid-cols-4',
  );

  return (
    <div className={cn(gridCols, gapClasses[gap], className)}>
      {children}
    </div>
  );
};

interface TouchTargetProps {
  children: React.ReactNode;
  className?: string;
  as?: 'button' | 'div' | 'a';
  onClick?: () => void;
}

export const TouchTarget: React.FC<TouchTargetProps> = ({
  children,
  className,
  as: Component = 'button',
  onClick,
}) => {
  return (
    <Component
      className={cn(
        'touch-target tap-highlight-transparent no-select',
        'flex items-center justify-center',
        'transition-transform active:scale-[0.98]',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};

interface ResponsiveTextProps {
  children: React.ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  truncate?: boolean;
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  className,
  size = 'base',
  truncate = false,
}) => {
  const sizeClasses = {
    xs: 'text-xs md:text-sm',
    sm: 'text-sm md:text-base',
    base: 'text-base md:text-lg',
    lg: 'text-lg md:text-xl',
    xl: 'text-xl md:text-2xl',
    '2xl': 'text-2xl md:text-3xl',
    '3xl': 'text-3xl md:text-4xl',
    '4xl': 'text-4xl md:text-5xl',
  };

  return (
    <span className={cn(sizeClasses[size], truncate && 'truncate', className)}>
      {children}
    </span>
  );
};