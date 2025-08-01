import React from 'react';
import { useChatState, useChatActions } from '../core/ChatContext';
import { chatSelectors } from '../core/chatReducer';
import { BookOpen, Heart, Lightbulb, Target, Zap, HelpCircle } from 'lucide-react';

const iconMap = {
  'Getting Started': BookOpen,
  'Nonprofit Applications': Heart,
  'Foundational Knowledge': Lightbulb,
  'Ethics & Values': Target,
  'Practical Steps': Zap,
  'Safety & Concerns': HelpCircle,
  'Lesson Support': BookOpen,
  'Application': Target
};

export const QuickQuestions: React.FC = () => {
  const { state } = useChatState();
  const { sendMessage } = useChatActions();
  
  const questions = chatSelectors.getQuickQuestions(state);

  const handleQuestionClick = async (question: typeof questions[0]) => {
    await sendMessage(question.text);
  };

  return (
    <div
      className="p-6 space-y-4 animate-fade-in"
      style={{ animationDelay: '0.2s' }}
    >
      <div className="text-center">
        <h4 className="font-medium text-gray-900 mb-2">
          I'm here to help! 
        </h4>
        <p className="text-sm text-gray-600 mb-6">
          Choose a question below or ask me anything about this lesson
        </p>
      </div>
      
      <div className="space-y-3">
        {questions.slice(0, 4).map((question, index) => {
          const IconComponent = iconMap[question.category as keyof typeof iconMap] || BookOpen;
          
          return (
            <button
              key={question.id}
              className="w-full text-left p-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all duration-200 group animate-slide-up hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => handleQuestionClick(question)}
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconComponent className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-purple-700 transition-colors">
                    {question.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {question.category}
                    </span>
                    {question.priority === 'high' && (
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-center pt-2">
        <p className="text-xs text-gray-500">
          💬 These suggestions are tailored to your current lesson
        </p>
      </div>
    </div>
  );
};