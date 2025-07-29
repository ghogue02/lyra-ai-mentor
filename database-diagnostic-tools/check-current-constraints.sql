-- Database Constraint Diagnostic Script
-- Checks the current state of constraints on generated_content table

\echo '🔍 DATABASE CONSTRAINT DIAGNOSTIC REPORT'
\echo '========================================'
\echo ''

-- Check if the table exists
\echo '📋 1. TABLE EXISTENCE CHECK'
\echo '------------------------'
SELECT 
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'generated_content'
    ) 
    THEN '✅ generated_content table EXISTS'
    ELSE '❌ generated_content table DOES NOT EXIST'
    END AS table_status;

\echo ''

-- Check current column definitions
\echo '📋 2. COLUMN DEFINITIONS'
\echo '----------------------'
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'generated_content'
ORDER BY ordinal_position;

\echo ''

-- Check all constraints on the table
\echo '📋 3. ALL CONSTRAINTS'
\echo '------------------'
SELECT 
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.generated_content'::regclass
ORDER BY contype, conname;

\echo ''

-- Specifically check the problematic constraints mentioned in the test report
\echo '📋 4. CRITICAL CONSTRAINT ANALYSIS'
\echo '--------------------------------'

-- Check character_type constraint
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS definition,
    CASE 
        WHEN pg_get_constraintdef(oid) LIKE '%rachel%' 
         AND pg_get_constraintdef(oid) LIKE '%sofia%' 
         AND pg_get_constraintdef(oid) LIKE '%david%' 
        THEN '✅ Includes all required characters'
        ELSE '❌ MISSING required characters (rachel, sofia, david)'
    END AS status
FROM pg_constraint 
WHERE conrelid = 'public.generated_content'::regclass 
  AND conname = 'generated_content_character_type_check';

\echo ''

-- Check content_type constraint  
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS definition,
    CASE 
        WHEN pg_get_constraintdef(oid) LIKE '%email%' 
         AND pg_get_constraintdef(oid) LIKE '%article%' 
        THEN '✅ Includes all required content types'
        ELSE '❌ MISSING required content types (email, article)'
    END AS status
FROM pg_constraint 
WHERE conrelid = 'public.generated_content'::regclass 
  AND conname = 'generated_content_content_type_check';

\echo ''

-- Check RLS policies
\echo '📋 5. ROW LEVEL SECURITY POLICIES'
\echo '-------------------------------'
SELECT 
    pol.polname AS policy_name,
    pol.polcmd AS command,
    pol.polroles::regrole[] AS roles,
    pol.polqual AS using_expression,
    pol.polwithcheck AS with_check_expression
FROM pg_policy pol
JOIN pg_class pc ON pol.polrelid = pc.oid
WHERE pc.relname = 'generated_content'
  AND pc.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY pol.polname;

\echo ''

-- Sample test data to verify what would work
\echo '📋 6. SAMPLE TEST VALUES VERIFICATION'
\echo '----------------------------------'
\echo 'Testing which character_type values would be accepted:'

WITH test_characters AS (
    SELECT unnest(ARRAY['maya', 'rachel', 'sofia', 'david', 'alex', 'lyra']) AS character_type
),
constraint_check AS (
    SELECT pg_get_constraintdef(oid) AS definition
    FROM pg_constraint 
    WHERE conrelid = 'public.generated_content'::regclass 
      AND conname = 'generated_content_character_type_check'
)
SELECT 
    tc.character_type,
    CASE 
        WHEN cc.definition LIKE '%' || tc.character_type || '%' 
        THEN '✅ ALLOWED'
        ELSE '❌ REJECTED - Would cause 503 error'
    END AS status
FROM test_characters tc
CROSS JOIN constraint_check cc
ORDER BY tc.character_type;

\echo ''
\echo 'Testing which content_type values would be accepted:'

WITH test_content_types AS (
    SELECT unnest(ARRAY['email', 'lesson', 'article', 'social_post', 'newsletter', 'blog_post', 'ecosystem-blueprint']) AS content_type
),
constraint_check AS (
    SELECT pg_get_constraintdef(oid) AS definition
    FROM pg_constraint 
    WHERE conrelid = 'public.generated_content'::regclass 
      AND conname = 'generated_content_content_type_check'
)
SELECT 
    tc.content_type,
    CASE 
        WHEN cc.definition LIKE '%' || tc.content_type || '%' 
        THEN '✅ ALLOWED'
        ELSE '❌ REJECTED - Would cause 503 error'
    END AS status
FROM test_content_types tc
CROSS JOIN constraint_check cc
ORDER BY tc.content_type;

\echo ''
\echo '📊 DIAGNOSTIC COMPLETE'
\echo '====================='
\echo 'Next Steps:'
\echo '- Run test-constraint-violations.sql to verify issues'
\echo '- If constraints are missing values, run fix-database-constraints.sql'
\echo '- Then run verify-constraint-fixes.sql to confirm success'