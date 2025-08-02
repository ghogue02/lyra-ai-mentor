import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'glass';
  glow?: boolean;
  hover?: boolean;
  animated?: boolean;
}

const PremiumCard: React.FC<PremiumCardProps> = ({
  children,
  className = '',
  variant = 'primary',
  glow = false,
  hover = true,
  animated = true
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-surface-primary border-border/50';
      case 'secondary':
        return 'bg-surface-secondary border-border/30';
      case 'accent':
        return 'bg-surface-accent border-primary/20';
      case 'glass':
        return 'glass-effect border-white/20';
      default:
        return 'bg-surface-primary border-border/50';
    }
  };

  const cardClasses = cn(
    'premium-card relative overflow-hidden transition-all duration-300',
    getVariantClasses(),
    {
      'brand-shadow-glow': glow,
      'interactive-hover': hover,
      'brand-shadow-md': !glow
    },
    className
  );

  if (animated) {
    return (
      <motion.div 
        className={cardClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 brand-gradient-glow rounded-3xl" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }

  return (
    <div className={cardClasses}>
      {/* Background Effects */}
      <div className="absolute inset-0 brand-gradient-glow rounded-3xl" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default PremiumCard;