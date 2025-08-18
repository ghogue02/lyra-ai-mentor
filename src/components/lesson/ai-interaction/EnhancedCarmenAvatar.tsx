import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { 
  Heart, 
  MessageCircle, 
  X, 
  Minimize2, 
  Send, 
  RotateCcw, 
  Sparkles,
  Users,
  Target,
  Brain,
  Coffee,
  Mic,
  Volume2,
  Settings
} from 'lucide-react';

export interface CarmenMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  emotion?: 'thoughtful' | 'empathetic' | 'analytical' | 'encouraging' | 'concerned' | 'excited';
  context?: string;
  suggestions?: string[];
}

export interface CarmenPersonalityMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  characteristics: string[];
}

export interface EnhancedCarmenAvatarProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  mode?: 'floating' | 'embedded' | 'fullscreen';
  initialExpanded?: boolean;
  lessonContext?: {
    chapterTitle?: string;
    lessonTitle?: string;
    content?: string;
    phase?: string;
    hrTopic?: string;
  };
  onEngagementChange?: (engaged: boolean, messageCount: number) => void;
  onMinimize?: () => void;
  disabled?: boolean;
  showPersonalityModes?: boolean;
  enableVoice?: boolean;
  contextualQuestions?: string[];
  'aria-label'?: string;
}

const personalityModes: CarmenPersonalityMode[] = [
  {
    id: 'empathetic',
    name: 'Empathetic Mentor',
    description: 'Focuses on human connection and emotional intelligence in HR practices',
    icon: <Heart className="w-4 h-4" />,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    characteristics: ['Compassionate guidance', 'People-first approach', 'Emotional support']
  },
  {
    id: 'analytical',
    name: 'Data-Driven Advisor',
    description: 'Emphasizes metrics, analytics, and evidence-based HR decisions',
    icon: <Target className="w-4 h-4" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    characteristics: ['Metrics-focused', 'Evidence-based', 'ROI analysis']
  },
  {
    id: 'strategic',
    name: 'Strategic Partner',
    description: 'Aligns HR initiatives with business objectives and long-term planning',
    icon: <Brain className="w-4 h-4" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    characteristics: ['Business alignment', 'Long-term vision', 'Organizational strategy']
  },
  {
    id: 'collaborative',
    name: 'Team Builder',
    description: 'Focuses on team dynamics, collaboration, and inclusive workplace culture',
    icon: <Users className="w-4 h-4" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    characteristics: ['Team dynamics', 'Inclusive culture', 'Collaboration']
  }
];

const positionClasses = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6', 
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6',
  'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
};

const contextualQuestions = {
  'talent-acquisition': [
    "How can I make my job descriptions more inclusive?",
    "What are the best practices for bias-free interviewing?",
    "How do I improve candidate experience during recruitment?",
    "What metrics should I track in hiring?"
  ],
  'performance-insights': [
    "How can I give feedback that motivates rather than discourages?",
    "What's the best way to set meaningful performance goals?",
    "How do I handle difficult performance conversations?",
    "What role should AI play in performance reviews?"
  ],
  'engagement-builder': [
    "What are the key drivers of employee engagement?",
    "How can I measure engagement effectively?",
    "What strategies work best for remote team engagement?",
    "How do I create personalized engagement plans?"
  ],
  'retention-mastery': [
    "What are the early warning signs of employee disengagement?",
    "How can I create effective stay interviews?",
    "What retention strategies work best for different generations?",
    "How do I balance retention with performance management?"
  ],
  'default': [
    "What makes AI so powerful for HR work?",
    "How can I get started with AI in people management?",
    "What are the most common HR AI mistakes to avoid?",
    "How do I balance AI efficiency with human empathy?"
  ]
};

export const EnhancedCarmenAvatar: React.FC<EnhancedCarmenAvatarProps> = ({
  className,
  position = 'bottom-right',
  mode = 'floating',
  initialExpanded = false,
  lessonContext,
  onEngagementChange,
  onMinimize,
  disabled = false,
  showPersonalityModes = true,
  enableVoice = false,
  contextualQuestions: customQuestions,
  'aria-label': ariaLabel = 'Carmen AI assistant'
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded || mode !== 'floating');
  const [messages, setMessages] = useState<CarmenMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPersonality, setCurrentPersonality] = useState<CarmenPersonalityMode>(personalityModes[0]);
  const [showPersonalitySelector, setShowPersonalitySelector] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  if (disabled) return null;

  const questions = customQuestions || 
    contextualQuestions[lessonContext?.hrTopic as keyof typeof contextualQuestions] || 
    contextualQuestions.default;

  // Mock AI response generation
  const generateCarmenResponse = async (userMessage: string): Promise<CarmenMessage> => {
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const responses = {
      empathetic: [
        "I understand how challenging this can feel. Let's work through this together with compassion and care for everyone involved.",
        "Your concern for both efficiency and human connection really resonates with me. Here's how we can honor both...",
        "It sounds like you're dealing with a delicate situation. Remember, the best HR solutions always keep human dignity at the center."
      ],
      analytical: [
        "Based on the data and best practices, here's what the research shows us...",
        "Let's look at the metrics that matter most for this situation. I recommend tracking these key indicators...",
        "The evidence suggests a structured approach would be most effective. Here's a framework we can use..."
      ],
      strategic: [
        "This connects to broader organizational goals. Let me help you see the bigger picture...",
        "Thinking strategically, this is an opportunity to align HR practices with business objectives...",
        "From a long-term perspective, this initiative could drive significant organizational change..."
      ],
      collaborative: [
        "Building inclusive teams requires intentional effort. Here are some proven strategies...",
        "Team dynamics are complex, but there are ways to foster better collaboration...",
        "Creating psychological safety is key to team success. Let's explore how to build that..."
      ]
    };

    const personalityResponses = responses[currentPersonality.id as keyof typeof responses] || responses.empathetic;
    const randomResponse = personalityResponses[Math.floor(Math.random() * personalityResponses.length)];

    return {
      id: Date.now().toString(),
      content: randomResponse,
      isUser: false,
      timestamp: new Date(),
      emotion: currentPersonality.id as any,
      context: lessonContext?.hrTopic,
      suggestions: questions.slice(0, 2)
    };
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: CarmenMessage = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const carmenResponse = await generateCarmenResponse(content);
      setMessages(prev => [...prev, carmenResponse]);
      
      // Notify parent about engagement
      const userMessages = messages.filter(msg => msg.isUser);
      onEngagementChange?.(true, userMessages.length + 1);
      
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    onEngagementChange?.(false, 0);
  };

  const handlePersonalityChange = (personality: CarmenPersonalityMode) => {
    setCurrentPersonality(personality);
    setShowPersonalitySelector(false);
    
    const personalityMessage: CarmenMessage = {
      id: Date.now().toString(),
      content: `I've switched to my ${personality.name} mode. ${personality.description}`,
      isUser: false,
      timestamp: new Date(),
      emotion: personality.id as any
    };
    
    setMessages(prev => [...prev, personalityMessage]);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  // Floating avatar button
  if (mode === 'floating' && !isExpanded) {
    return (
      <div className={cn('fixed z-50', positionClasses[position], className)}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative group"
        >
          <Button
            onClick={() => setIsExpanded(true)}
            size="lg"
            className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label={ariaLabel}
          >
            <Avatar className="w-12 h-12">
              <AvatarImage src="/lovable-uploads/character-avatars/carmen-avatar.png" alt="Carmen" />
              <AvatarFallback className="bg-transparent text-white text-sm font-bold">CR</AvatarFallback>
            </Avatar>
          </Button>
          
          {/* Notification pulse */}
          <motion.div
            className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-3 h-3 text-white" />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Main chat interface
  return (
    <div className={cn(
      mode === 'floating' 
        ? `fixed z-50 w-96 h-[600px] ${positionClasses[position]}` 
        : mode === 'fullscreen'
        ? 'fixed inset-0 z-50'
        : 'w-full h-full max-h-[600px]',
      className
    )}>
      <Card className="h-full flex flex-col bg-white shadow-2xl border-2 border-orange-200">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10 border-2 border-orange-200">
                <AvatarImage src="/lovable-uploads/character-avatars/carmen-avatar.png" alt="Carmen" />
                <AvatarFallback className="bg-orange-100 text-orange-700">CR</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <CardTitle className="text-orange-800 text-lg">Carmen Rodriguez</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={cn('text-xs', currentPersonality.color, currentPersonality.bgColor, currentPersonality.borderColor)}>
                    {currentPersonality.name}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center space-x-1">
              {enableVoice && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsListening(!isListening)}
                  className={cn('h-8 w-8 p-0', isListening ? 'text-red-600' : 'text-gray-400')}
                >
                  <Mic className="w-4 h-4" />
                </Button>
              )}
              
              {showPersonalityModes && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPersonalitySelector(!showPersonalitySelector)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-orange-600"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={clearMessages}
                className="h-8 w-8 p-0 text-gray-400 hover:text-orange-600"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>

              {(mode === 'floating' || onMinimize) && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onMinimize ? onMinimize() : setIsExpanded(false)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-orange-600"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Personality Selector */}
          <AnimatePresence>
            {showPersonalitySelector && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-2"
              >
                <h4 className="text-sm font-medium text-orange-800">Choose Carmen's Mode:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {personalityModes.map((personality) => (
                    <Button
                      key={personality.id}
                      size="sm"
                      variant={currentPersonality.id === personality.id ? "default" : "outline"}
                      onClick={() => handlePersonalityChange(personality)}
                      className={cn(
                        'h-auto p-2 text-left justify-start',
                        currentPersonality.id === personality.id 
                          ? `${personality.bgColor} ${personality.borderColor} ${personality.color}` 
                          : ''
                      )}
                    >
                      <div className="flex items-center space-x-2">
                        {personality.icon}
                        <span className="text-xs font-medium">{personality.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardHeader>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {/* Welcome message */}
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8 mt-1 border border-orange-200">
                      <AvatarImage src="/lovable-uploads/character-avatars/carmen-avatar.png" alt="Carmen" />
                      <AvatarFallback className="bg-orange-100 text-orange-700 text-xs">CR</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-orange-50 border border-orange-200 rounded-2xl rounded-tl-none p-3">
                      <div className="text-sm text-gray-700 mb-2">
                        Hi! I'm Carmen Rodriguez, your AI-powered People Management mentor. I'm here to help you create HR practices that blend efficiency with empathy.
                      </div>
                      <div className="text-xs text-orange-600">
                        Current mode: <span className="font-medium">{currentPersonality.name}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick questions */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-500 px-2">
                      <Sparkles className="w-3 h-3" />
                      <span>Quick questions to get started:</span>
                    </div>
                    {questions.slice(0, 3).map((question, index) => (
                      <button
                        key={index}
                        onClick={() => sendMessage(question)}
                        className="w-full text-left p-3 text-sm bg-white border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-200 transition-colors"
                        disabled={isLoading}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat messages */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start space-x-3",
                    message.isUser && "flex-row-reverse space-x-reverse"
                  )}
                >
                  {!message.isUser && (
                    <Avatar className="w-8 h-8 mt-1 border border-orange-200">
                      <AvatarImage src="/lovable-uploads/character-avatars/carmen-avatar.png" alt="Carmen" />
                      <AvatarFallback className="bg-orange-100 text-orange-700 text-xs">CR</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={cn(
                    "max-w-[80%] rounded-2xl p-3",
                    message.isUser 
                      ? "bg-orange-600 text-white rounded-tr-none" 
                      : "bg-orange-50 border border-orange-200 text-gray-700 rounded-tl-none"
                  )}>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                    
                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs text-orange-600 font-medium">Suggested follow-ups:</div>
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => sendMessage(suggestion)}
                            className="block w-full text-left text-xs p-2 bg-white border border-orange-200 rounded hover:bg-orange-50 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <div className={cn(
                      "text-xs mt-2",
                      message.isUser ? "text-orange-100" : "text-gray-500"
                    )}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8 mt-1 border border-orange-200">
                    <AvatarImage src="/lovable-uploads/character-avatars/carmen-avatar.png" alt="Carmen" />
                    <AvatarFallback className="bg-orange-100 text-orange-700 text-xs">CR</AvatarFallback>
                  </Avatar>
                  <div className="bg-orange-50 border border-orange-200 rounded-2xl rounded-tl-none p-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <Coffee className="w-4 h-4 text-orange-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Input */}
        <div className="border-t border-orange-200 p-4 bg-orange-50">
          <div className="flex space-x-2 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Carmen about people management..."
                className="w-full p-3 pr-10 border border-orange-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '100px' }}
                disabled={isLoading}
              />
              
              {enableVoice && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-2 h-6 w-6 p-0 text-gray-400 hover:text-orange-600"
                  onClick={() => setIsListening(!isListening)}
                >
                  <Mic className="w-3 h-3" />
                </Button>
              )}
            </div>
            
            <Button
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-lg"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedCarmenAvatar;