-- Create AI Playground Toolkit Items table
-- This table stores the various AI tools and features available in the playground

CREATE TABLE IF NOT EXISTS public.ai_playground_toolkit_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Tool identification
    tool_key TEXT UNIQUE NOT NULL,
    tool_name TEXT NOT NULL,
    tool_category TEXT NOT NULL CHECK (tool_category IN (
        'prompt_engineering',
        'content_creation',
        'data_analysis',
        'workflow_automation',
        'impact_measurement',
        'communication',
        'strategy_planning',
        'learning_resources',
        'templates',
        'integrations'
    )),
    
    -- Tool details
    description TEXT NOT NULL,
    detailed_description TEXT,
    icon_name TEXT,
    color_scheme JSONB DEFAULT '{"primary": "#3B82F6", "secondary": "#93C5FD"}'::jsonb,
    
    -- Availability and requirements
    is_active BOOLEAN DEFAULT TRUE,
    is_beta BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    min_user_level INTEGER DEFAULT 1,
    required_achievements TEXT[] DEFAULT '{}',
    
    -- Tool capabilities
    capabilities TEXT[] DEFAULT '{}',
    supported_formats TEXT[] DEFAULT '{}',
    max_input_length INTEGER,
    max_output_length INTEGER,
    
    -- AI model configuration
    ai_model TEXT DEFAULT 'gpt-4',
    model_parameters JSONB DEFAULT '{}'::jsonb,
    
    -- Usage statistics
    total_uses INTEGER DEFAULT 0,
    avg_rating NUMERIC(3,2) DEFAULT 0 CHECK (avg_rating >= 0 AND avg_rating <= 5),
    rating_count INTEGER DEFAULT 0,
    success_rate NUMERIC(3,2) DEFAULT 0 CHECK (success_rate >= 0 AND success_rate <= 1),
    
    -- Learning resources
    tutorial_url TEXT,
    documentation_url TEXT,
    example_prompts JSONB DEFAULT '[]'::jsonb,
    best_practices JSONB DEFAULT '[]'::jsonb,
    
    -- Integration details
    api_endpoint TEXT,
    webhook_url TEXT,
    external_service TEXT,
    
    -- Metadata
    tags TEXT[] DEFAULT '{}',
    related_tools TEXT[] DEFAULT '{}',
    prerequisites TEXT[] DEFAULT '{}',
    
    -- Version control
    version TEXT DEFAULT '1.0.0',
    changelog JSONB DEFAULT '[]'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ,
    deprecated_at TIMESTAMPTZ
);

-- Create indexes for performance
CREATE INDEX idx_ai_playground_toolkit_items_key ON public.ai_playground_toolkit_items(tool_key);
CREATE INDEX idx_ai_playground_toolkit_items_category ON public.ai_playground_toolkit_items(tool_category);
CREATE INDEX idx_ai_playground_toolkit_items_active ON public.ai_playground_toolkit_items(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_ai_playground_toolkit_items_tags ON public.ai_playground_toolkit_items USING GIN(tags);
CREATE INDEX idx_ai_playground_toolkit_items_rating ON public.ai_playground_toolkit_items(avg_rating DESC) WHERE rating_count > 0;

-- Add RLS policies
ALTER TABLE public.ai_playground_toolkit_items ENABLE ROW LEVEL SECURITY;

-- Everyone can view active toolkit items
CREATE POLICY "Anyone can view active toolkit items"
    ON public.ai_playground_toolkit_items
    FOR SELECT
    USING (is_active = TRUE);

-- Only admins can manage toolkit items
CREATE POLICY "Admins can manage toolkit items"
    ON public.ai_playground_toolkit_items
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create trigger for updated_at
CREATE TRIGGER update_ai_playground_toolkit_items_updated_at
    BEFORE UPDATE ON public.ai_playground_toolkit_items
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert initial toolkit items
INSERT INTO public.ai_playground_toolkit_items (tool_key, tool_name, tool_category, description, capabilities, tags) VALUES
    ('prompt_builder', 'AI Prompt Builder', 'prompt_engineering', 'Build effective prompts with guided templates', 
     ARRAY['template_selection', 'context_building', 'prompt_optimization', 'preview'], 
     ARRAY['prompts', 'templates', 'beginner-friendly']),
    
    ('impact_calculator', 'Impact Calculator', 'impact_measurement', 'Calculate and visualize your AI impact', 
     ARRAY['time_savings', 'cost_analysis', 'efficiency_metrics', 'roi_calculation'], 
     ARRAY['analytics', 'measurement', 'reporting']),
    
    ('workflow_designer', 'Workflow Designer', 'workflow_automation', 'Design and automate AI-powered workflows', 
     ARRAY['visual_design', 'logic_building', 'integration', 'testing'], 
     ARRAY['automation', 'workflows', 'advanced']),
    
    ('response_analyzer', 'Response Analyzer', 'data_analysis', 'Analyze and improve AI responses', 
     ARRAY['quality_scoring', 'bias_detection', 'improvement_suggestions', 'comparison'], 
     ARRAY['analysis', 'quality', 'optimization']),
    
    ('practice_simulator', 'Practice Simulator', 'learning_resources', 'Practice AI interactions in a safe environment', 
     ARRAY['scenario_selection', 'guided_practice', 'feedback', 'progress_tracking'], 
     ARRAY['practice', 'learning', 'simulation'])
ON CONFLICT (tool_key) DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE public.ai_playground_toolkit_items IS 'Stores configuration and metadata for AI playground tools and features';
COMMENT ON COLUMN public.ai_playground_toolkit_items.tool_key IS 'Unique identifier key for the tool';
COMMENT ON COLUMN public.ai_playground_toolkit_items.capabilities IS 'Array of specific capabilities this tool provides';
COMMENT ON COLUMN public.ai_playground_toolkit_items.required_achievements IS 'Achievement types that must be unlocked to access this tool';
COMMENT ON COLUMN public.ai_playground_toolkit_items.model_parameters IS 'JSON configuration for AI model parameters';