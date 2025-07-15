-- Create handle_updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create analytics views for AI Playground

-- User Engagement Summary View
CREATE OR REPLACE VIEW public.ai_playground_user_engagement AS
SELECT 
    u.id as user_id,
    u.email,
    COUNT(DISTINCT s.id) as total_sessions,
    COUNT(DISTINCT DATE(s.session_start)) as days_active,
    SUM(s.duration_seconds) / 3600.0 as total_hours,
    AVG(s.duration_seconds) / 60.0 as avg_session_minutes,
    COUNT(DISTINCT i.id) as total_interactions,
    COUNT(DISTINCT c.id) as total_creations,
    COUNT(DISTINCT a.id) FILTER (WHERE a.unlocked = TRUE) as achievements_unlocked,
    MAX(s.session_start) as last_active,
    MIN(s.session_start) as first_active,
    ARRAY_AGG(DISTINCT i.tool_name) FILTER (WHERE i.tool_name IS NOT NULL) as tools_used,
    ARRAY_AGG(DISTINCT s.activity_type) as activities_performed
FROM 
    auth.users u
    LEFT JOIN public.ai_playground_sessions s ON u.id = s.user_id
    LEFT JOIN public.ai_playground_interactions i ON u.id = i.user_id
    LEFT JOIN public.ai_playground_creations c ON u.id = c.user_id
    LEFT JOIN public.ai_playground_achievements a ON u.id = a.user_id
GROUP BY u.id, u.email;

-- Tool Usage Analytics View
CREATE OR REPLACE VIEW public.ai_playground_tool_analytics AS
SELECT 
    t.tool_key,
    t.tool_name,
    t.tool_category,
    t.avg_rating,
    t.rating_count,
    COUNT(DISTINCT i.user_id) as unique_users,
    COUNT(i.id) as total_uses,
    AVG(i.response_time_ms) as avg_response_time_ms,
    COUNT(i.id) FILTER (WHERE i.error_occurred = TRUE) as error_count,
    COUNT(i.id) FILTER (WHERE i.completed = TRUE) as successful_uses,
    CASE 
        WHEN COUNT(i.id) > 0 THEN 
            COUNT(i.id) FILTER (WHERE i.completed = TRUE)::NUMERIC / COUNT(i.id) * 100
        ELSE 0 
    END as success_rate,
    AVG(i.user_rating) as avg_user_rating,
    MAX(i.created_at) as last_used
FROM 
    public.ai_playground_toolkit_items t
    LEFT JOIN public.ai_playground_interactions i ON t.tool_key = i.tool_name
GROUP BY t.tool_key, t.tool_name, t.tool_category, t.avg_rating, t.rating_count;

-- Creation Analytics View
CREATE OR REPLACE VIEW public.ai_playground_creation_analytics AS
SELECT 
    c.creation_type,
    COUNT(DISTINCT c.id) as total_creations,
    COUNT(DISTINCT c.user_id) as unique_creators,
    AVG(c.quality_score) as avg_quality_score,
    SUM(c.view_count) as total_views,
    SUM(c.use_count) as total_uses,
    SUM(c.fork_count) as total_forks,
    COUNT(c.id) FILTER (WHERE c.is_published = TRUE) as published_count,
    COUNT(c.id) FILTER (WHERE c.is_template = TRUE) as template_count,
    AVG(c.avg_rating) FILTER (WHERE c.rating_count > 0) as avg_rating,
    ARRAY_AGG(DISTINCT unnest_tags) as popular_tags
FROM 
    public.ai_playground_creations c,
    LATERAL unnest(c.tags) as unnest_tags
GROUP BY c.creation_type;

-- Daily Activity Metrics View
CREATE OR REPLACE VIEW public.ai_playground_daily_metrics AS
SELECT 
    DATE(s.session_start) as activity_date,
    COUNT(DISTINCT s.user_id) as daily_active_users,
    COUNT(DISTINCT s.id) as total_sessions,
    COUNT(DISTINCT i.id) as total_interactions,
    COUNT(DISTINCT c.id) as new_creations,
    SUM(s.duration_seconds) / 3600.0 as total_hours,
    AVG(s.duration_seconds) / 60.0 as avg_session_minutes,
    COUNT(DISTINCT a.id) FILTER (WHERE DATE(a.unlocked_at) = DATE(s.session_start)) as achievements_unlocked
FROM 
    public.ai_playground_sessions s
    LEFT JOIN public.ai_playground_interactions i ON DATE(i.created_at) = DATE(s.session_start)
    LEFT JOIN public.ai_playground_creations c ON DATE(c.created_at) = DATE(s.session_start)
    LEFT JOIN public.ai_playground_achievements a ON DATE(a.unlocked_at) = DATE(s.session_start)
GROUP BY DATE(s.session_start);

-- User Journey Funnel View
CREATE OR REPLACE VIEW public.ai_playground_user_funnel AS
WITH user_milestones AS (
    SELECT 
        u.id as user_id,
        u.created_at as signup_date,
        MIN(s.session_start) as first_session,
        MIN(i.created_at) FILTER (WHERE i.interaction_type = 'prompt_submit') as first_prompt,
        MIN(c.created_at) as first_creation,
        MIN(c.published_at) FILTER (WHERE c.is_published = TRUE) as first_publish,
        COUNT(DISTINCT DATE(s.session_start)) as total_days_active
    FROM 
        auth.users u
        LEFT JOIN public.ai_playground_sessions s ON u.id = s.user_id
        LEFT JOIN public.ai_playground_interactions i ON u.id = i.user_id
        LEFT JOIN public.ai_playground_creations c ON u.id = c.user_id
    GROUP BY u.id, u.created_at
)
SELECT 
    COUNT(DISTINCT user_id) as total_users,
    COUNT(DISTINCT user_id) FILTER (WHERE first_session IS NOT NULL) as started_playground,
    COUNT(DISTINCT user_id) FILTER (WHERE first_prompt IS NOT NULL) as submitted_prompt,
    COUNT(DISTINCT user_id) FILTER (WHERE first_creation IS NOT NULL) as created_content,
    COUNT(DISTINCT user_id) FILTER (WHERE first_publish IS NOT NULL) as published_content,
    COUNT(DISTINCT user_id) FILTER (WHERE total_days_active >= 7) as retained_7_days,
    COUNT(DISTINCT user_id) FILTER (WHERE total_days_active >= 30) as retained_30_days
FROM user_milestones;

-- Performance Metrics View
CREATE OR REPLACE VIEW public.ai_playground_performance_metrics AS
SELECT 
    DATE_TRUNC('hour', i.created_at) as hour,
    COUNT(i.id) as request_count,
    AVG(i.response_time_ms) as avg_response_time_ms,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY i.response_time_ms) as median_response_time_ms,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY i.response_time_ms) as p95_response_time_ms,
    COUNT(i.id) FILTER (WHERE i.error_occurred = TRUE) as error_count,
    COUNT(i.id) FILTER (WHERE i.response_time_ms > 5000) as slow_requests,
    SUM(i.tokens_used) as total_tokens_used
FROM 
    public.ai_playground_interactions i
WHERE 
    i.created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('hour', i.created_at);

-- Grant permissions on views
GRANT SELECT ON public.ai_playground_user_engagement TO authenticated;
GRANT SELECT ON public.ai_playground_tool_analytics TO authenticated;
GRANT SELECT ON public.ai_playground_creation_analytics TO authenticated;
GRANT SELECT ON public.ai_playground_daily_metrics TO authenticated;
GRANT SELECT ON public.ai_playground_user_funnel TO authenticated;
GRANT SELECT ON public.ai_playground_performance_metrics TO authenticated;

-- Add comments for documentation
COMMENT ON VIEW public.ai_playground_user_engagement IS 'Aggregated user engagement metrics for the AI playground';
COMMENT ON VIEW public.ai_playground_tool_analytics IS 'Usage analytics for AI playground tools';
COMMENT ON VIEW public.ai_playground_creation_analytics IS 'Analytics for user-created content in the playground';
COMMENT ON VIEW public.ai_playground_daily_metrics IS 'Daily activity metrics for monitoring playground usage';
COMMENT ON VIEW public.ai_playground_user_funnel IS 'User journey funnel metrics from signup to active creation';
COMMENT ON VIEW public.ai_playground_performance_metrics IS 'Performance metrics for monitoring system health and response times';