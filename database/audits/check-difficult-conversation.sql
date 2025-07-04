-- Check the status of difficult_conversation_helper elements
SELECT 
  ie.id,
  ie.type,
  ie.title,
  l.lesson_number,
  l.title as lesson_title,
  c.chapter_number,
  c.title as chapter_title,
  ie.order_index,
  ie.is_active,
  ie.is_gated,
  ie.is_visible,
  LENGTH(ie.content) as content_length,
  CASE 
    WHEN ie.configuration IS NULL THEN 'NULL'
    WHEN ie.configuration::text = '{}' THEN 'Empty'
    ELSE 'Has Config'
  END as config_status
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE ie.type = 'difficult_conversation_helper'
ORDER BY c.chapter_number, l.lesson_number, ie.order_index;

-- Also check if any elements are set to inactive or invisible
SELECT 
  COUNT(*) as total_elements,
  SUM(CASE WHEN is_active = false THEN 1 ELSE 0 END) as inactive_elements,
  SUM(CASE WHEN is_visible = false THEN 1 ELSE 0 END) as invisible_elements,
  SUM(CASE WHEN is_gated = true THEN 1 ELSE 0 END) as gated_elements
FROM interactive_elements;
EOF < /dev/null