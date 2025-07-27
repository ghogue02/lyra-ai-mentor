import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BrandedIcon } from './BrandedIcon';
import VideoAnimation from './VideoAnimation';
import { getAnimationUrl } from '@/utils/supabaseIcons';

interface BrandedButtonProps extends ButtonProps {
  icon?: 'achievement' | 'learning' | 'growth' | 'mission' | 'network' | 'communication' | 'data' | 'workflow';
  showAnimation?: boolean;
  animated?: boolean;
  loading?: boolean;
  glow?: boolean;
}

export const BrandedButton: React.FC<BrandedButtonProps> = ({
  children,
  className,
  variant = 'default',
  size = 'default',
  icon,
  showAnimation = true,
  animated = true,
  loading = false,
  glow = false,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const buttonClasses = cn(
    glow && 'shadow-lg hover:shadow-xl',
    className
  );

  const buttonContent = (
    <>
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      
      {icon && !loading && showAnimation && (
        <VideoAnimation
          src={getAnimationUrl(`button-${icon}.mp4`)}
          fallbackIcon={
            <BrandedIcon 
              type={icon} 
              variant="static" 
              size="sm" 
              context="ui"
            />
          }
          className="w-4 h-4 mr-2"
          context="ui"
          loop={false}
        />
      )}
      
      {icon && !loading && !showAnimation && (
        <BrandedIcon 
          type={icon} 
          variant="static" 
          size="sm" 
          context="ui"
          className="w-4 h-4 mr-2"
        />
      )}
      
      {children}
    </>
  );

  if (animated && !isDisabled) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
      >
        <Button
          variant={variant}
          size={size}
          className={buttonClasses}
          disabled={isDisabled}
          {...props}
        >
          {buttonContent}
        </Button>
      </motion.div>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={buttonClasses}
      disabled={isDisabled}
      {...props}
    >
      {buttonContent}
    </Button>
  );
};