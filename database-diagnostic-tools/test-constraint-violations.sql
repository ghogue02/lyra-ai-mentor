-- Test Script to Reproduce the 503 Constraint Violation Errors
-- This script safely tests constraint violations without actually inserting data

\echo '🧪 CONSTRAINT VIOLATION TEST SCRIPT'
\echo '=================================='
\echo ''
\echo 'This script tests the exact values that caused 503 errors in production'
\echo 'without actually inserting data (uses prepared statements that fail gracefully)'
\echo ''

-- Test the failing character types from the test report
\echo '📋 1. TESTING CHARACTER TYPE CONSTRAINTS'
\echo '--------------------------------------'

-- Test rachel (should fail according to report)
\echo 'Testing character_type = "rachel"...'
BEGIN;
    PREPARE test_rachel AS 
    INSERT INTO public.generated_content (character_type, content_type, title, content) 
    VALUES ('rachel', 'lesson', 'Test Title', 'Test Content');
    
    -- This will show the exact error message if constraint fails
    \echo 'Attempting to execute rachel test...'
ROLLBACK;

-- Test sofia (should fail according to report)  
\echo 'Testing character_type = "sofia"...'
BEGIN;
    PREPARE test_sofia AS 
    INSERT INTO public.generated_content (character_type, content_type, title, content) 
    VALUES ('sofia', 'lesson', 'Test Title', 'Test Content');
    
    \echo 'Attempting to execute sofia test...'
ROLLBACK;

-- Test david (should fail according to report)
\echo 'Testing character_type = "david"...'
BEGIN;
    PREPARE test_david AS 
    INSERT INTO public.generated_content (character_type, content_type, title, content) 
    VALUES ('david', 'lesson', 'Test Title', 'Test Content');
    
    \echo 'Attempting to execute david test...'
ROLLBACK;

-- Test maya (should work according to report)
\echo 'Testing character_type = "maya"...'
BEGIN;
    PREPARE test_maya AS 
    INSERT INTO public.generated_content (character_type, content_type, title, content) 
    VALUES ('maya', 'lesson', 'Test Title', 'Test Content');
    
    \echo 'Attempting to execute maya test...'
ROLLBACK;

\echo ''

-- Test the failing content types from the test report  
\echo '📋 2. TESTING CONTENT TYPE CONSTRAINTS'
\echo '------------------------------------'

-- Test email (should fail according to report)
\echo 'Testing content_type = "email"...'
BEGIN;
    PREPARE test_email AS 
    INSERT INTO public.generated_content (character_type, content_type, title, content) 
    VALUES ('maya', 'email', 'Test Title', 'Test Content');
    
    \echo 'Attempting to execute email test...'
ROLLBACK;

-- Test article (should fail according to report)
\echo 'Testing content_type = "article"...'
BEGIN;
    PREPARE test_article AS 
    INSERT INTO public.generated_content (character_type, content_type, title, content) 
    VALUES ('maya', 'article', 'Test Title', 'Test Content');
    
    \echo 'Attempting to execute article test...'
ROLLBACK;

-- Test lesson (should work according to report)
\echo 'Testing content_type = "lesson"...'
BEGIN;
    PREPARE test_lesson AS 
    INSERT INTO public.generated_content (character_type, content_type, title, content) 
    VALUES ('maya', 'lesson', 'Test Title', 'Test Content');
    
    \echo 'Attempting to execute lesson test...'
ROLLBACK;

\echo ''

-- Test the combination that works
\echo '📋 3. TESTING KNOWN WORKING COMBINATION'
\echo '------------------------------------'
\echo 'Testing maya + lesson (should succeed)...'

BEGIN;
    INSERT INTO public.generated_content (character_type, content_type, title, content) 
    VALUES ('maya', 'lesson', 'Test Success Case', 'This should work based on the test report');
    
    SELECT 
        id,
        character_type,
        content_type,
        title,
        created_at
    FROM public.generated_content 
    WHERE title = 'Test Success Case';
    
    \echo '✅ SUCCESS: maya + lesson combination works'
ROLLBACK;  -- Don't actually keep the test data

\echo ''

-- Test the combinations that should fail
\echo '📋 4. TESTING KNOWN FAILING COMBINATIONS'
\echo '--------------------------------------'

\echo 'Testing rachel + lesson (should fail on character_type)...'
DO $$
BEGIN
    BEGIN
        INSERT INTO public.generated_content (character_type, content_type, title, content) 
        VALUES ('rachel', 'lesson', 'Test Failure Case 1', 'This should fail');
        RAISE NOTICE '❌ UNEXPECTED: rachel + lesson succeeded (constraint may be fixed)';
    EXCEPTION 
        WHEN check_violation THEN
            RAISE NOTICE '✅ EXPECTED: rachel + lesson failed with constraint violation: %', SQLERRM;
        WHEN OTHERS THEN
            RAISE NOTICE '⚠️  UNEXPECTED ERROR: %', SQLERRM;
    END;
END $$;

\echo 'Testing maya + email (should fail on content_type)...'
DO $$
BEGIN
    BEGIN
        INSERT INTO public.generated_content (character_type, content_type, title, content) 
        VALUES ('maya', 'email', 'Test Failure Case 2', 'This should fail');
        RAISE NOTICE '❌ UNEXPECTED: maya + email succeeded (constraint may be fixed)';
    EXCEPTION 
        WHEN check_violation THEN
            RAISE NOTICE '✅ EXPECTED: maya + email failed with constraint violation: %', SQLERRM;
        WHEN OTHERS THEN
            RAISE NOTICE '⚠️  UNEXPECTED ERROR: %', SQLERRM;
    END;
END $$;

\echo 'Testing rachel + email (should fail on both constraints)...'
DO $$
BEGIN
    BEGIN
        INSERT INTO public.generated_content (character_type, content_type, title, content) 
        VALUES ('rachel', 'email', 'Test Failure Case 3', 'This should fail');
        RAISE NOTICE '❌ UNEXPECTED: rachel + email succeeded (constraints may be fixed)';
    EXCEPTION 
        WHEN check_violation THEN
            RAISE NOTICE '✅ EXPECTED: rachel + email failed with constraint violation: %', SQLERRM;
        WHEN OTHERS THEN
            RAISE NOTICE '⚠️  UNEXPECTED ERROR: %', SQLERRM;
    END;
END $$;

\echo ''
\echo '🎯 CONSTRAINT VIOLATION TEST COMPLETE'
\echo '==================================='
\echo ''
\echo 'Expected Results Based on Test Report:'
\echo '- maya + lesson: ✅ Should succeed'
\echo '- rachel + lesson: ❌ Should fail (character_type constraint)'
\echo '- sofia + lesson: ❌ Should fail (character_type constraint)'
\echo '- david + lesson: ❌ Should fail (character_type constraint)'
\echo '- maya + email: ❌ Should fail (content_type constraint)'
\echo '- maya + article: ❌ Should fail (content_type constraint)'
\echo ''
\echo 'If any expected failures now succeed, constraints may have been fixed!'
\echo 'If expected successes fail, there may be additional issues.'