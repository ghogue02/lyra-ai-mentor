-- Content Scaling System Database Setup
-- Run this script to initialize the content scaling system

-- First, ensure we have the required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Run the main schema
\i ../schemas/content-scaling-schema.sql

-- Insert test data for immediate use
-- This will allow you to start testing right away

-- Test generation job for Chapter 3
INSERT INTO content_generation_jobs (
  job_type,
  generation_parameters,
  status,
  created_at
) VALUES (
  'single_component',
  '{
    "templateIds": ["interactive-builder"],
    "characterIds": ["alex"],
    "chapterNumbers": [3],
    "customVariables": {
      "skillName": "Strategic Planning",
      "practicalScenario": "Creating a 3-year organizational strategy for community impact",
      "timeMetrics": {
        "before": "3 hours planning sessions",
        "after": "45 minutes focused planning", 
        "savings": "2 hours 15 minutes per session",
        "impactDescription": "More time for execution and team development"
      }
    },
    "qualityThreshold": 0.85
  }',
  'queued',
  NOW()
);

-- Sample usage analytics entry
INSERT INTO template_usage_analytics (
  template_id,
  character_id,
  usage_date,
  usage_count,
  success_count,
  average_quality_score
) VALUES (
  (SELECT id FROM content_templates WHERE template_id = 'interactive-builder'),
  'alex',
  CURRENT_DATE,
  1,
  1,
  0.92
);

-- Create a test configuration for Chapter 3
INSERT INTO generated_content (
  template_id,
  character_id,
  chapter_number,
  content_type,
  content_data,
  quality_score,
  approval_status,
  deployment_status
) VALUES (
  (SELECT id FROM content_templates WHERE template_id = 'interactive-builder'),
  'alex',
  3,
  'interactive-component',
  '{
    "componentName": "AlexChapter3StrategicPlanningBuilder",
    "props": {
      "characterId": "alex",
      "skillName": "Strategic Planning",
      "practicalScenario": "Creating a 3-year organizational strategy for community impact",
      "timeMetrics": {
        "before": "3 hours planning sessions",
        "after": "45 minutes focused planning",
        "savings": "2 hours 15 minutes per session",
        "impactDescription": "More time for execution and team development"
      }
    }
  }',
  0.92,
  'approved',
  'staged'
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_generation_jobs_status_created 
ON content_generation_jobs(status, created_at);

CREATE INDEX IF NOT EXISTS idx_generated_content_chapter_character 
ON generated_content(chapter_number, character_id);

CREATE INDEX IF NOT EXISTS idx_template_analytics_template_character_date 
ON template_usage_analytics(template_id, character_id, usage_date);

-- Create a view for easy content scaling dashboard queries
CREATE OR REPLACE VIEW content_scaling_dashboard AS
SELECT 
  ca.character_id,
  ca.name as character_name,
  ca.profession,
  ct.template_id,
  ct.title as template_title,
  COUNT(gc.id) as content_count,
  AVG(gc.quality_score) as avg_quality,
  MAX(gc.created_at) as last_generated,
  SUM(CASE WHEN gc.approval_status = 'approved' THEN 1 ELSE 0 END) as approved_count
FROM character_archetypes ca
CROSS JOIN content_templates ct
LEFT JOIN generated_content gc ON gc.character_id = ca.character_id 
  AND gc.template_id = ct.id
GROUP BY ca.character_id, ca.name, ca.profession, ct.template_id, ct.title
ORDER BY ca.character_id, ct.template_id;

-- Create a function to get scaling progress
CREATE OR REPLACE FUNCTION get_scaling_progress(chapter_nums INTEGER[])
RETURNS TABLE (
  chapter_number INTEGER,
  character_id VARCHAR,
  template_id VARCHAR,
  status VARCHAR,
  quality_score DECIMAL,
  created_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    gc.chapter_number,
    gc.character_id,
    ct.template_id,
    gc.approval_status,
    gc.quality_score,
    gc.created_at
  FROM generated_content gc
  JOIN content_templates ct ON gc.template_id = ct.id
  WHERE gc.chapter_number = ANY(chapter_nums)
  ORDER BY gc.chapter_number, gc.character_id, ct.template_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to queue chapter generation
CREATE OR REPLACE FUNCTION queue_chapter_generation(
  chapter_num INTEGER,
  character_ids TEXT[] DEFAULT NULL,
  template_ids TEXT[] DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  job_id UUID;
  job_params JSONB;
BEGIN
  -- Generate job ID
  job_id := gen_random_uuid();
  
  -- Build parameters
  job_params := jsonb_build_object(
    'chapterNumbers', jsonb_build_array(chapter_num),
    'characterIds', COALESCE(to_jsonb(character_ids), '["alex", "maya", "david", "rachel", "sofia"]'::jsonb),
    'templateIds', COALESCE(to_jsonb(template_ids), '["interactive-builder", "character-journey"]'::jsonb),
    'qualityThreshold', 0.85,
    'autoApprove', false
  );
  
  -- Insert job
  INSERT INTO content_generation_jobs (
    id,
    job_type,
    generation_parameters,
    status,
    created_at
  ) VALUES (
    job_id,
    'chapter_batch',
    job_params,
    'queued',
    NOW()
  );
  
  RETURN job_id;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Content Scaling System database setup completed successfully!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Test the setup with: SELECT * FROM content_scaling_dashboard;';
  RAISE NOTICE '2. Queue a test job with: SELECT queue_chapter_generation(3, ARRAY[''alex''], ARRAY[''interactive-builder'']);';
  RAISE NOTICE '3. Check job status with: SELECT * FROM content_generation_jobs;';
END $$;