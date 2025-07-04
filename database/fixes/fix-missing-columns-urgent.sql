-- URGENT FIX: Add Missing Columns to Show All Elements
-- The application is filtering on columns that don't exist!

-- Add the missing columns with proper defaults
ALTER TABLE interactive_elements 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS is_gated boolean DEFAULT false;

-- Ensure all elements are active and not gated
UPDATE interactive_elements 
SET is_active = true, 
    is_gated = false;

-- Verify the fix worked
SELECT 
  'Column Fix Applied' as status,
  COUNT(*) as total_elements,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_elements,
  COUNT(CASE WHEN is_gated = false THEN 1 END) as ungated_elements
FROM interactive_elements;

-- Show element distribution per chapter
SELECT 
  c.id as chapter_id,
  c.title as chapter_title,
  COUNT(DISTINCT l.id) as lesson_count,
  COUNT(ie.id) as element_count,
  STRING_AGG(DISTINCT ie.type, ', ' ORDER BY ie.type) as element_types
FROM chapters c
JOIN lessons l ON l.chapter_id = c.id
LEFT JOIN interactive_elements ie ON ie.lesson_id = l.id
GROUP BY c.id, c.title
ORDER BY c.id;

-- Show all elements to confirm they're visible
SELECT 
  c.title as chapter,
  l.title as lesson,
  ie.type,
  ie.title,
  ie.order_index,
  ie.is_active,
  ie.is_gated
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
ORDER BY c.id, l.order_index, ie.order_index
LIMIT 20;