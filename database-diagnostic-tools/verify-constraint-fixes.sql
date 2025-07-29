-- Verification Script for Database Constraint Fixes
-- Comprehensive testing to ensure all constraint issues are resolved

\echo '✅ CONSTRAINT FIX VERIFICATION SCRIPT'
\echo '===================================='
\echo ''
\echo 'This script comprehensively tests all constraints to ensure'
\echo 'the 503 errors from the test report have been resolved'
\echo ''

-- Create a temporary test session identifier
\set test_session_id 'verify_' :CURRENT_TIMESTAMP

\echo '📋 1. CONSTRAINT DEFINITION VERIFICATION'
\echo '--------------------------------------'

-- Verify current constraint definitions
SELECT 
    'CHARACTER_TYPE CONSTRAINT:' AS check_type,
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS definition
FROM pg_constraint 
WHERE conrelid = 'public.generated_content'::regclass 
  AND conname = 'generated_content_character_type_check'

UNION ALL

SELECT 
    'CONTENT_TYPE CONSTRAINT:' AS check_type,
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS definition
FROM pg_constraint 
WHERE conrelid = 'public.generated_content'::regclass 
  AND conname = 'generated_content_content_type_check';

\echo ''
\echo '📋 2. INDIVIDUAL VALUE TESTING'
\echo '----------------------------'

-- Test all character types
\echo 'Testing ALL character types:'
DO $$
DECLARE
    char_type TEXT;
    char_types TEXT[] := ARRAY['maya', 'rachel', 'sofia', 'david', 'alex', 'lyra'];
    success_count INTEGER := 0;
    total_count INTEGER := 0;
BEGIN
    FOREACH char_type IN ARRAY char_types
    LOOP
        total_count := total_count + 1;
        BEGIN
            INSERT INTO public.generated_content (character_type, content_type, title, content) 
            VALUES (char_type, 'lesson', 'Verify Test Char', 'Testing ' || char_type);
            
            success_count := success_count + 1;
            RAISE NOTICE '✅ %: PASS', char_type;
            
            -- Clean up
            DELETE FROM public.generated_content WHERE title = 'Verify Test Char';
            
        EXCEPTION 
            WHEN OTHERS THEN
                RAISE NOTICE '❌ %: FAIL - %', char_type, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE 'Character Type Results: %/% passed (%.1%%)', 
                 success_count, total_count, 
                 (success_count::DECIMAL / total_count * 100);
END $$;

-- Test all content types
\echo 'Testing ALL content types:'
DO $$
DECLARE
    content_type TEXT;
    content_types TEXT[] := ARRAY['email', 'lesson', 'article', 'social_post', 'newsletter', 'blog_post', 'ecosystem-blueprint'];
    success_count INTEGER := 0;
    total_count INTEGER := 0;
BEGIN
    FOREACH content_type IN ARRAY content_types
    LOOP
        total_count := total_count + 1;
        BEGIN
            INSERT INTO public.generated_content (character_type, content_type, title, content) 
            VALUES ('maya', content_type, 'Verify Test Content', 'Testing ' || content_type);
            
            success_count := success_count + 1;
            RAISE NOTICE '✅ %: PASS', content_type;
            
            -- Clean up
            DELETE FROM public.generated_content WHERE title = 'Verify Test Content';
            
        EXCEPTION 
            WHEN OTHERS THEN
                RAISE NOTICE '❌ %: FAIL - %', content_type, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE 'Content Type Results: %/% passed (%.1%%)', 
                 success_count, total_count, 
                 (success_count::DECIMAL / total_count * 100);
END $$;

\echo ''
\echo '📋 3. REPRODUCING ORIGINAL TEST FAILURES'
\echo '---------------------------------------'

-- Test the exact combinations that failed in the original test report
\echo 'Testing ORIGINAL FAILING combinations from test report:'
DO $$
DECLARE
    test_record RECORD;
    original_failures CURSOR FOR
        SELECT * FROM (VALUES 
            ('rachel', 'lesson', 'Rachel lesson content should now work'),
            ('sofia', 'lesson', 'Sofia lesson content should now work'), 
            ('david', 'lesson', 'David lesson content should now work'),
            ('maya', 'email', 'Maya email content should now work'),
            ('maya', 'article', 'Maya article content should now work'),
            ('rachel', 'email', 'Rachel email - double constraint issue'),
            ('sofia', 'email', 'Sofia email combination'),
            ('david', 'article', 'David article combination')
        ) AS t(char_type, cont_type, description);
    success_count INTEGER := 0;
    total_count INTEGER := 0;
BEGIN
    FOR test_record IN original_failures
    LOOP
        total_count := total_count + 1;
        BEGIN
            INSERT INTO public.generated_content (
                character_type, 
                content_type, 
                title, 
                content,
                metadata
            ) VALUES (
                test_record.char_type, 
                test_record.cont_type, 
                'Original Failure Test', 
                test_record.description,
                jsonb_build_object('test_type', 'original_failure_reproduction')
            );
            
            success_count := success_count + 1;
            RAISE NOTICE '✅ % + %: NOW WORKS!', test_record.char_type, test_record.cont_type;
            
            -- Clean up
            DELETE FROM public.generated_content WHERE title = 'Original Failure Test';
            
        EXCEPTION 
            WHEN OTHERS THEN
                RAISE NOTICE '❌ % + %: STILL FAILS - %', 
                           test_record.char_type, test_record.cont_type, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE '🎯 ORIGINAL FAILURE RECOVERY RESULTS:';
    RAISE NOTICE '===================================';
    RAISE NOTICE 'Previously failing combinations: %', total_count;
    RAISE NOTICE 'Now working combinations: %', success_count;
    RAISE NOTICE 'Recovery success rate: %.1%%', (success_count::DECIMAL / total_count * 100);
    RAISE NOTICE 'Original success rate was: 6%% (1/16 tests)';
    
    IF success_count = total_count THEN
        RAISE NOTICE '🎉 COMPLETE SUCCESS: All previously failing combinations now work!';
    END IF;
END $$;

\echo ''
\echo '📋 4. COMPREHENSIVE MATRIX TEST'
\echo '-----------------------------'

-- Test a comprehensive matrix of character + content combinations
\echo 'Running comprehensive matrix test (all combinations):'
DO $$
DECLARE
    char_type TEXT;
    content_type TEXT;
    char_types TEXT[] := ARRAY['maya', 'rachel', 'sofia', 'david'];  -- Core characters from test
    content_types TEXT[] := ARRAY['email', 'lesson', 'article'];      -- Core content types from test
    success_count INTEGER := 0;
    total_count INTEGER := 0;
    matrix_results TEXT := '';
BEGIN
    FOREACH char_type IN ARRAY char_types
    LOOP
        FOREACH content_type IN ARRAY content_types
        LOOP
            total_count := total_count + 1;
            BEGIN
                INSERT INTO public.generated_content (
                    character_type, 
                    content_type, 
                    title, 
                    content,
                    metadata
                ) VALUES (
                    char_type, 
                    content_type, 
                    'Matrix Test', 
                    'Comprehensive test of ' || char_type || ' + ' || content_type,
                    jsonb_build_object(
                        'test_type', 'matrix_comprehensive',
                        'character', char_type,
                        'content', content_type
                    )
                );
                
                success_count := success_count + 1;
                matrix_results := matrix_results || '✅ ' || char_type || '+' || content_type || ' ';
                
                -- Clean up
                DELETE FROM public.generated_content WHERE title = 'Matrix Test';
                
            EXCEPTION 
                WHEN OTHERS THEN
                    matrix_results := matrix_results || '❌ ' || char_type || '+' || content_type || ' ';
            END;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Matrix Results: %', matrix_results;
    RAISE NOTICE '';
    RAISE NOTICE '📊 COMPREHENSIVE MATRIX RESULTS:';
    RAISE NOTICE '==============================';
    RAISE NOTICE 'Total combinations tested: %', total_count;
    RAISE NOTICE 'Successful combinations: %', success_count;
    RAISE NOTICE 'Current success rate: %.1%%', (success_count::DECIMAL / total_count * 100);
    RAISE NOTICE 'Original success rate: 6%% (1/16)';
    RAISE NOTICE 'Improvement factor: %.1fx', (success_count::DECIMAL / total_count * 100) / 6;
END $$;

\echo ''
\echo '📋 5. EDGE CASE TESTING'
\echo '---------------------'

-- Test edge cases and boundary conditions
\echo 'Testing edge cases:'

-- Test with NULL user_id (anonymous usage)
DO $$
BEGIN
    BEGIN
        INSERT INTO public.generated_content (
            character_type, 
            content_type, 
            title, 
            content,
            user_id
        ) VALUES (
            'maya', 
            'lesson', 
            'Anonymous Test', 
            'Testing anonymous user content generation',
            NULL
        );
        
        RAISE NOTICE '✅ Anonymous usage (NULL user_id): WORKS';
        DELETE FROM public.generated_content WHERE title = 'Anonymous Test';
        
    EXCEPTION 
        WHEN OTHERS THEN
            RAISE NOTICE '❌ Anonymous usage: FAILS - %', SQLERRM;
    END;
END $$;

-- Test with complex metadata
DO $$
BEGIN
    BEGIN
        INSERT INTO public.generated_content (
            character_type, 
            content_type, 
            title, 
            content,
            metadata
        ) VALUES (
            'rachel', 
            'email', 
            'Metadata Test', 
            'Testing complex metadata handling',
            jsonb_build_object(
                'targetAudience', 'developers',
                'topic', 'AI mentoring',
                'mayaPatterns', jsonb_build_array('technical', 'supportive'),
                'complexity', 'advanced'
            )
        );
        
        RAISE NOTICE '✅ Complex metadata: WORKS';
        DELETE FROM public.generated_content WHERE title = 'Metadata Test';
        
    EXCEPTION 
        WHEN OTHERS THEN
            RAISE NOTICE '❌ Complex metadata: FAILS - %', SQLERRM;
    END;
END $$;

\echo ''
\echo '📋 6. INVALID VALUE TESTING'
\echo '-------------------------'

-- Test that invalid values are still properly rejected
\echo 'Testing that invalid values are still rejected (should fail):'

DO $$
BEGIN
    -- Test invalid character type
    BEGIN
        INSERT INTO public.generated_content (character_type, content_type, title, content) 
        VALUES ('invalid_character', 'lesson', 'Should Fail', 'This should be rejected');
        
        RAISE NOTICE '❌ PROBLEM: Invalid character type was accepted!';
        DELETE FROM public.generated_content WHERE title = 'Should Fail';
        
    EXCEPTION 
        WHEN check_violation THEN
            RAISE NOTICE '✅ GOOD: Invalid character type properly rejected';
        WHEN OTHERS THEN
            RAISE NOTICE '⚠️  Unexpected error: %', SQLERRM;
    END;
    
    -- Test invalid content type
    BEGIN
        INSERT INTO public.generated_content (character_type, content_type, title, content) 
        VALUES ('maya', 'invalid_content', 'Should Fail', 'This should be rejected');
        
        RAISE NOTICE '❌ PROBLEM: Invalid content type was accepted!';
        DELETE FROM public.generated_content WHERE title = 'Should Fail';
        
    EXCEPTION 
        WHEN check_violation THEN
            RAISE NOTICE '✅ GOOD: Invalid content type properly rejected';
        WHEN OTHERS THEN
            RAISE NOTICE '⚠️  Unexpected error: %', SQLERRM;
    END;
END $$;

\echo ''
\echo '🎯 VERIFICATION COMPLETE'
\echo '======================='
\echo ''
\echo '📊 FINAL ASSESSMENT:'

-- Final assessment query
WITH test_summary AS (
    -- This would need to be populated by actual test results
    -- For now, we'll show the expected outcome
    SELECT 
        'Constraint fix verification' AS test_phase,
        16 AS total_original_tests,
        1 AS original_success_count,
        15 AS original_failure_count,
        6.0 AS original_success_rate
)
SELECT 
    test_phase,
    total_original_tests,
    original_success_count,
    original_failure_count,
    original_success_rate || '%' AS original_rate,
    'Expected: ~100%' AS expected_new_rate,
    'All character types should work' AS character_expectation,
    'All content types should work' AS content_expectation
FROM test_summary;

\echo ''
\echo 'Expected Results After Fix:'
\echo '- maya, rachel, sofia, david, alex, lyra: ALL should work'
\echo '- email, lesson, article, social_post, newsletter, blog_post: ALL should work'
\echo '- Success rate should improve from 6% to ~100%'
\echo '- 503 errors should be eliminated'
\echo ''
\echo 'If any tests above show failures, investigate:'
\echo '1. Check if migrations were applied to production database'
\echo '2. Verify constraint definitions match expectations'
\echo '3. Check for any additional constraints or triggers interfering'
\echo ''
\echo 'Next: Re-run comprehensive-edge-function-test.js to verify production fix'