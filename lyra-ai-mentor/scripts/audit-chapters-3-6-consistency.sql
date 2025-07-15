-- Audit Chapters 3-6 for Character Consistency

-- 1. Get chapter overview
SELECT 
  c.id,
  c.order_index as chapter_number,
  c.title,
  c.description
FROM chapters c
WHERE c.order_index BETWEEN 3 AND 6
ORDER BY c.order_index;

-- 2. Get all lessons in chapters 3-6 with their character assignments
SELECT 
  c.order_index as chapter_number,
  c.title as chapter_title,
  l.id as lesson_id,
  l.order_index as lesson_number,
  l.title as lesson_title
FROM lessons l
JOIN chapters c ON l.chapter_id = c.id
WHERE c.order_index BETWEEN 3 AND 6
ORDER BY c.order_index, l.order_index;

-- 3. Find character mentions in content blocks for chapters 3-6
WITH character_mentions AS (
  SELECT 
    c.order_index as chapter_number,
    l.order_index as lesson_number,
    l.title as lesson_title,
    cb.id as content_block_id,
    CASE 
      WHEN cb.content ILIKE '%Sofia%' THEN 'Sofia'
      WHEN cb.content ILIKE '%David%' THEN 'David'
      WHEN cb.content ILIKE '%Rachel%' THEN 'Rachel'
      WHEN cb.content ILIKE '%Alex%' THEN 'Alex'
      WHEN cb.content ILIKE '%Maya%' THEN 'Maya'
      WHEN cb.content ILIKE '%James%' THEN 'James'
      ELSE 'No character'
    END as character_found,
    SUBSTRING(cb.content, 1, 200) as content_preview
  FROM content_blocks cb
  JOIN lessons l ON cb.lesson_id = l.id
  JOIN chapters c ON l.chapter_id = c.id
  WHERE c.order_index BETWEEN 3 AND 6
    AND cb.is_active = true
    AND (
      cb.content ILIKE '%Sofia%' OR
      cb.content ILIKE '%David%' OR
      cb.content ILIKE '%Rachel%' OR
      cb.content ILIKE '%Alex%' OR
      cb.content ILIKE '%Maya%' OR
      cb.content ILIKE '%James%'
    )
)
SELECT 
  chapter_number,
  lesson_number,
  character_found,
  COUNT(*) as mention_count
FROM character_mentions
GROUP BY chapter_number, lesson_number, character_found
ORDER BY chapter_number, lesson_number, character_found;

-- 4. Check interactive elements for character references
SELECT 
  c.order_index as chapter_number,
  l.order_index as lesson_number,
  ie.id,
  ie.type,
  ie.title,
  CASE 
    WHEN ie.title ILIKE '%Sofia%' OR ie.configuration::text ILIKE '%Sofia%' THEN 'Sofia'
    WHEN ie.title ILIKE '%David%' OR ie.configuration::text ILIKE '%David%' THEN 'David'
    WHEN ie.title ILIKE '%Rachel%' OR ie.configuration::text ILIKE '%Rachel%' THEN 'Rachel'
    WHEN ie.title ILIKE '%Alex%' OR ie.configuration::text ILIKE '%Alex%' THEN 'Alex'
    WHEN ie.title ILIKE '%Maya%' OR ie.configuration::text ILIKE '%Maya%' THEN 'Maya'
    WHEN ie.title ILIKE '%James%' OR ie.configuration::text ILIKE '%James%' THEN 'James'
    ELSE 'No character'
  END as character_in_element
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE c.order_index BETWEEN 3 AND 6
  AND ie.is_active = true
  AND (
    ie.title ILIKE '%Sofia%' OR ie.configuration::text ILIKE '%Sofia%' OR
    ie.title ILIKE '%David%' OR ie.configuration::text ILIKE '%David%' OR
    ie.title ILIKE '%Rachel%' OR ie.configuration::text ILIKE '%Rachel%' OR
    ie.title ILIKE '%Alex%' OR ie.configuration::text ILIKE '%Alex%' OR
    ie.title ILIKE '%Maya%' OR ie.configuration::text ILIKE '%Maya%' OR
    ie.title ILIKE '%James%' OR ie.configuration::text ILIKE '%James%'
  )
ORDER BY c.order_index, l.order_index;