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
  
  console.log('QuickQuestions Debug:', {
    hasLesson: !!state.currentLesson,
    lesson: state.currentLesson,
    questionsCount: questions.length,
    questions: questions
  });

  const handleQuestionClick = async (question: typeof questions[0]) => {
    await sendMessage(question.text);
  };

  return (
    <div
      className="nm-p-xl space-y-4 animate-fade-in nm-surface-elevated"
      style={{ animationDelay: '0.2s' }}
    >
      <div className="text-center">
        <h4 className="font-medium nm-text-primary mb-2">
          I'm here to help! 
        </h4>
        <p className="text-sm nm-text-secondary mb-6">
          Choose a question below or ask me anything about this lesson
        </p>
      </div>
      
      <div className="space-y-3">
        {questions.slice(0, 4).map((question, index) => {
          const IconComponent = iconMap[question.category as keyof typeof iconMap] || BookOpen;
          
          return (
            <button
              key={question.id}
              className="w-full text-left nm-card nm-interactive nm-p-lg nm-rounded-xl group animate-slide-up nm-transition-normal"
              onClick={() => handleQuestionClick(question)}
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <div className="flex items-start gap-3">
                <div className="nm-avatar nm-surface-purple nm-shadow-subtle flex items-center justify-center group-hover:nm-animate-float nm-transition-normal">
                  <IconComponent className="w-4 h-4 nm-text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium nm-text-primary group-hover:nm-text-accent nm-transition-normal">
                    {question.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs nm-text-secondary">
                      {question.category}
                    </span>
                    {question.priority === 'high' && (
                      <span className="w-2 h-2 nm-surface-purple nm-rounded-full"></span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-center pt-2">
        <p className="text-xs nm-text-muted">
          💬 These suggestions are tailored to your current lesson
        </p>
      </div>
    </div>
  );
};