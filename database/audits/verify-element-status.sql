-- Verify Current Element Status Before Enhancement
-- This shows the current state of all interactive elements

-- Summary of element types and their AI integration status
SELECT 
  type,
  COUNT(*) as count,
  COUNT(CASE WHEN configuration::text LIKE '%ai_powered%' THEN 1 END) as ai_integrated,
  COUNT(CASE WHEN configuration::text LIKE '%llm_model%' THEN 1 END) as has_llm,
  COUNT(CASE WHEN content LIKE '%nonprofit%' OR content LIKE '%donor%' OR content LIKE '%mission%' THEN 1 END) as has_nonprofit_context
FROM interactive_elements
GROUP BY type
ORDER BY count DESC;

-- Elements that need AI integration (priority list)
SELECT 
  ie.id,
  ie.lesson_id,
  l.title as lesson_title,
  c.title as chapter_title,
  ie.type,
  ie.title,
  LENGTH(ie.content) as content_length,
  CASE 
    WHEN ie.configuration::text LIKE '%ai_powered%' THEN 'Has AI'
    ELSE 'Needs AI'
  END as ai_status,
  CASE
    WHEN ie.content LIKE '%nonprofit%' OR ie.content LIKE '%donor%' OR ie.content LIKE '%mission%' THEN 'Has Context'
    ELSE 'Needs Context'
  END as nonprofit_status
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE ie.configuration::text NOT LIKE '%ai_powered%'
   OR (ie.content NOT LIKE '%nonprofit%' AND ie.content NOT LIKE '%donor%' AND ie.content NOT LIKE '%mission%')
ORDER BY c.order_index, l.order_index, ie.order_index
LIMIT 20;

-- Check for static elements that should be upgraded
SELECT 
  type,
  COUNT(*) as count,
  STRING_AGG(DISTINCT title, ', ' ORDER BY title) as example_titles
FROM interactive_elements
WHERE type IN ('reflection', 'knowledge_check', 'callout_box', 'sequence_sorter', 'multiple_choice_scenarios')
GROUP BY type;

-- Elements with lowest content quality
SELECT 
  id,
  type,
  title,
  LENGTH(content) as content_length,
  SUBSTRING(content, 1, 100) || '...' as content_preview
FROM interactive_elements
WHERE LENGTH(content) < 200
ORDER BY LENGTH(content)
LIMIT 10;