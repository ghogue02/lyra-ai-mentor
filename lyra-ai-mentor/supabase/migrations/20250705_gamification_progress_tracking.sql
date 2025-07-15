-- Create user_progress table for storing gamification data
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_components JSONB DEFAULT '[]'::jsonb,
  time_spent_by_component JSONB DEFAULT '{}'::jsonb,
  skills_mastered JSONB DEFAULT '[]'::jsonb,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_time_spent INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  next_level_experience INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_progress UNIQUE (user_id)
);

-- Create index for faster lookups
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_last_active ON public.user_progress(last_active_date);

-- Enable RLS (Row Level Security)
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" ON public.user_progress
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create component_completions table for detailed tracking
CREATE TABLE IF NOT EXISTS public.component_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  component_id TEXT NOT NULL,
  character_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_spent INTEGER DEFAULT 0, -- in minutes
  attempts INTEGER DEFAULT 1,
  score INTEGER, -- optional score 0-100
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for component_completions
CREATE INDEX idx_component_completions_user_id ON public.component_completions(user_id);
CREATE INDEX idx_component_completions_component_id ON public.component_completions(component_id);
CREATE INDEX idx_component_completions_character_id ON public.component_completions(character_id);
CREATE INDEX idx_component_completions_completed_at ON public.component_completions(completed_at);

-- Enable RLS for component_completions
ALTER TABLE public.component_completions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for component_completions
CREATE POLICY "Users can view their own completions" ON public.component_completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own completions" ON public.component_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create achievement_unlocks table
CREATE TABLE IF NOT EXISTS public.achievement_unlocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notified BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for achievement_unlocks
CREATE INDEX idx_achievement_unlocks_user_id ON public.achievement_unlocks(user_id);
CREATE INDEX idx_achievement_unlocks_badge_id ON public.achievement_unlocks(badge_id);
CREATE INDEX idx_achievement_unlocks_unlocked_at ON public.achievement_unlocks(unlocked_at);

-- Enable RLS for achievement_unlocks
ALTER TABLE public.achievement_unlocks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for achievement_unlocks
CREATE POLICY "Users can view their own achievements" ON public.achievement_unlocks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" ON public.achievement_unlocks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create view for leaderboard (anonymous)
CREATE OR REPLACE VIEW public.progress_leaderboard AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY level DESC, experience DESC) as rank,
  level,
  experience,
  total_time_spent,
  array_length(completed_components::text[], 1) as components_completed,
  array_length(badges::text[], 1) as badges_earned,
  longest_streak,
  last_active_date
FROM public.user_progress
WHERE last_active_date > NOW() - INTERVAL '30 days'
ORDER BY level DESC, experience DESC
LIMIT 100;

-- Grant access to the leaderboard view
GRANT SELECT ON public.progress_leaderboard TO anon, authenticated;

-- Create function to get user's rank
CREATE OR REPLACE FUNCTION get_user_rank(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  user_rank INTEGER;
BEGIN
  SELECT rank INTO user_rank
  FROM (
    SELECT 
      user_id,
      ROW_NUMBER() OVER (ORDER BY level DESC, experience DESC) as rank
    FROM public.user_progress
    WHERE last_active_date > NOW() - INTERVAL '30 days'
  ) ranked
  WHERE user_id = user_uuid;
  
  RETURN COALESCE(user_rank, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to calculate suggested next component
CREATE OR REPLACE FUNCTION get_suggested_component(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  completed_components TEXT[];
  character_progress JSONB;
  least_progress_char TEXT;
  suggested_component TEXT;
BEGIN
  -- Get user's completed components
  SELECT completed_components::text[] 
  INTO completed_components
  FROM public.user_progress
  WHERE user_id = user_uuid;
  
  -- If no progress, suggest first Maya component
  IF completed_components IS NULL OR array_length(completed_components, 1) = 0 THEN
    RETURN 'MayaEmailComposer';
  END IF;
  
  -- Calculate progress by character
  -- This is a simplified version - in production, you'd have a more sophisticated algorithm
  WITH character_counts AS (
    SELECT 
      CASE 
        WHEN component_id ILIKE '%maya%' THEN 'maya'
        WHEN component_id ILIKE '%david%' THEN 'david'
        WHEN component_id ILIKE '%rachel%' THEN 'rachel'
        WHEN component_id ILIKE '%alex%' THEN 'alex'
        WHEN component_id ILIKE '%sofia%' THEN 'sofia'
        ELSE 'other'
      END as character,
      COUNT(*) as count
    FROM unnest(completed_components) as component_id
    GROUP BY character
  )
  SELECT character INTO least_progress_char
  FROM character_counts
  ORDER BY count ASC
  LIMIT 1;
  
  -- Return a component from the character with least progress
  -- This would be more sophisticated in production
  CASE least_progress_char
    WHEN 'maya' THEN suggested_component := 'MayaCommunicationCoach';
    WHEN 'david' THEN suggested_component := 'DavidDataStoryFinder';
    WHEN 'rachel' THEN suggested_component := 'RachelAutomationVision';
    WHEN 'alex' THEN suggested_component := 'AlexChangeStrategy';
    WHEN 'sofia' THEN suggested_component := 'SofiaVoiceDiscovery';
    ELSE suggested_component := 'MayaEmailComposer';
  END CASE;
  
  RETURN suggested_component;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_user_rank(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_suggested_component(UUID) TO authenticated;