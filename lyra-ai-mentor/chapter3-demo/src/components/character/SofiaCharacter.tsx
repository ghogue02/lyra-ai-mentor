import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Heart, BookOpen, Users, Star, MessageCircle } from 'lucide-react';
import { sofiaCharacterData, sofiaQuotes, sofiaEncouragementMessages } from '../../data/sofia-character';

interface SofiaCharacterProps {
  mood?: 'welcoming' | 'encouraging' | 'excited' | 'thoughtful' | 'supportive';
  showQuote?: boolean;
  showStats?: boolean;
  interactive?: boolean;
}

export const SofiaCharacter: React.FC<SofiaCharacterProps> = ({
  mood = 'welcoming',
  showQuote = true,
  showStats = false,
  interactive = false
}) => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'encouraging': return 'from-green-400 to-blue-600';
      case 'excited': return 'from-yellow-400 to-pink-600';
      case 'thoughtful': return 'from-purple-400 to-indigo-600';
      case 'supportive': return 'from-pink-400 to-rose-600';
      default: return 'from-blue-400 to-purple-600';
    }
  };

  const getNextQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuote((prev) => (prev + 1) % sofiaQuotes.length);
      setIsAnimating(false);
    }, 300);
  };

  const getRandomEncouragement = () => {
    const randomIndex = Math.floor(Math.random() * sofiaEncouragementMessages.length);
    return sofiaEncouragementMessages[randomIndex];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      {/* Character Header */}
      <div className="flex items-center space-x-4 mb-6">
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getMoodColor(mood)} flex items-center justify-center`}>
          <Mic className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{sofiaCharacterData.name}</h2>
          <p className="text-gray-600">{sofiaCharacterData.role}</p>
        </div>
      </div>

      {/* Character Stats */}
      {showStats && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">500+ Students Helped</span>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">10+ Years Experience</span>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Certified Voice Coach</span>
            </div>
          </div>
          <div className="bg-pink-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-pink-600" />
              <span className="text-sm font-medium text-gray-700">Confidence Builder</span>
            </div>
          </div>
        </div>
      )}

      {/* Character Quote */}
      {showQuote && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimating ? 0 : 1, y: isAnimating ? 20 : 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6"
        >
          <p className="text-gray-700 italic text-center">
            "{sofiaQuotes[currentQuote]}"
          </p>
          {interactive && (
            <div className="flex justify-center mt-3">
              <button
                onClick={getNextQuote}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Next Quote
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Character Traits */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Teaching Style</h3>
        <div className="flex flex-wrap gap-2">
          {sofiaCharacterData.personality.traits.map((trait, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* Expertise Areas */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Expertise</h3>
        <div className="grid grid-cols-2 gap-2">
          {sofiaCharacterData.expertise.map((skill, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">{skill}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Elements */}
      {interactive && (
        <div className="border-t pt-4">
          <button
            onClick={() => alert(getRandomEncouragement())}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Get Encouragement from Sofia</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SofiaCharacter;