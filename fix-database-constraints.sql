-- Fix database constraints for OpenRouter AI generation
-- This addresses the 503 errors by allowing all character types and content types

-- Fix character_type constraint to allow all characters
ALTER TABLE public.generated_content 
DROP CONSTRAINT IF EXISTS generated_content_character_type_check;

ALTER TABLE public.generated_content 
ADD CONSTRAINT generated_content_character_type_check 
CHECK (character_type IN ('maya', 'rachel', 'sofia', 'david', 'alex', 'lyra'));

-- Fix content_type constraint to allow all content types
ALTER TABLE public.generated_content 
DROP CONSTRAINT IF EXISTS generated_content_content_type_check;

ALTER TABLE public.generated_content 
ADD CONSTRAINT generated_content_content_type_check 
CHECK (content_type IN ('email', 'lesson', 'article', 'social_post', 'newsletter', 'blog_post', 'ecosystem-blueprint'));

-- Add comments to document the changes
COMMENT ON CONSTRAINT generated_content_character_type_check ON public.generated_content 
IS 'Allows all character types: maya, rachel, sofia, david, alex, lyra for AI content generation';

COMMENT ON CONSTRAINT generated_content_content_type_check ON public.generated_content 
IS 'Allows all content types for microlesson AI generation features';

-- Verify the constraints are working
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'generated_content'::regclass 
AND contype = 'c'
AND conname LIKE '%character_type%' OR conname LIKE '%content_type%';