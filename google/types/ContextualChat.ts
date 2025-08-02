// Type definitions for the ContextualLyraChat system

export interface LessonContext {
  chapterNumber: number;
  lessonTitle: string;
  phase: string;
  content: string;
  chapterTitle?: string;
  objectives?: string[];
  keyTerms?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration?: number;
  prerequisites?: string[];
  relatedLessons?: number[];
}

export interface ContextualQuestion {
  id: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  priority: 'high' | 'medium' | 'low';
  chapter?: number;
  tags?: string[];
}

export interface ChatEngagement {
  isEngaged: boolean;
  exchangeCount: number;
  hasReachedMinimum: boolean;
  totalMessageCount: number;
  startTime?: Date;
  lastActivityTime?: Date;
}

export interface ContextualChatConfig {
  // Appearance
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'default' | 'brand' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  
  // Behavior
  autoExpand?: boolean;
  persistState?: boolean;
  enableTypingIndicator?: boolean;
  enableScrollToBottom?: boolean;
  enableContextualQuestions?: boolean;
  
  // Integration
  pauseNarrativeOnOpen?: boolean;
  trackEngagement?: boolean;
  minEngagementExchanges?: number;
  
  // Customization
  customQuestions?: ContextualQuestion[];
  customGreeting?: string;
  maxMessageHistory?: number;
}

export interface NarrativeIntegration {
  onPause?: () => void;
  onResume?: () => void;
  onEngagementMilestone?: (milestone: number) => void;
  onChatComplete?: (engagement: ChatEngagement) => void;
}

export interface MobileResponsiveConfig {
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  mobileOptimizations: {
    fullScreenOnMobile?: boolean;
    reducedAnimations?: boolean;
    simplifiedUI?: boolean;
    keyboardHandling?: boolean;
  };
}

// Extended interfaces for advanced features
export interface AdvancedLessonContext extends LessonContext {
  // Lesson progression tracking
  completionPercentage?: number;
  currentStep?: number;
  totalSteps?: number;
  
  // Learning analytics
  strugglingConcepts?: string[];
  masteredConcepts?: string[];
  suggestedReview?: string[];
  
  // Adaptive content
  adaptedContent?: {
    difficulty: 'easier' | 'harder';
    reason: string;
    modifications: string[];
  };
  
  // Integration points
  narrativeManager?: {
    currentPhase: string;
    availablePhases: string[];
    canSkip: boolean;
  };
}

export interface LessonSpecificQuestions {
  // Chapter 1 - AI Foundations
  foundations: ContextualQuestion[];
  
  // Chapter 2 - Email & Communication  
  communication: ContextualQuestion[];
  
  // Chapter 3 - Storytelling & Presentations
  storytelling: ContextualQuestion[];
  
  // Chapter 4 - Data Analysis & Insights
  dataAnalysis: ContextualQuestion[];
  
  // Chapter 5 - Automation & Workflow
  automation: ContextualQuestion[];
  
  // Chapter 6 - Leadership & Strategy
  leadership: ContextualQuestion[];
  
  // Default fallback questions
  default: ContextualQuestion[];
}

export interface ChatAnalytics {
  sessionId: string;
  lessonContext: LessonContext;
  engagement: ChatEngagement;
  messageHistory: Array<{
    timestamp: Date;
    isUser: boolean;
    content: string;
    responseTime?: number;
  }>;
  outcomes: {
    questionsAnswered: number;
    conceptsClarified: string[];
    practicalApplications: string[];
    confidenceLevel?: 1 | 2 | 3 | 4 | 5;
  };
}

// Event types for the contextual chat system
export type ContextualChatEvent = 
  | { type: 'CHAT_OPENED'; payload: { lessonContext: LessonContext } }
  | { type: 'CHAT_CLOSED'; payload: { duration: number; messageCount: number } }
  | { type: 'QUESTION_SELECTED'; payload: { questionId: string; category: string } }
  | { type: 'MESSAGE_SENT'; payload: { content: string; isUser: boolean } }
  | { type: 'ENGAGEMENT_MILESTONE'; payload: { exchangeCount: number } }
  | { type: 'NARRATIVE_PAUSED'; payload: { reason: 'chat_opened' } }
  | { type: 'NARRATIVE_RESUMED'; payload: { reason: 'chat_closed' } }
  | { type: 'ERROR_OCCURRED'; payload: { error: string; context: string } };

// Hook return types
export interface UseContextualChatReturn {
  // State
  isExpanded: boolean;
  isMinimized: boolean;
  messages: any[];
  isTyping: boolean;
  isLoading: boolean;
  engagement: ChatEngagement;
  
  // Actions
  toggleExpanded: () => void;
  sendMessage: (content: string) => Promise<void>;
  selectQuestion: (question: ContextualQuestion) => Promise<void>;
  clearChat: () => Promise<void>;
  
  // Refs
  messagesEndRef: React.RefObject<HTMLDivElement>;
  scrollToBottom: () => void;
  
  // Integration
  pauseNarrative: () => void;
  resumeNarrative: () => void;
  trackEvent: (event: ContextualChatEvent) => void;
}

// Component prop types
export interface ContextualLyraChatProps {
  lessonContext: LessonContext;
  config?: ContextualChatConfig;
  integration?: NarrativeIntegration;
  mobileConfig?: MobileResponsiveConfig;
  className?: string;
  
  // Event handlers
  onChatOpen?: () => void;
  onChatClose?: () => void;
  onEngagementChange?: (isEngaged: boolean, exchangeCount: number) => void;
  onNarrativePause?: () => void;
  onNarrativeResume?: () => void;
  onError?: (error: string) => void;
  
  // Advanced features
  customQuestions?: ContextualQuestion[];
  analytics?: boolean;
  debugMode?: boolean;
}

export interface FloatingLyraAvatarProps {
  lessonContext: LessonContext;
  config?: ContextualChatConfig;
  integration?: NarrativeIntegration;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  disabled?: boolean;
  initialExpanded?: boolean;
  
  // Event handlers
  onEngagementChange?: (isEngaged: boolean, exchangeCount: number) => void;
  onNarrativePause?: () => void;
  onNarrativeResume?: () => void;
}

// Utility types
export type LessonPhase = 'introduction' | 'learning' | 'practice' | 'assessment' | 'reflection';
export type ChatState = 'collapsed' | 'expanded' | 'minimized' | 'loading' | 'error';
export type MessageType = 'text' | 'system' | 'error' | 'success' | 'contextual_question';

// Default configurations
export const DEFAULT_CHAT_CONFIG: ContextualChatConfig = {
  position: 'bottom-right',
  theme: 'default',
  size: 'md',
  autoExpand: false,
  persistState: true,
  enableTypingIndicator: true,
  enableScrollToBottom: true,
  enableContextualQuestions: true,
  pauseNarrativeOnOpen: true,
  trackEngagement: true,
  minEngagementExchanges: 3,
  maxMessageHistory: 50
};

export const DEFAULT_MOBILE_CONFIG: MobileResponsiveConfig = {
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200
  },
  mobileOptimizations: {
    fullScreenOnMobile: true,
    reducedAnimations: false,
    simplifiedUI: true,
    keyboardHandling: true
  }
};