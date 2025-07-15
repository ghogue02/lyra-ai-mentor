-- Fix interactive elements active status
-- All elements have undefined is_active and is_gated values

-- First, let's check the current state
SELECT 'Current state of interactive elements:' as info;
SELECT 
  COUNT(*) as total_elements,
  SUM(CASE WHEN is_active IS NULL THEN 1 ELSE 0 END) as null_active,
  SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active_true,
  SUM(CASE WHEN is_active = false THEN 1 ELSE 0 END) as active_false,
  SUM(CASE WHEN is_gated IS NULL THEN 1 ELSE 0 END) as null_gated,
  SUM(CASE WHEN is_gated = true THEN 1 ELSE 0 END) as gated_true,
  SUM(CASE WHEN is_gated = false THEN 1 ELSE 0 END) as gated_false
FROM interactive_elements;

-- Update all elements to be active and not gated
UPDATE interactive_elements
SET 
  is_active = true,
  is_gated = false
WHERE is_active IS NULL OR is_gated IS NULL;

-- Verify the update
SELECT '\nAfter update:' as info;
SELECT 
  COUNT(*) as total_elements,
  SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active_elements,
  SUM(CASE WHEN is_gated = false THEN 1 ELSE 0 END) as ungated_elements
FROM interactive_elements;

-- Show sample of updated elements per chapter
SELECT '\nElements per chapter after update:' as info;
SELECT 
  c.order_index as chapter_num,
  c.title as chapter_title,
  COUNT(ie.id) as element_count,
  SUM(CASE WHEN ie.is_active = true THEN 1 ELSE 0 END) as active_count
FROM chapters c
JOIN lessons l ON c.id = l.chapter_id
JOIN interactive_elements ie ON l.id = ie.lesson_id
GROUP BY c.order_index, c.title
ORDER BY c.order_index;