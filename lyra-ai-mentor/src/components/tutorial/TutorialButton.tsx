import React from 'react';
import { HelpCircle, PlayCircle } from 'lucide-react';
import { useTutorial } from '../../contexts/TutorialContext';
import { motion } from 'framer-motion';

interface TutorialButtonProps {
  tutorialId: string;
  className?: string;
  variant?: 'icon' | 'button' | 'floating';
  label?: string;
}

export const TutorialButton: React.FC<TutorialButtonProps> = ({
  tutorialId,
  className = '',
  variant = 'icon',
  label = 'Start Tutorial',
}) => {
  const { startTutorial, isTutorialCompleted, getTutorialProgress } = useTutorial();
  
  const isCompleted = isTutorialCompleted(tutorialId);
  const progress = getTutorialProgress(tutorialId);
  const isInProgress = progress && !progress.completed && !progress.skipped;

  const handleClick = () => {
    startTutorial(tutorialId);
  };

  if (variant === 'icon') {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className={`
          p-2 rounded-lg transition-colors
          ${isCompleted 
            ? 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20' 
            : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
          }
          ${className}
        `}
        title={isCompleted ? 'Review tutorial' : 'Start tutorial'}
      >
        <HelpCircle className="w-5 h-5" />
        {isInProgress && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
        )}
      </motion.button>
    );
  }

  if (variant === 'button') {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
          ${isCompleted
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            : 'bg-blue-600 text-white hover:bg-blue-700'
          }
          ${className}
        `}
      >
        <PlayCircle className="w-4 h-4" />
        {isCompleted ? 'Review Tutorial' : isInProgress ? 'Continue Tutorial' : label}
      </motion.button>
    );
  }

  if (variant === 'floating') {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className={`
          fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-lg transition-all
          ${isCompleted
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-blue-600 hover:bg-blue-700'
          }
          ${className}
        `}
      >
        <HelpCircle className="w-6 h-6 text-white" />
        {isInProgress && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
        )}
      </motion.button>
    );
  }

  return null;
};