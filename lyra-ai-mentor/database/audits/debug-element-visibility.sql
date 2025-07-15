-- Debug Element Visibility Issues
-- Run this to understand what elements should be visible

-- 1. Check a specific lesson that should have multiple elements
-- Let's look at Chapter 2, Lesson 5 (AI Email Assistant)
SELECT 
  'Chapter 2, Lesson 5 Elements' as context,
  ie.id,
  ie.type,
  ie.title,
  ie.order_index,
  LENGTH(ie.content) as content_length,
  CASE WHEN ie.configuration::text LIKE '%ai_powered%' THEN 'Has AI' ELSE 'No AI' END as ai_status
FROM interactive_elements ie
WHERE lesson_id = 5
ORDER BY order_index;

-- 2. Count all content blocks and interactive elements per lesson
SELECT 
  c.title as chapter,
  l.id as lesson_id,
  l.title as lesson,
  COUNT(DISTINCT cb.id) as content_blocks,
  COUNT(DISTINCT ie.id) as interactive_elements,
  COUNT(DISTINCT cb.id) + COUNT(DISTINCT ie.id) as total_elements
FROM lessons l
JOIN chapters c ON l.chapter_id = c.id
LEFT JOIN content_blocks cb ON cb.lesson_id = l.id
LEFT JOIN interactive_elements ie ON ie.lesson_id = l.id
GROUP BY c.id, c.title, l.id, l.title
ORDER BY c.id, l.order_index;

-- 3. Look for any filtering conditions that might hide elements
-- Check for nulls or empty values that might cause rendering issues
SELECT 
  'Potential Problem Elements' as issue_type,
  id,
  type,
  title,
  CASE 
    WHEN content IS NULL THEN 'NULL content'
    WHEN content = '' THEN 'Empty content'
    WHEN configuration IS NULL THEN 'NULL configuration'
    WHEN configuration::text = '{}' THEN 'Empty configuration'
    ELSE 'Other issue'
  END as problem
FROM interactive_elements
WHERE content IS NULL 
   OR content = ''
   OR configuration IS NULL
   OR configuration::text = '{}';

-- 4. Check for "board defense" element specifically
SELECT 
  'Board Defense Elements' as search_result,
  ie.id,
  ie.lesson_id,
  l.title as lesson_title,
  ie.type,
  ie.title,
  ie.order_index
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
WHERE LOWER(ie.title) LIKE '%board%'
ORDER BY ie.id;

-- 5. Sample what user should see in Chapter 3, Lesson 11
SELECT 
  'Expected in Chapter 3, Lesson 11' as preview,
  CASE 
    WHEN cb.id IS NOT NULL THEN 'Content Block'
    ELSE 'Interactive Element'
  END as element_type,
  COALESCE(cb.order_index, ie.order_index) as order_index,
  COALESCE(cb.title, ie.title) as title,
  COALESCE(cb.type, ie.type) as type
FROM lessons l
LEFT JOIN content_blocks cb ON cb.lesson_id = l.id
LEFT JOIN interactive_elements ie ON ie.lesson_id = l.id
WHERE l.id = 11
  AND (cb.id IS NOT NULL OR ie.id IS NOT NULL)
ORDER BY COALESCE(cb.order_index, ie.order_index);