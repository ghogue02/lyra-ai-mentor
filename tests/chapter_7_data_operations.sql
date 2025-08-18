-- Chapter 7 Data Operations Test
-- Test AI content state tracking, workshop interactions, and character metrics

-- Create a test user (simulating auth.uid())
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
    test_session_id TEXT := 'test-session-' || extract(epoch from now());
    ai_content_id UUID;
    workshop_interaction_id UUID;
BEGIN
    -- Test 1: Create AI content state for Carmen's performance framework workshop
    INSERT INTO ai_content_states (
        user_id,
        session_id,
        lesson_id,
        interactive_element_id,
        content_type,
        character_persona,
        generation_status,
        revelation_stage,
        total_stages,
        current_content,
        processing_metrics,
        user_inputs
    ) VALUES (
        test_user_id,
        test_session_id,
        71, -- Bias-Free Performance Excellence lesson
        (SELECT id FROM interactive_elements WHERE lesson_id = 71 AND type = 'workshop' LIMIT 1),
        'performance_framework',
        'carmen',
        'processing',
        1,
        3,
        '{"framework_type": "bias_free_performance", "stage_1_data": {"objectives": ["eliminate bias", "focus on growth"]}}',
        '{"processing_time_ms": 1500, "complexity_score": 0.7}',
        '{"organization_size": "medium", "current_process": "annual_reviews", "pain_points": ["bias", "lack_of_development_focus"]}'
    ) RETURNING id INTO ai_content_id;
    
    RAISE NOTICE 'Created AI content state with ID: %', ai_content_id;

    -- Test 2: Create workshop interaction for the performance framework
    INSERT INTO workshop_interactions (
        user_id,
        ai_content_state_id,
        lesson_id,
        workshop_phase,
        interaction_step,
        step_type,
        user_input,
        ai_response,
        interaction_metadata,
        is_completed,
        time_spent_seconds,
        character_engagement_level
    ) VALUES (
        test_user_id,
        ai_content_id,
        71,
        'discovery',
        1,
        'input_collection',
        '{"current_challenges": ["unconscious bias in reviews", "focus on past mistakes"], "team_size": 15, "industry": "nonprofit"}',
        '{"carmen_response": "I understand those challenges! Let''s design a framework that focuses on future potential...", "suggestions": ["competency-based evaluations", "growth conversations"]}',
        '{"engagement_score": 0.8, "personalization_applied": true}',
        true,
        180,
        'high'
    ) RETURNING id INTO workshop_interaction_id;
    
    RAISE NOTICE 'Created workshop interaction with ID: %', workshop_interaction_id;

    -- Test 3: Create character AI metrics for Carmen
    INSERT INTO character_ai_metrics (
        character_name,
        user_id,
        lesson_id,
        processing_session_id,
        content_generation_type,
        model_used,
        processing_time_ms,
        token_consumption,
        persona_adherence_score,
        context_relevance_score,
        user_alignment_score,
        content_coherence,
        practical_applicability,
        innovation_factor,
        user_satisfaction_rating,
        completion_rate,
        learning_insights,
        success_patterns
    ) VALUES (
        'carmen',
        test_user_id,
        71,
        test_session_id,
        'performance_framework',
        'claude-3.5-sonnet',
        1250,
        '{"input_tokens": 450, "output_tokens": 850, "total_tokens": 1300}',
        0.92, -- High persona adherence
        0.88, -- Good context relevance
        0.85, -- Strong user alignment
        0.90, -- Excellent coherence
        0.87, -- High practical applicability
        0.75, -- Good innovation
        4, -- Satisfied user
        0.95, -- Nearly complete
        '{"key_insights": ["user values human-centered approach", "prefers practical over theoretical"], "learning_patterns": ["responds well to empathetic guidance"]}',
        '{"successful_elements": ["personal anecdotes", "step-by-step guidance"], "user_preferences": ["compassionate tone", "actionable advice"]}'
    );

    RAISE NOTICE 'Created character AI metrics for Carmen';

    -- Test 4: Update lesson progress with AI interaction data
    INSERT INTO lesson_progress (
        user_id,
        lesson_id,
        status,
        progress_percentage,
        started_at,
        ai_interactions_completed,
        character_engagement_scores,
        personalized_content_generated,
        workshop_phases_completed
    ) VALUES (
        test_user_id,
        71,
        'in_progress',
        35.0,
        NOW(),
        1,
        '{"carmen": 0.85}',
        1,
        '{"discovery": {"completed": true, "score": 0.8}}'
    );

    RAISE NOTICE 'Created lesson progress entry';

    -- Test 5: Query the analytics views
    RAISE NOTICE 'Testing analytics views...';
    
    -- Test the AI content analytics view
    PERFORM * FROM ai_content_analytics WHERE character_persona = 'carmen';
    
    -- Test the workshop progress analytics view  
    PERFORM * FROM workshop_progress_analytics WHERE workshop_phase = 'discovery';
    
    -- Test the character performance summary view
    PERFORM * FROM character_performance_summary WHERE character_name = 'carmen';
    
    RAISE NOTICE 'Analytics views accessible - test completed successfully!';

END $$;