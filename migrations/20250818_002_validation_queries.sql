-- Validation Queries for Chapter 7 AI Enhancement Migration
-- Date: 2025-08-18
-- Purpose: Comprehensive validation and testing queries to ensure schema changes work correctly

-- =========================================================================
-- PART 1: TABLE STRUCTURE VALIDATION
-- =========================================================================

-- Verify all new tables were created successfully
SELECT 
  table_name,
  table_type,
  CASE 
    WHEN table_name IN ('ai_content_states', 'workshop_interactions', 'character_ai_metrics') 
    THEN '✓ NEW TABLE CREATED'
    ELSE 'EXISTING TABLE'
  END as creation_status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'ai_content_states', 
    'workshop_interactions', 
    'character_ai_metrics',
    'user_interactions',
    'lesson_progress'
  )
ORDER BY creation_status, table_name;

-- =========================================================================
-- PART 2: COLUMN VALIDATION
-- =========================================================================

-- Check ai_content_states table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'ai_content_states'
ORDER BY ordinal_position;

-- Check workshop_interactions table structure  
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'workshop_interactions'
ORDER BY ordinal_position;

-- Check character_ai_metrics table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'character_ai_metrics'
ORDER BY ordinal_position;

-- Verify new columns were added to existing tables
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('user_interactions', 'lesson_progress')
  AND column_name IN (
    'ai_content_state_id', 'workshop_phase', 'refinement_iteration',
    'validation_status', 'quality_metrics', 'processing_context',
    'ai_interactions_completed', 'workshop_phases_completed',
    'character_engagement_scores', 'personalized_content_generated',
    'refinement_cycles_completed', 'validation_passes'
  )
ORDER BY table_name, column_name;

-- =========================================================================
-- PART 3: CONSTRAINT VALIDATION
-- =========================================================================

-- Check all CHECK constraints
SELECT 
  tc.constraint_name,
  tc.table_name,
  cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc 
  ON tc.constraint_name = cc.constraint_name
WHERE tc.constraint_schema = 'public' 
  AND tc.table_name IN ('ai_content_states', 'workshop_interactions', 'character_ai_metrics')
  AND tc.constraint_type = 'CHECK'
ORDER BY tc.table_name, tc.constraint_name;

-- Check foreign key constraints
SELECT 
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.constraint_schema = 'public'
  AND tc.table_name IN ('ai_content_states', 'workshop_interactions', 'character_ai_metrics')
ORDER BY tc.table_name, tc.constraint_name;

-- =========================================================================
-- PART 4: INDEX VALIDATION
-- =========================================================================

-- Verify all indexes were created
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('ai_content_states', 'workshop_interactions', 'character_ai_metrics')
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- Check index usage statistics (after some data is inserted)
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('ai_content_states', 'workshop_interactions', 'character_ai_metrics')
ORDER BY tablename, indexname;

-- =========================================================================
-- PART 5: RLS POLICY VALIDATION
-- =========================================================================

-- Check RLS is enabled on new tables
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('ai_content_states', 'workshop_interactions', 'character_ai_metrics');

-- List all RLS policies on new tables
SELECT 
  schemaname,
  tablename,
  policyname,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('ai_content_states', 'workshop_interactions', 'character_ai_metrics')
ORDER BY tablename, policyname;

-- =========================================================================
-- PART 6: TRIGGER VALIDATION
-- =========================================================================

-- Verify updated_at triggers exist
SELECT 
  event_object_table,
  trigger_name,
  action_timing,
  event_manipulation
FROM information_schema.triggers 
WHERE event_object_schema = 'public' 
  AND event_object_table IN ('ai_content_states', 'workshop_interactions', 'character_ai_metrics')
  AND trigger_name LIKE '%updated_at%'
ORDER BY event_object_table, trigger_name;

-- =========================================================================
-- PART 7: VIEW VALIDATION
-- =========================================================================

-- Verify analytics views were created
SELECT 
  table_name,
  view_definition
FROM information_schema.views 
WHERE table_schema = 'public' 
  AND table_name IN (
    'ai_content_analytics', 
    'workshop_progress_analytics', 
    'character_performance_summary'
  )
ORDER BY table_name;

-- Test view access (should return empty results if no data exists yet)
SELECT 'ai_content_analytics' as view_name, COUNT(*) as record_count 
FROM public.ai_content_analytics
UNION ALL
SELECT 'workshop_progress_analytics' as view_name, COUNT(*) as record_count 
FROM public.workshop_progress_analytics
UNION ALL
SELECT 'character_performance_summary' as view_name, COUNT(*) as record_count 
FROM public.character_performance_summary;

-- =========================================================================
-- PART 8: PERMISSION VALIDATION
-- =========================================================================

-- Check table permissions for service_role and authenticated users
SELECT 
  grantee,
  table_name,
  privilege_type
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
  AND table_name IN ('ai_content_states', 'workshop_interactions', 'character_ai_metrics')
  AND grantee IN ('service_role', 'authenticated', 'anon')
ORDER BY table_name, grantee, privilege_type;

-- =========================================================================
-- PART 9: SAMPLE DATA INSERTION TESTS
-- =========================================================================

-- Test ai_content_states insertion (will need a valid user_id)
-- Note: Replace 'test-user-id' with an actual UUID from auth.users for real testing
/*
INSERT INTO public.ai_content_states (
  user_id, 
  session_id, 
  lesson_id, 
  content_type,
  character_persona,
  generation_status,
  current_content,
  user_inputs
) VALUES (
  'test-user-id'::UUID,
  'test-session-001',
  71, -- Chapter 7, Lesson 1
  'performance_framework',
  'carmen',
  'initiated',
  '{"framework": "draft", "stage": 1}',
  '{"position_title": "Program Coordinator", "organization_focus": "Social Services"}'
) RETURNING id, created_at;
*/

-- Test workshop_interactions insertion
/*
INSERT INTO public.workshop_interactions (
  user_id,
  lesson_id,
  workshop_phase,
  interaction_step,
  step_type,
  user_input,
  ai_response
) VALUES (
  'test-user-id'::UUID,
  71,
  'discovery',
  1,
  'input_collection',
  '{"role": "Program Coordinator", "challenges": ["inconsistent ratings"]}',
  '{"acknowledgment": "Understanding your performance management challenges..."}'
) RETURNING id, created_at;
*/

-- Test character_ai_metrics insertion
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
  context_relevance_score
) VALUES (
  'carmen',
  'test-user-id'::UUID,
  71,
  'test-session-001',
  'performance_framework',
  'gpt-4',
  2500,
  0.92,
  0.88
) RETURNING id, created_at;
*/

-- =========================================================================
-- PART 10: PERFORMANCE VALIDATION
-- =========================================================================

-- Check table sizes (should be 0 initially)
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation,
  most_common_vals
FROM pg_stats 
WHERE schemaname = 'public' 
  AND tablename IN ('ai_content_states', 'workshop_interactions', 'character_ai_metrics')
ORDER BY tablename, attname;

-- Analyze query performance for common access patterns
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM public.ai_content_states 
WHERE user_id = 'test-user-id'::UUID 
  AND lesson_id = 71 
  AND generation_status = 'completed';

EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM public.workshop_interactions 
WHERE user_id = 'test-user-id'::UUID 
  AND lesson_id = 71 
  AND workshop_phase = 'discovery';

-- =========================================================================
-- PART 11: INTEGRATION VALIDATION
-- =========================================================================

-- Test joins between new and existing tables
SELECT 
  l.title as lesson_title,
  ie.title as interactive_element_title,
  acs.content_type,
  acs.generation_status
FROM lessons l
JOIN interactive_elements ie ON l.id = ie.lesson_id
LEFT JOIN ai_content_states acs ON ie.id = acs.interactive_element_id
WHERE l.chapter_id = 7
ORDER BY l.order_index, ie.order_index;

-- Validate enhanced user_interactions table
SELECT 
  ui.interaction_type,
  ui.workshop_phase,
  ui.validation_status,
  COUNT(*) as interaction_count
FROM user_interactions ui
WHERE ui.lesson_id IN (SELECT id FROM lessons WHERE chapter_id = 7)
GROUP BY ui.interaction_type, ui.workshop_phase, ui.validation_status;

-- Check enhanced lesson_progress tracking
SELECT 
  lp.lesson_id,
  lp.progress_percentage,
  lp.ai_interactions_completed,
  lp.personalized_content_generated,
  lp.refinement_cycles_completed
FROM lesson_progress lp
JOIN lessons l ON lp.lesson_id = l.id
WHERE l.chapter_id = 7;

-- =========================================================================
-- SUMMARY VALIDATION REPORT
-- =========================================================================

-- Generate comprehensive validation summary
SELECT 
  'SCHEMA VALIDATION COMPLETE' as status,
  NOW() as validation_timestamp,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('ai_content_states', 'workshop_interactions', 'character_ai_metrics')) as new_tables_created,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name IN ('user_interactions', 'lesson_progress') AND column_name LIKE '%ai%' OR column_name LIKE '%workshop%' OR column_name LIKE '%character%') as new_columns_added,
  (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND tablename IN ('ai_content_states', 'workshop_interactions', 'character_ai_metrics')) as indexes_created,
  (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('ai_content_states', 'workshop_interactions', 'character_ai_metrics')) as rls_policies_created,
  (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public' AND table_name IN ('ai_content_analytics', 'workshop_progress_analytics', 'character_performance_summary')) as analytics_views_created;