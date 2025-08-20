-- URGENT FIX: Create missing maya_analysis_results table and update generated_content table
-- This fixes the critical 503 error in the generate-character-content Edge Function

-- 1. Create maya_analysis_results table that's referenced by the Edge Function
CREATE TABLE IF NOT EXISTS public.maya_analysis_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- User information
  user_id TEXT NOT NULL, -- Can be UUID or 'anonymous'
  
  -- Analysis metadata
  analysis_type TEXT NOT NULL,
  
  -- Source data used for analysis (JSONB for flexibility)
  source_data JSONB DEFAULT '[]' NOT NULL,
  
  -- Analysis results (JSONB containing analysis and patterns)
  analysis_results JSONB NOT NULL,
  
  -- Recommendations (JSONB containing recommendations)
  recommendations JSONB NOT NULL,
  
  -- Confidence score between 0 and 1
  confidence_score DECIMAL(3,2) DEFAULT 0.50 CHECK (confidence_score >= 0 AND confidence_score <= 1)
);

-- Create indexes for maya_analysis_results
CREATE INDEX idx_maya_analysis_results_user_id ON public.maya_analysis_results(user_id);
CREATE INDEX idx_maya_analysis_results_analysis_type ON public.maya_analysis_results(analysis_type);
CREATE INDEX idx_maya_analysis_results_created_at ON public.maya_analysis_results(created_at DESC);
CREATE INDEX idx_maya_analysis_results_confidence_score ON public.maya_analysis_results(confidence_score DESC);

-- Create updated_at trigger for maya_analysis_results
CREATE TRIGGER update_maya_analysis_results_updated_at
    BEFORE UPDATE ON public.maya_analysis_results
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS for maya_analysis_results
ALTER TABLE public.maya_analysis_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for maya_analysis_results

-- Service role can do everything (for Edge Functions)
CREATE POLICY "Service role can manage all maya analysis results" 
ON public.maya_analysis_results 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Anonymous and authenticated users can read all results (for learning purposes)
CREATE POLICY "Allow read access to maya analysis results" 
ON public.maya_analysis_results 
FOR SELECT 
TO anon, authenticated
USING (true);

-- Authenticated users can insert results
CREATE POLICY "Authenticated users can insert maya analysis results" 
ON public.maya_analysis_results 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Grant permissions for maya_analysis_results
GRANT ALL ON public.maya_analysis_results TO service_role;
GRANT SELECT, INSERT ON public.maya_analysis_results TO authenticated;
GRANT SELECT ON public.maya_analysis_results TO anon;

-- 2. Update generated_content table to include 'carmen' in character_type check
-- First, drop the existing constraint
ALTER TABLE public.generated_content DROP CONSTRAINT IF EXISTS generated_content_character_type_check;

-- Add the updated constraint that includes 'carmen'
ALTER TABLE public.generated_content ADD CONSTRAINT generated_content_character_type_check 
  CHECK (character_type IN ('maya', 'sofia', 'david', 'rachel', 'alex', 'lyra', 'carmen'));

-- 3. Update generated_content table to include additional content types
-- Drop the existing content_type constraint  
ALTER TABLE public.generated_content DROP CONSTRAINT IF EXISTS generated_content_content_type_check;

-- Add updated constraint with more content types
ALTER TABLE public.generated_content ADD CONSTRAINT generated_content_content_type_check 
  CHECK (content_type IN ('email', 'lesson', 'article', 'social_post', 'newsletter', 'blog_post', 'hiring_strategy', 'ecosystem_blueprint'));

-- Add comments for new table
COMMENT ON TABLE public.maya_analysis_results IS 'Stores Maya pattern analysis results for scaling successful interaction patterns to other characters';
COMMENT ON COLUMN public.maya_analysis_results.analysis_results IS 'JSONB field containing analysis and patterns extracted from Maya conversations';  
COMMENT ON COLUMN public.maya_analysis_results.recommendations IS 'JSONB field containing actionable recommendations for applying Maya patterns';
COMMENT ON COLUMN public.maya_analysis_results.source_data IS 'JSONB array containing the conversation data that was analyzed';

-- Insert a default Maya pattern for immediate use
INSERT INTO public.maya_analysis_results (
  user_id,
  analysis_type, 
  analysis_results,
  recommendations,
  confidence_score
) VALUES (
  'system',
  'default_patterns',
  '{"analysis": "Maya excels in data-driven personalization, segmentation strategies, and conversion optimization. Key patterns include: 1) Starting with audience analysis, 2) Using behavioral data for personalization, 3) A/B testing different approaches, 4) Focusing on metrics-driven decisions, 5) Building engagement through value-first content.", "patterns": "Focus on data-driven approaches, audience segmentation, personalization strategies, and measurable outcomes"}',
  '{"recommendations": ["Apply data-driven decision making to all content creation", "Use audience segmentation principles across characters", "Implement A/B testing mindset", "Focus on measurable outcomes and KPIs", "Start with value-first, audience-centric approaches"]}',
  0.85
) ON CONFLICT DO NOTHING;