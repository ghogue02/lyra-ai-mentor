-- Create AI Playground Interactions table
-- This table records individual user interactions with AI tools and features

CREATE TABLE IF NOT EXISTS public.ai_playground_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.ai_playground_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Interaction details
    interaction_type TEXT NOT NULL CHECK (interaction_type IN (
        'prompt_submit',
        'tool_use',
        'response_generate',
        'response_edit',
        'workflow_create',
        'workflow_edit',
        'workflow_execute',
        'impact_calculate',
        'feature_explore',
        'tutorial_step',
        'challenge_attempt',
        'challenge_complete',
        'help_request',
        'feedback_submit',
        'share_creation',
        'save_creation',
        'export_creation'
    )),
    
    -- Tool/Feature specific data
    tool_name TEXT,
    feature_name TEXT,
    action_name TEXT,
    
    -- Interaction data
    input_data JSONB DEFAULT '{}'::jsonb,
    output_data JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Performance metrics
    response_time_ms INTEGER,
    tokens_used INTEGER,
    error_occurred BOOLEAN DEFAULT FALSE,
    error_message TEXT,
    
    -- User feedback
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    user_feedback TEXT,
    
    -- Success tracking
    completed BOOLEAN DEFAULT TRUE,
    success_score NUMERIC(3,2) CHECK (success_score >= 0 AND success_score <= 1),
    
    -- Context
    previous_interaction_id UUID REFERENCES public.ai_playground_interactions(id),
    interaction_sequence INTEGER DEFAULT 1,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_ai_playground_interactions_session_id ON public.ai_playground_interactions(session_id);
CREATE INDEX idx_ai_playground_interactions_user_id ON public.ai_playground_interactions(user_id);
CREATE INDEX idx_ai_playground_interactions_type ON public.ai_playground_interactions(interaction_type);
CREATE INDEX idx_ai_playground_interactions_tool ON public.ai_playground_interactions(tool_name) WHERE tool_name IS NOT NULL;
CREATE INDEX idx_ai_playground_interactions_created_at ON public.ai_playground_interactions(created_at DESC);
CREATE INDEX idx_ai_playground_interactions_sequence ON public.ai_playground_interactions(session_id, interaction_sequence);

-- Add RLS policies
ALTER TABLE public.ai_playground_interactions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own interactions
CREATE POLICY "Users can view own playground interactions"
    ON public.ai_playground_interactions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own interactions
CREATE POLICY "Users can insert own playground interactions"
    ON public.ai_playground_interactions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own interactions
CREATE POLICY "Users can update own playground interactions"
    ON public.ai_playground_interactions
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_ai_playground_interactions_updated_at
    BEFORE UPDATE ON public.ai_playground_interactions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.ai_playground_interactions IS 'Records individual user interactions with AI playground tools and features';
COMMENT ON COLUMN public.ai_playground_interactions.interaction_type IS 'Type of interaction performed by the user';
COMMENT ON COLUMN public.ai_playground_interactions.tool_name IS 'Specific AI tool used in the interaction';
COMMENT ON COLUMN public.ai_playground_interactions.response_time_ms IS 'Time taken to process the interaction in milliseconds';
COMMENT ON COLUMN public.ai_playground_interactions.success_score IS 'Score between 0-1 indicating interaction success';
COMMENT ON COLUMN public.ai_playground_interactions.interaction_sequence IS 'Order of interaction within the session';