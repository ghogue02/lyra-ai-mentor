export interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  lessonContext?: {
    chapterTitle?: string;
    lessonTitle?: string;
    content?: string;
  };
  conversationId?: string;
  userId?: string;
  lessonId?: number;
  isDummyDataRequest?: boolean;
  isDataInsights?: boolean;
  useCleanFormatting?: boolean;
}

export interface StreamChunk {
  content?: string;
}