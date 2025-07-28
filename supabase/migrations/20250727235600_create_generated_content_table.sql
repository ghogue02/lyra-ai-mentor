-- Create the generated_content table for storing AI-generated content
-- This table is required by the generate-character-content Edge Function

CREATE TABLE IF NOT EXISTS public.generated_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- User information (nullable for anonymous usage)
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT NULL,
  
  -- Content identification
  character_type TEXT NOT NULL CHECK (character_type IN ('maya', 'sofia', 'david', 'rachel', 'alex', 'lyra')),
  content_type TEXT NOT NULL CHECK (content_type IN ('email', 'lesson', 'article', 'social_post', 'newsletter', 'blog_post')),
  
  -- Content data
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  
  -- Metadata as JSONB for flexibility
  metadata JSONB DEFAULT '{}' NOT NULL,
  
  -- Approval workflow
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'draft')) NOT NULL,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX idx_generated_content_character_type ON public.generated_content(character_type);
CREATE INDEX idx_generated_content_content_type ON public.generated_content(content_type);
CREATE INDEX idx_generated_content_approval_status ON public.generated_content(approval_status);
CREATE INDEX idx_generated_content_user_id ON public.generated_content(user_id);
CREATE INDEX idx_generated_content_created_at ON public.generated_content(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_generated_content_updated_at
    BEFORE UPDATE ON public.generated_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Policy 1: Service role can do everything (for Edge Functions)
CREATE POLICY "Service role can manage all generated content" 
ON public.generated_content 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Policy 2: Users can view their own content
CREATE POLICY "Users can view their own generated content" 
ON public.generated_content 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Policy 3: Users can insert their own content
CREATE POLICY "Users can insert their own generated content" 
ON public.generated_content 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Policy 4: Users can update their own content
CREATE POLICY "Users can update their own generated content" 
ON public.generated_content 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Policy 5: Allow anonymous access for testing (can be removed later)
CREATE POLICY "Allow anonymous access for testing" 
ON public.generated_content 
FOR ALL 
TO anon 
USING (user_id IS NULL) 
WITH CHECK (user_id IS NULL);

-- Grant necessary permissions
GRANT ALL ON public.generated_content TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.generated_content TO authenticated;
GRANT SELECT, INSERT ON public.generated_content TO anon;

-- Comment on table and important columns
COMMENT ON TABLE public.generated_content IS 'Stores AI-generated content from character-based Edge Functions';
COMMENT ON COLUMN public.generated_content.metadata IS 'JSONB field for storing flexible metadata like topic, targetAudience, mayaPatterns, character details';
COMMENT ON COLUMN public.generated_content.character_type IS 'The AI character that generated the content (maya, sofia, david, rachel, alex, lyra)';
COMMENT ON COLUMN public.generated_content.content_type IS 'Type of content generated (email, lesson, article, social_post, newsletter, blog_post)';
COMMENT ON COLUMN public.generated_content.approval_status IS 'Workflow status for content approval (pending, approved, rejected, draft)';