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
  stage?: 'reflection' | 'input' | 'practice' | 'comparison';
  showHeader?: boolean;
}

const InteractionGateway: React.FC<InteractionGatewayProps> = ({
  title,
  description,
  children,
  onComplete,
  stage = 'input',
  showHeader = true
}) => {

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
              {showHeader && (
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
              )}
              
              {/* Interactive Content */}
              <div className="relative">
                {/* Subtle divider */}
                {showHeader && (
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />
                )}
                
                {/* Content Container */}
                <div className="space-y-6">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InteractionGateway;