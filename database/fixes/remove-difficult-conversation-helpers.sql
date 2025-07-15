-- Remove All Difficult Conversation Helper Elements
-- ================================================

-- 1. First, let's see what we're removing
SELECT 
  'Elements to be removed:' as action,
  COUNT(*) as total_count
FROM interactive_elements
WHERE type = 'difficult_conversation_helper';

-- Show details of what will be deleted
SELECT 
  ie.id,
  ie.lesson_id,
  l.title as lesson_title,
  c.title as chapter_title,
  ie.title as element_title,
  ie.order_index
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE ie.type = 'difficult_conversation_helper'
ORDER BY c.id, l.id, ie.order_index;

-- 2. Delete any progress records for these elements
DELETE FROM interactive_element_progress
WHERE interactive_element_id IN (
  SELECT id FROM interactive_elements 
  WHERE type = 'difficult_conversation_helper'
);

-- 3. Delete any chat conversations related to these elements
DELETE FROM chat_conversations
WHERE element_id IN (
  SELECT id FROM interactive_elements 
  WHERE type = 'difficult_conversation_helper'
);

-- 4. Delete the difficult conversation helper elements
DELETE FROM interactive_elements
WHERE type = 'difficult_conversation_helper';

-- 5. Verify deletion
SELECT 
  'Deletion complete. Remaining difficult_conversation_helper elements:' as status,
  COUNT(*) as remaining_count
FROM interactive_elements
WHERE type = 'difficult_conversation_helper';

-- 6. Show updated element counts per chapter
SELECT 
  c.title as chapter,
  COUNT(ie.id) as remaining_interactive_elements,
  COUNT(CASE WHEN ie.type = 'lyra_chat' THEN 1 END) as lyra_chats,
  COUNT(CASE WHEN ie.type = 'ai_content_generator' THEN 1 END) as content_generators,
  COUNT(CASE WHEN ie.type = 'template_creator' THEN 1 END) as template_creators
FROM chapters c
JOIN lessons l ON l.chapter_id = c.id
LEFT JOIN interactive_elements ie ON ie.lesson_id = l.id
GROUP BY c.id, c.title
ORDER BY c.id;