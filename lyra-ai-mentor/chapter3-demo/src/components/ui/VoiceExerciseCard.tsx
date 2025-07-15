import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Clock, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { VoiceExercise } from '../../types/sofia';

interface VoiceExerciseCardProps {
  exercise: VoiceExercise;
  onComplete?: () => void;
  showSofiaCoaching?: boolean;
}

export const VoiceExerciseCard: React.FC<VoiceExerciseCardProps> = ({
  exercise,
  onComplete,
  showSofiaCoaching = true
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'breathing': return '🫁';
      case 'vocal_warm_up': return '🎵';
      case 'projection': return '📢';
      case 'articulation': return '🗣️';
      case 'resonance': return '🔊';
      default: return '🎤';
    }
  };

  const handleStart = () => {
    setIsActive(true);
    setCurrentStep(0);
    setIsCompleted(false);
  };

  const handleNext = () => {
    if (currentStep < exercise.instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
      setIsActive(false);
      onComplete?.();
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentStep(0);
    setIsCompleted(false);
  };

  const sofiaCoachingMessage = () => {
    if (exercise.type === 'breathing') {
      return "Remember, this is the foundation of everything we'll do together. Take your time and really feel the difference.";
    } else if (exercise.type === 'vocal_warm_up') {
      return "Your voice is like any other muscle - it needs to be warmed up before we ask it to perform!";
    } else if (exercise.type === 'projection') {
      return "Think of this as building your vocal strength. Every great speaker has strong projection skills.";
    } else if (exercise.type === 'articulation') {
      return "Clear speech is confident speech. Your audience will thank you for this precision!";
    } else {
      return "You're doing great! Remember, every expert was once a beginner.";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      {/* Exercise Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getTypeIcon(exercise.type)}</div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{exercise.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                {exercise.difficulty}
              </span>
              <div className="flex items-center space-x-1 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{exercise.duration} min</span>
              </div>
            </div>
          </div>
        </div>
        {isCompleted && (
          <div className="text-green-600">
            <CheckCircle className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Sofia's Coaching Message */}
      {showSofiaCoaching && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <p className="text-gray-700 text-sm italic">
              "{sofiaCoachingMessage()}"
            </p>
          </div>
        </div>
      )}

      {/* Exercise Instructions */}
      {isActive && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-gray-800">
              Step {currentStep + 1} of {exercise.instructions.length}
            </h4>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowTips(!showTips)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {showTips ? 'Hide Tips' : 'Show Tips'}
              </button>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-gray-800 font-medium">
              {exercise.instructions[currentStep]}
            </p>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {currentStep === exercise.instructions.length - 1 ? 'Complete' : 'Next Step'}
            </button>
          </div>
        </div>
      )}

      {/* Tips and Common Mistakes */}
      {showTips && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Tips for Success
            </h4>
            <ul className="space-y-1">
              {exercise.tips.map((tip, index) => (
                <li key={index} className="text-green-700 text-sm">• {tip}</li>
              ))}
            </ul>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              Common Mistakes
            </h4>
            <ul className="space-y-1">
              {exercise.common_mistakes.map((mistake, index) => (
                <li key={index} className="text-yellow-700 text-sm">• {mistake}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Exercise Controls */}
      {!isActive && !isCompleted && (
        <div className="flex justify-center">
          <button
            onClick={handleStart}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
          >
            <Play className="w-5 h-5" />
            <span>Start Exercise</span>
          </button>
        </div>
      )}

      {isCompleted && (
        <div className="text-center">
          <div className="bg-green-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-green-800 mb-2">Exercise Complete!</h4>
            <p className="text-green-700 text-sm">
              Great job! You've completed the {exercise.name} exercise. 
              Regular practice will help you build these skills naturally.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Practice Again
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default VoiceExerciseCard;