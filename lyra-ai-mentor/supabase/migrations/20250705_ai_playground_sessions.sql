-- Create AI Playground Sessions table
-- This table tracks user sessions within the AI playground, including activities and time spent

CREATE TABLE IF NOT EXISTS public.ai_playground_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Session metadata
    session_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    session_end TIMESTAMPTZ,
    duration_seconds INTEGER GENERATED ALWAYS AS (
        EXTRACT(EPOCH FROM (COALESCE(session_end, NOW()) - session_start))::INTEGER
    ) STORED,
    
    -- Activity tracking
    activity_type TEXT NOT NULL CHECK (activity_type IN (
        'prompt_building',
        'ai_simulation',
        'response_analysis',
        'workflow_design',
        'impact_calculation',
        'exploration',
        'tutorial',
        'challenge'
    )),
    
    -- Session context
    entry_point TEXT, -- Where user entered playground from
    exit_point TEXT,  -- Where user exited to
    browser_info JSONB DEFAULT '{}'::jsonb,
    device_type TEXT CHECK (device_type IN ('desktop', 'tablet', 'mobile')),
    
    -- Engagement metrics
    total_interactions INTEGER DEFAULT 0,
    tools_used TEXT[] DEFAULT '{}',
    features_explored TEXT[] DEFAULT '{}',
    
    -- Performance tracking
    avg_response_time_ms INTEGER,
    error_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_ai_playground_sessions_user_id ON public.ai_playground_sessions(user_id);
CREATE INDEX idx_ai_playground_sessions_session_start ON public.ai_playground_sessions(session_start DESC);
CREATE INDEX idx_ai_playground_sessions_activity_type ON public.ai_playground_sessions(activity_type);
CREATE INDEX idx_ai_playground_sessions_duration ON public.ai_playground_sessions(duration_seconds);

-- Add RLS policies
ALTER TABLE public.ai_playground_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own sessions
CREATE POLICY "Users can view own playground sessions"
    ON public.ai_playground_sessions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own sessions
CREATE POLICY "Users can insert own playground sessions"
    ON public.ai_playground_sessions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own sessions
CREATE POLICY "Users can update own playground sessions"
    ON public.ai_playground_sessions
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_ai_playground_sessions_updated_at
    BEFORE UPDATE ON public.ai_playground_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.ai_playground_sessions IS 'Tracks user sessions in the AI playground including duration, activities, and engagement metrics';
COMMENT ON COLUMN public.ai_playground_sessions.activity_type IS 'Type of activity performed during the session';
COMMENT ON COLUMN public.ai_playground_sessions.duration_seconds IS 'Calculated duration of the session in seconds';
COMMENT ON COLUMN public.ai_playground_sessions.tools_used IS 'Array of AI tools used during the session';
COMMENT ON COLUMN public.ai_playground_sessions.features_explored IS 'Array of features explored during the session';