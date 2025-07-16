import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Home, RotateCcw, AlertTriangle } from 'lucide-react';

export type JourneyPhase = 
  | 'intro'
  | 'maya-introduction'
  | 'maya-struggle'
  | 'help-maya-first-attempt'
  | 'elena-introduction'
  | 'maya-pace-building'
  | 'maya-success-story'
  | 'personal-toolkit';

interface GlobalNavigationProps {
  currentPhase: JourneyPhase;
  onPhaseChange: (phase: JourneyPhase) => void;
  onExit: () => void;
  isStuck?: boolean;
  onReset?: () => void;
}

const phaseLabels: Record<JourneyPhase, string> = {
  'intro': 'Introduction',
  'maya-introduction': 'Meet Maya',
  'maya-struggle': 'Maya\'s Challenge',
  'help-maya-first-attempt': 'Help Maya (First Try)',
  'elena-introduction': 'Meet Elena',
  'maya-pace-building': 'Building PACE',
  'maya-success-story': 'Maya\'s Success',
  'personal-toolkit': 'Your Toolkit'
};

const phaseOrder: JourneyPhase[] = [
  'intro',
  'maya-introduction',
  'maya-struggle',
  'help-maya-first-attempt',
  'elena-introduction',
  'maya-pace-building',
  'maya-success-story',
  'personal-toolkit'
];

const GlobalNavigation: React.FC<GlobalNavigationProps> = ({
  currentPhase,
  onPhaseChange,
  onExit,
  isStuck = false,
  onReset
}) => {
  const currentIndex = phaseOrder.indexOf(currentPhase);
  const canGoBack = currentIndex > 0;
  const progress = ((currentIndex + 1) / phaseOrder.length) * 100;

  const handleGoBack = () => {
    if (canGoBack) {
      const previousPhase = phaseOrder[currentIndex - 1];
      onPhaseChange(previousPhase);
    }
  };

  return (
    <Card className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Left side - Back button and breadcrumb */}
          <div className="flex items-center gap-4">
            {canGoBack && (
              <Button
                onClick={handleGoBack}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {currentIndex + 1} / {phaseOrder.length}
              </Badge>
              <span className="text-sm font-medium text-gray-700">
                {phaseLabels[currentPhase]}
              </span>
            </div>
          </div>

          {/* Center - Progress bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-2">
            {isStuck && onReset && (
              <Button
                onClick={onReset}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-amber-600 border-amber-200 hover:bg-amber-50"
              >
                <AlertTriangle className="w-4 h-4" />
                Reset Section
              </Button>
            )}
            
            <Button
              onClick={() => onPhaseChange('intro')}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Restart
            </Button>
            
            <Button
              onClick={onExit}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Exit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobalNavigation;