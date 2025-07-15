-- Create Synthetic Nonprofit Profiles table
-- This table stores synthetic nonprofit organization profiles for practice scenarios

CREATE TABLE IF NOT EXISTS public.synthetic_nonprofit_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Organization details
    org_name TEXT NOT NULL,
    org_type TEXT NOT NULL CHECK (org_type IN (
        'food_bank',
        'homeless_shelter',
        'youth_services',
        'elder_care',
        'education',
        'healthcare',
        'environmental',
        'arts_culture',
        'animal_welfare',
        'disaster_relief',
        'advocacy',
        'community_development',
        'mental_health',
        'disability_services',
        'international_aid'
    )),
    
    -- Organization characteristics
    size_category TEXT CHECK (size_category IN ('small', 'medium', 'large', 'enterprise')),
    annual_budget NUMERIC(12,2),
    staff_count INTEGER,
    volunteer_count INTEGER,
    years_operating INTEGER,
    
    -- Mission and focus
    mission_statement TEXT NOT NULL,
    primary_focus TEXT,
    secondary_focuses TEXT[] DEFAULT '{}',
    target_demographics TEXT[] DEFAULT '{}',
    service_area TEXT,
    
    -- Current challenges (for practice scenarios)
    current_challenges JSONB DEFAULT '[]'::jsonb,
    tech_maturity_level TEXT CHECK (tech_maturity_level IN ('low', 'medium', 'high', 'advanced')),
    priority_needs TEXT[] DEFAULT '{}',
    
    -- Resources and capabilities
    existing_tools TEXT[] DEFAULT '{}',
    budget_constraints JSONB DEFAULT '{}'::jsonb,
    staff_skills JSONB DEFAULT '{}'::jsonb,
    
    -- Scenario data
    scenario_contexts JSONB DEFAULT '[]'::jsonb,
    sample_data JSONB DEFAULT '{}'::jsonb,
    key_metrics JSONB DEFAULT '{}'::jsonb,
    
    -- Usage in playground
    usage_count INTEGER DEFAULT 0,
    avg_scenario_rating NUMERIC(3,2) DEFAULT 0 CHECK (avg_scenario_rating >= 0 AND avg_scenario_rating <= 5),
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    
    -- Tags and categorization
    tags TEXT[] DEFAULT '{}',
    suitable_for_tools TEXT[] DEFAULT '{}',
    learning_objectives TEXT[] DEFAULT '{}',
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ
);

-- Create indexes for performance
CREATE INDEX idx_synthetic_nonprofit_profiles_type ON public.synthetic_nonprofit_profiles(org_type);
CREATE INDEX idx_synthetic_nonprofit_profiles_size ON public.synthetic_nonprofit_profiles(size_category);
CREATE INDEX idx_synthetic_nonprofit_profiles_tech_level ON public.synthetic_nonprofit_profiles(tech_maturity_level);
CREATE INDEX idx_synthetic_nonprofit_profiles_active ON public.synthetic_nonprofit_profiles(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_synthetic_nonprofit_profiles_featured ON public.synthetic_nonprofit_profiles(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_synthetic_nonprofit_profiles_tags ON public.synthetic_nonprofit_profiles USING GIN(tags);
CREATE INDEX idx_synthetic_nonprofit_profiles_difficulty ON public.synthetic_nonprofit_profiles(difficulty_level);

-- Add RLS policies
ALTER TABLE public.synthetic_nonprofit_profiles ENABLE ROW LEVEL SECURITY;

-- Everyone can view active profiles
CREATE POLICY "Anyone can view active nonprofit profiles"
    ON public.synthetic_nonprofit_profiles
    FOR SELECT
    USING (is_active = TRUE);

-- Only admins can manage profiles
CREATE POLICY "Admins can manage nonprofit profiles"
    ON public.synthetic_nonprofit_profiles
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create trigger for updated_at
CREATE TRIGGER update_synthetic_nonprofit_profiles_updated_at
    BEFORE UPDATE ON public.synthetic_nonprofit_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample synthetic nonprofit profiles
INSERT INTO public.synthetic_nonprofit_profiles (
    org_name, org_type, size_category, annual_budget, staff_count, 
    mission_statement, tech_maturity_level, difficulty_level,
    current_challenges, priority_needs, tags
) VALUES
    ('Hope Harbor Food Bank', 'food_bank', 'medium', 2500000, 25,
     'To eliminate hunger in our community by providing nutritious food to those in need',
     'medium', 'beginner',
     '[{"type": "inventory_management", "description": "Tracking food donations and distribution efficiently"},
       {"type": "volunteer_coordination", "description": "Managing 200+ volunteers across multiple locations"}]'::jsonb,
     ARRAY['inventory_system', 'volunteer_management', 'donor_communication'],
     ARRAY['food_security', 'logistics', 'community_service']),
    
    ('Tech4Good Education Initiative', 'education', 'small', 500000, 8,
     'Bridging the digital divide by providing technology education to underserved youth',
     'high', 'intermediate',
     '[{"type": "program_scaling", "description": "Expanding programs to reach more students"},
       {"type": "impact_measurement", "description": "Demonstrating program effectiveness to funders"}]'::jsonb,
     ARRAY['impact_reporting', 'curriculum_development', 'student_tracking'],
     ARRAY['education', 'technology', 'youth_development']),
    
    ('Green Earth Conservation', 'environmental', 'large', 5000000, 45,
     'Protecting endangered ecosystems through conservation, education, and advocacy',
     'advanced', 'advanced',
     '[{"type": "data_analysis", "description": "Analyzing complex environmental data for reporting"},
       {"type": "stakeholder_engagement", "description": "Coordinating with multiple government agencies"}]'::jsonb,
     ARRAY['data_visualization', 'report_automation', 'stakeholder_management'],
     ARRAY['environment', 'conservation', 'advocacy'])
ON CONFLICT DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE public.synthetic_nonprofit_profiles IS 'Stores synthetic nonprofit organization profiles for AI playground practice scenarios';
COMMENT ON COLUMN public.synthetic_nonprofit_profiles.org_type IS 'Type of nonprofit organization';
COMMENT ON COLUMN public.synthetic_nonprofit_profiles.current_challenges IS 'JSON array of current challenges the organization faces';
COMMENT ON COLUMN public.synthetic_nonprofit_profiles.scenario_contexts IS 'JSON array of practice scenario contexts';
COMMENT ON COLUMN public.synthetic_nonprofit_profiles.suitable_for_tools IS 'Array of AI playground tools this profile is suitable for';