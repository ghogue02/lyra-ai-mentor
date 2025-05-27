
export interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  lessonContext?: any;
  conversationId?: string;
  userId: string;
  lessonId?: number;
  isDummyDataRequest?: boolean;
  demoStage?: string;
}

export interface UserProfile {
  user_id: string;
  first_name?: string;
  role?: string;
  tech_comfort?: string;
  ai_experience?: string;
  profile_completed?: boolean;
}

export interface StreamChunk {
  content?: string;
}
