-- URGENT: Fix Database Constraints Causing 503 Errors in OpenRouter Edge Function
-- Date: 2025-07-29
-- Issues Identified:
-- 1. Edge function failing due to restrictive CHECK constraints on generated_content table
-- 2. user_id column has NOT NULL constraint but Edge Function sends NULL for anonymous users
-- 3. Missing character and content type values in constraints

-- The problems:
-- 1. Current constraints only allow limited values, but the OpenRouter function
--    needs to generate content for all characters (maya, rachel, sofia, david, alex, lyra)
--    and all content types (email, lesson, article, social_post, newsletter, blog_post, ecosystem-blueprint)
-- 2. user_id column cannot be NULL but Edge Function allows anonymous usage

-- Step 1: Fix user_id constraint to allow NULL (for anonymous users)
ALTER TABLE public.generated_content 
ALTER COLUMN user_id DROP NOT NULL;

-- Step 2: Drop existing restrictive constraints
ALTER TABLE public.generated_content 
DROP CONSTRAINT IF EXISTS generated_content_character_type_check;

ALTER TABLE public.generated_content 
DROP CONSTRAINT IF EXISTS generated_content_content_type_check;

-- Step 3: Add corrected constraints with all required values
-- Character types based on all characters in the system
ALTER TABLE public.generated_content 
ADD CONSTRAINT generated_content_character_type_check 
CHECK (character_type IN (
    'maya', 
    'rachel', 
    'sofia', 
    'david', 
    'alex', 
    'lyra'
));

-- Content types based on actual usage in edge functions
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

-- Step 4: Add comments to document the changes
COMMENT ON CONSTRAINT generated_content_character_type_check ON public.generated_content 
IS 'Updated 2025-07-29: Allows all character types for AI content generation - maya, rachel, sofia, david, alex, lyra';

COMMENT ON CONSTRAINT generated_content_content_type_check ON public.generated_content 
IS 'Updated 2025-07-29: Allows all content types for microlesson AI generation features';

-- Step 5: Add comment to user_id column to document the change
COMMENT ON COLUMN public.generated_content.user_id 
IS 'Updated 2025-07-29: Allows NULL for anonymous content generation via Edge Functions';

-- Step 6: Verify constraints are properly applied (for monitoring)
-- This will help us confirm the migration worked
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.generated_content'::regclass 
AND contype = 'c'
AND (conname LIKE '%character_type%' OR conname LIKE '%content_type%')
ORDER BY conname;

-- Step 7: Verify user_id column allows NULL
SELECT 
    column_name,
    is_nullable,
    data_type
FROM information_schema.columns 
WHERE table_name = 'generated_content' 
AND column_name = 'user_id';