-- Fix Database Constraints Script
-- This script corrects the check constraints that are causing 503 errors

\echo '🔧 DATABASE CONSTRAINT FIX SCRIPT'
\echo '================================'
\echo ''
\echo 'This script will fix the constraints that are causing 94% failure rate'
\echo 'Based on the test report analysis and schema investigation'
\echo ''

-- Backup current constraint definitions before making changes
\echo '📋 1. BACKING UP CURRENT CONSTRAINTS'
\echo '----------------------------------'

CREATE TABLE IF NOT EXISTS constraint_backup_20250729 AS
SELECT 
    conname,
    contype,
    pg_get_constraintdef(oid) AS original_definition,
    NOW() AS backup_timestamp
FROM pg_constraint 
WHERE conrelid = 'public.generated_content'::regclass
  AND contype = 'c';  -- Check constraints only

SELECT * FROM constraint_backup_20250729;

\echo ''
\echo '📋 2. FIXING CHARACTER_TYPE CONSTRAINT'
\echo '------------------------------------'

-- Drop the existing character_type constraint
ALTER TABLE public.generated_content 
DROP CONSTRAINT IF EXISTS generated_content_character_type_check;

-- Recreate with all required character types
-- Based on the schema and application requirements
ALTER TABLE public.generated_content 
ADD CONSTRAINT generated_content_character_type_check 
CHECK (character_type IN ('maya', 'sofia', 'david', 'rachel', 'alex', 'lyra'));

\echo '✅ CHARACTER_TYPE constraint updated to include: maya, sofia, david, rachel, alex, lyra'

\echo ''
\echo '📋 3. FIXING CONTENT_TYPE CONSTRAINT'  
\echo '----------------------------------'

-- Drop the existing content_type constraint
ALTER TABLE public.generated_content 
DROP CONSTRAINT IF EXISTS generated_content_content_type_check;

-- Recreate with all required content types
-- Based on the latest migration and application requirements
ALTER TABLE public.generated_content 
ADD CONSTRAINT generated_content_content_type_check 
CHECK (content_type IN ('email', 'lesson', 'article', 'social_post', 'newsletter', 'blog_post', 'ecosystem-blueprint'));

\echo '✅ CONTENT_TYPE constraint updated to include: email, lesson, article, social_post, newsletter, blog_post, ecosystem-blueprint'

\echo ''
\echo '📋 4. VERIFYING CONSTRAINT FIXES'
\echo '------------------------------'

-- Verify the new constraints are in place
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS new_definition
FROM pg_constraint 
WHERE conrelid = 'public.generated_content'::regclass 
  AND conname IN ('generated_content_character_type_check', 'generated_content_content_type_check')
ORDER BY conname;

\echo ''
\echo '📋 5. TESTING PREVIOUSLY FAILING VALUES'
\echo '-------------------------------------'

-- Test character types that were failing
\echo 'Testing previously failing character types:'

DO $$
DECLARE
    test_char TEXT;
    chars TEXT[] := ARRAY['rachel', 'sofia', 'david'];
BEGIN
    FOREACH test_char IN ARRAY chars
    LOOP
        BEGIN
            -- Test insertion (will rollback)
            INSERT INTO public.generated_content (character_type, content_type, title, content) 
            VALUES (test_char, 'lesson', 'Constraint Test', 'Testing constraint fix');
            
            RAISE NOTICE '✅ SUCCESS: % character_type now works', test_char;
            
            -- Clean up test data
            DELETE FROM public.generated_content WHERE title = 'Constraint Test';
            
        EXCEPTION 
            WHEN check_violation THEN
                RAISE NOTICE '❌ STILL FAILING: % character_type: %', test_char, SQLERRM;
            WHEN OTHERS THEN
                RAISE NOTICE '⚠️  OTHER ERROR for %: %', test_char, SQLERRM;
        END;
    END LOOP;
END $$;

-- Test content types that were failing  
\echo 'Testing previously failing content types:'

DO $$
DECLARE
    test_content TEXT;
    contents TEXT[] := ARRAY['email', 'article'];
BEGIN
    FOREACH test_content IN ARRAY contents
    LOOP
        BEGIN
            -- Test insertion (will rollback)
            INSERT INTO public.generated_content (character_type, content_type, title, content) 
            VALUES ('maya', test_content, 'Constraint Test', 'Testing constraint fix');
            
            RAISE NOTICE '✅ SUCCESS: % content_type now works', test_content;
            
            -- Clean up test data
            DELETE FROM public.generated_content WHERE title = 'Constraint Test';
            
        EXCEPTION 
            WHEN check_violation THEN
                RAISE NOTICE '❌ STILL FAILING: % content_type: %', test_content, SQLERRM;
            WHEN OTHERS THEN
                RAISE NOTICE '⚠️  OTHER ERROR for %: %', test_content, SQLERRM;
        END;
    END LOOP;
END $$;

\echo ''
\echo '📋 6. COMPREHENSIVE TEST OF ALL COMBINATIONS'
\echo '------------------------------------------'

-- Test the combinations that were failing in the original test report
DO $$
DECLARE
    combinations RECORD;
    success_count INTEGER := 0;
    total_count INTEGER := 0;
BEGIN
    -- Test critical failing combinations from the test report
    FOR combinations IN 
        SELECT * FROM (VALUES 
            ('rachel', 'lesson'),
            ('sofia', 'lesson'), 
            ('david', 'lesson'),
            ('maya', 'email'),
            ('maya', 'article'),
            ('rachel', 'email')  -- The double-failure case
        ) AS t(char_type, cont_type)
    LOOP
        total_count := total_count + 1;
        
        BEGIN
            INSERT INTO public.generated_content (character_type, content_type, title, content) 
            VALUES (combinations.char_type, combinations.cont_type, 'Multi Test', 'Testing all combinations');
            
            success_count := success_count + 1;
            RAISE NOTICE '✅ SUCCESS: % + % works', combinations.char_type, combinations.cont_type;
            
            -- Clean up
            DELETE FROM public.generated_content WHERE title = 'Multi Test';
            
        EXCEPTION 
            WHEN check_violation THEN
                RAISE NOTICE '❌ FAILED: % + % still fails: %', combinations.char_type, combinations.cont_type, SQLERRM;
            WHEN OTHERS THEN
                RAISE NOTICE '⚠️  ERROR: % + %: %', combinations.char_type, combinations.cont_type, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE '📊 CONSTRAINT FIX RESULTS:';
    RAISE NOTICE '========================';
    RAISE NOTICE 'Total combinations tested: %', total_count;
    RAISE NOTICE 'Successful combinations: %', success_count;
    RAISE NOTICE 'Success rate: %% (was 6%% before fix)', ROUND((success_count::DECIMAL / total_count * 100), 1);
    
    IF success_count = total_count THEN
        RAISE NOTICE '🎉 ALL CONSTRAINT FIXES SUCCESSFUL!';
        RAISE NOTICE 'The 503 errors should now be resolved.';
    ELSE
        RAISE NOTICE '⚠️  Some combinations still failing - investigate further';
    END IF;
END $$;

\echo ''
\echo '🎯 CONSTRAINT FIX COMPLETE'
\echo '========================='
\echo ''
\echo 'Summary of changes:'
\echo '- Updated character_type constraint to allow: maya, sofia, david, rachel, alex, lyra'
\echo '- Updated content_type constraint to allow: email, lesson, article, social_post, newsletter, blog_post, ecosystem-blueprint'
\echo ''
\echo 'Next steps:'
\echo '1. Run verify-constraint-fixes.sql to do comprehensive testing'
\echo '2. Re-run the Edge Function tests to confirm 503 errors are resolved'
\echo '3. Monitor production for any remaining issues'
\echo ''
\echo 'Backup of original constraints saved in: constraint_backup_20250729'