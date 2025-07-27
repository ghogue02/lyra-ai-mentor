// Branded System Utilities
// Centralized utilities for the branded component system

export interface BrandedTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
}

export const brandedThemes = {
  default: {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    accent: 'hsl(var(--accent))',
    background: 'hsl(var(--background))',
    surface: 'hsl(var(--card))',
    text: 'hsl(var(--foreground))'
  }
} as const;

export const animationVariants = {
  subtle: {
    scale: { hover: 1.02, tap: 0.98 },
    duration: 0.1
  },
  moderate: {
    scale: { hover: 1.05, tap: 0.95 },
    duration: 0.2
  },
  pronounced: {
    scale: { hover: 1.1, tap: 0.9 },
    duration: 0.3
  }
} as const;

export const glowStyles = {
  soft: 'shadow-lg hover:shadow-xl',
  medium: 'shadow-xl hover:shadow-2xl',
  intense: 'shadow-2xl hover:shadow-3xl'
} as const;

export const getOptimalAnimationVariant = (performanceLevel: 'low' | 'medium' | 'high') => {
  switch (performanceLevel) {
    case 'low': return animationVariants.subtle;
    case 'medium': return animationVariants.moderate;
    case 'high': return animationVariants.pronounced;
    default: return animationVariants.moderate;
  }
};

export const getBrandedClassName = (base: string, variant?: string, options?: {
  animated?: boolean;
  glow?: boolean;
  interactive?: boolean;
}) => {
  const classes = [base];
  
  if (options?.animated) {
    classes.push('transition-all duration-200');
  }
  
  if (options?.glow) {
    classes.push(glowStyles.soft);
  }
  
  if (options?.interactive) {
    classes.push('hover:scale-105 active:scale-95');
  }
  
  return classes.join(' ');
};