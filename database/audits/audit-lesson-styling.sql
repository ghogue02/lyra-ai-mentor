-- Comprehensive audit of lesson styling and content structure
-- This will help identify lessons that need story formatting applied

-- Check all lessons and their content structure
SELECT 
  l.id as lesson_id,
  l.title as lesson_title,
  l.chapter_id,
  c.title as chapter_title,
  COUNT(cb.id) as content_blocks_count,
  COUNT(ie.id) as interactive_elements_count,
  -- Check for character names in content
  SUM(CASE WHEN cb.content ILIKE '%maya%' THEN 1 ELSE 0 END) as maya_blocks,
  SUM(CASE WHEN cb.content ILIKE '%sofia%' THEN 1 ELSE 0 END) as sofia_blocks,
  SUM(CASE WHEN cb.content ILIKE '%david%' THEN 1 ELSE 0 END) as david_blocks,
  SUM(CASE WHEN cb.content ILIKE '%rachel%' THEN 1 ELSE 0 END) as rachel_blocks,
  SUM(CASE WHEN cb.content ILIKE '%alex%' THEN 1 ELSE 0 END) as alex_blocks,
  -- Check for story indicators
  SUM(CASE WHEN cb.content ILIKE '%thought%' OR cb.content ILIKE '%said%' OR cb.content ILIKE '%felt%' THEN 1 ELSE 0 END) as story_elements,
  SUM(CASE WHEN cb.content LIKE '%"%' AND cb.content LIKE '%"%' THEN 1 ELSE 0 END) as dialogue_blocks,
  -- Check content length
  AVG(LENGTH(cb.content)) as avg_content_length,
  MAX(LENGTH(cb.content)) as max_content_length
FROM lessons l
LEFT JOIN chapters c ON l.chapter_id = c.id
LEFT JOIN content_blocks cb ON l.id = cb.lesson_id
LEFT JOIN interactive_elements ie ON l.id = ie.lesson_id AND ie.is_active = true
WHERE l.is_published = true
GROUP BY l.id, l.title, l.chapter_id, c.title
ORDER BY l.chapter_id, l.order_index;

-- Detailed look at lessons 11-26 (chapters 3-6) content
SELECT 
  l.id as lesson_id,
  l.title as lesson_title,
  l.chapter_id,
  cb.id as block_id,
  cb.title as block_title,
  LEFT(cb.content, 100) as content_preview,
  LENGTH(cb.content) as content_length,
  CASE 
    WHEN cb.content ILIKE '%sofia%' THEN 'Sofia'
    WHEN cb.content ILIKE '%david%' THEN 'David'
    WHEN cb.content ILIKE '%rachel%' THEN 'Rachel'
    WHEN cb.content ILIKE '%alex%' THEN 'Alex'
    WHEN cb.content ILIKE '%maya%' THEN 'Maya'
    ELSE 'No Character'
  END as character_detected,
  CASE 
    WHEN cb.content LIKE '%"%' AND cb.content LIKE '%"%' THEN 'Has Dialogue'
    WHEN cb.content ILIKE '%thought%' OR cb.content ILIKE '%said%' OR cb.content ILIKE '%felt%' THEN 'Story Elements'
    ELSE 'Plain Content'
  END as content_type
FROM lessons l
LEFT JOIN content_blocks cb ON l.id = cb.lesson_id
WHERE l.chapter_id IN (3, 4, 5, 6) 
AND l.is_published = true
AND cb.id IS NOT NULL
ORDER BY l.id, cb.order_index;