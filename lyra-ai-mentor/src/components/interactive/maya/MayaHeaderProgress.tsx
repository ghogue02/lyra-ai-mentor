import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Trophy, Star, Target, Volume2, FileText, MessageCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { MayaJourneyProgress, MayaStage } from './types';

interface MayaHeaderProgressProps {
  progress: MayaJourneyProgress;
  className?: string;
  showMiniDots?: boolean;
  showSkillDetails?: boolean;
}

export function MayaHeaderProgress({ 
  progress, 
  className,
  showMiniDots = true,
  showSkillDetails = false 
}: MayaHeaderProgressProps) {
  const { currentStageIndex, totalStages, completedSkills, totalSkills, stages } = progress;
  const currentStage = stages?.[currentStageIndex];
  
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Stage Progress Badge */}
      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1 flex items-center gap-2">
        <BarChart3 className="w-3 h-3" />
        <span className="font-medium">Stage {currentStageIndex + 1}/{totalStages}</span>
      </Badge>
      
      {/* Skills Badge */}
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1 flex items-center gap-2">
        <Trophy className="w-3 h-3" />
        <span className="font-medium">{completedSkills}/{totalSkills} Skills Mastered</span>
      </Badge>
      
      {/* Current Stage Name (optional) */}
      {currentStage && (
        <Badge variant="secondary" className="hidden md:inline-flex">
          {currentStage.name}
        </Badge>
      )}
      
      {/* Mini Progress Dots */}
      {showMiniDots && (
        <div className="hidden md:flex items-center gap-1 ml-2">
          {Array.from({ length: totalStages }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                i < currentStageIndex ? "bg-purple-600" : 
                i === currentStageIndex ? "bg-purple-600 animate-pulse" : 
                "bg-gray-300"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Compact version for smaller spaces
export function MayaHeaderProgressCompact({ progress }: { progress: MayaJourneyProgress }) {
  const { currentStageIndex, totalStages, completedSkills, totalSkills } = progress;
  const progressPercent = ((currentStageIndex + 1) / totalStages) * 100;
  
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-1">
        <BarChart3 className="w-3 h-3 text-purple-600" />
        <span className="font-medium">{currentStageIndex + 1}/{totalStages}</span>
      </div>
      <div className="w-px h-4 bg-gray-300" />
      <div className="flex items-center gap-1">
        <Trophy className="w-3 h-3 text-green-600" />
        <span className="font-medium">{completedSkills}/{totalSkills}</span>
      </div>
      <div className="w-16 h-1 bg-gray-200 rounded-full ml-2">
        <motion.div 
          className="h-full bg-purple-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}

// Skill icons component for detailed view
export function MayaSkillIcons({ progress }: { progress: MayaJourneyProgress }) {
  const skillAreas = [
    { id: 'pace', name: 'PACE', icon: Target, completed: progress.skills?.pace || false },
    { id: 'tone', name: 'Tone', icon: Volume2, completed: progress.skills?.tone || false },
    { id: 'templates', name: 'Templates', icon: FileText, completed: progress.skills?.templates || false },
    { id: 'conversations', name: 'Conversations', icon: MessageCircle, completed: progress.skills?.conversations || false },
    { id: 'subjects', name: 'Subject Lines', icon: Star, completed: progress.skills?.subjects || false }
  ];

  return (
    <div className="flex items-center gap-2">
      {skillAreas.map(({ id, name, icon: Icon, completed }) => (
        <div
          key={id}
          className={cn(
            "relative p-1.5 rounded-lg transition-colors",
            completed ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
          )}
          title={`${name} ${completed ? '(Mastered)' : '(In Progress)'}`}
        >
          <Icon className="w-3.5 h-3.5" />
          {completed && (
            <Check className="w-2.5 h-2.5 absolute -top-1 -right-1 text-green-600 bg-white rounded-full" />
          )}
        </div>
      ))}
    </div>
  );
}