// Core chat types for OpenRouter integration and data collection
export interface ChatMessage {
  id: string;
  content: string;
  role: 'system' | 'user' | 'assistant';
  timestamp: Date;
  conversationId: string;
  userId: string;
  metadata?: ChatMessageMetadata;
}

export interface ChatMessageMetadata {
  characterType?: string;
  lessonId?: number;
  chapterId?: number;
  messageOrder?: number;
  tokenCount?: number;
  processingTime?: number;
  model?: string;
  temperature?: number;
  contextLength?: number;
  error?: string;
  retryCount?: number;
}

export interface ChatConversation {
  id: string;
  userId: string;
  lessonId: number;
  chapterId: number;
  title?: string;
  characterType: string;
  lessonContext?: LessonContext;
  startedAt: Date;
  lastMessageAt: Date;
  messageCount: number;
  totalTokens?: number;
  avgResponseTime?: number;
  metadata?: ConversationMetadata;
}

export interface ConversationMetadata {
  topics?: string[];
  userIntent?: string[];
  satisfactionRating?: number;
  engagementLevel?: 'low' | 'medium' | 'high';
  completionStatus?: 'active' | 'completed' | 'abandoned';
  learningObjectives?: string[];
  keyInsights?: string[];
  followUpActions?: string[];
}

export interface LessonContext {
  chapterTitle?: string;
  lessonTitle?: string;
  content?: string;
  objectives?: string[];
  keyTerms?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration?: number;
  prerequisites?: string[];
  relatedLessons?: number[];
}

export interface ChatStreamChunk {
  id: string;
  content: string;
  role: 'assistant';
  delta?: string;
  finished?: boolean;
  metadata?: {
    model?: string;
    tokens?: number;
    processingTime?: number;
  };
}

export interface ChatResponse {
  success: boolean;
  message?: ChatMessage;
  error?: string;
  metadata?: {
    totalTokens?: number;
    processingTime?: number;
    model?: string;
    retryCount?: number;
  };
}

export interface StreamingChatResponse {
  success: boolean;
  stream?: ReadableStream<ChatStreamChunk>;
  conversationId?: string;
  error?: string;
}

export interface ChatAnalytics {
  conversationId: string;
  userId: string;
  totalMessages: number;
  totalTokens: number;
  avgResponseTime: number;
  characterTypes: string[];
  topics: string[];
  sentimentAnalysis?: {
    positive: number;
    negative: number;
    neutral: number;
  };
  engagementMetrics: {
    sessionDuration: number;
    messageFrequency: number;
    userInitiatedMessages: number;
    followUpQuestions: number;
  };
  learningProgress?: {
    conceptsDiscussed: string[];
    questionsAnswered: number;
    clarificationsRequested: number;
    practicalApplications: number;
  };
}

export interface UserChatProfile {
  userId: string;
  totalConversations: number;
  totalMessages: number;
  totalTokens: number;
  preferredCharacters: string[];
  commonTopics: string[];
  avgSessionDuration: number;
  engagementLevel: 'low' | 'medium' | 'high';
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  lastActiveAt: Date;
  streakDays: number;
  achievements: string[];
}

export interface ChatServiceConfig {
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
  timeout?: number;
  retryAttempts?: number;
  streamingEnabled?: boolean;
  analyticsEnabled?: boolean;
  cacheEnabled?: boolean;
  rateLimitConfig?: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
}

export interface ChatError {
  code: string;
  message: string;
  details?: any;
  retryable?: boolean;
  timestamp: Date;
}

// Character-specific configurations
export interface CharacterConfig {
  name: string;
  model: string;
  personality: string;
  tone: string;
  expertise: string[];
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  responseStyle: 'conversational' | 'educational' | 'analytical' | 'supportive';
}

// OpenRouter API types
export interface OpenRouterRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenRouterStreamResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason?: string;
  }>;
}