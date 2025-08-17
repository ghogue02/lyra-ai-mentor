-- Add 'document' to the allowed content types for generated_content table
ALTER TABLE generated_content 
DROP CONSTRAINT IF EXISTS generated_content_content_type_check;

ALTER TABLE generated_content 
ADD CONSTRAINT generated_content_content_type_check 
CHECK (content_type IN ('email', 'lesson', 'article', 'social_post', 'newsletter', 'blog_post', 'ecosystem-blueprint', 'document'));