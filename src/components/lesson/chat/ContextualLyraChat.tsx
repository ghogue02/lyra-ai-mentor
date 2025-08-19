import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// Memory management hooks removed
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Heart, 
  HelpCircle, 
  Target, 
  BookOpen,
  Lightbulb,
  Users,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LessonContext, ContextualQuestion, ChatEngagement } from '@/types/ContextualChat';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'contextual_question' | 'system';
}

interface ContextualLyraChatProps {
  lessonContext: LessonContext;
  className?: string;
  onEngagementChange?: (isEngaged: boolean, exchangeCount: number) => void;
  onNarrativePause?: () => void;
  onNarrativeResume?: () => void;
  onChatOpen?: () => void;
  onChatClose?: () => void;
  config?: {
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    pauseNarrativeOnOpen?: boolean;
    minEngagementExchanges?: number;
  };
}

export const ContextualLyraChat: React.FC<ContextualLyraChatProps> = ({
  lessonContext,
  className,
  onEngagementChange,
  onNarrativePause,
  onNarrativeResume,
  onChatOpen,
  onChatClose,
  config = {}
}) => {
  // Memory management hooks removed

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [engagement, setEngagement] = useState<ChatEngagement>({
    isEngaged: false,
    exchangeCount: 0,
    hasReachedMinimum: false,
    totalMessageCount: 0,
    startTime: new Date()
  });
  const [showContextualQuestions, setShowContextualQuestions] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    pauseNarrativeOnOpen = true,
    minEngagementExchanges = 3
  } = config;

  // Generate contextual questions based on lesson context
  const getContextualQuestions = (): ContextualQuestion[] => {
    const baseQuestions: ContextualQuestion[] = [
      {
        id: 'explain-concept',
        text: `Can you explain the key concepts in "${lessonContext.lessonTitle}"?`,
        icon: BookOpen,
        category: 'understanding',
        priority: 'high'
      },
      {
        id: 'practical-application',
        text: 'How can I apply this to my nonprofit work?',
        icon: Target,
        category: 'application',
        priority: 'high'
      },
      {
        id: 'clarification',
        text: 'I need clarification on something from this lesson',
        icon: HelpCircle,
        category: 'clarification',
        priority: 'medium'
      }
    ];

    // Add chapter-specific questions
    if (lessonContext.chapterNumber === 1) {
      baseQuestions.push(
        {
          id: 'ai-basics',
          text: 'What are the basics of AI that I should understand?',
          icon: Lightbulb,
          category: 'foundations',
          priority: 'high'
        },
        {
          id: 'nonprofit-specific',
          text: 'How is AI different for nonprofits vs. businesses?',
          icon: Heart,
          category: 'nonprofit-focus',
          priority: 'medium'
        }
      );
    }

    return baseQuestions;
  };

  const contextualQuestions = getContextualQuestions();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Memory management removed - handled by React

  // Handle sending messages
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString() + '-user',
      content: content.trim(),
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    setShowContextualQuestions(false);

    // Update engagement tracking
    const newExchangeCount = engagement.exchangeCount + 1;
    const newTotalCount = engagement.totalMessageCount + 1;
    const newEngagement: ChatEngagement = {
      ...engagement,
      isEngaged: true,
      exchangeCount: newExchangeCount,
      totalMessageCount: newTotalCount,
      hasReachedMinimum: newExchangeCount >= minEngagementExchanges,
      lastActivityTime: new Date()
    };
    
    setEngagement(newEngagement);
    onEngagementChange?.(true, newExchangeCount);

    try {
      // Call the existing Edge Function for AI responses
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          lessonContext: {
            chapter: lessonContext.chapterNumber,
            lesson: lessonContext.lessonTitle,
            phase: lessonContext.phase,
            objectives: lessonContext.objectives,
            keyTerms: lessonContext.keyTerms
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        content: data.response || 'I apologize, but I encountered an issue generating a response. Could you please try rephrasing your question?',
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Update engagement count for AI response
      setEngagement(prev => ({
        ...prev,
        totalMessageCount: prev.totalMessageCount + 1
      }));

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback AI response
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        content: "I'm having trouble connecting right now, but I'm here to help! Could you try asking your question again? I'm designed to help with AI concepts for nonprofit work.",
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle contextual question selection
  const handleQuestionSelect = async (question: ContextualQuestion) => {
    await sendMessage(question.text);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(currentMessage);
  };

  return (
    <Card className={cn("w-full max-w-md h-[500px] flex flex-col", className)}>
      {/* Chat Header */}
      <CardHeader className="pb-3 border-b bg-gradient-to-r from-primary/5 to-brand-cyan/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-brand-cyan flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Lyra AI Coach</h3>
            <p className="text-xs text-muted-foreground">
              Chapter {lessonContext.chapterNumber}: {lessonContext.lessonTitle}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {engagement.exchangeCount} msgs
          </Badge>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-primary/30 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Hi! I'm Lyra, your AI learning companion. I'm here to help you with this lesson.
              </p>
              <p className="text-xs text-muted-foreground">
                Choose a question below or ask me anything!
              </p>
            </div>
          )}

          {/* Contextual Questions */}
          {showContextualQuestions && messages.length === 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground text-center mb-3">
                Quick start questions:
              </p>
              {contextualQuestions.slice(0, 3).map((question) => (
                <Button
                  key={question.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-3 text-xs"
                  onClick={() => handleQuestionSelect(question)}
                >
                  <question.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{question.text}</span>
                </Button>
              ))}
            </div>
          )}

          {/* Message List */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.isUser ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                  message.isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-3 py-2 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Lyra is typing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Ask me about this lesson..."
              className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!currentMessage.trim() || isLoading}
              className="px-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContextualLyraChat;