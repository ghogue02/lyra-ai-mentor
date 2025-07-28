-- Add 'ecosystem-blueprint' as a valid content_type
-- This is needed for the micro lessons ecosystem builder functionality

-- First, drop the existing check constraint
ALTER TABLE public.generated_content 
DROP CONSTRAINT IF EXISTS generated_content_content_type_check;

-- Recreate the constraint with the additional content type
ALTER TABLE public.generated_content 
ADD CONSTRAINT generated_content_content_type_check 
CHECK (content_type IN ('email', 'lesson', 'article', 'social_post', 'newsletter', 'blog_post', 'ecosystem-blueprint'));

-- Add comment to document this addition
COMMENT ON CONSTRAINT generated_content_content_type_check ON public.generated_content 
IS 'Allows ecosystem-blueprint content type for micro lessons ecosystem builder feature';