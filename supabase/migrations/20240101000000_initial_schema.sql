-- Initial Database Schema for Lyra AI Mentor
-- Date: 2024-01-01
-- Purpose: Create all base tables, indexes, and policies

-- =========================================================================
-- PART 1: CORE TABLES
-- =========================================================================

-- Create chapters table
CREATE TABLE IF NOT EXISTS public.chapters (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  icon TEXT,
  duration INTEGER,
  is_published BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
  id INTEGER PRIMARY KEY,
  chapter_id INTEGER REFERENCES chapters(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  estimated_duration INTEGER,
  is_published BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create characters table
CREATE TABLE IF NOT EXISTS public.characters (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  bio TEXT,
  personality TEXT,
  expertise TEXT[] DEFAULT ARRAY[]::TEXT[],
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create interactive_elements table
CREATE TABLE IF NOT EXISTS public.interactive_elements (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'text', 'reflection', 'lyra_chat', 'multiple_choice', 'sequence_sorter', 
    'slider', 'interactive_element_placeholder', 'case_study', 'workshop'
  )),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  configuration JSONB DEFAULT '{}' NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true NOT NULL,
  is_gated BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create lesson_progress table
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'not_started' CHECK (status IN (
    'not_started', 'in_progress', 'completed'
  )) NOT NULL,
  progress_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (
    progress_percentage >= 0 AND progress_percentage <= 100
  ) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  UNIQUE(user_id, lesson_id)
);

-- Create user_interactions table
CREATE TABLE IF NOT EXISTS public.user_interactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  interactive_element_id INTEGER REFERENCES interactive_elements(id) ON DELETE CASCADE NOT NULL,
  interaction_type TEXT NOT NULL,
  interaction_data JSONB DEFAULT '{}' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- =========================================================================
-- PART 2: INDEXES FOR PERFORMANCE
-- =========================================================================

CREATE INDEX IF NOT EXISTS idx_chapters_order ON chapters(order_index);
CREATE INDEX IF NOT EXISTS idx_chapters_published ON chapters(is_published);

CREATE INDEX IF NOT EXISTS idx_lessons_chapter ON lessons(chapter_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(chapter_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_published ON lessons(is_published);

CREATE INDEX IF NOT EXISTS idx_interactive_elements_lesson ON interactive_elements(lesson_id);
CREATE INDEX IF NOT EXISTS idx_interactive_elements_order ON interactive_elements(lesson_id, order_index);
CREATE INDEX IF NOT EXISTS idx_interactive_elements_type ON interactive_elements(type);
CREATE INDEX IF NOT EXISTS idx_interactive_elements_active ON interactive_elements(is_active);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_status ON lesson_progress(status);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_updated ON lesson_progress(updated_at);

CREATE INDEX IF NOT EXISTS idx_user_interactions_user ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_element ON user_interactions(interactive_element_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_type ON user_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_user_interactions_created ON user_interactions(created_at);

CREATE INDEX IF NOT EXISTS idx_characters_active ON characters(is_active);
CREATE INDEX IF NOT EXISTS idx_characters_name ON characters(name);

-- =========================================================================
-- PART 3: ROW LEVEL SECURITY (RLS)
-- =========================================================================

-- Enable RLS on tables
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactive_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;

-- Policies for chapters (public read, authenticated can see published)
CREATE POLICY "Chapters are viewable by everyone" ON public.chapters
  FOR SELECT USING (true);

-- Policies for lessons (public read, authenticated can see published)
CREATE POLICY "Lessons are viewable by everyone" ON public.lessons
  FOR SELECT USING (true);

-- Policies for characters (public read for active characters)
CREATE POLICY "Active characters are viewable by everyone" ON public.characters
  FOR SELECT USING (is_active = true);

-- Policies for interactive_elements (public read for active elements)
CREATE POLICY "Active interactive elements are viewable by everyone" ON public.interactive_elements
  FOR SELECT USING (is_active = true);

-- Policies for lesson_progress (users can only access their own data)
CREATE POLICY "Users can view own lesson progress" ON public.lesson_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress" ON public.lesson_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress" ON public.lesson_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for user_interactions (users can only access their own data)
CREATE POLICY "Users can view own interactions" ON public.user_interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interactions" ON public.user_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =========================================================================
-- PART 4: TRIGGERS FOR UPDATED_AT
-- =========================================================================

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to update updated_at column
CREATE TRIGGER set_timestamp_chapters
  BEFORE UPDATE ON public.chapters
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_timestamp_lessons
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_timestamp_characters
  BEFORE UPDATE ON public.characters
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_timestamp_interactive_elements
  BEFORE UPDATE ON public.interactive_elements
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_timestamp_lesson_progress
  BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_timestamp_user_interactions
  BEFORE UPDATE ON public.user_interactions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- PART 5: INITIAL DATA
-- =========================================================================

-- Insert core characters
INSERT INTO public.characters (name, role, bio, personality, expertise, is_active) VALUES
('Lyra', 'AI Mentor', 'Your AI guide through the world of nonprofit innovation', 'Supportive, knowledgeable, encouraging', ARRAY['AI', 'nonprofit', 'mentoring'], true),
('Carmen', 'HR Director', 'Expert in people management and organizational development', 'Compassionate, strategic, human-centered', ARRAY['HR', 'people management', 'organizational development'], true),
('Maya', 'Data Scientist', 'Data analytics and AI implementation specialist', 'Analytical, practical, detail-oriented', ARRAY['data science', 'AI', 'analytics'], true),
('Sofia', 'Fundraising Director', 'Expert in donor relations and fundraising strategy', 'Relationship-focused, strategic, results-driven', ARRAY['fundraising', 'donor relations', 'strategy'], true),
('David', 'Communications Director', 'Storytelling and brand communications expert', 'Creative, strategic, audience-focused', ARRAY['communications', 'storytelling', 'branding'], true),
('Rachel', 'Program Director', 'Community engagement and program design specialist', 'Collaborative, innovative, community-focused', ARRAY['program design', 'community engagement', 'social impact'], true),
('Alex', 'Operations Director', 'Efficiency and systems optimization expert', 'Systematic, analytical, process-oriented', ARRAY['operations', 'systems', 'efficiency'], true)
ON CONFLICT (name) DO NOTHING;