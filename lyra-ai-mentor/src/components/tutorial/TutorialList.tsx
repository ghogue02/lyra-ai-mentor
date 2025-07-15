import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  SkipForward,
  Award,
  TrendingUp 
} from 'lucide-react';
import { useTutorial } from '../../contexts/TutorialContext';
import { tutorials, tutorialCategories } from '../../data/tutorials';

interface TutorialListProps {
  onClose?: () => void;
}

export const TutorialList: React.FC<TutorialListProps> = ({ onClose }) => {
  const { 
    startTutorial, 
    progress, 
    getCompletionPercentage,
    resetProgress 
  } = useTutorial();

  const completionPercentage = getCompletionPercentage();
  const completedCount = Object.values(progress).filter(p => p.completed).length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'communication': return '💬';
      case 'storytelling': return '📖';
      case 'dataAnalysis': return '📊';
      case 'automation': return '🤖';
      case 'strategy': return '🎯';
      default: return '📚';
    }
  };

  const getTutorialStatus = (tutorialId: string) => {
    const tutorialProgress = progress[tutorialId];
    if (!tutorialProgress) return 'new';
    if (tutorialProgress.completed) return 'completed';
    if (tutorialProgress.skipped) return 'skipped';
    return 'in-progress';
  };

  const groupedTutorials = tutorials.reduce((acc, tutorial) => {
    const category = tutorial.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(tutorial);
    return acc;
  }, {} as Record<string, typeof tutorials>);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Interactive Tutorials
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Learn how to use each AI assistant effectively with guided walkthroughs
        </p>
      </div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Your Progress
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {completedCount} of {tutorials.length} tutorials completed
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round(completionPercentage)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Complete
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full"
          />
        </div>

        {completionPercentage === 100 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-700 dark:text-green-300 font-medium">
              Congratulations! You've completed all tutorials!
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Tutorial Categories */}
      {Object.entries(groupedTutorials).map(([category, categoryTutorials]) => (
        <div key={category} className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">{getCategoryIcon(category)}</span>
            {tutorialCategories[category as keyof typeof tutorialCategories] || category}
          </h3>

          <div className="grid gap-4">
            {categoryTutorials.map((tutorial) => {
              const status = getTutorialStatus(tutorial.id);
              const tutorialProgress = progress[tutorial.id];

              return (
                <motion.div
                  key={tutorial.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`
                    bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border
                    ${status === 'completed' 
                      ? 'border-green-200 dark:border-green-800' 
                      : 'border-gray-200 dark:border-gray-700'
                    }
                    hover:shadow-md transition-all cursor-pointer
                  `}
                  onClick={() => {
                    startTutorial(tutorial.id);
                    onClose?.();
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {tutorial.name}
                        </h4>
                        {status === 'completed' && (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        )}
                        {status === 'skipped' && (
                          <SkipForward className="w-5 h-5 text-gray-400" />
                        )}
                        {status === 'in-progress' && (
                          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {tutorial.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          {tutorial.estimatedTime} min
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {tutorial.steps.length} steps
                        </span>
                        {tutorialProgress && !tutorialProgress.completed && (
                          <span className="text-blue-600 dark:text-blue-400">
                            Step {tutorialProgress.currentStep + 1} of {tutorial.steps.length}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      className={`
                        ml-4 px-4 py-2 rounded-lg font-medium transition-colors
                        ${status === 'completed'
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                        }
                      `}
                    >
                      {status === 'completed' ? 'Review' : status === 'in-progress' ? 'Continue' : 'Start'}
                      <Play className="w-4 h-4 ml-1 inline" />
                    </button>
                  </div>

                  {/* Progress indicator for in-progress tutorials */}
                  {status === 'in-progress' && tutorialProgress && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                        <div
                          className="bg-blue-600 dark:bg-blue-400 h-1 rounded-full transition-all"
                          style={{
                            width: `${((tutorialProgress.currentStep + 1) / tutorial.steps.length) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Reset Progress */}
      {completedCount > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all tutorial progress?')) {
                resetProgress();
              }
            }}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            Reset All Progress
          </button>
        </div>
      )}
    </div>
  );
};