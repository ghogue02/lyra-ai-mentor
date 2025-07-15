-- Create user_progress table for tracking learning progress
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES public.lessons(id) ON DELETE CASCADE,
    chapter_id INTEGER REFERENCES public.chapters(id) ON DELETE CASCADE,
    element_id INTEGER REFERENCES public.interactive_elements(id) ON DELETE CASCADE,
    
    -- Progress tracking
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Status and metrics
    status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped')) DEFAULT 'not_started',
    progress_percentage DECIMAL(5,2) DEFAULT 0.0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    time_spent_seconds INTEGER DEFAULT 0,
    
    -- Specific progress data
    current_step INTEGER DEFAULT 1,
    total_steps INTEGER DEFAULT 1,
    data JSONB DEFAULT '{}',
    
    -- Performance tracking
    confidence_score INTEGER CHECK (confidence_score >= 1 AND confidence_score <= 10),
    difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
    completion_quality DECIMAL(3,2) CHECK (completion_quality >= 0 AND completion_quality <= 1),
    
    -- Maya-specific tracking
    email_efficiency_before INTEGER, -- minutes before AI
    email_efficiency_after INTEGER,  -- minutes after AI
    stress_level_before INTEGER CHECK (stress_level_before >= 1 AND stress_level_before <= 10),
    stress_level_after INTEGER CHECK (stress_level_after >= 1 AND stress_level_after <= 10),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON public.user_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_chapter_id ON public.user_progress(chapter_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_element_id ON public.user_progress(element_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON public.user_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_progress_last_accessed ON public.user_progress(last_accessed_at);

-- Unique constraint to prevent duplicate progress entries
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_progress_unique 
ON public.user_progress(user_id, COALESCE(lesson_id, 0), COALESCE(chapter_id, 0), COALESCE(element_id, 0));

-- Enable RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own progress" ON public.user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" ON public.user_progress
    FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_progress_updated_at 
    BEFORE UPDATE ON public.user_progress 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Helper function to upsert user progress
CREATE OR REPLACE FUNCTION upsert_user_progress(
    p_user_id UUID,
    p_lesson_id INTEGER DEFAULT NULL,
    p_chapter_id INTEGER DEFAULT NULL,
    p_element_id INTEGER DEFAULT NULL,
    p_status TEXT DEFAULT NULL,
    p_progress_percentage DECIMAL DEFAULT NULL,
    p_time_spent_seconds INTEGER DEFAULT NULL,
    p_current_step INTEGER DEFAULT NULL,
    p_total_steps INTEGER DEFAULT NULL,
    p_data JSONB DEFAULT NULL,
    p_confidence_score INTEGER DEFAULT NULL,
    p_difficulty_rating INTEGER DEFAULT NULL,
    p_completion_quality DECIMAL DEFAULT NULL
)
RETURNS public.user_progress AS $$
DECLARE
    result public.user_progress;
BEGIN
    INSERT INTO public.user_progress (
        user_id, lesson_id, chapter_id, element_id, status, 
        progress_percentage, time_spent_seconds, current_step, total_steps,
        data, confidence_score, difficulty_rating, completion_quality,
        last_accessed_at
    ) VALUES (
        p_user_id, p_lesson_id, p_chapter_id, p_element_id, 
        COALESCE(p_status, 'in_progress'),
        COALESCE(p_progress_percentage, 0.0),
        COALESCE(p_time_spent_seconds, 0),
        COALESCE(p_current_step, 1),
        COALESCE(p_total_steps, 1),
        COALESCE(p_data, '{}'),
        p_confidence_score,
        p_difficulty_rating, 
        p_completion_quality,
        NOW()
    )
    ON CONFLICT (user_id, COALESCE(lesson_id, 0), COALESCE(chapter_id, 0), COALESCE(element_id, 0))
    DO UPDATE SET
        status = CASE WHEN p_status IS NOT NULL THEN p_status ELSE user_progress.status END,
        progress_percentage = CASE WHEN p_progress_percentage IS NOT NULL THEN p_progress_percentage ELSE user_progress.progress_percentage END,
        time_spent_seconds = CASE WHEN p_time_spent_seconds IS NOT NULL THEN user_progress.time_spent_seconds + p_time_spent_seconds ELSE user_progress.time_spent_seconds END,
        current_step = CASE WHEN p_current_step IS NOT NULL THEN p_current_step ELSE user_progress.current_step END,
        total_steps = CASE WHEN p_total_steps IS NOT NULL THEN p_total_steps ELSE user_progress.total_steps END,
        data = CASE WHEN p_data IS NOT NULL THEN user_progress.data || p_data ELSE user_progress.data END,
        confidence_score = CASE WHEN p_confidence_score IS NOT NULL THEN p_confidence_score ELSE user_progress.confidence_score END,
        difficulty_rating = CASE WHEN p_difficulty_rating IS NOT NULL THEN p_difficulty_rating ELSE user_progress.difficulty_rating END,
        completion_quality = CASE WHEN p_completion_quality IS NOT NULL THEN p_completion_quality ELSE user_progress.completion_quality END,
        last_accessed_at = NOW(),
        completed_at = CASE WHEN p_status = 'completed' AND user_progress.completed_at IS NULL THEN NOW() ELSE user_progress.completed_at END
    RETURNING * INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant usage to authenticated users
GRANT EXECUTE ON FUNCTION upsert_user_progress TO authenticated;