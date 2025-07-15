-- Create AI Playground Achievements table
-- This table tracks gamification achievements and milestones for user engagement

CREATE TABLE IF NOT EXISTS public.ai_playground_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Achievement details
    achievement_type TEXT NOT NULL CHECK (achievement_type IN (
        'first_prompt',
        'first_workflow',
        'first_creation',
        'prompt_master',
        'workflow_wizard',
        'ai_explorer',
        'tool_collector',
        'quality_creator',
        'helpful_neighbor',
        'template_maker',
        'power_user',
        'innovation_leader',
        'community_champion',
        'milestone_sessions',
        'milestone_creations',
        'milestone_shares',
        'streak_daily',
        'streak_weekly',
        'challenge_complete',
        'tutorial_complete'
    )),
    
    -- Achievement metadata
    achievement_name TEXT NOT NULL,
    achievement_description TEXT,
    achievement_icon TEXT,
    achievement_category TEXT CHECK (achievement_category IN (
        'getting_started',
        'skill_building',
        'creation',
        'community',
        'milestones',
        'streaks',
        'challenges',
        'special'
    )),
    
    -- Progress tracking
    progress_current INTEGER DEFAULT 0,
    progress_target INTEGER DEFAULT 1,
    progress_percentage NUMERIC(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN progress_target > 0 THEN (progress_current::NUMERIC / progress_target * 100)
            ELSE 0
        END
    ) STORED,
    
    -- Reward details
    points_earned INTEGER DEFAULT 0,
    badge_level TEXT CHECK (badge_level IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
    special_reward JSONB DEFAULT '{}'::jsonb,
    
    -- Unlock conditions
    unlock_criteria JSONB DEFAULT '{}'::jsonb,
    related_achievements UUID[] DEFAULT '{}',
    
    -- Status
    unlocked BOOLEAN DEFAULT FALSE,
    unlocked_at TIMESTAMPTZ,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_at TIMESTAMPTZ,
    
    -- Social features
    shared BOOLEAN DEFAULT FALSE,
    shared_at TIMESTAMPTZ,
    congratulations_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_ai_playground_achievements_user_id ON public.ai_playground_achievements(user_id);
CREATE INDEX idx_ai_playground_achievements_type ON public.ai_playground_achievements(achievement_type);
CREATE INDEX idx_ai_playground_achievements_category ON public.ai_playground_achievements(achievement_category);
CREATE INDEX idx_ai_playground_achievements_unlocked ON public.ai_playground_achievements(unlocked, user_id) WHERE unlocked = TRUE;
CREATE INDEX idx_ai_playground_achievements_progress ON public.ai_playground_achievements(progress_percentage) WHERE unlocked = FALSE;
CREATE INDEX idx_ai_playground_achievements_unlocked_at ON public.ai_playground_achievements(unlocked_at DESC) WHERE unlocked_at IS NOT NULL;

-- Add RLS policies
ALTER TABLE public.ai_playground_achievements ENABLE ROW LEVEL SECURITY;

-- Users can view their own achievements and public unlocked achievements
CREATE POLICY "Users can view achievements"
    ON public.ai_playground_achievements
    FOR SELECT
    USING (
        auth.uid() = user_id 
        OR (unlocked = TRUE AND shared = TRUE)
    );

-- System can insert achievements for users
CREATE POLICY "System can insert achievements"
    ON public.ai_playground_achievements
    FOR INSERT
    WITH CHECK (TRUE);

-- System can update achievements
CREATE POLICY "System can update achievements"
    ON public.ai_playground_achievements
    FOR UPDATE
    USING (TRUE)
    WITH CHECK (TRUE);

-- Create trigger for updated_at
CREATE TRIGGER update_ai_playground_achievements_updated_at
    BEFORE UPDATE ON public.ai_playground_achievements
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create function to check and award achievements
CREATE OR REPLACE FUNCTION check_and_award_achievements(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Check for first prompt achievement
    IF NOT EXISTS (
        SELECT 1 FROM public.ai_playground_achievements 
        WHERE user_id = p_user_id AND achievement_type = 'first_prompt'
    ) AND EXISTS (
        SELECT 1 FROM public.ai_playground_interactions 
        WHERE user_id = p_user_id AND interaction_type = 'prompt_submit'
    ) THEN
        INSERT INTO public.ai_playground_achievements (
            user_id, achievement_type, achievement_name, achievement_description,
            achievement_category, points_earned, badge_level, unlocked, unlocked_at
        ) VALUES (
            p_user_id, 'first_prompt', 'First Steps', 'Created your first AI prompt!',
            'getting_started', 10, 'bronze', TRUE, NOW()
        );
    END IF;
    
    -- Check for milestone achievements (e.g., 10 creations)
    IF NOT EXISTS (
        SELECT 1 FROM public.ai_playground_achievements 
        WHERE user_id = p_user_id AND achievement_type = 'milestone_creations'
    ) AND (
        SELECT COUNT(*) FROM public.ai_playground_creations 
        WHERE user_id = p_user_id
    ) >= 10 THEN
        INSERT INTO public.ai_playground_achievements (
            user_id, achievement_type, achievement_name, achievement_description,
            achievement_category, points_earned, badge_level, unlocked, unlocked_at,
            progress_current, progress_target
        ) VALUES (
            p_user_id, 'milestone_creations', 'Creative Force', 'Created 10 AI-powered creations!',
            'milestones', 50, 'silver', TRUE, NOW(), 10, 10
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON TABLE public.ai_playground_achievements IS 'Tracks gamification achievements and milestones for AI playground engagement';
COMMENT ON COLUMN public.ai_playground_achievements.achievement_type IS 'Type of achievement earned by the user';
COMMENT ON COLUMN public.ai_playground_achievements.progress_percentage IS 'Calculated progress towards unlocking the achievement';
COMMENT ON COLUMN public.ai_playground_achievements.badge_level IS 'Level of badge awarded: bronze, silver, gold, platinum, diamond';
COMMENT ON COLUMN public.ai_playground_achievements.unlock_criteria IS 'JSON criteria that must be met to unlock the achievement';
COMMENT ON FUNCTION check_and_award_achievements IS 'Checks user activity and awards appropriate achievements';