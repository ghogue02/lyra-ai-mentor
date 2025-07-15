-- Content Scaling System Database Schema
-- Based on hive mind analysis of Chapter 2 patterns

-- Character Archetypes Table
CREATE TABLE IF NOT EXISTS character_archetypes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id VARCHAR(50) UNIQUE NOT NULL, -- 'maya', 'alex', 'david', 'rachel', 'sofia'
  name VARCHAR(100) NOT NULL,
  profession VARCHAR(100) NOT NULL,
  primary_skill VARCHAR(100) NOT NULL,
  challenge_pattern VARCHAR(100) NOT NULL, -- 'anxiety-to-confidence', 'overwhelm-to-clarity'
  transformation_arc JSONB NOT NULL, -- before, after, timeMetrics
  personality_traits TEXT[] NOT NULL,
  preferred_learning_style VARCHAR(200) NOT NULL,
  contextual_scenarios TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Templates Table
CREATE TABLE IF NOT EXISTS content_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'interactive-component', 'lesson-content', 'character-scene'
  category VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  character_archetype VARCHAR(50), -- NULL for 'any', specific character_id for character-specific
  template_variables JSONB NOT NULL, -- Array of TemplateVariable objects
  base_component VARCHAR(100) NOT NULL,
  generation_prompt TEXT NOT NULL,
  quality_metrics JSONB NOT NULL, -- QualityMetrics object
  usage_count INTEGER DEFAULT 0,
  success_rate DECIMAL(3,2) DEFAULT 0.00,
  average_quality_score DECIMAL(3,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (character_archetype) REFERENCES character_archetypes(character_id)
);

-- Template Variables Table (for complex variable definitions)
CREATE TABLE IF NOT EXISTS template_variables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES content_templates(id) ON DELETE CASCADE,
  variable_name VARCHAR(100) NOT NULL,
  variable_type VARCHAR(50) NOT NULL, -- 'string', 'array', 'object', 'number'
  is_required BOOLEAN DEFAULT false,
  default_value JSONB,
  description TEXT,
  validation_rules JSONB, -- Array of ValidationRule objects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated Content Table
CREATE TABLE IF NOT EXISTS generated_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES content_templates(id),
  character_id VARCHAR(50) REFERENCES character_archetypes(character_id),
  chapter_number INTEGER NOT NULL,
  lesson_number INTEGER,
  content_type VARCHAR(100) NOT NULL,
  content_data JSONB NOT NULL, -- The actual generated content
  generation_variables JSONB, -- Variables used for generation
  validation_results JSONB, -- ValidationResults object
  quality_score DECIMAL(3,2) DEFAULT 0.00,
  approval_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'needs_revision'
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  generated_by UUID REFERENCES auth.users(id),
  generation_metadata JSONB, -- AI model, parameters, etc.
  file_path VARCHAR(500), -- Path to generated React component file
  component_name VARCHAR(255), -- Name of generated React component
  deployment_status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'staged', 'deployed', 'archived'
  deployed_at TIMESTAMP WITH TIME ZONE,
  performance_metrics JSONB, -- Load time, engagement, completion rates
  user_feedback JSONB, -- User ratings and feedback
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Generation Jobs Table (for async processing)
CREATE TABLE IF NOT EXISTS content_generation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type VARCHAR(100) NOT NULL, -- 'single_component', 'chapter_batch', 'template_application'
  template_id UUID REFERENCES content_templates(id),
  character_id VARCHAR(50) REFERENCES character_archetypes(character_id),
  target_chapters INTEGER[], -- Array of chapter numbers
  generation_parameters JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'queued', -- 'queued', 'processing', 'completed', 'failed', 'cancelled'
  progress_percentage INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  results JSONB, -- Array of generated content IDs
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Template Usage Analytics Table
CREATE TABLE IF NOT EXISTS template_usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES content_templates(id),
  character_id VARCHAR(50) REFERENCES character_archetypes(character_id),
  usage_date DATE DEFAULT CURRENT_DATE,
  usage_count INTEGER DEFAULT 1,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  average_generation_time DECIMAL(8,2), -- in seconds
  average_quality_score DECIMAL(3,2),
  user_satisfaction_score DECIMAL(3,2),
  performance_metrics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(template_id, character_id, usage_date)
);

-- Quality Assurance Rules Table
CREATE TABLE IF NOT EXISTS qa_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name VARCHAR(100) NOT NULL,
  rule_type VARCHAR(50) NOT NULL, -- 'character_consistency', 'technical_quality', 'learning_alignment'
  applicable_templates TEXT[], -- Array of template IDs, empty for all
  applicable_characters TEXT[], -- Array of character IDs, empty for all
  validation_criteria JSONB NOT NULL,
  minimum_score DECIMAL(3,2) DEFAULT 0.80,
  is_blocking BOOLEAN DEFAULT false, -- If true, content cannot be approved without passing
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scaling Automation Rules Table
CREATE TABLE IF NOT EXISTS scaling_automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name VARCHAR(100) NOT NULL,
  trigger_condition VARCHAR(100) NOT NULL, -- 'new_chapter', 'template_update', 'schedule', 'manual'
  template_id UUID REFERENCES content_templates(id),
  target_characters TEXT[], -- Array of character IDs to apply to
  target_chapters INTEGER[], -- Array of chapter numbers to apply to
  generation_parameters JSONB,
  auto_approve BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  last_executed TIMESTAMP WITH TIME ZONE,
  execution_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_generated_content_template_character ON generated_content(template_id, character_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_chapter ON generated_content(chapter_number);
CREATE INDEX IF NOT EXISTS idx_generated_content_status ON generated_content(approval_status, deployment_status);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_status ON content_generation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_template_analytics_date ON template_usage_analytics(usage_date);
CREATE INDEX IF NOT EXISTS idx_character_archetypes_character_id ON character_archetypes(character_id);

-- RLS Policies (Row Level Security)
ALTER TABLE character_archetypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_generation_jobs ENABLE ROW LEVEL SECURITY;

-- Allow read access to character archetypes for all authenticated users
CREATE POLICY "character_archetypes_read" ON character_archetypes
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow template access based on user permissions
CREATE POLICY "content_templates_read" ON content_templates
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "content_templates_write" ON content_templates
  FOR ALL USING (
    auth.role() = 'authenticated' AND (
      created_by = auth.uid() OR
      EXISTS (SELECT 1 FROM user_permissions WHERE user_id = auth.uid() AND permission = 'template_admin')
    )
  );

-- Allow users to see their own generated content and approved content
CREATE POLICY "generated_content_read" ON generated_content
  FOR SELECT USING (
    auth.role() = 'authenticated' AND (
      generated_by = auth.uid() OR
      approval_status = 'approved' OR
      EXISTS (SELECT 1 FROM user_permissions WHERE user_id = auth.uid() AND permission = 'content_admin')
    )
  );

CREATE POLICY "generated_content_write" ON generated_content
  FOR ALL USING (
    auth.role() = 'authenticated' AND (
      generated_by = auth.uid() OR
      EXISTS (SELECT 1 FROM user_permissions WHERE user_id = auth.uid() AND permission = 'content_admin')
    )
  );

-- Allow users to manage their own generation jobs
CREATE POLICY "generation_jobs_manage" ON content_generation_jobs
  FOR ALL USING (
    auth.role() = 'authenticated' AND (
      created_by = auth.uid() OR
      EXISTS (SELECT 1 FROM user_permissions WHERE user_id = auth.uid() AND permission = 'content_admin')
    )
  );

-- Insert default character archetypes based on Chapter 2 analysis
INSERT INTO character_archetypes (character_id, name, profession, primary_skill, challenge_pattern, transformation_arc, personality_traits, preferred_learning_style, contextual_scenarios) VALUES
('maya', 'Maya Rodriguez', 'Marketing Coordinator', 'communication', 'anxiety-to-confidence', 
 '{"before": "Overwhelmed by email volume and uncertain about tone", "after": "Confident communicator with structured approach", "timeMetrics": {"before": "2 hours per email", "after": "15 minutes per email", "savings": "1 hour 45 minutes per email"}}',
 ARRAY['detail-oriented', 'empathetic', 'analytical', 'growth-minded'],
 'step-by-step with examples',
 ARRAY['donor thank you emails', 'volunteer coordination', 'board member updates', 'community outreach']),

('alex', 'Alex Chen', 'Executive Director', 'strategy', 'overwhelm-to-clarity',
 '{"before": "Scattered priorities and unclear strategic direction", "after": "Clear strategic focus with actionable plans", "timeMetrics": {"before": "3 hours planning sessions", "after": "45 minutes focused planning", "savings": "2 hours 15 minutes per session"}}',
 ARRAY['visionary', 'decisive', 'collaborative', 'results-oriented'],
 'frameworks with real-world application',
 ARRAY['strategic planning sessions', 'board presentations', 'funding proposals', 'team alignment meetings']),

('david', 'David Park', 'Program Manager', 'data-analysis', 'confusion-to-insight',
 '{"before": "Drowning in spreadsheets, making gut decisions", "after": "Data-driven insights with clear visualizations", "timeMetrics": {"before": "4 hours per report", "after": "1 hour per report", "savings": "3 hours per report"}}',
 ARRAY['methodical', 'curious', 'perfectionist', 'logical'],
 'hands-on practice with tools',
 ARRAY['impact measurement', 'donor analytics', 'program evaluation', 'budget forecasting']),

('rachel', 'Rachel Martinez', 'Operations Director', 'process-automation', 'chaos-to-order',
 '{"before": "Manual processes eating up valuable time", "after": "Streamlined automated workflows", "timeMetrics": {"before": "6 hours weekly admin", "after": "1.5 hours weekly admin", "savings": "4.5 hours per week"}}',
 ARRAY['organized', 'efficient', 'systematic', 'pragmatic'],
 'workflow-based with templates',
 ARRAY['volunteer onboarding', 'event management', 'donor database maintenance', 'reporting automation']),

('sofia', 'Sofia Thompson', 'Communications Manager', 'storytelling', 'silence-to-voice',
 '{"before": "Struggling to create compelling narratives", "after": "Powerful storyteller driving engagement", "timeMetrics": {"before": "5 hours per story", "after": "2 hours per story", "savings": "3 hours per story"}}',
 ARRAY['creative', 'empathetic', 'persuasive', 'authentic'],
 'story-driven with emotional connection',
 ARRAY['impact stories', 'social media campaigns', 'grant narratives', 'newsletter content']);

-- Insert default content templates based on Maya's PromptSandwichBuilder pattern
INSERT INTO content_templates (template_id, type, category, title, description, character_archetype, template_variables, base_component, generation_prompt, quality_metrics) VALUES
('interactive-builder', 'interactive-component', 'skill-builder', 'Interactive Skill Builder', 'Multi-stage interactive component following the proven 4-stage pattern', NULL,
 '[{"name": "skillName", "type": "string", "required": true, "description": "The primary skill being taught"}, {"name": "builderStages", "type": "array", "required": true, "description": "Array of builder stages (intro, build, preview, success)"}, {"name": "timeMetrics", "type": "object", "required": true, "description": "Before/after time savings data"}, {"name": "practicalScenario", "type": "string", "required": true, "description": "Real-world application scenario"}]',
 'ScalableInteractiveBuilder',
 'Create an interactive skill builder component that follows the proven 4-stage pattern: 1. Introduction with character context, 2. Step-by-step building process, 3. Preview/review of created content, 4. Success celebration with metrics. Include character-specific scenarios and authentic nonprofit contexts.',
 '{"characterConsistency": 0.95, "engagementScore": 0.90, "learningObjectiveAlignment": 0.92, "technicalQuality": 0.88, "userExperienceScore": 0.93}'),

('character-journey', 'lesson-content', 'story-arc', 'Character Journey Arc', 'Character development content following transformation patterns', 'specific',
 '[{"name": "characterId", "type": "string", "required": true, "description": "Character archetype identifier"}, {"name": "journeyStage", "type": "string", "required": true, "description": "Current stage in character arc"}, {"name": "learningObjectives", "type": "array", "required": true, "description": "Specific learning outcomes for this stage"}]',
 'CharacterJourneyContent',
 'Create character journey content that shows authentic progression through the transformation arc. Include emotional elements, practical challenges, and measurable outcomes.',
 '{"characterConsistency": 0.98, "engagementScore": 0.85, "learningObjectiveAlignment": 0.90, "technicalQuality": 0.87, "userExperienceScore": 0.89}');

-- Insert default QA rules
INSERT INTO qa_rules (rule_name, rule_type, validation_criteria, minimum_score, is_blocking) VALUES
('Character Voice Consistency', 'character_consistency', '{"checkPersonalityTraits": true, "validateProfessionContext": true, "ensureTransformationArc": true}', 0.90, true),
('Technical Component Quality', 'technical_quality', '{"validateReactSyntax": true, "checkAccessibility": true, "ensureResponsive": true, "validatePerformance": true}', 0.85, true),
('Learning Objective Alignment', 'learning_alignment', '{"validateSkillProgression": true, "checkPracticalApplication": true, "ensureMeasurableOutcomes": true}', 0.88, false);

-- Create functions for automated content generation triggers
CREATE OR REPLACE FUNCTION trigger_content_generation()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert generation job when new chapter is created
  INSERT INTO content_generation_jobs (job_type, generation_parameters, created_by)
  VALUES (
    'chapter_batch',
    jsonb_build_object('chapter_number', NEW.id, 'auto_generate', true),
    auth.uid()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update template usage analytics
CREATE OR REPLACE FUNCTION update_template_analytics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO template_usage_analytics (template_id, character_id, usage_count, success_count, average_quality_score)
  VALUES (NEW.template_id, NEW.character_id, 1, 
          CASE WHEN NEW.approval_status = 'approved' THEN 1 ELSE 0 END,
          NEW.quality_score)
  ON CONFLICT (template_id, character_id, usage_date)
  DO UPDATE SET
    usage_count = template_usage_analytics.usage_count + 1,
    success_count = template_usage_analytics.success_count + 
                   CASE WHEN NEW.approval_status = 'approved' THEN 1 ELSE 0 END,
    average_quality_score = (template_usage_analytics.average_quality_score * template_usage_analytics.usage_count + NEW.quality_score) / (template_usage_analytics.usage_count + 1);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER update_template_usage_analytics
  AFTER INSERT ON generated_content
  FOR EACH ROW
  EXECUTE FUNCTION update_template_analytics();

COMMENT ON TABLE character_archetypes IS 'Character archetype definitions based on Chapter 2 analysis';
COMMENT ON TABLE content_templates IS 'Reusable content templates for scaling across chapters';
COMMENT ON TABLE generated_content IS 'AI-generated content instances with quality tracking';
COMMENT ON TABLE content_generation_jobs IS 'Async job processing for batch content generation';
COMMENT ON TABLE template_usage_analytics IS 'Analytics for template performance and usage patterns';
COMMENT ON TABLE qa_rules IS 'Quality assurance rules for automated content validation';
COMMENT ON TABLE scaling_automation_rules IS 'Automation rules for systematic content scaling';