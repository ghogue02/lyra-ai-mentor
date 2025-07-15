-- Create AI Playground Creations table
-- This table stores user-generated content and creations from the AI playground

CREATE TABLE IF NOT EXISTS public.ai_playground_creations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.ai_playground_sessions(id) ON DELETE SET NULL,
    
    -- Creation metadata
    creation_type TEXT NOT NULL CHECK (creation_type IN (
        'prompt',
        'workflow',
        'email',
        'document',
        'presentation',
        'report',
        'analysis',
        'campaign',
        'strategy',
        'automation',
        'template',
        'dataset',
        'visualization',
        'other'
    )),
    
    -- Content details
    title TEXT NOT NULL,
    description TEXT,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Tool/Feature association
    tool_used TEXT,
    features_used TEXT[] DEFAULT '{}',
    
    -- Version control
    version INTEGER DEFAULT 1,
    parent_creation_id UUID REFERENCES public.ai_playground_creations(id),
    is_published BOOLEAN DEFAULT FALSE,
    is_template BOOLEAN DEFAULT FALSE,
    
    -- Quality metrics
    quality_score NUMERIC(3,2) CHECK (quality_score >= 0 AND quality_score <= 1),
    complexity_level TEXT CHECK (complexity_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    
    -- Engagement metrics
    view_count INTEGER DEFAULT 0,
    use_count INTEGER DEFAULT 0,
    fork_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    
    -- User ratings
    avg_rating NUMERIC(3,2) DEFAULT 0 CHECK (avg_rating >= 0 AND avg_rating <= 5),
    rating_count INTEGER DEFAULT 0,
    
    -- Tags and categorization
    tags TEXT[] DEFAULT '{}',
    category TEXT,
    nonprofit_sector TEXT,
    
    -- Sharing settings
    visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'public', 'shared', 'organization')),
    shared_with UUID[] DEFAULT '{}', -- Array of user IDs
    
    -- AI generation details
    ai_model_used TEXT,
    tokens_consumed INTEGER,
    generation_time_ms INTEGER,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ
);

-- Create indexes for performance
CREATE INDEX idx_ai_playground_creations_user_id ON public.ai_playground_creations(user_id);
CREATE INDEX idx_ai_playground_creations_type ON public.ai_playground_creations(creation_type);
CREATE INDEX idx_ai_playground_creations_visibility ON public.ai_playground_creations(visibility);
CREATE INDEX idx_ai_playground_creations_published ON public.ai_playground_creations(is_published) WHERE is_published = TRUE;
CREATE INDEX idx_ai_playground_creations_template ON public.ai_playground_creations(is_template) WHERE is_template = TRUE;
CREATE INDEX idx_ai_playground_creations_tags ON public.ai_playground_creations USING GIN(tags);
CREATE INDEX idx_ai_playground_creations_created_at ON public.ai_playground_creations(created_at DESC);
CREATE INDEX idx_ai_playground_creations_quality ON public.ai_playground_creations(quality_score DESC) WHERE quality_score IS NOT NULL;

-- Add RLS policies
ALTER TABLE public.ai_playground_creations ENABLE ROW LEVEL SECURITY;

-- Users can view their own private creations
CREATE POLICY "Users can view own creations"
    ON public.ai_playground_creations
    FOR SELECT
    USING (
        auth.uid() = user_id 
        OR visibility = 'public'
        OR (visibility = 'shared' AND auth.uid() = ANY(shared_with))
    );

-- Users can insert their own creations
CREATE POLICY "Users can insert own creations"
    ON public.ai_playground_creations
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own creations
CREATE POLICY "Users can update own creations"
    ON public.ai_playground_creations
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own creations
CREATE POLICY "Users can delete own creations"
    ON public.ai_playground_creations
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_ai_playground_creations_updated_at
    BEFORE UPDATE ON public.ai_playground_creations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.ai_playground_creations IS 'Stores user-generated content and creations from the AI playground';
COMMENT ON COLUMN public.ai_playground_creations.creation_type IS 'Type of content created by the user';
COMMENT ON COLUMN public.ai_playground_creations.content IS 'JSON structure containing the actual creation data';
COMMENT ON COLUMN public.ai_playground_creations.quality_score IS 'AI-assessed quality score between 0-1';
COMMENT ON COLUMN public.ai_playground_creations.visibility IS 'Sharing visibility: private, public, shared with specific users, or organization-wide';
COMMENT ON COLUMN public.ai_playground_creations.is_template IS 'Whether this creation can be used as a template by others';