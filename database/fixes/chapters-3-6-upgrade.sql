-- AUTOMATED CHAPTERS 3-6 UPGRADE
-- Generated: 2025-07-02T17:23:26.864Z
-- Total fixes: 0

BEGIN;

-- Placement Fixes (0 items)


-- Formatting Fixes (0 items)


COMMIT;

-- Verify the updates
SELECT 
  l.id as lesson_id,
  l.title as lesson,
  COUNT(DISTINCT ie.id) as interactive_elements,
  MIN(ie.order_index) as first_element_position,
  MIN(cb.order_index) as first_content_position
FROM lessons l
LEFT JOIN interactive_elements ie ON ie.lesson_id = l.id AND ie.is_active = true
LEFT JOIN content_blocks cb ON cb.lesson_id = l.id
WHERE l.id BETWEEN 11 AND 26
GROUP BY l.id, l.title
ORDER BY l.id;