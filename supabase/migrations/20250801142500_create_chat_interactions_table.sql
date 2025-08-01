-- Create chat_interactions table for storing Lyra chat data
CREATE TABLE IF NOT EXISTS public.chat_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- User identification
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Chat metadata
  character_type TEXT NOT NULL CHECK (character_type IN ('lyra', 'maya', 'sofia', 'david', 'rachel', 'alex')),
  conversation_id TEXT,
  session_id TEXT,
  
  -- Message content
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  
  -- Context information
  context JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  
  -- Performance tracking
  response_time_ms INTEGER,
  model_used TEXT,
  
  -- Engagement metrics
  message_length INTEGER GENERATED ALWAYS AS (LENGTH(user_message)) STORED,
  response_length INTEGER GENERATED ALWAYS AS (LENGTH(ai_response)) STORED,
  
  -- Indexing for performance
  CONSTRAINT chat_interactions_character_type_check CHECK (character_type IS NOT NULL),
  CONSTRAINT chat_interactions_user_message_check CHECK (LENGTH(user_message) > 0),
  CONSTRAINT chat_interactions_ai_response_check CHECK (LENGTH(ai_response) > 0)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_interactions_user_id ON public.chat_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_interactions_character_type ON public.chat_interactions(character_type);
CREATE INDEX IF NOT EXISTS idx_chat_interactions_created_at ON public.chat_interactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_interactions_conversation_id ON public.chat_interactions(conversation_id) WHERE conversation_id IS NOT NULL;

-- Create composite index for common queries
CREATE INDEX IF NOT EXISTS idx_chat_interactions_user_character_date ON public.chat_interactions(user_id, character_type, created_at DESC);

-- Add RLS (Row Level Security)
ALTER TABLE public.chat_interactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own chat interactions" ON public.chat_interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat interactions" ON public.chat_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow service role to manage all records (for Edge Functions)
CREATE POLICY "Service role can manage all chat interactions" ON public.chat_interactions
  FOR ALL USING (auth.role() = 'service_role');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.chat_interactions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add helpful comments
COMMENT ON TABLE public.chat_interactions IS 'Stores chat interactions between users and AI characters like Lyra';
COMMENT ON COLUMN public.chat_interactions.character_type IS 'Which AI character the user was chatting with (lyra, maya, etc.)';
COMMENT ON COLUMN public.chat_interactions.context IS 'JSONB field storing lesson context, chapter info, user goals, etc.';
COMMENT ON COLUMN public.chat_interactions.metadata IS 'JSONB field for model info, performance metrics, and other technical data';
COMMENT ON COLUMN public.chat_interactions.conversation_id IS 'Groups related messages in the same conversation session';

-- Create a view for analytics
CREATE OR REPLACE VIEW public.chat_analytics AS
SELECT 
  character_type,
  DATE_TRUNC('day', created_at) as chat_date,
  COUNT(*) as total_interactions,
  AVG(message_length) as avg_user_message_length,
  AVG(response_length) as avg_ai_response_length,
  AVG(response_time_ms) as avg_response_time,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT conversation_id) as unique_conversations
FROM public.chat_interactions
GROUP BY character_type, DATE_TRUNC('day', created_at)
ORDER BY chat_date DESC, character_type;