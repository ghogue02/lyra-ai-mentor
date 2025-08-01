import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Maximize2,
  Heart, 
  Sparkles, 
  Target, 
  Users, 
  Lightbulb,
  HelpCircle,
  Zap,
  BookOpen,
  ArrowDown
} from 'lucide-react';
import { LyraAvatar } from '@/components/LyraAvatar';
import { ChatMessage, type ChatMessageData } from '../shared/ChatMessage';
import { cn } from '@/lib/utils';
import { useLyraChat } from '@/hooks/useLyraChat';
import { getMayaContextualQuestions, MayaJourneyState } from './maya/Chapter2ContextualQuestions';

// Types for lesson context and integration
export interface LessonContext {
  chapterNumber: number;
  lessonTitle: string;
  phase: string;
  content: string;
  chapterTitle?: string;
  objectives?: string[];
  keyTerms?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface ContextualLyraChatProps {
  lessonContext: LessonContext;
  mayaJourneyState?: MayaJourneyState; // Optional for Maya Chapter 2 integration
  onChatOpen?: () => void;
  onChatClose?: () => void;
  onEngagementChange?: (isEngaged: boolean, exchangeCount: number) => void;
  onNarrativePause?: () => void;
  onNarrativeResume?: () => void;
  className?: string;
  isFloating?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  onAvatarClick?: () => void;
}

// Enhanced contextual questions with Maya journey support
const getContextualQuestions = (lessonContext: LessonContext, mayaProgress?: MayaJourneyState): Array<{
  id: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  priority: 'high' | 'medium' | 'low';
}> => {
  const { chapterNumber, lessonTitle, phase } = lessonContext;
  
  // Chapter 2 - Maya's Email Challenge with enhanced contextual questions
  if (chapterNumber === 2 && mayaProgress) {
    const mayaQuestions = getMayaContextualQuestions(lessonContext, mayaProgress);
    // Convert to expected format
    return mayaQuestions.map(q => ({
      id: q.id,
      text: q.text,
      icon: q.icon,
      category: q.category,
      priority: q.priority
    }));
  }
  
  // Chapter 1 Lesson 1 - AI Foundations
  if (chapterNumber === 1) {
    return [
      {
        id: 'ai-beginner',
        text: "I'm new to AI - where should I start?",
        icon: BookOpen,
        category: 'Getting Started',
        priority: 'high'
      },
      {
        id: 'nonprofit-ai',
        text: "How can AI help my nonprofit's daily work?",
        icon: Heart,
        category: 'Nonprofit Applications',
        priority: 'high'
      },
      {
        id: 'ai-concepts',
        text: "What are the most important AI concepts for beginners?",
        icon: Lightbulb,
        category: 'Foundational Knowledge',
        priority: 'high'
      },
      {
        id: 'ai-ethics',
        text: "I'm worried about AI ethics - can you help me understand?",
        icon: Target,
        category: 'Ethics & Values',
        priority: 'high'
      },
      {
        id: 'ai-practical',
        text: "What's the first AI tool I should try?",
        icon: Zap,
        category: 'Practical Steps',
        priority: 'medium'
      },
      {
        id: 'ai-concerns',
        text: "What should I be cautious about with AI?",
        icon: HelpCircle,
        category: 'Safety & Concerns',
        priority: 'medium'
      }
    ];
  }
  
  // Fallback to existing Chapter 2 questions if mayaProgress not provided
  if (chapterNumber === 2) {
    return [
      {
        id: 'email-help',
        text: "How can AI help me write better emails?",
        icon: MessageCircle,
        category: 'Email Writing',
        priority: 'high'
      },
      {
        id: 'donor-communication',
        text: "How do I communicate with different donor types?",
        icon: Users,
        category: 'Donor Relations',
        priority: 'high'
      },
      {
        id: 'pace-framework',
        text: "What is the PACE framework Maya uses?",
        icon: Target,
        category: 'Frameworks',
        priority: 'high'
      },
      {
        id: 'personalization',
        text: "How can I personalize messages at scale?",
        icon: Sparkles,
        category: 'Personalization',
        priority: 'medium'
      }
    ];
  }
  
  // Default fallback questions
  return [
    {
      id: 'lesson-help',
      text: `Help me understand this lesson: ${lessonTitle}`,
      icon: BookOpen,
      category: 'Lesson Support',
      priority: 'high'
    },
    {
      id: 'practical-application',
      text: "How can I apply this to my nonprofit work?",
      icon: Target,
      category: 'Application',
      priority: 'high'
    },
    {
      id: 'next-steps',
      text: "What should I do next?",
      icon: Lightbulb,
      category: 'Next Steps',
      priority: 'medium'
    }
  ];
};

export const ContextualLyraChat: React.FC<ContextualLyraChatProps> = ({
  lessonContext,
  mayaJourneyState,
  onChatOpen,
  onChatClose,
  onEngagementChange,
  onNarrativePause,
  onNarrativeResume,
  className,
  isFloating = true,
  expanded = false,
  onExpandedChange,
  onAvatarClick
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Get contextual questions based on lesson (with Maya journey state if available)
  const contextualQuestions = getContextualQuestions(lessonContext, mayaJourneyState);

  // Initialize chat hook with lesson context
  const {
    messages,
    sendMessage,
    clearChat,
    isLoading
  } = useLyraChat({
    chapterTitle: lessonContext.chapterTitle || `Chapter ${lessonContext.chapterNumber}`,
    lessonTitle: lessonContext.lessonTitle,
    content: lessonContext.content,
    lessonContext: lessonContext
  });

  // Handle expansion changes
  useEffect(() => {
    if (isExpanded !== expanded) {
      setIsExpanded(expanded);
    }
  }, [expanded, isExpanded]);

  useEffect(() => {
    onExpandedChange?.(isExpanded);
  }, [isExpanded, onExpandedChange]);

  // Handle engagement tracking
  useEffect(() => {
    const userMessages = messages.filter(m => m.isUser).length;
    if (userMessages !== exchangeCount) {
      setExchangeCount(userMessages);
      onEngagementChange?.(userMessages > 0, userMessages);
    }
  }, [messages, exchangeCount, onEngagementChange]);

  // Handle chat open/close callbacks
  useEffect(() => {
    if (isExpanded && !isMinimized) {
      onChatOpen?.();
      onNarrativePause?.();
    } else {
      onChatClose?.();
      onNarrativeResume?.();
    }
  }, [isExpanded, isMinimized, onChatOpen, onChatClose, onNarrativePause, onNarrativeResume]);

  // Click outside detection to close chat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Only handle clicks when chat is expanded and not minimized
      if (!isExpanded || isMinimized) return;
      
      // Check if the click is outside the chat container
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        // Prevent closing if clicking on the floating avatar (when it exists)
        const target = event.target as Element;
        if (target.closest('[data-lyra-avatar]')) {
          return;
        }
        
        handleClose();
      }
    };

    // Add event listeners for both mouse and touch events
    if (isExpanded && !isMinimized) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isExpanded, isMinimized]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle scroll events for scroll-to-bottom button
  const handleScroll = useCallback(() => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollToBottom(!isNearBottom && messages.length > 3);
    }
  }, [messages.length]);

  // Handle sending contextual questions
  const handleQuestionClick = async (question: typeof contextualQuestions[0]) => {
    setIsTyping(true);
    try {
      await sendMessage(question.text);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle custom message sending
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const message = inputValue;
    setInputValue('');
    setIsTyping(true);
    
    try {
      await sendMessage(message);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle expanding/collapsing
  const handleToggleExpanded = () => {
    console.log('ContextualLyraChat: toggling expansion from', isExpanded);
    if (onAvatarClick) {
      // Use the parent's click handler for proper state coordination
      onAvatarClick();
    } else {
      // Fallback to local state management
      setIsExpanded(!isExpanded);
      setIsMinimized(false);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    setIsExpanded(false);
    setIsMinimized(false);
  };

  // Floating avatar when collapsed
  if (!isExpanded && isFloating) {
    return (
      <motion.div
        data-lyra-avatar
        className={cn(
          "fixed bottom-6 right-6 z-50 group cursor-pointer",
          className
        )}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggleExpanded}
      >
        <div className="relative">
          <LyraAvatar 
            size="lg" 
            withWave={true} 
            expression="helping"
            className="shadow-lg hover:shadow-xl transition-shadow duration-300" 
          />
          
          {/* Notification pulse - removed per user request */}
          
          {/* Context indicator - removed help text per user request */}
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
            Chat with Lyra about {lessonContext.lessonTitle}
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Expanded chat interface
  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          ref={chatRef}
          className={cn(
            isFloating 
              ? "fixed inset-4 md:right-6 md:bottom-6 md:top-auto md:left-auto md:w-96 md:h-[400px] z-50"
              : "w-full h-full",
            className
          )}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          <Card className="h-full flex flex-col premium-card brand-shadow-glow">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-brand-cyan/5 to-brand-purple/5">
              <div className="flex items-center gap-3">
                <LyraAvatar size="sm" expression="helping" />
                <div>
                  <h3 className="font-semibold text-sm brand-gradient-text">
                    Lyra - Lesson Assistant
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Ch.{lessonContext.chapterNumber} • {lessonContext.lessonTitle}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {isFloating && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMinimize}
                      className="w-8 h-8 p-0"
                    >
                      {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClose}
                      className="w-8 h-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Chat Content */}
            <div className={cn(
              "flex-1 flex flex-col min-h-0",
              isMinimized && "hidden"
            )}>
              {/* Contextual Questions (shown when no messages) */}
              {messages.length === 0 && (
                <motion.div
                  className="p-4 space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-center">
                    <h4 className="font-medium text-sm mb-2">
                      I'm here to help with this lesson!
                    </h4>
                    <p className="text-xs text-muted-foreground mb-4">
                      Choose a question below or ask me anything about {lessonContext.lessonTitle}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {contextualQuestions.slice(0, 4).map((question, index) => (
                      <motion.button
                        key={question.id}
                        className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-brand-cyan/10 hover:to-brand-purple/10 border border-gray-200 hover:border-brand-cyan/30 transition-all duration-200 group"
                        onClick={() => handleQuestionClick(question)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-md bg-gradient-to-r from-brand-cyan to-brand-purple flex items-center justify-center group-hover:scale-110 transition-transform">
                            <question.icon className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-brand-cyan">
                              {question.text}
                            </p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {question.category}
                            </Badge>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Messages Area */}
              {messages.length > 0 && (
                <div className="flex-1 min-h-0 overflow-hidden">
                  <ScrollArea 
                    ref={scrollAreaRef}
                    className="h-full"
                    onScrollCapture={handleScroll}
                  >
                    <div className="p-4 space-y-4">
                      {messages.map((message) => (
                        <ChatMessage
                          key={message.id}
                          message={{
                            ...message,
                            characterName: message.isUser ? undefined : "Lyra"
                          }}
                        />
                      ))}
                      
                      {/* Typing indicator */}
                      {(isTyping || isLoading) && (
                        <div className="flex items-start gap-3">
                          <LyraAvatar size="sm" expression="thinking" />
                          <Card className="bg-gradient-to-r from-brand-cyan/10 to-brand-purple/10 border-brand-cyan/20">
                            <CardContent className="p-3">
                              <div className="flex items-center space-x-2">
                                <div className="flex space-x-1">
                                  <motion.div
                                    className="w-2 h-2 bg-brand-cyan rounded-full"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                                  />
                                  <motion.div
                                    className="w-2 h-2 bg-brand-cyan rounded-full"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                  />
                                  <motion.div
                                    className="w-2 h-2 bg-brand-cyan rounded-full"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  Lyra is thinking...
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  
                  {/* Scroll to bottom button */}
                  <AnimatePresence>
                    {showScrollToBottom && (
                      <motion.div
                        className="absolute bottom-4 right-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Button
                          size="sm"
                          onClick={scrollToBottom}
                          className="rounded-full w-10 h-10 p-0 bg-brand-cyan hover:bg-brand-cyan/90 shadow-lg"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t bg-gray-50/50 flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about this lesson..."
                    className="flex-1 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    disabled={isLoading || isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading || isTyping}
                    size="sm"
                    className="premium-button-primary px-3"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>Press Enter to send</span>
                  {messages.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearChat}
                      className="text-xs px-2 py-1 h-auto"
                    >
                      Clear Chat
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContextualLyraChat;