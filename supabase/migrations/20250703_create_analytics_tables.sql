-- Create analytics tables for interactive element tracking

-- Event tracking table
CREATE TABLE IF NOT EXISTS element_analytics_events (
  id SERIAL PRIMARY KEY,
  element_id INTEGER NOT NULL,
  element_type VARCHAR(100) NOT NULL,
  lesson_id INTEGER NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  session_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_element_analytics_events_element_id ON element_analytics_events(element_id);
CREATE INDEX idx_element_analytics_events_user_id ON element_analytics_events(user_id);
CREATE INDEX idx_element_analytics_events_timestamp ON element_analytics_events(timestamp);
CREATE INDEX idx_element_analytics_events_session_id ON element_analytics_events(session_id);
CREATE INDEX idx_element_analytics_events_event_type ON element_analytics_events(event_type);

-- Aggregated analytics summary table
CREATE TABLE IF NOT EXISTS element_analytics_summary (
  id SERIAL PRIMARY KEY,
  element_id INTEGER NOT NULL,
  element_type VARCHAR(100) NOT NULL,
  element_title TEXT,
  lesson_id INTEGER NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  start_count INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  abandonment_count INTEGER DEFAULT 0,
  completion_rate FLOAT DEFAULT 0,
  total_time_spent INTEGER DEFAULT 0,
  average_time_spent INTEGER DEFAULT 0,
  min_time_spent INTEGER,
  max_time_spent INTEGER,
  total_interactions INTEGER DEFAULT 0,
  retry_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  hint_view_count INTEGER DEFAULT 0,
  help_request_count INTEGER DEFAULT 0,
  phase_completions JSONB DEFAULT '{}',
  average_phase_time JSONB DEFAULT '{}',
  last_updated TIMESTAMP DEFAULT NOW(),
  UNIQUE(element_id, user_id)
);

-- Create indexes for summary table
CREATE INDEX idx_element_analytics_summary_element_id ON element_analytics_summary(element_id);
CREATE INDEX idx_element_analytics_summary_user_id ON element_analytics_summary(user_id);
CREATE INDEX idx_element_analytics_summary_lesson_id ON element_analytics_summary(lesson_id);
CREATE INDEX idx_element_analytics_summary_completion_rate ON element_analytics_summary(completion_rate);

-- A/B test variants table
CREATE TABLE IF NOT EXISTS ab_test_variants (
  variant_id VARCHAR(100) PRIMARY KEY,
  element_id INTEGER NOT NULL,
  variant_name VARCHAR(100) NOT NULL,
  configuration JSONB NOT NULL DEFAULT '{}',
  weight FLOAT NOT NULL CHECK (weight >= 0 AND weight <= 1),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for A/B test variants
CREATE INDEX idx_ab_test_variants_element_id ON ab_test_variants(element_id);
CREATE INDEX idx_ab_test_variants_is_active ON ab_test_variants(is_active);

-- A/B test results table
CREATE TABLE IF NOT EXISTS ab_test_results (
  id SERIAL PRIMARY KEY,
  variant_id VARCHAR(100) NOT NULL REFERENCES ab_test_variants(variant_id) ON DELETE CASCADE,
  element_id INTEGER NOT NULL,
  sample_size INTEGER DEFAULT 0,
  completion_rate FLOAT DEFAULT 0,
  average_time_spent INTEGER DEFAULT 0,
  engagement_score FLOAT DEFAULT 0,
  statistical_significance FLOAT DEFAULT 0,
  calculated_at TIMESTAMP DEFAULT NOW(),
  last_updated TIMESTAMP DEFAULT NOW()
);

-- Create indexes for A/B test results
CREATE INDEX idx_ab_test_results_variant_id ON ab_test_results(variant_id);
CREATE INDEX idx_ab_test_results_element_id ON ab_test_results(element_id);

-- Function to update analytics summary
CREATE OR REPLACE FUNCTION update_element_analytics_summary()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert summary data based on new events
  INSERT INTO element_analytics_summary (
    element_id,
    element_type,
    lesson_id,
    user_id,
    start_count,
    completion_count,
    total_interactions,
    last_updated
  ) VALUES (
    NEW.element_id,
    NEW.element_type,
    NEW.lesson_id,
    NEW.user_id,
    CASE WHEN NEW.event_type = 'element_started' THEN 1 ELSE 0 END,
    CASE WHEN NEW.event_type = 'element_completed' THEN 1 ELSE 0 END,
    1,
    NOW()
  )
  ON CONFLICT (element_id, user_id) DO UPDATE SET
    start_count = element_analytics_summary.start_count + 
      CASE WHEN NEW.event_type = 'element_started' THEN 1 ELSE 0 END,
    completion_count = element_analytics_summary.completion_count + 
      CASE WHEN NEW.event_type = 'element_completed' THEN 1 ELSE 0 END,
    abandonment_count = element_analytics_summary.abandonment_count + 
      CASE WHEN NEW.event_type = 'element_abandoned' THEN 1 ELSE 0 END,
    total_interactions = element_analytics_summary.total_interactions + 1,
    retry_count = element_analytics_summary.retry_count + 
      CASE WHEN NEW.event_type = 'retry_attempted' THEN 1 ELSE 0 END,
    error_count = element_analytics_summary.error_count + 
      CASE WHEN NEW.event_type = 'error_occurred' THEN 1 ELSE 0 END,
    hint_view_count = element_analytics_summary.hint_view_count + 
      CASE WHEN NEW.event_type = 'hint_viewed' THEN 1 ELSE 0 END,
    help_request_count = element_analytics_summary.help_request_count + 
      CASE WHEN NEW.event_type = 'help_requested' THEN 1 ELSE 0 END,
    last_updated = NOW();
    
  -- Update completion rate
  UPDATE element_analytics_summary 
  SET completion_rate = CASE 
    WHEN start_count > 0 THEN completion_count::float / start_count::float 
    ELSE 0 
  END
  WHERE element_id = NEW.element_id AND user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic summary updates
CREATE TRIGGER update_analytics_summary_trigger
AFTER INSERT ON element_analytics_events
FOR EACH ROW
EXECUTE FUNCTION update_element_analytics_summary();

-- Grant permissions
GRANT ALL ON element_analytics_events TO authenticated;
GRANT ALL ON element_analytics_summary TO authenticated;
GRANT ALL ON ab_test_variants TO authenticated;
GRANT ALL ON ab_test_results TO authenticated;

-- Enable Row Level Security
ALTER TABLE element_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE element_analytics_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own analytics events
CREATE POLICY "Users can view own analytics events" ON element_analytics_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics events" ON element_analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own summary data
CREATE POLICY "Users can view own analytics summary" ON element_analytics_summary
  FOR SELECT USING (auth.uid() = user_id);

-- Admin users can view all analytics (optional - adjust based on your needs)
-- CREATE POLICY "Admins can view all analytics" ON element_analytics_events
--   FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- A/B test variants are viewable by all authenticated users
CREATE POLICY "Authenticated users can view active variants" ON ab_test_variants
  FOR SELECT USING (is_active = true);

-- A/B test results are viewable by all authenticated users
CREATE POLICY "Authenticated users can view test results" ON ab_test_results
  FOR SELECT USING (true);