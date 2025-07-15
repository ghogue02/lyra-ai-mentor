import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, Zap, Clock, Users, CheckCircle, Star, ArrowRight } from 'lucide-react';

interface PACEResults {
  currentSkillLevel: 'beginner' | 'intermediate' | 'advanced';
  learningPreferences: string[];
  confidenceAreas: string[];
  personalizedPath: string[];
  adaptiveSettings: {
    pacing: 'slow' | 'medium' | 'fast';
    supportLevel: 'high' | 'medium' | 'low';
    practiceFrequency: 'daily' | 'frequent' | 'moderate';
  };
}

interface PACEResultsProps {
  results: PACEResults;
  onStartJourney: () => void;
}

export const PACEResultsComponent: React.FC<PACEResultsProps> = ({ results, onStartJourney }) => {
  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPacingIcon = (pacing: string) => {
    switch (pacing) {
      case 'slow': return '🐢';
      case 'medium': return '🚶';
      case 'fast': return '🏃';
      default: return '🚶';
    }
  };

  const getSupportIcon = (support: string) => {
    switch (support) {
      case 'high': return '🤝';
      case 'medium': return '👋';
      case 'low': return '👍';
      default: return '👋';
    }
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'daily': return '📅';
      case 'frequent': return '📆';
      case 'moderate': return '🗓️';
      default: return '📆';
    }
  };

  const sofiaPersonalizedMessage = () => {
    const level = results.currentSkillLevel;
    const hasConfidenceFear = results.learningPreferences.includes('being_judged');
    const hasVoiceConcerns = results.learningPreferences.includes('voice_quality');
    
    if (level === 'beginner') {
      return "I'm so excited to work with you! Starting your speaking journey takes real courage, and I can already see you have that. We're going to take this step by step, building your confidence from the ground up. Remember, every expert was once a beginner - you're in the perfect place to start!";
    } else if (level === 'intermediate') {
      return "I love working with speakers at your level! You already have some experience, which means we can focus on refining your skills and breaking through those confidence barriers. You're going to be amazed at how much progress we can make together.";
    } else {
      return "What an honor to work with an experienced speaker! Even at your level, there's always room for growth and refinement. I'm excited to help you polish your skills and maybe discover some new techniques that will take your speaking to the next level.";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8"
      >
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your PACE Profile Complete!</h1>
        <p className="text-gray-600 text-lg">
          Sofia has analyzed your responses and created a personalized learning path just for you.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Assessment */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Brain className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-700">Skill Level</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSkillLevelColor(results.currentSkillLevel)}`}>
                {results.currentSkillLevel.charAt(0).toUpperCase() + results.currentSkillLevel.slice(1)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-700">Focus Areas</span>
              </div>
              <div className="flex flex-wrap gap-2 ml-8">
                {results.confidenceAreas.slice(0, 4).map((area, index) => (
                  <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    {area.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl mb-1">{getPacingIcon(results.adaptiveSettings.pacing)}</div>
                <p className="text-xs text-gray-600">Pacing</p>
                <p className="text-sm font-medium">{results.adaptiveSettings.pacing}</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">{getSupportIcon(results.adaptiveSettings.supportLevel)}</div>
                <p className="text-xs text-gray-600">Support</p>
                <p className="text-sm font-medium">{results.adaptiveSettings.supportLevel}</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">{getFrequencyIcon(results.adaptiveSettings.practiceFrequency)}</div>
                <p className="text-xs text-gray-600">Practice</p>
                <p className="text-sm font-medium">{results.adaptiveSettings.practiceFrequency}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sofia's Message */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">A Message from Sofia</h3>
              <p className="text-gray-600 text-sm">Your Personal Voice Coach</p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed italic">
            "{sofiaPersonalizedMessage()}"
          </p>
        </motion.div>
      </div>

      {/* Personalized Learning Path */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Personalized Learning Path</h2>
        
        <div className="space-y-3">
          {results.personalizedPath.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{index + 1}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{step}</h4>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </motion.div>
          ))}
        </div>

        <div className="mt-6 bg-yellow-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Star className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-1">Adaptive Learning</h4>
              <p className="text-yellow-700 text-sm">
                This path will adapt based on your progress and feedback. Sofia will adjust the difficulty, 
                pacing, and focus areas as you grow and develop your speaking confidence.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 text-center">
          <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">Personalized Content</h3>
          <p className="text-gray-600 text-sm">
            Every lesson and exercise is tailored to your specific needs and goals.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 text-center">
          <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">Adaptive Pacing</h3>
          <p className="text-gray-600 text-sm">
            Learn at your optimal pace with content that adjusts to your progress.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 text-center">
          <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">Continuous Support</h3>
          <p className="text-gray-600 text-sm">
            Sofia provides guidance and encouragement every step of your journey.
          </p>
        </div>
      </motion.div>

      {/* Start Journey Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <button
          onClick={onStartJourney}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          Start Your Voice Mastery Journey
        </button>
        <p className="text-gray-600 text-sm mt-3">
          Begin with your personalized lesson plan created just for you
        </p>
      </motion.div>
    </div>
  );
};

export default PACEResultsComponent;