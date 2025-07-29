-- 🚨 URGENT: Apply this SQL immediately to fix 503 errors
-- Go to: https://supabase.com/dashboard/project/hfkzwjnlxrwynactcmpe/sql
-- Paste and execute this entire script

-- Fix 1: Allow NULL user_id for anonymous content generation
ALTER TABLE public.generated_content 
ALTER COLUMN user_id DROP NOT NULL;

-- Fix 2: Remove restrictive character type constraint
ALTER TABLE public.generated_content 
DROP CONSTRAINT IF EXISTS generated_content_character_type_check;

-- Fix 3: Remove restrictive content type constraint  
ALTER TABLE public.generated_content 
DROP CONSTRAINT IF EXISTS generated_content_content_type_check;

-- Fix 4: Add correct character type constraint (all 6 characters)
ALTER TABLE public.generated_content 
ADD CONSTRAINT generated_content_character_type_check 
CHECK (character_type IN ('maya', 'rachel', 'sofia', 'david', 'alex', 'lyra'));

-- Fix 5: Add correct content type constraint (all 7 content types)
ALTER TABLE public.generated_content 
ADD CONSTRAINT generated_content_content_type_check 
CHECK (content_type IN ('email', 'lesson', 'article', 'social_post', 'newsletter', 'blog_post', 'ecosystem-blueprint'));

-- Verification query - should show updated constraints
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.generated_content'::regclass 
AND contype = 'c'
AND (conname LIKE '%character_type%' OR conname LIKE '%content_type%')
ORDER BY conname;