-- URGENT: Fix Database Constraints Causing 503 Errors
-- Date: 2025-07-28
-- Issue: Edge function failing due to restrictive CHECK constraints

-- PROBLEM ANALYSIS:
-- 1. Multiple migration files created different constraint definitions
-- 2. Supabase migration file /supabase/migrations/20250727235600_create_generated_content_table.sql 
--    contains restrictive content_type constraint: CHECK (content_type IN ('email', 'lesson', 'article', 'social_post', 'newsletter', 'blog_post'))
-- 3. But the production database appears to only allow 'lesson' content_type and 'maya' character_type
-- 4. This means the migration wasn't applied correctly or was overridden

-- IMMEDIATE FIXES NEEDED:

-- Step 1: Check current constraint definitions
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.generated_content'::regclass 
AND contype = 'c'
ORDER BY conname;

-- Step 2: Drop existing constraints that are too restrictive
ALTER TABLE public.generated_content 
DROP CONSTRAINT IF EXISTS generated_content_content_type_check;

ALTER TABLE public.generated_content 
DROP CONSTRAINT IF EXISTS generated_content_character_type_check;

-- Step 3: Add correct constraints with all required values
-- Content types based on actual usage in edge function
ALTER TABLE public.generated_content 
ADD CONSTRAINT generated_content_content_type_check 
CHECK (content_type IN (
    'email', 
    'lesson', 
    'article', 
    'social_post', 
    'newsletter', 
    'blog_post',
    'ecosystem-blueprint'
));

-- Character types based on all characters in the system
ALTER TABLE public.generated_content 
ADD CONSTRAINT generated_content_character_type_check 
CHECK (character_type IN (
    'maya', 
    'sofia', 
    'david', 
    'rachel', 
    'alex', 
    'lyra'
));

-- Step 4: Verify constraints are correct
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.generated_content'::regclass 
AND contype = 'c'
ORDER BY conname;

-- Step 5: Test insert to verify fix (remove this after testing)
INSERT INTO public.generated_content (
    user_id,
    character_type,
    content_type,
    title,
    content,
    metadata,
    approval_status
) VALUES (
    NULL, -- test anonymous
    'maya', -- should work
    'email', -- should work after fix
    'Database Fix Test',
    'This is a test to verify the constraint fix works.',
    '{"test": true, "timestamp": "2025-07-28T00:31:00Z"}',
    'pending'
);

-- Step 6: Test with different character types
INSERT INTO public.generated_content (
    user_id,
    character_type,
    content_type,
    title,
    content,
    metadata,
    approval_status
) VALUES (
    NULL,
    'rachel', -- should work after fix
    'article', -- should work after fix
    'Database Fix Test - Rachel Article',
    'This is a test article from Rachel character.',
    '{"test": true, "character": "rachel", "type": "article"}',
    'pending'
);

-- Step 7: Test with sofia
INSERT INTO public.generated_content (
    user_id,
    character_type,
    content_type,
    title,
    content,
    metadata,
    approval_status
) VALUES (
    NULL,
    'sofia', -- should work after fix
    'social_post', -- should work after fix
    'Database Fix Test - Sofia Social',
    'This is a test social post from Sofia.',
    '{"test": true, "character": "sofia", "type": "social_post"}',
    'pending'
);

-- Step 8: Clean up test data (run after verification)
-- DELETE FROM public.generated_content WHERE title LIKE 'Database Fix Test%';

-- VERIFICATION COMMANDS:
-- Run these to confirm the fix worked:

-- 1. Check constraint definitions are correct
-- 2. Test edge function with different character/content combinations
-- 3. Monitor application logs for constraint violation errors

-- EXPECTED RESULTS:
-- ✅ content_type constraint allows: email, lesson, article, social_post, newsletter, blog_post, ecosystem-blueprint
-- ✅ character_type constraint allows: maya, sofia, david, rachel, alex, lyra
-- ✅ Edge function no longer returns 503 errors
-- ✅ All character/content type combinations work as expected