-- Check for difficult_conversation_helper elements
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
  ie.is_gated
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE ie.type = 'difficult_conversation_helper'
ORDER BY c.chapter_number, l.lesson_number, ie.order_index;
EOF < /dev/null