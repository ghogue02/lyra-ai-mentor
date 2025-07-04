-- Verify No Content Blocking
-- Check if content gating is preventing element display

-- 1. Check for any lyra_chat elements that might be blocking content
SELECT 
  'Lyra Chat Elements by Lesson' as check_type,
  l.id as lesson_id,
  l.title as lesson_title,
  COUNT(ie.id) as lyra_chat_count,
  MIN(ie.order_index) as first_lyra_chat_order,
  STRING_AGG(ie.order_index::text, ', ' ORDER BY ie.order_index) as all_lyra_chat_orders
FROM lessons l
LEFT JOIN interactive_elements ie ON ie.lesson_id = l.id AND ie.type = 'lyra_chat'
GROUP BY l.id, l.title
HAVING COUNT(ie.id) > 0
ORDER BY l.id;

-- 2. Show elements that come AFTER lyra_chat in each lesson
WITH lyra_positions AS (
  SELECT 
    lesson_id,
    MIN(order_index) as first_lyra_order
  FROM interactive_elements
  WHERE type = 'lyra_chat'
  GROUP BY lesson_id
)
SELECT 
  'Elements After Lyra Chat' as status,
  ie.lesson_id,
  l.title as lesson_title,
  ie.type,
  ie.title,
  ie.order_index,
  lp.first_lyra_order as lyra_chat_at
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
JOIN lyra_positions lp ON ie.lesson_id = lp.lesson_id
WHERE ie.order_index > lp.first_lyra_order
ORDER BY ie.lesson_id, ie.order_index
LIMIT 20;

-- 3. Count how many elements would be blocked if gating was active
WITH lyra_positions AS (
  SELECT 
    lesson_id,
    MIN(order_index) as first_lyra_order
  FROM interactive_elements
  WHERE type = 'lyra_chat'
  GROUP BY lesson_id
)
SELECT 
  'Potential Blocked Elements Count' as metric,
  COUNT(*) as would_be_blocked,
  COUNT(DISTINCT ie.lesson_id) as affected_lessons
FROM interactive_elements ie
JOIN lyra_positions lp ON ie.lesson_id = lp.lesson_id
WHERE ie.order_index > lp.first_lyra_order;

-- 4. Sample what user sees with blocking disabled (should see all)
SELECT 
  'Chapter 2 Lesson 5 - All Elements' as view,
  COALESCE(cb.order_index, ie.order_index) as display_order,
  CASE 
    WHEN cb.id IS NOT NULL THEN 'Content'
    ELSE 'Interactive'
  END as element_type,
  COALESCE(cb.title, ie.title) as title,
  COALESCE(cb.type, ie.type) as type,
  CASE 
    WHEN ie.type = 'lyra_chat' THEN '🔒 Would block after this'
    ELSE ''
  END as note
FROM lessons l
LEFT JOIN content_blocks cb ON cb.lesson_id = l.id
LEFT JOIN interactive_elements ie ON ie.lesson_id = l.id
WHERE l.id = 5
ORDER BY COALESCE(cb.order_index, ie.order_index);