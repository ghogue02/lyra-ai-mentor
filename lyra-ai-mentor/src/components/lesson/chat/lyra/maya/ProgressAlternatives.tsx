import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronUp, ChevronDown, Target, Volume2, FileText, MessageCircle, Star, BarChart3, Trophy, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type MayaJourneyState } from './types';

interface ProgressProps {
  currentStageIndex: number;
  totalStages: number;
  mayaJourney: MayaJourneyState;
}

/**
 * Alternative 1: Top Progress Bar
 * Slim, always-visible progress indicator at the top of the page
 */
export function TopProgressBar({ currentStageIndex, totalStages, mayaJourney }: ProgressProps) {
  const progress = ((currentStageIndex + 1) / totalStages) * 100;
  
  const completedSkills = [
    mayaJourney.purpose && mayaJourney.audience && mayaJourney.tone,
    mayaJourney.selectedAudience,
    mayaJourney.templateCategory,
    mayaJourney.conversationScenario,
    mayaJourney.subjectStrategy
  ].filter(Boolean).length;

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="relative h-2 bg-gray-200">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
      <div className="px-4 py-2 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center gap-4 text-sm">
          <span className="font-medium text-gray-700">Maya's Journey</span>
          <span className="text-purple-600">{currentStageIndex + 1}/{totalStages} stages</span>
          <span className="text-green-600">{completedSkills}/5 skills mastered</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalStages }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full",
                i <= currentStageIndex ? "bg-purple-600" : "bg-gray-300"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Alternative 2: Floating Progress Widget
 * Minimizable floating component that can be positioned anywhere
 */
export function FloatingProgressWidget({ currentStageIndex, totalStages, mayaJourney }: ProgressProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  
  const progress = ((currentStageIndex + 1) / totalStages) * 100;
  const skillAreas = [
    { name: 'PACE', completed: mayaJourney.purpose && mayaJourney.audience && mayaJourney.tone, icon: Target },
    { name: 'Tone', completed: mayaJourney.selectedAudience, icon: Volume2 },
    { name: 'Templates', completed: mayaJourney.templateCategory, icon: FileText },
    { name: 'Conversations', completed: mayaJourney.conversationScenario, icon: MessageCircle },
    { name: 'Subject Lines', completed: mayaJourney.subjectStrategy, icon: Star }
  ];

  return (
    <motion.div
      className="fixed z-40 bg-white rounded-lg shadow-xl border border-gray-200"
      style={{ left: position.x, top: position.y }}
      drag
      onDrag={(event, info) => {
        setPosition({ x: info.offset.x, y: info.offset.y });
      }}
      whileHover={{ scale: 1.02 }}
    >
      <AnimatePresence>
        {isMinimized ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="p-3 cursor-pointer"
            onClick={() => setIsMinimized(false)}
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">{currentStageIndex + 1}/{totalStages}</span>
              <div className="w-16 h-1 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-purple-600 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="p-4 w-64"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-purple-600" />
                Maya's Progress
              </h3>
              <button
                onClick={() => setIsMinimized(true)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Stage {currentStageIndex + 1} of {totalStages}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              {skillAreas.map(({ name, completed, icon: Icon }) => (
                <div key={name} className="flex items-center gap-2 text-sm">
                  <Icon className="w-3 h-3 text-gray-400" />
                  <span className={completed ? "text-green-600" : "text-gray-400"}>{name}</span>
                  {completed && <Check className="w-3 h-3 text-green-600" />}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Alternative 3: Header-Integrated Progress
 * Progress badges and indicators built into the existing header
 */
export function HeaderIntegratedProgress({ currentStageIndex, totalStages, mayaJourney }: ProgressProps) {
  const completedSkills = [
    mayaJourney.purpose && mayaJourney.audience && mayaJourney.tone,
    mayaJourney.selectedAudience,
    mayaJourney.templateCategory,
    mayaJourney.conversationScenario,
    mayaJourney.subjectStrategy
  ].filter(Boolean).length;

  return (
    <div className="flex items-center gap-3">
      {/* Progress Badge */}
      <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
        <BarChart3 className="w-3 h-3" />
        {currentStageIndex + 1}/{totalStages}
      </div>
      
      {/* Skills Badge */}
      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
        <Trophy className="w-3 h-3" />
        {completedSkills}/5 skills
      </div>
      
      {/* Mini Progress Bar */}
      <div className="hidden md:flex items-center gap-1">
        {Array.from({ length: totalStages }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              i <= currentStageIndex ? "bg-purple-600" : "bg-gray-300"
            )}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Alternative 4: Bottom Progress Dock
 * Collapsible progress area at the bottom with detailed info
 */
export function BottomProgressDock({ currentStageIndex, totalStages, mayaJourney }: ProgressProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const progress = ((currentStageIndex + 1) / totalStages) * 100;
  const skillAreas = [
    { name: 'PACE Framework', completed: mayaJourney.purpose && mayaJourney.audience && mayaJourney.tone, icon: Target },
    { name: 'Tone Mastery', completed: mayaJourney.selectedAudience, icon: Volume2 },
    { name: 'Template Library', completed: mayaJourney.templateCategory, icon: FileText },
    { name: 'Difficult Conversations', completed: mayaJourney.conversationScenario, icon: MessageCircle },
    { name: 'Subject Excellence', completed: mayaJourney.subjectStrategy, icon: Star }
  ];

  const completedSkills = skillAreas.filter(skill => skill.completed).length;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-lg">
      {/* Collapsed View */}
      <div 
        className="px-4 py-3 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-gray-800">Maya's Journey Progress</span>
          </div>
          <div className="flex-1 max-w-xs">
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="text-sm text-gray-600">
            Stage {currentStageIndex + 1}/{totalStages} • {completedSkills}/{skillAreas.length} skills
          </span>
        </div>
        
        <motion.button
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="text-gray-400 hover:text-gray-600"
        >
          <ChevronUp className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Expanded View */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 bg-gradient-to-r from-purple-50/30 to-pink-50/30"
          >
            <div className="px-4 py-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Skills Progress */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Communication Skills
                  </h4>
                  <div className="space-y-2">
                    {skillAreas.map(({ name, completed, icon: Icon }) => (
                      <div key={name} className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-gray-400" />
                        <span className={cn(
                          "flex-1 text-sm",
                          completed ? "text-green-600 font-medium" : "text-gray-500"
                        )}>
                          {name}
                        </span>
                        {completed && <Check className="w-4 h-4 text-green-600" />}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Journey Timeline */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Journey Timeline
                  </h4>
                  <div className="text-sm space-y-1">
                    <div className="text-purple-600 font-medium">
                      Current: Stage {currentStageIndex + 1}
                    </div>
                    <div className="text-gray-600">
                      Progress: {Math.round(progress)}% complete
                    </div>
                    <div className="text-gray-600">
                      Skills Mastered: {completedSkills}/{skillAreas.length}
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
}