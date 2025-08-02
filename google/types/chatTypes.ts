// Core chat message interface
export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  characterName?: string;
  metadata?: {
    lessonContext?: string;
    questionId?: string;
    category?: string;
  };
}

// Lesson module interface for modular system
export interface LessonModule {
  chapterNumber: number;
  title: string;
  phase: string;
  content: string;
  chapterTitle?: string;
  objectives?: string[];
  keyTerms?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

// Quick question interface
export interface QuickQuestion {
  id: string;
  text: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

// Performance tracking interface
export interface ChatPerformance {
  renderTime: number;
  messageCount: number;
  averageResponseTime: number;
}

// Main chat state interface
export interface ChatState {
  isExpanded: boolean;
  isMinimized: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  error: string | null;
  currentLesson: LessonModule | null;
  lastActivity: Date;
  performance: ChatPerformance;
}

// Action types for reducer
export type ChatAction =
  | { type: 'SET_EXPANDED'; payload: boolean }
  | { type: 'TOGGLE_EXPANDED' }
  | { type: 'SET_MINIMIZED'; payload: boolean }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LESSON_MODULE'; payload: LessonModule }
  | { type: 'UPDATE_PERFORMANCE'; payload: Partial<ChatPerformance> };

// Animation configuration
export interface AnimationConfig {
  typewriterSpeed: number;
  transitionDuration: number;
  staggerDelay: number;
}

// Narrative integration interface
export interface NarrativeIntegration {
  isPaused: boolean;
  canResume: boolean;
  pauseReason?: 'chat_active' | 'user_interaction' | 'manual';
}

// Export legacy types for backward compatibility
export type LessonContext = LessonModule;
export type ChatMessageData = ChatMessage;