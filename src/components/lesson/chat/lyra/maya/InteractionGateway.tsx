import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, ChevronRight, Lightbulb, Sparkles } from 'lucide-react';
import MayaCharacter from './MayaCharacter';
import PremiumCard from '@/components/ui/premium-card';

interface InteractionGatewayProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onComplete?: () => void;
  showEmotionalSupport?: boolean;
  supportMessage?: string;
  stage?: 'reflection' | 'input' | 'practice' | 'comparison';
}

const InteractionGateway: React.FC<InteractionGatewayProps> = ({
  title,
  description,
  children,
  onComplete,
  showEmotionalSupport = false,
  supportMessage = "You're doing great! This is exactly what Maya went through.",
  stage = 'input'
}) => {
  const [showSupport, setShowSupport] = useState(showEmotionalSupport);

  const getStageIcon = () => {
    switch (stage) {
      case 'reflection':
        return <Heart className="w-6 h-6 text-pink-500" />;
      case 'input':
        return <MessageSquare className="w-6 h-6 text-primary" />;
      case 'practice':
        return <Lightbulb className="w-6 h-6 text-emerald-500" />;
      case 'comparison':
        return <ChevronRight className="w-6 h-6 text-blue-500" />;
      default:
        return <MessageSquare className="w-6 h-6 text-primary" />;
    }
  };

  const getStageConfig = () => {
    switch (stage) {
      case 'reflection':
        return {
          gradient: 'from-pink-500/10 via-rose-500/5 to-pink-500/10',
          accent: 'text-pink-500',
          glow: 'shadow-pink-500/20'
        };
      case 'input':
        return {
          gradient: 'from-primary/10 via-brand-cyan/5 to-primary/10',
          accent: 'text-primary',
          glow: 'shadow-primary/20'
        };
      case 'practice':
        return {
          gradient: 'from-emerald-500/10 via-teal-500/5 to-emerald-500/10',
          accent: 'text-emerald-500',
          glow: 'shadow-emerald-500/20'
        };
      case 'comparison':
        return {
          gradient: 'from-blue-500/10 via-indigo-500/5 to-blue-500/10',
          accent: 'text-blue-500',
          glow: 'shadow-blue-500/20'
        };
      default:
        return {
          gradient: 'from-primary/10 via-brand-cyan/5 to-primary/10',
          accent: 'text-primary',
          glow: 'shadow-primary/20'
        };
    }
  };

  const stageConfig = getStageConfig();

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="animate-scale-in"
      >
        {/* Premium Main Container */}
        <div className="relative">
          {/* Glow Effect Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stageConfig.gradient} rounded-3xl blur-xl opacity-50`} />
          
          {/* Main Content Card */}
          <div className="relative premium-card interactive-hover brand-shadow-md">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 brand-gradient-glow rounded-3xl" />
            
            {/* Content */}
            <div className="relative z-10 p-8">
              {/* Header Section */}
              <div className="flex items-start gap-6 mb-8">
                {/* Stage Icon */}
                <div className="relative">
                  <div className={`w-16 h-16 rounded-2xl glass-effect flex items-center justify-center ${stageConfig.glow} shadow-lg`}>
                    {getStageIcon()}
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                  </div>
                </div>
                
                {/* Title & Description */}
                <div className="flex-1 space-y-3">
                  <h1 className="text-3xl font-bold text-foreground tracking-tight leading-tight">
                    {title}
                  </h1>
                  <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                    {description}
                  </p>
                </div>
              </div>
              
              {/* Interactive Content */}
              <div className="relative">
                {/* Subtle divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />
                
                {/* Content Container */}
                <div className="space-y-6">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Emotional Support */}
      <AnimatePresence>
        {showSupport && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
            className="mt-8"
          >
            <div className="relative">
              {/* Support Card Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-brand-cyan/10 to-primary/20 rounded-3xl blur-xl opacity-60" />
              
              {/* Support Card */}
              <div className="relative premium-card brand-shadow-md">
                <div className="absolute inset-0 brand-gradient-glow rounded-3xl" />
                
                <div className="relative z-10 p-6">
                  <div className="flex items-start gap-4">
                    {/* Maya Avatar */}
                    <MayaCharacter 
                      mood="encouraging" 
                      size="md" 
                      showSparkles={true}
                      className="mb-2"
                    />
                    
                    {/* Support Message */}
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-primary">Maya's Support</span>
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        </div>
                        <p className="text-foreground/90 font-medium leading-relaxed text-lg">
                          {supportMessage}
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSupport(false)}
                        className="text-primary hover:text-primary/80 hover:bg-primary/10 font-semibold rounded-xl transition-all duration-300 px-4 py-2"
                      >
                        Got it, thanks! ✨
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractionGateway;