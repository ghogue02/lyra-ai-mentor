-- Additional indexes and functions for AI Playground performance optimization

-- Composite indexes for common query patterns
CREATE INDEX idx_ai_playground_sessions_user_activity 
    ON public.ai_playground_sessions(user_id, session_start DESC);

CREATE INDEX idx_ai_playground_interactions_session_sequence 
    ON public.ai_playground_interactions(session_id, interaction_sequence);

CREATE INDEX idx_ai_playground_creations_user_recent 
    ON public.ai_playground_creations(user_id, created_at DESC);

-- Partial indexes for filtered queries
CREATE INDEX idx_ai_playground_sessions_active 
    ON public.ai_playground_sessions(user_id, session_start) 
    WHERE session_end IS NULL;

CREATE INDEX idx_ai_playground_interactions_errors 
    ON public.ai_playground_interactions(created_at DESC) 
    WHERE error_occurred = TRUE;

CREATE INDEX idx_ai_playground_creations_public_quality 
    ON public.ai_playground_creations(quality_score DESC, created_at DESC) 
    WHERE visibility = 'public' AND quality_score IS NOT NULL;

-- Function to get user's recent activity
CREATE OR REPLACE FUNCTION get_user_recent_activity(p_user_id UUID, p_days INTEGER DEFAULT 7)
RETURNS TABLE (
    activity_date DATE,
    sessions_count INTEGER,
    interactions_count INTEGER,
    creations_count INTEGER,
    tools_used TEXT[],
    total_time_minutes INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE(s.session_start) as activity_date,
        COUNT(DISTINCT s.id)::INTEGER as sessions_count,
        COUNT(DISTINCT i.id)::INTEGER as interactions_count,
        COUNT(DISTINCT c.id)::INTEGER as creations_count,
        ARRAY_AGG(DISTINCT i.tool_name) FILTER (WHERE i.tool_name IS NOT NULL) as tools_used,
        (SUM(s.duration_seconds) / 60)::INTEGER as total_time_minutes
    FROM 
        public.ai_playground_sessions s
        LEFT JOIN public.ai_playground_interactions i ON s.id = i.session_id
        LEFT JOIN public.ai_playground_creations c ON s.user_id = c.user_id 
            AND DATE(c.created_at) = DATE(s.session_start)
    WHERE 
        s.user_id = p_user_id
        AND s.session_start >= CURRENT_DATE - INTERVAL '1 day' * p_days
    GROUP BY DATE(s.session_start)
    ORDER BY activity_date DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to calculate user's skill progression
CREATE OR REPLACE FUNCTION calculate_user_skill_level(p_user_id UUID)
RETURNS TABLE (
    skill_category TEXT,
    skill_level INTEGER,
    experience_points INTEGER,
    next_level_points INTEGER,
    achievements_in_category INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH user_activity AS (
        SELECT 
            CASE 
                WHEN i.tool_name IN ('prompt_builder', 'response_analyzer') THEN 'prompt_engineering'
                WHEN i.tool_name IN ('workflow_designer', 'practice_simulator') THEN 'automation'
                WHEN i.tool_name IN ('impact_calculator') THEN 'impact_measurement'
                ELSE 'general'
            END as category,
            COUNT(*) as interaction_count,
            AVG(i.success_score) as avg_success
        FROM public.ai_playground_interactions i
        WHERE i.user_id = p_user_id AND i.completed = TRUE
        GROUP BY category
    ),
    user_achievements AS (
        SELECT 
            a.achievement_category,
            COUNT(*) as achievement_count,
            SUM(a.points_earned) as total_points
        FROM public.ai_playground_achievements a
        WHERE a.user_id = p_user_id AND a.unlocked = TRUE
        GROUP BY a.achievement_category
    )
    SELECT 
        ua.category as skill_category,
        CASE 
            WHEN ua.interaction_count < 10 THEN 1
            WHEN ua.interaction_count < 50 THEN 2
            WHEN ua.interaction_count < 200 THEN 3
            WHEN ua.interaction_count < 500 THEN 4
            ELSE 5
        END as skill_level,
        COALESCE(ach.total_points, 0)::INTEGER as experience_points,
        CASE 
            WHEN ua.interaction_count < 10 THEN 10
            WHEN ua.interaction_count < 50 THEN 50
            WHEN ua.interaction_count < 200 THEN 200
            WHEN ua.interaction_count < 500 THEN 500
            ELSE 1000
        END as next_level_points,
        COALESCE(ach.achievement_count, 0)::INTEGER as achievements_in_category
    FROM user_activity ua
    LEFT JOIN user_achievements ach ON ua.category = ach.achievement_category;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to get recommended tools for user
CREATE OR REPLACE FUNCTION get_recommended_tools(p_user_id UUID, p_limit INTEGER DEFAULT 5)
RETURNS TABLE (
    tool_key TEXT,
    tool_name TEXT,
    recommendation_reason TEXT,
    relevance_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH user_profile AS (
        SELECT 
            ARRAY_AGG(DISTINCT i.tool_name) as used_tools,
            ARRAY_AGG(DISTINCT c.creation_type) as creation_types,
            COUNT(DISTINCT i.id) as total_interactions
        FROM public.ai_playground_interactions i
        LEFT JOIN public.ai_playground_creations c ON i.user_id = c.user_id
        WHERE i.user_id = p_user_id
    ),
    tool_scores AS (
        SELECT 
            t.tool_key,
            t.tool_name,
            CASE 
                WHEN t.tool_key = ANY(up.used_tools) THEN 0  -- Already used
                WHEN t.min_user_level <= 1 AND up.total_interactions < 10 THEN 0.9  -- Beginner friendly
                WHEN t.tool_category IN (
                    SELECT DISTINCT tool_category 
                    FROM public.ai_playground_toolkit_items 
                    WHERE tool_key = ANY(up.used_tools)
                ) THEN 0.8  -- Related category
                ELSE 0.5
            END as relevance_score,
            CASE 
                WHEN t.tool_key = ANY(up.used_tools) THEN 'Already in your toolkit'
                WHEN t.min_user_level <= 1 AND up.total_interactions < 10 THEN 'Perfect for beginners'
                WHEN t.tool_category IN (
                    SELECT DISTINCT tool_category 
                    FROM public.ai_playground_toolkit_items 
                    WHERE tool_key = ANY(up.used_tools)
                ) THEN 'Similar to tools you use'
                ELSE 'Expand your skills'
            END as recommendation_reason
        FROM public.ai_playground_toolkit_items t
        CROSS JOIN user_profile up
        WHERE t.is_active = TRUE
    )
    SELECT 
        tool_key,
        tool_name,
        recommendation_reason,
        relevance_score
    FROM tool_scores
    WHERE relevance_score > 0
    ORDER BY relevance_score DESC, tool_name
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to track tool usage
CREATE OR REPLACE FUNCTION track_tool_usage(
    p_session_id UUID,
    p_user_id UUID,
    p_tool_name TEXT,
    p_interaction_type TEXT,
    p_response_time_ms INTEGER DEFAULT NULL,
    p_success BOOLEAN DEFAULT TRUE,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    v_interaction_id UUID;
    v_sequence INTEGER;
BEGIN
    -- Get the next sequence number for this session
    SELECT COALESCE(MAX(interaction_sequence), 0) + 1
    INTO v_sequence
    FROM public.ai_playground_interactions
    WHERE session_id = p_session_id;
    
    -- Insert the interaction
    INSERT INTO public.ai_playground_interactions (
        session_id,
        user_id,
        interaction_type,
        tool_name,
        response_time_ms,
        completed,
        metadata,
        interaction_sequence
    ) VALUES (
        p_session_id,
        p_user_id,
        p_interaction_type,
        p_tool_name,
        p_response_time_ms,
        p_success,
        p_metadata,
        v_sequence
    ) RETURNING id INTO v_interaction_id;
    
    -- Update session metrics
    UPDATE public.ai_playground_sessions
    SET 
        total_interactions = total_interactions + 1,
        tools_used = CASE 
            WHEN p_tool_name = ANY(tools_used) THEN tools_used
            ELSE array_append(tools_used, p_tool_name)
        END,
        avg_response_time_ms = CASE 
            WHEN p_response_time_ms IS NOT NULL THEN
                (COALESCE(avg_response_time_ms, 0) * total_interactions + p_response_time_ms) / (total_interactions + 1)
            ELSE avg_response_time_ms
        END,
        error_count = error_count + CASE WHEN p_success THEN 0 ELSE 1 END
    WHERE id = p_session_id;
    
    -- Update tool usage statistics
    UPDATE public.ai_playground_toolkit_items
    SET 
        total_uses = total_uses + 1,
        last_used_at = NOW(),
        success_rate = CASE 
            WHEN total_uses > 0 THEN
                ((success_rate * total_uses) + CASE WHEN p_success THEN 1 ELSE 0 END) / (total_uses + 1)
            ELSE CASE WHEN p_success THEN 1 ELSE 0 END
        END
    WHERE tool_key = p_tool_name;
    
    RETURN v_interaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_user_recent_activity TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_user_skill_level TO authenticated;
GRANT EXECUTE ON FUNCTION get_recommended_tools TO authenticated;
GRANT EXECUTE ON FUNCTION track_tool_usage TO authenticated;
GRANT EXECUTE ON FUNCTION check_and_award_achievements TO authenticated;

-- Add comments for documentation
COMMENT ON FUNCTION get_user_recent_activity IS 'Returns user activity summary for the specified number of days';
COMMENT ON FUNCTION calculate_user_skill_level IS 'Calculates user skill levels based on interactions and achievements';
COMMENT ON FUNCTION get_recommended_tools IS 'Recommends tools based on user activity and profile';
COMMENT ON FUNCTION track_tool_usage IS 'Records tool usage and updates related statistics';