-- Rollback Procedures for Chapter 7 AI Enhancement Migration
-- Date: 2025-08-18
-- Purpose: Safe rollback procedures to revert schema changes if needed

-- =========================================================================
-- IMPORTANT SAFETY NOTES
-- =========================================================================

/*
BEFORE RUNNING ROLLBACK:
1. BACKUP ALL DATA from the new tables if you want to preserve it
2. Ensure no active user sessions are using Chapter 7 features
3. Run validation queries to understand current data state
4. Consider partial rollback if only specific issues need addressing

ROLLBACK ORDER (execute in this sequence):
1. Drop views and analytics
2. Remove triggers
3. Drop RLS policies  
4. Remove new columns from existing tables
5. Drop new tables
6. Drop indexes (done automatically with tables)
*/

-- =========================================================================
-- PART 1: DATA PRESERVATION (OPTIONAL)
-- =========================================================================

-- Create backup tables if you want to preserve data before rollback
-- Uncomment these sections if you need to preserve data:

/*
-- Backup ai_content_states data
CREATE TABLE IF NOT EXISTS public.ai_content_states_backup AS 
SELECT * FROM public.ai_content_states;

-- Backup workshop_interactions data
CREATE TABLE IF NOT EXISTS public.workshop_interactions_backup AS 
SELECT * FROM public.workshop_interactions;

-- Backup character_ai_metrics data
CREATE TABLE IF NOT EXISTS public.character_ai_metrics_backup AS 
SELECT * FROM public.character_ai_metrics;

-- Backup enhanced user_interactions data
CREATE TABLE IF NOT EXISTS public.user_interactions_backup AS 
SELECT 
  id, user_id, lesson_id, interaction_type, content, metadata,
  ai_content_state_id, workshop_phase, refinement_iteration,
  validation_status, quality_metrics, processing_context, created_at
FROM public.user_interactions
WHERE ai_content_state_id IS NOT NULL 
   OR workshop_phase IS NOT NULL 
   OR refinement_iteration > 1;

-- Backup enhanced lesson_progress data  
CREATE TABLE IF NOT EXISTS public.lesson_progress_backup AS
SELECT 
  id, user_id, lesson_id, progress_percentage, completed,
  ai_interactions_completed, workshop_phases_completed,
  character_engagement_scores, personalized_content_generated,
  refinement_cycles_completed, validation_passes, created_at
FROM public.lesson_progress
WHERE ai_interactions_completed > 0 
   OR workshop_phases_completed != '{}'
   OR character_engagement_scores != '{}'
   OR personalized_content_generated > 0
   OR refinement_cycles_completed > 0
   OR validation_passes > 0;
*/

-- =========================================================================
-- PART 2: DROP ANALYTICS VIEWS
-- =========================================================================

-- Drop analytics views first (they depend on tables)
DROP VIEW IF EXISTS public.ai_content_analytics CASCADE;
DROP VIEW IF EXISTS public.workshop_progress_analytics CASCADE; 
DROP VIEW IF EXISTS public.character_performance_summary CASCADE;

-- Confirm views are dropped
SELECT 'Analytics views dropped' as rollback_step_1_status;

-- =========================================================================
-- PART 3: REMOVE TRIGGERS
-- =========================================================================

-- Drop updated_at triggers for new tables
DROP TRIGGER IF EXISTS set_updated_at_ai_content_states ON public.ai_content_states;
DROP TRIGGER IF EXISTS set_updated_at_workshop_interactions ON public.workshop_interactions;
DROP TRIGGER IF EXISTS set_updated_at_character_ai_metrics ON public.character_ai_metrics;

-- Note: We keep the handle_updated_at() function as it may be used by other tables

-- Confirm triggers are dropped
SELECT 'Triggers dropped' as rollback_step_2_status;

-- =========================================================================
-- PART 4: DROP RLS POLICIES
-- =========================================================================

-- Drop RLS policies for ai_content_states
DROP POLICY IF EXISTS "Users can view their own AI content states" ON public.ai_content_states;
DROP POLICY IF EXISTS "Users can insert their own AI content states" ON public.ai_content_states;
DROP POLICY IF EXISTS "Users can update their own AI content states" ON public.ai_content_states;
DROP POLICY IF EXISTS "Service role can manage all AI content states" ON public.ai_content_states;

-- Drop RLS policies for workshop_interactions
DROP POLICY IF EXISTS "Users can view their own workshop interactions" ON public.workshop_interactions;
DROP POLICY IF EXISTS "Users can insert their own workshop interactions" ON public.workshop_interactions;
DROP POLICY IF EXISTS "Users can update their own workshop interactions" ON public.workshop_interactions;
DROP POLICY IF EXISTS "Service role can manage all workshop interactions" ON public.workshop_interactions;

-- Drop RLS policies for character_ai_metrics
DROP POLICY IF EXISTS "Users can view their own character AI metrics" ON public.character_ai_metrics;
DROP POLICY IF EXISTS "Users can insert their own character AI metrics" ON public.character_ai_metrics;
DROP POLICY IF EXISTS "Service role can manage all character AI metrics" ON public.character_ai_metrics;

-- Disable RLS on tables before dropping them
ALTER TABLE IF EXISTS public.ai_content_states DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.workshop_interactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.character_ai_metrics DISABLE ROW LEVEL SECURITY;

-- Confirm RLS policies are dropped
SELECT 'RLS policies dropped' as rollback_step_3_status;

-- =========================================================================
-- PART 5: REMOVE NEW COLUMNS FROM EXISTING TABLES
-- =========================================================================

-- Remove AI enhancement columns from user_interactions
ALTER TABLE public.user_interactions 
DROP COLUMN IF EXISTS ai_content_state_id CASCADE,
DROP COLUMN IF EXISTS workshop_phase CASCADE,
DROP COLUMN IF EXISTS refinement_iteration CASCADE,
DROP COLUMN IF EXISTS validation_status CASCADE,
DROP COLUMN IF EXISTS quality_metrics CASCADE,
DROP COLUMN IF EXISTS processing_context CASCADE;

-- Remove Chapter 7 specific columns from lesson_progress
ALTER TABLE public.lesson_progress
DROP COLUMN IF EXISTS ai_interactions_completed CASCADE,
DROP COLUMN IF EXISTS workshop_phases_completed CASCADE,
DROP COLUMN IF EXISTS character_engagement_scores CASCADE,
DROP COLUMN IF EXISTS personalized_content_generated CASCADE,
DROP COLUMN IF EXISTS refinement_cycles_completed CASCADE,
DROP COLUMN IF EXISTS validation_passes CASCADE;

-- Confirm columns are removed
SELECT 'New columns removed from existing tables' as rollback_step_4_status;

-- =========================================================================
-- PART 6: DROP NEW TABLES
-- =========================================================================

-- Drop new tables (this will also drop their indexes automatically)
-- Drop in order of dependencies (child tables first)

DROP TABLE IF EXISTS public.workshop_interactions CASCADE;
DROP TABLE IF EXISTS public.character_ai_metrics CASCADE; 
DROP TABLE IF EXISTS public.ai_content_states CASCADE;

-- Confirm tables are dropped
SELECT 'New tables dropped' as rollback_step_5_status;

-- =========================================================================
-- PART 7: REVOKE PERMISSIONS (CLEANUP)
-- =========================================================================

-- Note: Permissions are automatically revoked when tables are dropped,
-- but we'll explicitly revoke any remaining ones for completeness

-- These will fail silently if the tables don't exist (which is expected)
REVOKE ALL ON public.ai_content_states FROM service_role;
REVOKE ALL ON public.ai_content_states FROM authenticated;
REVOKE ALL ON public.ai_content_states FROM anon;

REVOKE ALL ON public.workshop_interactions FROM service_role;
REVOKE ALL ON public.workshop_interactions FROM authenticated;
REVOKE ALL ON public.workshop_interactions FROM anon;

REVOKE ALL ON public.character_ai_metrics FROM service_role;
REVOKE ALL ON public.character_ai_metrics FROM authenticated;
REVOKE ALL ON public.character_ai_metrics FROM anon;

-- Confirm permissions are revoked
SELECT 'Permissions revoked' as rollback_step_6_status;

-- =========================================================================
-- PART 8: VERIFICATION QUERIES
-- =========================================================================

-- Verify tables no longer exist
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('ai_content_states', 'workshop_interactions', 'character_ai_metrics') 
    THEN 'ERROR: Table should not exist!'
    ELSE 'OK: Table exists as expected'
  END as rollback_verification
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'ai_content_states', 
    'workshop_interactions', 
    'character_ai_metrics',
    'user_interactions',
    'lesson_progress'
  )
ORDER BY table_name;

-- Verify new columns are removed from existing tables
SELECT 
  table_name,
  column_name,
  'ERROR: Column should not exist after rollback!' as rollback_verification
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('user_interactions', 'lesson_progress')
  AND column_name IN (
    'ai_content_state_id', 'workshop_phase', 'refinement_iteration',
    'validation_status', 'quality_metrics', 'processing_context',
    'ai_interactions_completed', 'workshop_phases_completed',
    'character_engagement_scores', 'personalized_content_generated',
    'refinement_cycles_completed', 'validation_passes'
  );

-- Verify views no longer exist
SELECT 
  table_name,
  'ERROR: View should not exist after rollback!' as rollback_verification
FROM information_schema.views 
WHERE table_schema = 'public' 
  AND table_name IN (
    'ai_content_analytics', 
    'workshop_progress_analytics', 
    'character_performance_summary'
  );

-- Verify indexes are gone (should return no results)
SELECT 
  indexname,
  tablename,
  'ERROR: Index should not exist after rollback!' as rollback_verification
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND indexname LIKE 'idx_%ai%' 
  OR indexname LIKE 'idx_%workshop%'
  OR indexname LIKE 'idx_%character%';

-- Verify RLS policies are gone (should return no results)
SELECT 
  tablename,
  policyname,
  'ERROR: RLS policy should not exist after rollback!' as rollback_verification
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('ai_content_states', 'workshop_interactions', 'character_ai_metrics');

-- =========================================================================
-- PART 9: CLEANUP BACKUP TABLES (OPTIONAL)
-- =========================================================================

-- If you created backup tables and no longer need them, uncomment to drop:

/*
DROP TABLE IF EXISTS public.ai_content_states_backup CASCADE;
DROP TABLE IF EXISTS public.workshop_interactions_backup CASCADE;
DROP TABLE IF EXISTS public.character_ai_metrics_backup CASCADE;
DROP TABLE IF EXISTS public.user_interactions_backup CASCADE;
DROP TABLE IF EXISTS public.lesson_progress_backup CASCADE;
*/

-- =========================================================================
-- PART 10: ROLLBACK COMPLETION SUMMARY
-- =========================================================================

-- Generate rollback completion report
SELECT 
  'ROLLBACK COMPLETED SUCCESSFULLY' as status,
  NOW() as rollback_timestamp,
  (
    SELECT COUNT(*) 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_name IN ('ai_content_states', 'workshop_interactions', 'character_ai_metrics')
  ) as remaining_new_tables,
  (
    SELECT COUNT(*) 
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
  ) as remaining_new_columns,
  (
    SELECT COUNT(*) 
    FROM information_schema.views 
    WHERE table_schema = 'public' 
      AND table_name IN ('ai_content_analytics', 'workshop_progress_analytics', 'character_performance_summary')
  ) as remaining_new_views;

-- Final verification message
SELECT 
  CASE 
    WHEN (
      SELECT COUNT(*) FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('ai_content_states', 'workshop_interactions', 'character_ai_metrics')
    ) = 0 
    AND (
      SELECT COUNT(*) FROM information_schema.views 
      WHERE table_schema = 'public' 
        AND table_name IN ('ai_content_analytics', 'workshop_progress_analytics', 'character_performance_summary')
    ) = 0
    THEN 'SUCCESS: All Chapter 7 AI enhancement schema changes have been rolled back successfully!'
    ELSE 'WARNING: Some components may not have been fully rolled back. Please review the verification queries above.'
  END as final_rollback_status;

-- =========================================================================
-- POST-ROLLBACK RECOMMENDATIONS
-- =========================================================================

/*
POST-ROLLBACK CHECKLIST:

1. ✓ Verify application functionality with existing schema
2. ✓ Test Chapter 1-6 lessons still work correctly  
3. ✓ Check that existing user progress is preserved
4. ✓ Update any application code that referenced the dropped tables/columns
5. ✓ Consider running VACUUM ANALYZE to reclaim space and update statistics
6. ✓ Monitor application logs for any references to removed schema elements
7. ✓ Update API documentation to reflect schema changes
8. ✓ Inform development team about the rollback completion

RECOVERY OPTIONS:
- If you preserved data in backup tables, you can restore specific records
- The migration can be re-applied after addressing any issues
- Consider partial migrations for testing individual components

PERFORMANCE NOTES:
- Run VACUUM ANALYZE on modified tables to optimize performance
- Monitor query performance after the rollback
- Update any cached schema information in applications
*/