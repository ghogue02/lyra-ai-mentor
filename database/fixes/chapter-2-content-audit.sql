-- Chapter 2 Content Consistency Audit
-- Check for mismatches between promises and delivery

-- 1. Check what lessons are in Chapter 2
SELECT 
  'Chapter 2 Lessons' as audit_section,
  l.id,
  l.title,
  l.subtitle,
  l.order_index
FROM lessons l
WHERE l.chapter_id = 2
ORDER BY l.order_index;

-- 2. Find all content blocks that mention "four tools" or similar
SELECT 
  'Four Tools Mentions' as audit_section,
  cb.lesson_id,
  l.title as lesson_title,
  cb.title as block_title,
  cb.content,
  cb.order_index
FROM content_blocks cb
JOIN lessons l ON cb.lesson_id = l.id
WHERE l.chapter_id = 2
  AND (cb.content ILIKE '%four%tool%' 
    OR cb.content ILIKE '%4 tool%'
    OR cb.content ILIKE '%game-changing%'
    OR cb.content ILIKE '%essential%tool%');

-- 3. Find character mentions that aren't developed
SELECT 
  'Character Mentions' as audit_section,
  cb.lesson_id,
  l.title as lesson_title,
  cb.title as block_title,
  CASE 
    WHEN cb.content ILIKE '%sofia%' THEN 'Sofia mentioned'
    WHEN cb.content ILIKE '%david%' THEN 'David mentioned'
    WHEN cb.content ILIKE '%rachel%' THEN 'Rachel mentioned'
    WHEN cb.content ILIKE '%alex%' THEN 'Alex mentioned'
  END as character_mention,
  cb.content,
  cb.order_index
FROM content_blocks cb
JOIN lessons l ON cb.lesson_id = l.id
WHERE l.chapter_id = 2
  AND (cb.content ILIKE '%sofia%' 
    OR cb.content ILIKE '%david%'
    OR cb.content ILIKE '%rachel%'
    OR cb.content ILIKE '%alex%');

-- 4. Check interactive elements and their alignment
SELECT 
  'Interactive Elements' as audit_section,
  ie.lesson_id,
  l.title as lesson_title,
  ie.type,
  ie.title,
  ie.content,
  ie.order_index
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
WHERE l.chapter_id = 2
ORDER BY ie.lesson_id, ie.order_index;

-- 5. Check what content blocks promise vs what elements deliver
SELECT 
  'Content vs Elements Mismatch' as audit_section,
  cb.lesson_id,
  l.title as lesson_title,
  cb.title as content_title,
  SUBSTRING(cb.content, 1, 200) || '...' as content_preview,
  COUNT(ie.id) as interactive_elements_count
FROM content_blocks cb
JOIN lessons l ON cb.lesson_id = l.id
LEFT JOIN interactive_elements ie ON ie.lesson_id = cb.lesson_id
WHERE l.chapter_id = 2
  AND cb.type IN ('text', 'interactive_element_placeholder')
GROUP BY cb.lesson_id, l.title, cb.title, cb.content, cb.order_index
ORDER BY cb.lesson_id, cb.order_index;

-- 6. Find interactive element placeholders without matching elements
SELECT 
  'Missing Interactive Elements' as audit_section,
  cb.lesson_id,
  l.title as lesson_title,
  cb.title as placeholder_title,
  cb.content as placeholder_description,
  cb.order_index
FROM content_blocks cb
JOIN lessons l ON cb.lesson_id = l.id
WHERE l.chapter_id = 2
  AND cb.type = 'interactive_element_placeholder';

-- 7. Check for Maya/James story continuity
SELECT 
  'Story Continuity Check' as audit_section,
  cb.lesson_id,
  l.title as lesson_title,
  cb.title,
  CASE 
    WHEN cb.content ILIKE '%maya%' THEN 'Maya story'
    WHEN cb.content ILIKE '%james%' THEN 'James story'
    ELSE 'No character'
  END as character_story,
  cb.order_index
FROM content_blocks cb
JOIN lessons l ON cb.lesson_id = l.id
WHERE l.chapter_id = 2
ORDER BY cb.lesson_id, cb.order_index;