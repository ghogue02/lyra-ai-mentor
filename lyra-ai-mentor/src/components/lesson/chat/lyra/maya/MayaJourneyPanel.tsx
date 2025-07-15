import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Volume2, FileText, MessageCircle, Star, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MayaJourneyPanelProps } from './types';
import { getStageTitle } from './helpers';

/**
 * Enhanced Summary Panel for Complete Journey - Mobile Responsive
 */
export function MayaJourneyPanel({ 
  showSummaryPanel, 
  setShowSummaryPanel, 
  mayaJourney, 
  currentStageIndex,
  totalStages,
  isMobile = false
}: MayaJourneyPanelProps) {
  const skillAreas = [
    { 
      name: 'PACE Framework', 
      completed: mayaJourney.purpose && mayaJourney.audience && mayaJourney.tone, 
      icon: Target 
    },
    { 
      name: 'Tone Mastery', 
      completed: mayaJourney.selectedAudience, 
      icon: Volume2 
    },
    { 
      name: 'Template Library', 
      completed: mayaJourney.templateCategory, 
      icon: FileText 
    },
    { 
      name: 'Difficult Conversations', 
      completed: mayaJourney.conversationScenario, 
      icon: MessageCircle 
    },
    { 
      name: 'Subject Excellence', 
      completed: mayaJourney.subjectStrategy, 
      icon: Star 
    }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "h-full bg-white overflow-y-auto",
        isMobile ? "w-72 border-r fixed left-0 top-0 z-50 shadow-xl" : "w-full"
      )}
      role="navigation"
      aria-label="Journey progress and navigation"
    >
      <div className="px-6 py-8 space-y-6">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Maya's Journey
          </h3>
        </div>
        
        {/* Overall Progress */}
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-lg border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Journey Progress</span>
            <span className="text-sm text-purple-600 font-semibold">
              {currentStageIndex + 1}/{totalStages}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStageIndex + 1) / totalStages) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        
        {/* Skill Area Progress */}
        <div className="space-y-3 py-2">
          <h4 className="font-medium text-gray-700 mb-3">Communication Skills</h4>
          {skillAreas.map(({ name, completed, icon: Icon }) => (
            <motion.div 
              key={name} 
              className={cn(
                "p-3 rounded-lg flex items-center gap-3 transition-all cursor-pointer",
                completed 
                  ? "bg-green-50/70 text-green-800 border border-green-200 shadow-sm" 
                  : "bg-gray-50/70 text-gray-500 border border-gray-200 hover:bg-gray-100"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium flex-1">{name}</span>
              {completed && <Check className="w-4 h-4 flex-shrink-0" />}
            </motion.div>
          ))}
        </div>
        
        {/* Current Stage Info */}
        <div className="mt-6 p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-purple-200 shadow-sm">
          <h4 className="font-medium text-purple-800 mb-2">Current Stage</h4>
          <p className="text-sm text-purple-700">
            Stage {currentStageIndex + 1}: {getStageTitle(currentStageIndex)}
          </p>
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50/60 to-pink-50/60 backdrop-blur-sm rounded-lg text-xs text-center text-purple-700 border border-purple-100">
          Experience Maya's complete transformation from email overwhelm to communication mastery
        </div>
      </div>
    </motion.div>
  );
}