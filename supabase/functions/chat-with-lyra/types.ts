
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
  isDataInsights?: boolean;
  useCleanFormatting?: boolean;
}

export interface UserProfile {
  user_id: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  tech_comfort?: string;
  ai_experience?: string;
  learning_style?: string;
  organization_name?: string;
  organization_type?: string;
  organization_size?: string;
  job_title?: string;
  years_experience?: string;
  location?: string;
  profile_completed?: boolean;
}

export interface StreamChunk {
  content?: string;
}
