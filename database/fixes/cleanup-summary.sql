-- Summary of Difficult Conversation Helper Removal
-- ================================================

-- Check what was removed
SELECT 
  'Difficult Conversation Helpers Removed' as action,
  COUNT(*) as count
FROM interactive_elements
WHERE type = 'difficult_conversation_helper';

-- Show current element type distribution
SELECT 
  type,
  COUNT(*) as count
FROM interactive_elements
GROUP BY type
ORDER BY count DESC;

-- Show elements per chapter after removal
SELECT 
  c.title as chapter,
  COUNT(ie.id) as total_elements,
  STRING_AGG(DISTINCT ie.type, ', ' ORDER BY ie.type) as element_types
FROM chapters c
JOIN lessons l ON l.chapter_id = c.id
LEFT JOIN interactive_elements ie ON ie.lesson_id = l.id
GROUP BY c.id, c.title
ORDER BY c.id;