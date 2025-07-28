-- Fix user_id column to allow NULL values for anonymous usage
-- This addresses the NOT NULL constraint violation error in production

-- Drop the NOT NULL constraint on user_id column
ALTER TABLE public.generated_content 
ALTER COLUMN user_id DROP NOT NULL;

-- Add a default NULL value (if not already present)
ALTER TABLE public.generated_content 
ALTER COLUMN user_id SET DEFAULT NULL;

-- Verify the existing RLS policies work with NULL user_id
-- The policies are already correctly configured to handle NULL values

-- Add a comment to document this change
COMMENT ON COLUMN public.generated_content.user_id IS 'User ID - nullable to allow anonymous content generation for testing and demos';