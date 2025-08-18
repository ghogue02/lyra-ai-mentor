-- Integration Testing Commands for Chapter 7 AI Enhancement Migration
-- Date: 2025-08-18
-- Purpose: Comprehensive testing commands to validate schema integration with application features

-- =========================================================================
-- IMPORTANT TESTING NOTES
-- =========================================================================

/*
BEFORE RUNNING INTEGRATION TESTS:
1. Ensure the main migration (20250818_001_enhance_ai_interactions.sql) has been applied
2. Run validation queries (20250818_002_validation_queries.sql) to confirm schema setup
3. Replace 'test-user-uuid' with actual user IDs from your auth.users table
4. Have Chapter 7 lessons (71-74) created in your lessons table
5. Ensure interactive elements exist for Chapter 7 lessons

TEST EXECUTION ORDER:
1. Schema integration tests
2. Sample data insertion tests  
3. Progressive revelation workflow tests
4. Character-specific processing tests
5. Workshop interaction flow tests
6. Analytics and reporting tests
7. Performance and load tests
8. Edge case and error condition tests
*/

-- =========================================================================
-- PART 1: SCHEMA INTEGRATION TESTS
-- =========================================================================

-- Test 1: Verify Chapter 7 lessons exist and can be referenced
SELECT 
  'Chapter 7 Lesson Integration Test' as test_name,
  l.id as lesson_id,
  l.title,
  l.chapter_id,
  CASE 
    WHEN l.chapter_id = 7 THEN 'PASS'
    ELSE 'FAIL - Chapter mismatch'
  END as test_result
FROM lessons l 
WHERE l.id IN (71, 72, 73, 74)
ORDER BY l.id;

-- Test 2: Verify interactive elements exist for Chapter 7
SELECT 
  'Chapter 7 Interactive Elements Test' as test_name,
  ie.id as element_id,
  ie.lesson_id,
  ie.title,
  ie.type,
  CASE 
    WHEN ie.type = 'ai_content_generator' THEN 'PASS - AI Content Element'
    ELSE 'INFO - Other Element Type'
  END as test_result
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
WHERE l.chapter_id = 7
ORDER BY ie.lesson_id, ie.order_index;

-- Test 3: Foreign key relationship validation
SELECT 
  'Foreign Key Relationship Test' as test_name,
  'ai_content_states -> lessons' as relationship,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_type = 'FOREIGN KEY' 
        AND table_name = 'ai_content_states' 
        AND constraint_name LIKE '%lesson_id%'
    ) THEN 'PASS'
    ELSE 'FAIL'
  END as test_result

UNION ALL

SELECT 
  'Foreign Key Relationship Test' as test_name,
  'workshop_interactions -> ai_content_states' as relationship,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_type = 'FOREIGN KEY' 
        AND table_name = 'workshop_interactions' 
        AND constraint_name LIKE '%ai_content_state%'
    ) THEN 'PASS'
    ELSE 'FAIL'
  END as test_result;

-- =========================================================================
-- PART 2: SAMPLE DATA INSERTION TESTS
-- =========================================================================

-- Test 4: Insert sample AI content state (replace with real user UUID)
-- Note: Comment/uncomment as needed for testing

/*
-- First, get a valid user ID for testing
SELECT id as user_id FROM auth.users LIMIT 1;

-- Insert test AI content state
INSERT INTO public.ai_content_states (
  user_id, 
  session_id, 
  lesson_id, 
  content_type,
  character_persona,
  generation_status,
  revelation_stage,
  total_stages,
  current_content,
  user_inputs,
  processing_metrics
) VALUES (
  (SELECT id FROM auth.users LIMIT 1), -- Use actual user ID
  'test-session-' || EXTRACT(EPOCH FROM NOW())::TEXT,
  71, -- Carmen's Performance Framework lesson
  'performance_framework',
  'carmen',
  'initiated',
  1,
  3,
  '{"framework_draft": "initial competency structure", "completion": 0.33}',
  '{"position_title": "Program Coordinator", "organization_focus": "Social Services", "team_size": "Medium team (6-15 coordinators)"}',
  '{"processing_time_ms": 1250, "confidence_score": 0.85}'
) RETURNING 
  'AI Content State Insert Test' as test_name,
  id as inserted_id,
  'PASS - Record created' as test_result;
*/

-- Test 5: Insert sample workshop interaction
/*
WITH test_content_state AS (
  SELECT id FROM public.ai_content_states 
  WHERE character_persona = 'carmen' 
    AND content_type = 'performance_framework'
  LIMIT 1
)
INSERT INTO public.workshop_interactions (
  user_id,
  ai_content_state_id,
  lesson_id,
  workshop_phase,
  interaction_step,
  step_type,
  user_input,
  ai_response,
  time_spent_seconds,
  character_engagement_level
) 
SELECT 
  (SELECT user_id FROM public.ai_content_states WHERE id = tcs.id),
  tcs.id,
  71,
  'discovery',
  1,
  'input_collection',
  '{"current_challenges": "Inconsistent manager ratings", "priority_focus": "bias reduction"}',
  '{"acknowledgment": "I understand the frustration with inconsistent performance evaluations...", "next_steps": "Let me help you design objective criteria"}',
  180,
  'high'
FROM test_content_state tcs
RETURNING 
  'Workshop Interaction Insert Test' as test_name,
  id as inserted_id,
  'PASS - Record created' as test_result;
*/

-- Test 6: Insert sample character AI metrics
/*
INSERT INTO public.character_ai_metrics (
  character_name,
  user_id,
  lesson_id,
  processing_session_id,
  content_generation_type,
  model_used,
  processing_time_ms,
  persona_adherence_score,
  context_relevance_score,
  user_alignment_score,
  content_coherence,
  practical_applicability,
  token_consumption
) VALUES (
  'carmen',
  (SELECT id FROM auth.users LIMIT 1),
  71,
  'test-session-' || EXTRACT(EPOCH FROM NOW())::TEXT,
  'performance_framework',
  'gpt-4-turbo',
  2350,
  0.94, -- Carmen persona adherence
  0.89, -- Context relevance 
  0.91, -- User alignment
  0.87, -- Content coherence
  0.92, -- Practical applicability
  '{"prompt_tokens": 450, "completion_tokens": 850, "total_tokens": 1300}'
) RETURNING 
  'Character AI Metrics Insert Test' as test_name,
  id as inserted_id,
  'PASS - Record created' as test_result;
*/

-- =========================================================================
-- PART 3: PROGRESSIVE REVELATION WORKFLOW TESTS
-- =========================================================================

-- Test 7: Simulate progressive content revelation
/*
-- Update AI content state to next revelation stage
UPDATE public.ai_content_states 
SET 
  revelation_stage = 2,
  generation_status = 'processing',
  current_content = current_content || '{"stage_2": "detailed competency definitions", "completion": 0.67}',
  updated_at = NOW()
WHERE character_persona = 'carmen' 
  AND content_type = 'performance_framework'
  AND revelation_stage = 1
RETURNING 
  'Progressive Revelation Test' as test_name,
  id as content_state_id,
  revelation_stage,
  'PASS - Stage advanced' as test_result;

-- Complete the revelation process
UPDATE public.ai_content_states 
SET 
  revelation_stage = 3,
  generation_status = 'completed',
  current_content = current_content || '{"stage_3": "implementation guide", "completion": 1.0}',
  quality_score = 0.88,
  updated_at = NOW()
WHERE character_persona = 'carmen' 
  AND content_type = 'performance_framework'
  AND revelation_stage = 2
RETURNING 
  'Progressive Revelation Completion Test' as test_name,
  id as content_state_id,
  generation_status,
  'PASS - Content completed' as test_result;
*/

-- =========================================================================
-- PART 4: CHARACTER-SPECIFIC PROCESSING TESTS
-- =========================================================================

-- Test 8: Validate character persona constraints
SELECT 
  'Character Persona Validation Test' as test_name,
  character_persona,
  COUNT(*) as record_count,
  CASE 
    WHEN character_persona IN ('carmen', 'maya', 'sofia', 'david', 'rachel', 'alex', 'lyra') 
    THEN 'PASS - Valid persona'
    ELSE 'FAIL - Invalid persona'
  END as test_result
FROM public.ai_content_states 
WHERE character_persona IS NOT NULL
GROUP BY character_persona;

-- Test 9: Content type validation by character
SELECT 
  'Content Type by Character Test' as test_name,
  character_persona,
  content_type,
  COUNT(*) as record_count,
  CASE 
    WHEN character_persona = 'carmen' AND content_type IN ('performance_framework', 'hr_automation')
    THEN 'PASS - Carmen content match'
    WHEN character_persona IN ('maya', 'sofia', 'david', 'rachel', 'alex') 
    THEN 'INFO - Other character content'
    ELSE 'WARNING - Unexpected content/character combination'
  END as test_result
FROM public.ai_content_states 
WHERE character_persona IS NOT NULL AND content_type IS NOT NULL
GROUP BY character_persona, content_type;

-- =========================================================================
-- PART 5: WORKSHOP INTERACTION FLOW TESTS
-- =========================================================================

-- Test 10: Workshop phase progression validation
SELECT 
  'Workshop Phase Progression Test' as test_name,
  workshop_phase,
  COUNT(*) as interaction_count,
  AVG(time_spent_seconds) as avg_time_spent,
  CASE 
    WHEN workshop_phase IN ('discovery', 'analysis', 'design', 'implementation', 'refinement', 'completion')
    THEN 'PASS - Valid phase'
    ELSE 'FAIL - Invalid phase'
  END as test_result
FROM public.workshop_interactions
GROUP BY workshop_phase
ORDER BY 
  CASE workshop_phase
    WHEN 'discovery' THEN 1
    WHEN 'analysis' THEN 2
    WHEN 'design' THEN 3
    WHEN 'implementation' THEN 4
    WHEN 'refinement' THEN 5
    WHEN 'completion' THEN 6
    ELSE 7
  END;

-- Test 11: Step type validation within phases
SELECT 
  'Workshop Step Type Test' as test_name,
  workshop_phase,
  step_type,
  COUNT(*) as step_count,
  CASE 
    WHEN step_type IN ('input_collection', 'ai_generation', 'user_review', 'refinement_request', 'validation', 'progress_check', 'completion_confirmation')
    THEN 'PASS - Valid step type'
    ELSE 'FAIL - Invalid step type'
  END as test_result
FROM public.workshop_interactions
GROUP BY workshop_phase, step_type
ORDER BY workshop_phase, step_type;

-- =========================================================================
-- PART 6: ANALYTICS AND REPORTING TESTS
-- =========================================================================

-- Test 12: Analytics views functionality
SELECT 
  'AI Content Analytics View Test' as test_name,
  COUNT(*) as record_count,
  CASE 
    WHEN COUNT(*) >= 0 THEN 'PASS - View accessible'
    ELSE 'FAIL - View error'
  END as test_result
FROM public.ai_content_analytics;

SELECT 
  'Workshop Progress Analytics View Test' as test_name,
  COUNT(*) as record_count,
  CASE 
    WHEN COUNT(*) >= 0 THEN 'PASS - View accessible'
    ELSE 'FAIL - View error'
  END as test_result
FROM public.workshop_progress_analytics;

SELECT 
  'Character Performance Summary View Test' as test_name,
  COUNT(*) as record_count,
  CASE 
    WHEN COUNT(*) >= 0 THEN 'PASS - View accessible'
    ELSE 'FAIL - View error'
  END as test_result
FROM public.character_performance_summary;

-- Test 13: Analytics data accuracy (if data exists)
/*
SELECT 
  'Analytics Data Accuracy Test' as test_name,
  character_persona as character,
  content_type,
  generation_status,
  total_generations,
  success_rate_percent,
  CASE 
    WHEN success_rate_percent BETWEEN 0 AND 100 THEN 'PASS - Valid success rate'
    ELSE 'FAIL - Invalid success rate calculation'
  END as test_result
FROM public.ai_content_analytics
WHERE total_generations > 0
LIMIT 5;
*/

-- =========================================================================
-- PART 7: PERFORMANCE AND LOAD TESTS
-- =========================================================================

-- Test 14: Index usage validation
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) 
SELECT * FROM public.ai_content_states 
WHERE user_id = (SELECT id FROM auth.users LIMIT 1)
  AND lesson_id = 71 
  AND generation_status = 'completed';

-- Test 15: Query performance for common patterns
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT 
  acs.content_type,
  acs.generation_status,
  wi.workshop_phase,
  cam.persona_adherence_score
FROM public.ai_content_states acs
LEFT JOIN public.workshop_interactions wi ON acs.id = wi.ai_content_state_id
LEFT JOIN public.character_ai_metrics cam ON acs.user_id = cam.user_id AND acs.lesson_id = cam.lesson_id
WHERE acs.user_id = (SELECT id FROM auth.users LIMIT 1)
  AND acs.lesson_id IN (71, 72, 73, 74)
ORDER BY acs.created_at DESC
LIMIT 10;

-- =========================================================================
-- PART 8: EDGE CASE AND ERROR CONDITION TESTS
-- =========================================================================

-- Test 16: Constraint validation tests
-- These should fail with constraint violations:

/*
-- Test invalid character persona (should fail)
BEGIN;
INSERT INTO public.ai_content_states (
  user_id, session_id, lesson_id, content_type, character_persona
) VALUES (
  (SELECT id FROM auth.users LIMIT 1), 'test', 71, 'performance_framework', 'invalid_character'
);
ROLLBACK; -- Always rollback test failures

-- Test invalid revelation stage (should fail)  
BEGIN;
INSERT INTO public.ai_content_states (
  user_id, session_id, lesson_id, content_type, revelation_stage, total_stages
) VALUES (
  (SELECT id FROM auth.users LIMIT 1), 'test', 71, 'performance_framework', 5, 3 -- stage > total
);
ROLLBACK;

-- Test invalid quality score (should fail)
BEGIN;  
INSERT INTO public.character_ai_metrics (
  character_name, user_id, lesson_id, processing_session_id, 
  content_generation_type, model_used, processing_time_ms, persona_adherence_score
) VALUES (
  'carmen', (SELECT id FROM auth.users LIMIT 1), 71, 'test', 
  'performance_framework', 'test-model', 1000, 1.5 -- score > 1.0
);
ROLLBACK;
*/

-- Test 17: RLS policy validation
-- Test that users cannot access other users' data
/*
-- This should return no results if RLS is working correctly
SELECT 
  'RLS Policy Test' as test_name,
  COUNT(*) as accessible_records,
  CASE 
    WHEN COUNT(*) = 0 THEN 'PASS - RLS blocking cross-user access'
    ELSE 'WARNING - RLS may not be working correctly'
  END as test_result
FROM public.ai_content_states 
WHERE user_id != auth.uid(); -- Should be blocked by RLS
*/

-- =========================================================================
-- PART 9: INTEGRATION WITH EXISTING TABLES TESTS
-- =========================================================================

-- Test 18: Enhanced user_interactions integration
SELECT 
  'Enhanced User Interactions Test' as test_name,
  ui.interaction_type,
  ui.workshop_phase,
  ui.validation_status,
  COUNT(*) as interaction_count,
  CASE 
    WHEN ui.workshop_phase IS NOT NULL AND ui.validation_status IS NOT NULL
    THEN 'PASS - Enhanced fields working'
    ELSE 'INFO - Standard interaction'
  END as test_result
FROM public.user_interactions ui
WHERE ui.lesson_id IN (SELECT id FROM lessons WHERE chapter_id = 7)
GROUP BY ui.interaction_type, ui.workshop_phase, ui.validation_status;

-- Test 19: Enhanced lesson_progress integration  
SELECT 
  'Enhanced Lesson Progress Test' as test_name,
  lp.lesson_id,
  lp.progress_percentage,
  lp.ai_interactions_completed,
  lp.personalized_content_generated,
  CASE 
    WHEN lp.ai_interactions_completed >= 0 AND lp.personalized_content_generated >= 0
    THEN 'PASS - Enhanced tracking fields working'
    ELSE 'WARNING - Enhanced fields may have issues'
  END as test_result
FROM public.lesson_progress lp
WHERE lp.lesson_id IN (SELECT id FROM lessons WHERE chapter_id = 7);

-- =========================================================================
-- PART 10: COMPREHENSIVE INTEGRATION TEST SUMMARY
-- =========================================================================

-- Test 20: Overall integration health check
WITH integration_health AS (
  SELECT 
    'Tables Created' as component,
    (SELECT COUNT(*) FROM information_schema.tables 
     WHERE table_schema = 'public' 
       AND table_name IN ('ai_content_states', 'workshop_interactions', 'character_ai_metrics')) as expected_count,
    3 as target_count
  
  UNION ALL
  
  SELECT 
    'Views Created' as component,
    (SELECT COUNT(*) FROM information_schema.views 
     WHERE table_schema = 'public' 
       AND table_name IN ('ai_content_analytics', 'workshop_progress_analytics', 'character_performance_summary')) as expected_count,
    3 as target_count
    
  UNION ALL
  
  SELECT 
    'Indexes Created' as component,
    (SELECT COUNT(*) FROM pg_indexes 
     WHERE schemaname = 'public' 
       AND tablename IN ('ai_content_states', 'workshop_interactions', 'character_ai_metrics')
       AND indexname LIKE 'idx_%') as expected_count,
    15 as target_count -- Approximate expected index count
    
  UNION ALL
  
  SELECT 
    'RLS Policies' as component,
    (SELECT COUNT(*) FROM pg_policies 
     WHERE schemaname = 'public' 
       AND tablename IN ('ai_content_states', 'workshop_interactions', 'character_ai_metrics')) as expected_count,
    8 as target_count -- Expected policy count
)
SELECT 
  'Integration Health Summary' as test_name,
  component,
  expected_count,
  target_count,
  CASE 
    WHEN expected_count >= target_count * 0.8 THEN 'PASS'
    WHEN expected_count >= target_count * 0.5 THEN 'WARNING'
    ELSE 'FAIL'
  END as test_result
FROM integration_health;

-- Final integration test summary
SELECT 
  'INTEGRATION TESTING COMPLETED' as status,
  NOW() as test_completion_timestamp,
  'Review individual test results above for detailed analysis' as instructions,
  'Ready for application-level testing with Chapter 7 features' as next_steps;