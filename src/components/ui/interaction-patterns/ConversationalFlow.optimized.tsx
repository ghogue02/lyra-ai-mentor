import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  ChevronRight, 
  ChevronLeft, 
  MessageSquare, 
  CheckCircle, 
  ArrowRight,
  Lightbulb,
  HelpCircle,
  Edit3,
  Users,
  Target,
  BarChart3,
  Heart,
  Sparkles
} from 'lucide-react';
import { getCarmenManagementIconUrl, getAnimationUrl } from '@/utils/supabaseIcons';
import VideoAnimation from '@/components/ui/VideoAnimation';
import { useDebounce, useThrottle, useGPUOptimizedAnimation, useMemoryOptimizer } from '@/hooks/usePerformanceOptimizer';

// ================================
// OPTIMIZED TYPE DEFINITIONS
// ================================

export interface ConversationQuestion {
  id: string;
  type: 'single-choice' | 'multiple-choice' | 'text-input' | 'scale' | 'yes-no';
  question: string;
  description?: string;
  subtext?: string;
  required: boolean;
  options?: ConversationOption[];
  scaleConfig?: {
    min: number;
    max: number;
    minLabel: string;
    maxLabel: string;
    step: number;
  };
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    customValidator?: (value: any) => string | null;
  };
  conditionalLogic?: {
    showIf: (responses: ConversationResponses) => boolean;
    skipIf?: (responses: ConversationResponses) => boolean;
  };
  insights?: string[];
  carmenResponse?: string;
  avatarAnimation?: string;
}

export interface ConversationOption {
  id: string;
  label: string;
  description?: string;
  value: any;
  icon?: React.ReactNode | string;
  recommended?: boolean;
  followUpQuestions?: string[];
}

export interface ConversationResponse {
  questionId: string;
  value: any;
  timestamp: Date;
  confidence?: number;
}

export interface ConversationResponses {
  [questionId: string]: ConversationResponse;
}

export interface ConversationFlowProps {
  title: string;
  description?: string;
  questions: ConversationQuestion[];
  responses: ConversationResponses;
  onResponseChange: (questionId: string, value: any) => void;
  onComplete?: (responses: ConversationResponses) => void;
  className?: string;
  characterTheme?: 'carmen' | 'sofia' | 'alex' | 'maya' | 'default';
  showProgress?: boolean;
  allowBacktrack?: boolean;
  conversationalTone?: 'professional' | 'friendly' | 'casual' | 'empathetic';
  aiInsights?: boolean;
  autoProgress?: boolean;
  characterName?: string;
}

// ================================
// OPTIMIZED THEME CONFIGURATION
// ================================

const themeColors = {
  carmen: {
    primary: 'bg-gradient-to-r from-purple-600 to-cyan-500',
    primaryText: 'text-purple-700',
    secondary: 'bg-purple-50 border-purple-200',
    accent: 'border-purple-400',
    button: 'bg-purple-600 hover:bg-purple-700',
    progress: 'bg-purple-600',
    messageUser: 'bg-purple-100 border-purple-300',
    messageBot: 'bg-gradient-to-r from-purple-50 to-cyan-50 border-purple-200'
  },
  sofia: {
    primary: 'bg-gradient-to-r from-rose-600 to-purple-500',
    primaryText: 'text-rose-700',
    secondary: 'bg-rose-50 border-rose-200',
    accent: 'border-rose-400',
    button: 'bg-rose-600 hover:bg-rose-700',
    progress: 'bg-rose-600',
    messageUser: 'bg-rose-100 border-rose-300',
    messageBot: 'bg-gradient-to-r from-rose-50 to-purple-50 border-rose-200'
  },
  alex: {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-500',
    primaryText: 'text-blue-700',
    secondary: 'bg-blue-50 border-blue-200',
    accent: 'border-blue-400',
    button: 'bg-blue-600 hover:bg-blue-700',
    progress: 'bg-blue-600',
    messageUser: 'bg-blue-100 border-blue-300',
    messageBot: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
  },
  maya: {
    primary: 'bg-gradient-to-r from-green-600 to-emerald-500',
    primaryText: 'text-green-700',
    secondary: 'bg-green-50 border-green-200',
    accent: 'border-green-400',
    button: 'bg-green-600 hover:bg-green-700',
    progress: 'bg-green-600',
    messageUser: 'bg-green-100 border-green-300',
    messageBot: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
  },
  default: {
    primary: 'bg-gradient-to-r from-gray-600 to-slate-500',
    primaryText: 'text-gray-700',
    secondary: 'bg-gray-50 border-gray-200',
    accent: 'border-gray-400',
    button: 'bg-gray-600 hover:bg-gray-700',
    progress: 'bg-gray-600',
    messageUser: 'bg-gray-100 border-gray-300',
    messageBot: 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'
  }
} as const;

// ================================
// OPTIMIZED TYPING INDICATOR COMPONENT
// ================================

const TypingIndicator = memo<{ theme: any }>(({ theme }) => {
  const { ref, enableGPUAcceleration, disableGPUAcceleration } = useGPUOptimizedAnimation();

  useEffect(() => {
    enableGPUAcceleration();
    return disableGPUAcceleration;
  }, [enableGPUAcceleration, disableGPUAcceleration]);

  const dots = useMemo(() => [0, 1, 2], []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn('flex items-center space-x-2 p-4 rounded-xl', theme.messageBot)}
    >
      <div className="flex space-x-1">
        {dots.map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-purple-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
      <span className="text-sm text-gray-600">Carmen is thinking...</span>
    </motion.div>
  );
});

TypingIndicator.displayName = 'TypingIndicator';

// ================================
// OPTIMIZED MESSAGE BUBBLE COMPONENT
// ================================

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  theme: any;
  showAvatar?: boolean;
  avatarAnimation?: string;
  timestamp?: Date;
  onEdit?: () => void;
  canEdit?: boolean;
}

const MessageBubble = memo<MessageBubbleProps>(({
  message,
  isUser,
  theme,
  showAvatar = false,
  avatarAnimation,
  timestamp,
  onEdit,
  canEdit = false
}) => {
  const { ref, enableGPUAcceleration, disableGPUAcceleration } = useGPUOptimizedAnimation();

  useEffect(() => {
    enableGPUAcceleration();
    return disableGPUAcceleration;
  }, [enableGPUAcceleration, disableGPUAcceleration]);

  const timeDisplay = useMemo(() => {
    return timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [timestamp]);

  const handleEdit = useCallback(() => {
    onEdit?.();
  }, [onEdit]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'flex gap-3 mb-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {/* Avatar (for bot messages) */}
      {!isUser && showAvatar && (
        <div className="flex-shrink-0 w-10 h-10">
          {avatarAnimation ? (
            <VideoAnimation
              src={getAnimationUrl(avatarAnimation)}
              fallbackIcon={
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-purple-600" />
                </div>
              }
              className="w-full h-full rounded-full"
              context="character"
              loop={false}
            />
          ) : (
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-purple-600" />
            </div>
          )}
        </div>
      )}

      {/* Message Content */}
      <div className={cn(
        'max-w-xs lg:max-w-md xl:max-w-lg p-4 rounded-xl border-2 relative transform transition-transform duration-200',
        isUser ? theme.messageUser : theme.messageBot,
        'shadow-sm hover:shadow-md will-change-transform'
      )}>
        {/* Edit Button */}
        {canEdit && isUser && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full bg-white shadow-md hover:bg-gray-50 transform transition-transform duration-200 hover:scale-110"
          >
            <Edit3 className="w-3 h-3" />
          </Button>
        )}

        <p className="text-sm leading-relaxed text-gray-800">
          {message}
        </p>
        
        {timestamp && (
          <div className="text-xs text-gray-500 mt-2">
            {timeDisplay}
          </div>
        )}
      </div>

      {/* Avatar (for user messages) */}
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-gray-600" />
        </div>
      )}
    </motion.div>
  );
});

MessageBubble.displayName = 'MessageBubble';

// ================================
// OPTIMIZED QUESTION COMPONENT
// ================================

interface QuestionComponentProps {
  question: ConversationQuestion;
  response?: ConversationResponse;
  onResponse: (value: any) => void;
  theme: any;
  characterTheme: string;
}

const QuestionComponent = memo<QuestionComponentProps>(({
  question,
  response,
  onResponse,
  theme,
  characterTheme
}) => {
  const [tempValue, setTempValue] = useState<any>(response?.value || '');
  const { addCleanup } = useMemoryOptimizer();

  // Debounce text input to prevent excessive calls
  const debouncedTempValue = useDebounce(tempValue, 300);

  useEffect(() => {
    if (response?.value !== undefined) {
      setTempValue(response.value);
    }
  }, [response?.value]);

  // Throttled response handler for better performance
  const handleResponse = useThrottle(useCallback((value: any) => {
    setTempValue(value);
    onResponse(value);
  }, [onResponse]), 100);

  // Effect to handle debounced text input
  useEffect(() => {
    if (question.type === 'text-input' && debouncedTempValue !== response?.value) {
      handleResponse(debouncedTempValue);
    }
  }, [debouncedTempValue, question.type, response?.value, handleResponse]);

  // Memoized option rendering for choice questions
  const optionElements = useMemo(() => {
    if (question.type !== 'single-choice' && question.type !== 'multiple-choice') {
      return null;
    }

    return question.options?.map((option, index) => {
      const isSelected = question.type === 'single-choice' 
        ? tempValue === option.value
        : Array.isArray(tempValue) && tempValue.includes(option.value);

      return (
        <motion.button
          key={option.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05, duration: 0.2 }}
          onClick={() => {
            if (question.type === 'single-choice') {
              handleResponse(option.value);
            } else {
              const current = Array.isArray(tempValue) ? tempValue : [];
              const newValue = isSelected
                ? current.filter(v => v !== option.value)
                : [...current, option.value];
              handleResponse(newValue);
            }
          }}
          className={cn(
            'w-full p-4 text-left border-2 rounded-xl transition-all duration-150',
            'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2',
            'transform hover:scale-[1.02] active:scale-[0.98] will-change-transform',
            isSelected 
              ? `${theme.accent} bg-purple-50 border-purple-300 shadow-md` 
              : 'border-gray-200 hover:border-gray-300 bg-white',
            'relative group'
          )}
        >
          <div className="flex items-start gap-3">
            {/* Option Icon */}
            {option.icon && (
              <div className="flex-shrink-0 mt-1 transform transition-transform duration-200 group-hover:scale-110">
                {typeof option.icon === 'string' ? (
                  <img 
                    src={getCarmenManagementIconUrl(option.icon as any)} 
                    alt={option.label}
                    className="w-6 h-6 object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-xl">{option.icon}</div>
                )}
              </div>
            )}

            {/* Option Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-800 transition-colors duration-150 group-hover:text-purple-700">
                  {option.label}
                </h4>
                {option.recommended && (
                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                    Recommended
                  </Badge>
                )}
              </div>
              {option.description && (
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{option.description}</p>
              )}
            </div>

            {/* Selection Indicator */}
            <div className={cn(
              'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-150',
              'transform group-hover:scale-110',
              isSelected 
                ? 'bg-purple-600 border-purple-600 shadow-lg' 
                : 'border-gray-300 group-hover:border-purple-400'
            )}>
              {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
            </div>
          </div>
        </motion.button>
      );
    });
  }, [question.options, question.type, tempValue, theme.accent, handleResponse]);

  // Handle different question types
  if (question.type === 'single-choice' || question.type === 'multiple-choice') {
    return (
      <div className="space-y-3">
        {optionElements}
      </div>
    );
  }

  if (question.type === 'text-input') {
    return (
      <div className="space-y-3">
        <textarea
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          placeholder="Type your response here..."
          className={cn(
            'w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none resize-none',
            'transition-all duration-200 hover:border-gray-300',
            'transform focus:scale-[1.01] will-change-transform'
          )}
          rows={3}
        />
        <Button
          onClick={() => handleResponse(tempValue)}
          disabled={!tempValue.trim()}
          className={cn(
            theme.button, 
            'text-white transform transition-all duration-200 hover:scale-105 active:scale-95',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
          )}
        >
          Submit Response
        </Button>
      </div>
    );
  }

  if (question.type === 'yes-no') {
    const choices = useMemo(() => [
      { value: true, label: 'Yes', icon: CheckCircle },
      { value: false, label: 'No', icon: HelpCircle }
    ], []);

    return (
      <div className="flex gap-3">
        {choices.map(({ value, label, icon: Icon }) => (
          <Button
            key={label}
            variant={tempValue === value ? 'default' : 'outline'}
            onClick={() => handleResponse(value)}
            className={cn(
              'flex-1 py-4 transform transition-all duration-200 hover:scale-105 active:scale-95',
              tempValue === value && theme.button
            )}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </Button>
        ))}
      </div>
    );
  }

  return null;
});

QuestionComponent.displayName = 'QuestionComponent';

// ================================
// MAIN OPTIMIZED CONVERSATIONAL FLOW COMPONENT
// ================================

export const ConversationalFlow = memo<ConversationFlowProps>(({
  title,
  description,
  questions,
  responses,
  onResponseChange,
  onComplete,
  className,
  characterTheme = 'carmen',
  showProgress = true,
  allowBacktrack = true,
  conversationalTone = 'empathetic',
  aiInsights = false,
  autoProgress = true,
  characterName = 'Carmen'
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: 'question' | 'response' | 'insight';
    content: string;
    timestamp: Date;
    questionId?: string;
  }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addCleanup } = useMemoryOptimizer();

  // Memoized theme and current data
  const theme = useMemo(() => themeColors[characterTheme], [characterTheme]);
  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
  const isLastQuestion = useMemo(() => currentQuestionIndex === questions.length - 1, [currentQuestionIndex, questions.length]);
  const currentResponse = useMemo(() => 
    currentQuestion ? responses[currentQuestion.id] : undefined, 
    [currentQuestion, responses]
  );

  // Throttled scroll function
  const scrollToBottom = useThrottle(useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []), 100);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory, scrollToBottom]);

  // Initialize conversation with first question
  useEffect(() => {
    if (questions.length > 0 && conversationHistory.length === 0) {
      const timeoutId = setTimeout(() => {
        setConversationHistory([{
          type: 'question',
          content: questions[0].question,
          timestamp: new Date(),
          questionId: questions[0].id
        }]);
      }, 500);

      addCleanup(() => clearTimeout(timeoutId));
      return () => clearTimeout(timeoutId);
    }
  }, [questions, conversationHistory.length, addCleanup]);

  // Optimized response handler
  const handleResponse = useCallback((value: any) => {
    if (!currentQuestion) return;

    // Update responses
    onResponseChange(currentQuestion.id, value);

    // Add user response to conversation
    const responseText = Array.isArray(value) 
      ? value.join(', ')
      : typeof value === 'boolean'
      ? value ? 'Yes' : 'No'
      : value.toString();

    setConversationHistory(prev => [
      ...prev,
      {
        type: 'response',
        content: responseText,
        timestamp: new Date(),
        questionId: currentQuestion.id
      }
    ]);

    // Show Carmen's follow-up response if available
    if (currentQuestion.carmenResponse) {
      setIsTyping(true);
      const typingTimeout = setTimeout(() => {
        setIsTyping(false);
        setConversationHistory(prev => [
          ...prev,
          {
            type: 'insight',
            content: currentQuestion.carmenResponse!,
            timestamp: new Date(),
            questionId: currentQuestion.id
          }
        ]);
      }, 1000);

      addCleanup(() => clearTimeout(typingTimeout));
    }

    // Auto-progress to next question
    if (autoProgress && !isLastQuestion) {
      const progressTimeout = setTimeout(() => {
        moveToNextQuestion();
      }, currentQuestion.carmenResponse ? 2000 : 1000);

      addCleanup(() => clearTimeout(progressTimeout));
    }
  }, [currentQuestion, onResponseChange, isLastQuestion, autoProgress, addCleanup]);

  const moveToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      // Add next question to conversation
      setIsTyping(true);
      const timeout = setTimeout(() => {
        setIsTyping(false);
        setConversationHistory(prev => [
          ...prev,
          {
            type: 'question',
            content: questions[nextIndex].question,
            timestamp: new Date(),
            questionId: questions[nextIndex].id
          }
        ]);
      }, 800);

      addCleanup(() => clearTimeout(timeout));
    } else {
      // Complete the conversation
      onComplete?.(responses);
    }
  }, [currentQuestionIndex, questions, onComplete, responses, addCleanup]);

  const moveToPreviousQuestion = useCallback(() => {
    if (allowBacktrack && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [allowBacktrack, currentQuestionIndex]);

  const editResponse = useCallback((questionId: string) => {
    // Find the question and allow editing
    const questionIndex = questions.findIndex(q => q.id === questionId);
    if (questionIndex !== -1) {
      setCurrentQuestionIndex(questionIndex);
      // Remove messages after this point
      setConversationHistory(prev => 
        prev.filter(msg => {
          const msgQuestionIndex = questions.findIndex(q => q.id === msg.questionId);
          return msgQuestionIndex <= questionIndex;
        })
      );
    }
  }, [questions]);

  // Memoized progress calculation
  const progress = useMemo(() => 
    questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0, 
    [currentQuestionIndex, questions.length]
  );

  // Memoized conversation history rendering
  const conversationElements = useMemo(() => {
    return conversationHistory.map((item, index) => (
      <MessageBubble
        key={`${item.questionId}-${index}`}
        message={item.content}
        isUser={item.type === 'response'}
        theme={theme}
        showAvatar={item.type !== 'response'}
        avatarAnimation={item.type === 'question' ? 'carmen-performance-question.mp4' : 'carmen-performance-insight.mp4'}
        timestamp={item.timestamp}
        onEdit={() => item.questionId && editResponse(item.questionId)}
        canEdit={item.type === 'response' && allowBacktrack}
      />
    ));
  }, [conversationHistory, theme, editResponse, allowBacktrack]);

  return (
    <Card className={cn('w-full h-full flex flex-col transform transition-all duration-300', className)}>
      {/* Header */}
      <CardHeader className="flex-shrink-0 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {title}
            </CardTitle>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
          <Badge variant="outline" className="bg-white">
            {currentQuestionIndex + 1} of {questions.length}
          </Badge>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="mt-4">
            <Progress 
              value={progress} 
              className="h-2 transform transition-all duration-300"
            />
            <p className="text-xs text-gray-500 mt-1">
              Progress: {Math.round(progress)}% complete
            </p>
          </div>
        )}
      </CardHeader>

      {/* Conversation Area */}
      <CardContent className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-6 scroll-smooth">
          {/* Conversation History */}
          {conversationElements}

          {/* Typing Indicator */}
          <AnimatePresence mode="wait">
            {isTyping && <TypingIndicator theme={theme} />}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Current Question Input */}
        {currentQuestion && !isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex-shrink-0 space-y-4"
          >
            {/* Question Description */}
            {currentQuestion.description && (
              <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-purple-400">
                <p className="text-sm text-gray-700">{currentQuestion.description}</p>
              </div>
            )}

            {/* Question Input */}
            <QuestionComponent
              question={currentQuestion}
              response={currentResponse}
              onResponse={handleResponse}
              theme={theme}
              characterTheme={characterTheme}
            />

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={moveToPreviousQuestion}
                disabled={!allowBacktrack || currentQuestionIndex === 0}
                className="flex items-center gap-2 transform transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentResponse && !isLastQuestion && (
                <Button
                  onClick={moveToNextQuestion}
                  className={cn(
                    theme.button, 
                    'text-white flex items-center gap-2 transform transition-all duration-200 hover:scale-105'
                  )}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}

              {isLastQuestion && currentResponse && (
                <Button
                  onClick={() => onComplete?.(responses)}
                  className={cn(
                    theme.button, 
                    'text-white flex items-center gap-2 transform transition-all duration-200 hover:scale-105'
                  )}
                >
                  Complete
                  <Sparkles className="w-4 h-4" />
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
});

ConversationalFlow.displayName = 'ConversationalFlow';

export default ConversationalFlow;