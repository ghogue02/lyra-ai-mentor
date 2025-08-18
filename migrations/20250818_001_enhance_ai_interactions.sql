-- Migration: Enhanced AI Interactions for Chapter 7
-- Date: 2025-08-18
-- Purpose: Add support for progressive AI content revelation, workshop interactions, 
-- and character-specific processing metrics for Chapter 7 enhancements

-- =========================================================================
-- PART 1: AI CONTENT STATE MANAGEMENT
-- =========================================================================

-- Create table for AI content generation states and progressive revelation
CREATE TABLE IF NOT EXISTS public.ai_content_states (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- User and session identification
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id TEXT NOT NULL, -- Groups related AI interactions
  
  -- Content identification
  interactive_element_id INTEGER REFERENCES interactive_elements(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN (
    'performance_framework', 'recruitment_strategy', 'people_analytics', 
    'hr_automation', 'workshop_exercise', 'character_dialogue'
  )),
  
  -- AI generation tracking
  generation_status TEXT DEFAULT 'initiated' CHECK (generation_status IN (
    'initiated', 'processing', 'generated', 'refined', 'completed', 'error'
  )) NOT NULL,
  
  -- Progressive revelation state
  revelation_stage INTEGER DEFAULT 1 NOT NULL CHECK (revelation_stage >= 1),
  total_stages INTEGER DEFAULT 1 NOT NULL CHECK (total_stages >= 1),
  current_content JSONB DEFAULT '{}' NOT NULL,
  
  -- AI processing metadata
  character_persona TEXT CHECK (character_persona IN (
    'carmen', 'maya', 'sofia', 'david', 'rachel', 'alex', 'lyra'
  )),
  processing_metrics JSONB DEFAULT '{}' NOT NULL,
  user_inputs JSONB DEFAULT '{}' NOT NULL,
  refinement_history JSONB DEFAULT '[]' NOT NULL,
  
  -- Quality and validation
  validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN (
    'pending', 'validated', 'needs_review', 'approved', 'rejected'
  )) NOT NULL,
  quality_score DECIMAL(3,2) CHECK (quality_score >= 0 AND quality_score <= 1),
  
  -- Performance tracking
  generation_time_ms INTEGER,
  token_usage JSONB DEFAULT '{}' NOT NULL,
  
  CONSTRAINT ai_content_states_stage_check CHECK (revelation_stage <= total_stages)
);

-- =========================================================================
-- PART 2: INTERACTIVE WORKSHOP PROGRESS
-- =========================================================================

-- Enhanced table for workshop-style interactive progress tracking
CREATE TABLE IF NOT EXISTS public.workshop_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- User and content identification
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ai_content_state_id UUID REFERENCES ai_content_states(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  
  -- Workshop structure
  workshop_phase TEXT NOT NULL CHECK (workshop_phase IN (
    'discovery', 'analysis', 'design', 'implementation', 'refinement', 'completion'
  )),
  interaction_step INTEGER NOT NULL CHECK (interaction_step >= 1),
  step_type TEXT NOT NULL CHECK (step_type IN (
    'input_collection', 'ai_generation', 'user_review', 'refinement_request',
    'validation', 'progress_check', 'completion_confirmation'
  )),
  
  -- Interaction content
  user_input JSONB DEFAULT '{}' NOT NULL,
  ai_response JSONB DEFAULT '{}' NOT NULL,
  interaction_metadata JSONB DEFAULT '{}' NOT NULL,
  
  -- Progress tracking
  is_completed BOOLEAN DEFAULT false NOT NULL,
  completion_score DECIMAL(3,2) CHECK (completion_score >= 0 AND completion_score <= 1),
  time_spent_seconds INTEGER DEFAULT 0,
  
  -- Character-specific metrics
  character_engagement_level TEXT CHECK (character_engagement_level IN (
    'low', 'medium', 'high', 'exceptional'
  )),
  personalization_applied JSONB DEFAULT '{}' NOT NULL,
  
  -- Validation and quality
  validation_required BOOLEAN DEFAULT false NOT NULL,
  validation_completed BOOLEAN DEFAULT false NOT NULL,
  quality_indicators JSONB DEFAULT '{}' NOT NULL
);

-- =========================================================================
-- PART 3: CHARACTER-SPECIFIC AI PROCESSING METRICS
-- =========================================================================

-- Table for tracking character-specific AI processing and personalization
CREATE TABLE IF NOT EXISTS public.character_ai_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- Character and user identification
  character_name TEXT NOT NULL CHECK (character_name IN (
    'carmen', 'maya', 'sofia', 'david', 'rachel', 'alex', 'lyra'
  )),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  
  -- Processing session information
  processing_session_id TEXT NOT NULL,
  content_generation_type TEXT NOT NULL,
  
  -- AI Model and performance metrics
  model_used TEXT NOT NULL,
  processing_time_ms INTEGER NOT NULL,
  token_consumption JSONB DEFAULT '{}' NOT NULL,
  
  -- Character personalization metrics
  persona_adherence_score DECIMAL(3,2) CHECK (persona_adherence_score >= 0 AND persona_adherence_score <= 1),
  context_relevance_score DECIMAL(3,2) CHECK (context_relevance_score >= 0 AND context_relevance_score <= 1),
  user_alignment_score DECIMAL(3,2) CHECK (user_alignment_score >= 0 AND user_alignment_score <= 1),
  
  -- Content quality indicators
  content_coherence DECIMAL(3,2) CHECK (content_coherence >= 0 AND content_coherence <= 1),
  practical_applicability DECIMAL(3,2) CHECK (practical_applicability >= 0 AND practical_applicability <= 1),
  innovation_factor DECIMAL(3,2) CHECK (innovation_factor >= 0 AND innovation_factor <= 1),
  
  -- User engagement metrics
  user_satisfaction_rating INTEGER CHECK (user_satisfaction_rating >= 1 AND user_satisfaction_rating <= 5),
  refinement_requests_count INTEGER DEFAULT 0,
  completion_rate DECIMAL(3,2) CHECK (completion_rate >= 0 AND completion_rate <= 1),
  
  -- Adaptive learning data
  learning_insights JSONB DEFAULT '{}' NOT NULL,
  personalization_adjustments JSONB DEFAULT '{}' NOT NULL,
  success_patterns JSONB DEFAULT '{}' NOT NULL
);

-- =========================================================================
-- PART 4: ENHANCED USER INPUT COLLECTION
-- =========================================================================

-- Extend user_interactions table with AI-specific capabilities
-- (Adding new columns to existing table)

-- Add AI-enhancement columns to user_interactions
ALTER TABLE public.user_interactions 
ADD COLUMN IF NOT EXISTS ai_content_state_id UUID REFERENCES ai_content_states(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS workshop_phase TEXT CHECK (workshop_phase IN (
  'discovery', 'analysis', 'design', 'implementation', 'refinement', 'completion'
)),
ADD COLUMN IF NOT EXISTS refinement_iteration INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN (
  'pending', 'validated', 'needs_review', 'approved', 'rejected'
)),
ADD COLUMN IF NOT EXISTS quality_metrics JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS processing_context JSONB DEFAULT '{}';

-- =========================================================================
-- PART 5: ENHANCED PROGRESS TRACKING
-- =========================================================================

-- Add Chapter 7 specific columns to lesson_progress
ALTER TABLE public.lesson_progress
ADD COLUMN IF NOT EXISTS ai_interactions_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS workshop_phases_completed JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS character_engagement_scores JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS personalized_content_generated INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS refinement_cycles_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS validation_passes INTEGER DEFAULT 0;

-- =========================================================================
-- PART 6: PERFORMANCE INDEXES
-- =========================================================================

-- Indexes for ai_content_states
CREATE INDEX IF NOT EXISTS idx_ai_content_states_user_id ON public.ai_content_states(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_content_states_session_id ON public.ai_content_states(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_content_states_lesson_id ON public.ai_content_states(lesson_id);
CREATE INDEX IF NOT EXISTS idx_ai_content_states_status ON public.ai_content_states(generation_status);
CREATE INDEX IF NOT EXISTS idx_ai_content_states_character ON public.ai_content_states(character_persona);
CREATE INDEX IF NOT EXISTS idx_ai_content_states_content_type ON public.ai_content_states(content_type);
CREATE INDEX IF NOT EXISTS idx_ai_content_states_created_at ON public.ai_content_states(created_at DESC);

-- Indexes for workshop_interactions
CREATE INDEX IF NOT EXISTS idx_workshop_interactions_user_id ON public.workshop_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_workshop_interactions_lesson_id ON public.workshop_interactions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_workshop_interactions_phase ON public.workshop_interactions(workshop_phase);
CREATE INDEX IF NOT EXISTS idx_workshop_interactions_ai_content_state ON public.workshop_interactions(ai_content_state_id);
CREATE INDEX IF NOT EXISTS idx_workshop_interactions_completed ON public.workshop_interactions(is_completed);
CREATE INDEX IF NOT EXISTS idx_workshop_interactions_created_at ON public.workshop_interactions(created_at DESC);

-- Indexes for character_ai_metrics
CREATE INDEX IF NOT EXISTS idx_character_ai_metrics_character ON public.character_ai_metrics(character_name);
CREATE INDEX IF NOT EXISTS idx_character_ai_metrics_user_id ON public.character_ai_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_character_ai_metrics_lesson_id ON public.character_ai_metrics(lesson_id);
CREATE INDEX IF NOT EXISTS idx_character_ai_metrics_session ON public.character_ai_metrics(processing_session_id);
CREATE INDEX IF NOT EXISTS idx_character_ai_metrics_created_at ON public.character_ai_metrics(created_at DESC);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_ai_content_user_lesson_status ON public.ai_content_states(user_id, lesson_id, generation_status);
CREATE INDEX IF NOT EXISTS idx_workshop_user_lesson_phase ON public.workshop_interactions(user_id, lesson_id, workshop_phase);
CREATE INDEX IF NOT EXISTS idx_character_metrics_char_user_lesson ON public.character_ai_metrics(character_name, user_id, lesson_id);

-- =========================================================================
-- PART 7: ROW LEVEL SECURITY (RLS)
-- =========================================================================

-- Enable RLS on new tables
ALTER TABLE public.ai_content_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_ai_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_content_states
CREATE POLICY "Users can view their own AI content states" ON public.ai_content_states
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI content states" ON public.ai_content_states
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI content states" ON public.ai_content_states
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all AI content states" ON public.ai_content_states
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for workshop_interactions
CREATE POLICY "Users can view their own workshop interactions" ON public.workshop_interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workshop interactions" ON public.workshop_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workshop interactions" ON public.workshop_interactions
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all workshop interactions" ON public.workshop_interactions
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for character_ai_metrics
CREATE POLICY "Users can view their own character AI metrics" ON public.character_ai_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own character AI metrics" ON public.character_ai_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all character AI metrics" ON public.character_ai_metrics
  FOR ALL USING (auth.role() = 'service_role');

-- =========================================================================
-- PART 8: TRIGGERS FOR UPDATED_AT
-- =========================================================================

-- Create or update the trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for new tables
CREATE TRIGGER set_updated_at_ai_content_states
  BEFORE UPDATE ON public.ai_content_states
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_workshop_interactions
  BEFORE UPDATE ON public.workshop_interactions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_character_ai_metrics
  BEFORE UPDATE ON public.character_ai_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- PART 9: HELPFUL VIEWS FOR ANALYTICS
-- =========================================================================

-- View for AI content generation analytics
CREATE OR REPLACE VIEW public.ai_content_analytics AS
SELECT 
  character_persona,
  content_type,
  generation_status,
  DATE_TRUNC('day', created_at) as generation_date,
  COUNT(*) as total_generations,
  AVG(generation_time_ms) as avg_generation_time,
  AVG(quality_score) as avg_quality_score,
  COUNT(DISTINCT user_id) as unique_users,
  SUM(CASE WHEN generation_status = 'completed' THEN 1 ELSE 0 END) as successful_generations,
  ROUND(
    (SUM(CASE WHEN generation_status = 'completed' THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100, 2
  ) as success_rate_percent
FROM public.ai_content_states
WHERE character_persona IS NOT NULL
GROUP BY character_persona, content_type, generation_status, DATE_TRUNC('day', created_at)
ORDER BY generation_date DESC, character_persona, content_type;

-- View for workshop progress analytics
CREATE OR REPLACE VIEW public.workshop_progress_analytics AS
SELECT 
  lesson_id,
  workshop_phase,
  step_type,
  COUNT(*) as total_interactions,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(time_spent_seconds) as avg_time_spent,
  AVG(completion_score) as avg_completion_score,
  SUM(CASE WHEN is_completed = true THEN 1 ELSE 0 END) as completed_interactions,
  ROUND(
    (SUM(CASE WHEN is_completed = true THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100, 2
  ) as completion_rate_percent
FROM public.workshop_interactions
GROUP BY lesson_id, workshop_phase, step_type
ORDER BY lesson_id, workshop_phase, step_type;

-- View for character performance metrics
CREATE OR REPLACE VIEW public.character_performance_summary AS
SELECT 
  character_name,
  COUNT(*) as total_interactions,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(persona_adherence_score) as avg_persona_adherence,
  AVG(context_relevance_score) as avg_context_relevance,
  AVG(user_alignment_score) as avg_user_alignment,
  AVG(content_coherence) as avg_content_coherence,
  AVG(practical_applicability) as avg_practical_applicability,
  AVG(user_satisfaction_rating) as avg_user_satisfaction,
  AVG(completion_rate) as avg_completion_rate,
  AVG(refinement_requests_count) as avg_refinement_requests
FROM public.character_ai_metrics
WHERE user_satisfaction_rating IS NOT NULL
GROUP BY character_name
ORDER BY avg_user_satisfaction DESC, character_name;

-- =========================================================================
-- PART 10: COMMENTS AND DOCUMENTATION
-- =========================================================================

-- Table comments
COMMENT ON TABLE public.ai_content_states IS 'Tracks AI content generation states and progressive revelation for Chapter 7 enhanced interactions';
COMMENT ON TABLE public.workshop_interactions IS 'Detailed tracking of workshop-style interactive learning sessions with AI characters';
COMMENT ON TABLE public.character_ai_metrics IS 'Performance metrics and analytics for character-specific AI processing and personalization';

-- Key column comments
COMMENT ON COLUMN public.ai_content_states.revelation_stage IS 'Current stage in progressive content revelation (1 to total_stages)';
COMMENT ON COLUMN public.ai_content_states.refinement_history IS 'Array of user refinement requests and AI responses';
COMMENT ON COLUMN public.workshop_interactions.workshop_phase IS 'Current phase of workshop-style learning experience';
COMMENT ON COLUMN public.character_ai_metrics.persona_adherence_score IS 'How well AI output matches character persona (0-1 scale)';
COMMENT ON COLUMN public.character_ai_metrics.learning_insights IS 'Adaptive learning data for improving character interactions';

-- Grant permissions
GRANT ALL ON public.ai_content_states TO service_role;
GRANT ALL ON public.workshop_interactions TO service_role;
GRANT ALL ON public.character_ai_metrics TO service_role;

GRANT SELECT, INSERT, UPDATE ON public.ai_content_states TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.workshop_interactions TO authenticated;
GRANT SELECT, INSERT ON public.character_ai_metrics TO authenticated;

-- Grant view access
GRANT SELECT ON public.ai_content_analytics TO service_role;
GRANT SELECT ON public.workshop_progress_analytics TO service_role;
GRANT SELECT ON public.character_performance_summary TO service_role;