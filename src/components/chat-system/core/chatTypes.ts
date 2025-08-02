/**
 * Chat System Type Definitions
 * Central type definitions for the modular chat system
 * 
 * @architecture Single source of truth for all chat-related types
 * @performance Optimized for minimal re-renders and memory usage
 */

import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

// ============================================================================
// CORE STATE TYPES
// ============================================================================

export interface ChatState {
  // UI State Management
  ui: {
    isExpanded: boolean;
    isMinimized: boolean;
    position: FloatingPosition;
    showScrollToBottom: boolean;
    hasNewMessage: boolean;
  };
  
  // Narrative Engine State
  narrative: {
    currentIndex: number;
    isTyping: boolean;
    isPaused: boolean;
    displayedText: string;
    isComplete: boolean;
    messages: NarrativeMessage[];
    autoAdvance: boolean;
    stuckDetection: boolean;
  };
  
  // Chat Conversation State
  conversation: {
    messages: ChatMessage[];
    isLoading: boolean;
    inputValue: string;
    exchangeCount: number;
    contextualQuestions: ContextualQuestion[];
  };
  
  // Lesson Integration State
  lesson: {
    context: LessonContext;
    moduleId?: string;
    progress: LessonProgress;
  };
  
  // Performance Tracking
  performance: {
    renderCount: number;
    lastUpdate: number;
    memoryUsage?: number;
  };
}

// ============================================================================
// ACTION TYPES
// ============================================================================

export type ChatAction = 
  // UI Actions
  | { type: 'UI_EXPAND'; payload?: { animated?: boolean } }
  | { type: 'UI_COLLAPSE'; payload?: { animated?: boolean } }
  | { type: 'UI_MINIMIZE'; payload: boolean }
  | { type: 'UI_SET_POSITION'; payload: FloatingPosition }
  | { type: 'UI_NEW_MESSAGE_INDICATOR'; payload: boolean }
  
  // Narrative Actions
  | { type: 'NARRATIVE_START'; payload: NarrativeMessage[] }
  | { type: 'NARRATIVE_PAUSE' }
  | { type: 'NARRATIVE_RESUME' }
  | { type: 'NARRATIVE_ADVANCE' }
  | { type: 'NARRATIVE_RESET' }
  | { type: 'NARRATIVE_UPDATE_TEXT'; payload: string }
  | { type: 'NARRATIVE_SET_TYPING'; payload: boolean }
  | { type: 'NARRATIVE_COMPLETE' }
  
  // Chat Actions
  | { type: 'CHAT_SEND_MESSAGE'; payload: string }
  | { type: 'CHAT_RECEIVE_MESSAGE'; payload: ChatMessage }
  | { type: 'CHAT_SET_LOADING'; payload: boolean }
  | { type: 'CHAT_CLEAR_MESSAGES' }
  | { type: 'CHAT_UPDATE_INPUT'; payload: string }
  
  // Module Actions
  | { type: 'MODULE_LOAD'; payload: { moduleId: string; config?: ModuleConfig } }
  | { type: 'MODULE_UPDATE_CONTEXT'; payload: LessonContext }
  | { type: 'MODULE_SET_QUESTIONS'; payload: ContextualQuestion[] }
  
  // Performance Actions
  | { type: 'PERFORMANCE_TRACK_RENDER' }
  | { type: 'PERFORMANCE_UPDATE_MEMORY'; payload: number };

// ============================================================================
// LESSON INTEGRATION TYPES
// ============================================================================

export interface LessonContext {
  chapterNumber: number;
  lessonTitle: string;
  phase: string;
  content: string;
  chapterTitle?: string;
  objectives?: string[];
  keyTerms?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  
  // Module-specific data
  moduleData?: Record<string, unknown>;
}

export interface LessonProgress {
  completedSteps: string[];
  currentStep?: string;
  engagementLevel: number;
  timeSpent: number;
  lastActivity: number;
}

// ============================================================================
// NARRATIVE SYSTEM TYPES
// ============================================================================

export interface NarrativeMessage {
  id: string;
  content: string;
  emotion?: NarrativeEmotion;
  delay?: number;
  showAvatar?: boolean;
  characterName?: string;
  
  // Animation properties
  animation?: {
    type: 'typewriter' | 'fade' | 'slide';
    duration?: number;
    easing?: string;
  };
  
  // Interaction properties
  interactionPoint?: string;
  autoAdvance?: boolean;
}

export type NarrativeEmotion = 
  | 'neutral' 
  | 'frustrated' 
  | 'excited' 
  | 'worried' 
  | 'hopeful' 
  | 'anxious' 
  | 'disappointed' 
  | 'thoughtful' 
  | 'enlightened'
  | 'amazed'
  | 'concerned'
  | 'reflective'
  | 'regretful'
  | 'curious'
  | 'optimistic'
  | 'determined'
  | 'accomplished'
  | 'overwhelmed'
  | 'proud'
  | 'confident'
  | 'amused'
  | 'inspired'
  | 'grateful'
  | 'motivated'
  | 'empowered'
  | 'ambitious'
  | 'focused'
  | 'strategic'
  | 'creative'
  | 'innovative'
  | 'collaborative'
  | 'compassionate'
  | 'resilient'
  | 'visionary';

export interface NarrativeProgress {
  currentIndex: number;
  totalMessages: number;
  progressPercent: number;
  timeElapsed: number;
  isComplete: boolean;
}

// ============================================================================
// CHAT MESSAGE TYPES
// ============================================================================

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: number;
  characterName?: string;
  
  // Rich content support
  type?: 'text' | 'html' | 'markdown';
  metadata?: {
    lessonContext?: string;
    sourceModule?: string;
    confidence?: number;
  };
  
  // Animation properties
  animateIn?: boolean;
  streamingComplete?: boolean;
}

// ============================================================================
// CONTEXTUAL QUESTIONS TYPES
// ============================================================================

export interface ContextualQuestion {
  id: string;
  text: string;
  icon: LucideIcon;
  category: string;
  priority: 'high' | 'medium' | 'low';
  
  // Conditional display
  conditions?: {
    lessonPhase?: string[];
    completedSteps?: string[];
    engagementLevel?: number;
  };
  
  // Analytics
  analytics?: {
    clickCount: number;
    successRate: number;
    lastUsed: number;
  };
}

// ============================================================================
// UI CONFIGURATION TYPES
// ============================================================================

export type FloatingPosition = 
  | 'bottom-right' 
  | 'bottom-left' 
  | 'top-right' 
  | 'top-left';

export interface UIConfiguration {
  position: FloatingPosition;
  size: {
    collapsed: { width: number; height: number };
    expanded: { width: number; height: number };
  };
  animation: {
    duration: number;
    easing: string;
    stagger?: number;
  };
  theme: {
    colors: Record<string, string>;
    spacing: Record<string, number>;
    borderRadius: number;
  };
}

// ============================================================================
// MODULE SYSTEM TYPES
// ============================================================================

export interface LessonModule {
  id: string;
  name: string;
  version: string;
  
  // Configuration
  config: ModuleConfig;
  
  // Core Methods
  getContextQuestions(context: LessonContext): ContextualQuestion[];
  getNarrativeMessages(phase: string): NarrativeMessage[];
  
  // Lifecycle Hooks
  onLoad?(context: ChatContext): void;
  onChatOpen?(context: ChatContext): void;
  onChatClose?(context: ChatContext): void;
  onMessageSent?(message: string, context: ChatContext): void;
  onNarrativeComplete?(context: ChatContext): void;
  onUnload?(context: ChatContext): void;
  
  // State Management
  getInitialState?(): Record<string, unknown>;
  onStateChange?(state: Record<string, unknown>, context: ChatContext): void;
}

export interface ModuleConfig {
  // Feature flags
  features: {
    narrativeEngine: boolean;
    contextualQuestions: boolean;
    autoAdvance: boolean;
    persistState: boolean;
  };
  
  // UI Configuration
  ui: {
    showAvatar: boolean;
    enableAnimations: boolean;
    customTheme?: Partial<UIConfiguration['theme']>;
  };
  
  // Performance
  performance: {
    maxMessages: number;
    memoryLimit: number;
    renderOptimization: boolean;
  };
}

// ============================================================================
// CONTEXT TYPES
// ============================================================================

export interface ChatContext {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  
  // Module Integration
  currentModule?: LessonModule;
  moduleRegistry: ModuleRegistry;
  
  // Performance Utilities
  performance: {
    trackRender(): void;
    trackMemory(usage: number): void;
    getMetrics(): PerformanceMetrics;
  };
  
  // Storage Utilities
  storage: {
    persist(key: string, data: unknown): void;
    retrieve(key: string): unknown;
    clear(key?: string): void;
  };
}

// ============================================================================
// PERFORMANCE TYPES
// ============================================================================

export interface PerformanceMetrics {
  renderCount: number;
  averageRenderTime: number;
  memoryUsage: number;
  messageCount: number;
  lastUpdate: number;
  
  // Narrative specific
  narrativeMetrics?: {
    typingSpeed: number;
    pauseCount: number;
    stuckDetectionCount: number;
    completionTime: number;
  };
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export interface ChatEvents {
  // UI Events
  onExpand?: () => void;
  onCollapse?: () => void;
  onMinimize?: (minimized: boolean) => void;
  
  // Narrative Events
  onNarrativeStart?: () => void;
  onNarrativePause?: () => void;
  onNarrativeResume?: () => void;
  onNarrativeComplete?: () => void;
  
  // Chat Events
  onMessageSent?: (message: string) => void;
  onMessageReceived?: (message: ChatMessage) => void;
  
  // Engagement Events
  onEngagementChange?: (isEngaged: boolean, exchangeCount: number) => void;
  
  // Performance Events
  onPerformanceIssue?: (issue: string, metrics: PerformanceMetrics) => void;
}

// ============================================================================
// REGISTRY TYPES
// ============================================================================

export interface ModuleRegistry {
  register(module: LessonModule): void;
  unregister(moduleId: string): void;
  get(moduleId: string): LessonModule | undefined;
  getForLesson(context: LessonContext): LessonModule;
  list(): LessonModule[];
  
  // Module loading
  loadModule(moduleId: string, config?: ModuleConfig): Promise<LessonModule>;
  unloadModule(moduleId: string): Promise<void>;
}

// ============================================================================
// ANIMATION TYPES
// ============================================================================

export interface AnimationConfig {
  type: 'spring' | 'tween' | 'keyframes';
  duration?: number;
  delay?: number;
  easing?: string;
  
  // Spring specific
  damping?: number;
  stiffness?: number;
  mass?: number;
  
  // Keyframes specific
  keyframes?: Record<string, unknown>[];
}

// ============================================================================
// ERROR HANDLING TYPES
// ============================================================================

export interface ChatError {
  type: 'NARRATIVE_ERROR' | 'MODULE_ERROR' | 'NETWORK_ERROR' | 'PERFORMANCE_ERROR';
  message: string;
  context?: Record<string, unknown>;
  timestamp: number;
  recoverable: boolean;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: ChatError;
  errorInfo?: React.ErrorInfo;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

// For creating partial updates to chat state
export type ChatStateUpdate<T = Partial<ChatState>> = T;

// For creating type-safe action creators
export type ActionCreator<T extends ChatAction['type']> = 
  Extract<ChatAction, { type: T }> extends { payload: infer P }
    ? (payload: P) => Extract<ChatAction, { type: T }>
    : () => Extract<ChatAction, { type: T }>;

// For module-specific state
export type ModuleState<T = Record<string, unknown>> = T;

// For performance monitoring
export type PerformanceThreshold = {
  renderTime: number;
  memoryUsage: number;
  messageProcessing: number;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default ChatState;