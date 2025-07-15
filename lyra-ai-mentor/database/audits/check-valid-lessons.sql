-- Check which lessons exist in the database
SELECT 
  l.id as lesson_id,
  l.title as lesson_title,
  c.id as chapter_id,
  c.title as chapter_title,
  l.order_index
FROM lessons l
JOIN chapters c ON l.chapter_id = c.id
ORDER BY c.id, l.order_index;