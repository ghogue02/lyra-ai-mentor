import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2, Sparkles } from 'lucide-react';

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  glow?: boolean;
  animated?: boolean;
  children: React.ReactNode;
}

const PremiumButton: React.FC<PremiumButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  glow = false,
  animated = true,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg';
      case 'secondary':
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50';
      case 'accent':
        return 'bg-surface-accent text-foreground hover:bg-surface-accent/80 border border-primary/20';
      case 'ghost':
        return 'text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20';
      case 'gradient':
        return 'brand-gradient-primary text-white hover:opacity-90 shadow-lg';
      default:
        return 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm rounded-xl';
      case 'md':
        return 'px-6 py-3 text-base rounded-xl';
      case 'lg':
        return 'px-8 py-4 text-lg rounded-2xl';
      default:
        return 'px-6 py-3 text-base rounded-xl';
    }
  };

  const buttonClasses = cn(
    'relative overflow-hidden font-semibold transition-all duration-300 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50',
    'flex items-center justify-center gap-2',
    getSizeClasses(),
    getVariantClasses(),
    {
      'brand-shadow-glow': glow,
      'interactive-hover': !disabled && !loading,
      'brand-shadow-md': !glow && variant !== 'ghost'
    },
    className
  );

  if (animated) {
    return (
      <motion.button
        className={buttonClasses}
        disabled={disabled || loading}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        onClick={props.onClick}
        type={props.type}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 brand-gradient-glow rounded-xl opacity-50" />
        
        {/* Shimmer Effect */}
        {!disabled && !loading && (
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                            transform -skew-x-12 animate-shimmer" />
          </div>
        )}
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center gap-2">
          {loading && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
          
          {!loading && icon && (
            <span className="flex items-center justify-center">
              {icon}
            </span>
          )}
          
          <span>{children}</span>
          
          {glow && !loading && (
            <Sparkles className="w-4 h-4 animate-pulse opacity-80" />
          )}
        </div>
      </motion.button>
    );
  }

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 brand-gradient-glow rounded-xl opacity-50" />
      
      {/* Shimmer Effect */}
      {!disabled && !loading && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                          transform -skew-x-12 animate-shimmer" />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        
        {!loading && icon && (
          <span className="flex items-center justify-center">
            {icon}
          </span>
        )}
        
        <span>{children}</span>
        
        {glow && !loading && (
          <Sparkles className="w-4 h-4 animate-pulse opacity-80" />
        )}
      </div>
    </button>
  );
};

export default PremiumButton;