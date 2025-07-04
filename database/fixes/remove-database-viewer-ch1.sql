-- Remove Database Content Viewer from Chapter 1
-- This removes the debugging tool that was added for development purposes

-- First, find and deactivate any database content viewers in Chapter 1
UPDATE interactive_elements 
SET is_active = false, 
    updated_at = NOW()
WHERE type = 'database_content_viewer' 
AND lesson_id IN (
  SELECT id 
  FROM lessons 
  WHERE chapter_id = 1
);

-- Alternative: Delete completely if preferred
-- DELETE FROM interactive_elements 
-- WHERE type = 'database_content_viewer' 
-- AND lesson_id IN (
--   SELECT id 
--   FROM lessons 
--   WHERE chapter_id = 1
-- );

-- Verify removal
SELECT 
  ie.id, 
  ie.type, 
  ie.title, 
  ie.is_active,
  l.chapter_id,
  l.title as lesson_title
FROM interactive_elements ie 
JOIN lessons l ON ie.lesson_id = l.id 
WHERE l.chapter_id = 1 
AND ie.type = 'database_content_viewer';