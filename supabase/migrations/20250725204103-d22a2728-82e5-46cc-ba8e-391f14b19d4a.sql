-- Create journey definitions table for scalable content management
CREATE TABLE public.journey_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  character_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'communication',
  total_phases INTEGER NOT NULL DEFAULT 1,
  estimated_duration INTEGER, -- in minutes
  difficulty_level TEXT NOT NULL DEFAULT 'beginner',
  scoring_enabled BOOLEAN NOT NULL DEFAULT false,
  scoring_criteria JSONB,
  badge_requirements JSONB,
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user journey progress table for real-time tracking
CREATE TABLE public.user_journey_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  journey_id UUID NOT NULL REFERENCES public.journey_definitions(id),
  journey_key TEXT NOT NULL,
  current_phase INTEGER NOT NULL DEFAULT 1,
  total_phases INTEGER NOT NULL DEFAULT 1,
  phase_data JSONB DEFAULT '{}',
  overall_score NUMERIC,
  phase_scores JSONB DEFAULT '{}',
  completion_data JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, journey_key)
);

-- Enable RLS on journey tables
ALTER TABLE public.journey_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_journey_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for journey_definitions
CREATE POLICY "Journey definitions are publicly readable" 
ON public.journey_definitions 
FOR SELECT 
USING (is_active = true);

-- RLS policies for user_journey_progress
CREATE POLICY "Users can view their own journey progress" 
ON public.user_journey_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journey progress" 
ON public.user_journey_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journey progress" 
ON public.user_journey_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Insert PACE and Tone Mastery journey definitions
INSERT INTO public.journey_definitions (journey_key, name, description, character_name, category, total_phases, estimated_duration, difficulty_level, scoring_enabled, scoring_criteria, badge_requirements) VALUES
('maya-pace-framework', 'PACE Framework Mastery', 'Learn to structure perfect prompts using Maya''s PACE framework', 'Maya', 'communication', 4, 20, 'beginner', true, 
  '{"criteria": ["clarity", "specificity", "completeness", "actionability"], "weights": {"clarity": 0.25, "specificity": 0.25, "completeness": 0.25, "actionability": 0.25}, "max_score": 100}',
  '{"pace_pioneer": {"requirement": "completion", "score_threshold": null}, "pace_master": {"requirement": "score", "score_threshold": 85}, "pace_perfectionist": {"requirement": "score", "score_threshold": 95}}'
),
('maya-tone-mastery', 'Tone Adaptation Mastery', 'Master adapting communication tone for different audiences with Maya', 'Maya', 'communication', 3, 15, 'intermediate', true,
  '{"criteria": ["audience_understanding", "tone_appropriateness", "message_clarity", "engagement"], "weights": {"audience_understanding": 0.3, "tone_appropriateness": 0.3, "message_clarity": 0.2, "engagement": 0.2}, "max_score": 100}',
  '{"tone_apprentice": {"requirement": "completion", "score_threshold": null}, "multi_tone_master": {"requirement": "avg_score", "score_threshold": 80}, "communication_chameleon": {"requirement": "min_score_all", "score_threshold": 90}}'
);

-- Add new achievement badges for journeys
INSERT INTO public.toolkit_achievements (achievement_key, name, description, icon, color, criteria_type, criteria_value, criteria_metadata, achievement_tier, order_index) VALUES
-- PACE Framework badges
('pace_pioneer', 'PACE Pioneer', 'Complete your first PACE framework', '🚀', '#3B82F6', 'journey_completion', 1, '{"journey_key": "maya-pace-framework"}', 'bronze', 100),
('pace_master', 'PACE Master', 'Complete PACE framework with score above 85%', '🎯', '#10B981', 'journey_score', 85, '{"journey_key": "maya-pace-framework"}', 'silver', 101),
('pace_perfectionist', 'PACE Perfectionist', 'Complete PACE framework with score above 95%', '👑', '#F59E0B', 'journey_score', 95, '{"journey_key": "maya-pace-framework"}', 'gold', 102),

-- Tone Mastery badges
('tone_apprentice', 'Tone Apprentice', 'Complete your first tone adaptation exercise', '🎭', '#8B5CF6', 'journey_completion', 1, '{"journey_key": "maya-tone-mastery"}', 'bronze', 103),
('multi_tone_master', 'Multi-Tone Master', 'Complete all tone adaptations with average score above 80%', '🎨', '#EC4899', 'journey_avg_score', 80, '{"journey_key": "maya-tone-mastery"}', 'silver', 104),
('communication_chameleon', 'Communication Chameleon', 'Achieve 90%+ on all tone adaptations', '🦎', '#06B6D4', 'journey_min_score', 90, '{"journey_key": "maya-tone-mastery"}', 'gold', 105),

-- Cross-journey achievements
('renaissance_learner', 'Renaissance Learner', 'Complete journeys from 3+ different characters', '📚', '#7C3AED', 'cross_journey', 3, '{"requirement": "unique_characters"}', 'platinum', 106),
('speed_learner', 'Speed Learner', 'Complete any journey in under 20 minutes', '⚡', '#EF4444', 'journey_speed', 20, '{"requirement": "completion_time_minutes"}', 'silver', 107);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_journey_definitions_updated_at
  BEFORE UPDATE ON public.journey_definitions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_journey_progress_updated_at
  BEFORE UPDATE ON public.user_journey_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();