-- Fix Element Visibility Issues
-- This comprehensive fix addresses all potential database issues

-- 1. First, ensure the table structure is correct
ALTER TABLE interactive_elements 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS is_gated boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_visible boolean DEFAULT true;

ALTER TABLE content_blocks
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS is_visible boolean DEFAULT true;

-- 2. Set all elements to be active and visible
UPDATE interactive_elements 
SET is_active = true, 
    is_gated = false,
    is_visible = true
WHERE is_active IS NULL OR is_gated IS NULL OR is_visible IS NULL;

UPDATE content_blocks
SET is_active = true,
    is_visible = true
WHERE is_active IS NULL OR is_visible IS NULL;

-- 3. Fix any null or empty content/configuration
UPDATE interactive_elements
SET content = 'This element is being updated. Please refresh the page.'
WHERE content IS NULL OR content = '';

UPDATE interactive_elements
SET configuration = '{}'::jsonb
WHERE configuration IS NULL;

-- 4. Ensure reasonable order_index values
-- Fix extremely high order_index values
UPDATE interactive_elements
SET order_index = 
  CASE 
    WHEN order_index > 200 THEN 90
    WHEN order_index < 0 THEN 10
    ELSE order_index
  END
WHERE order_index > 200 OR order_index < 0;

-- 5. Show what should be visible for Chapter 2, Lesson 5
SELECT 
  '=== CHAPTER 2, LESSON 5 VISIBILITY CHECK ===' as section;

SELECT 
  'Content Blocks' as element_type,
  cb.id,
  cb.title,
  cb.order_index,
  cb.is_active,
  cb.is_visible
FROM content_blocks cb
WHERE cb.lesson_id = 5
ORDER BY cb.order_index;

SELECT 
  'Interactive Elements' as element_type,
  ie.id,
  ie.type,
  ie.title,
  ie.order_index,
  ie.is_active,
  ie.is_gated,
  ie.is_visible
FROM interactive_elements ie
WHERE ie.lesson_id = 5
ORDER BY ie.order_index;

-- 6. Summary of all lessons
SELECT 
  '=== ELEMENTS PER LESSON ===' as section;

SELECT 
  c.title as chapter,
  l.title as lesson,
  COUNT(DISTINCT cb.id) as content_blocks,
  COUNT(DISTINCT ie.id) as interactive_elements,
  COUNT(DISTINCT cb.id) + COUNT(DISTINCT ie.id) as total_visible
FROM lessons l
JOIN chapters c ON l.chapter_id = c.id
LEFT JOIN content_blocks cb ON cb.lesson_id = l.id AND (cb.is_active = true OR cb.is_active IS NULL)
LEFT JOIN interactive_elements ie ON ie.lesson_id = l.id AND (ie.is_active = true OR ie.is_active IS NULL)
GROUP BY c.id, c.title, l.id, l.title
ORDER BY c.id, l.order_index;

-- 7. Find any problematic elements
SELECT 
  '=== POTENTIAL PROBLEMS ===' as section;

SELECT 
  'Interactive Elements with Issues' as problem_type,
  id,
  type,
  title,
  order_index,
  CASE 
    WHEN configuration IS NULL THEN 'NULL config'
    WHEN configuration::text = '{}' THEN 'Empty config'
    WHEN content IS NULL OR content = '' THEN 'Empty content'
    WHEN order_index > 100 THEN 'High order_index'
    ELSE 'Unknown'
  END as issue
FROM interactive_elements
WHERE configuration IS NULL 
   OR configuration::text = '{}'
   OR content IS NULL 
   OR content = ''
   OR order_index > 100;