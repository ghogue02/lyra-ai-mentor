-- Chapter 2 Database Verification and Update Queries
-- Run these once MCP Supabase connection is established

-- 1. Verify Chapter 2 is Maya's journey
SELECT 
  c.id,
  c.chapter_number,
  c.title,
  c.description
FROM chapters c
WHERE c.chapter_number = 2;

-- 2. Check all lessons in Chapter 2
SELECT 
  l.id,
  l.lesson_number,
  l.title,
  l.description
FROM lessons l
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number = 2
ORDER BY l.lesson_number;

-- 3. Find any James references in content blocks
SELECT 
  cb.id,
  cb.lesson_id,
  l.lesson_number,
  cb.type,
  cb.title,
  SUBSTRING(cb.content, 1, 200) as content_preview
FROM content_blocks cb
JOIN lessons l ON cb.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number = 2
  AND cb.content ILIKE '%james%'
  AND cb.is_active = true;

-- 4. Find any James references in interactive elements
SELECT 
  ie.id,
  ie.lesson_id,
  l.lesson_number,
  ie.type,
  ie.title,
  ie.configuration
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number = 2
  AND (
    ie.title ILIKE '%james%' OR
    ie.configuration::text ILIKE '%james%'
  )
  AND ie.is_active = true;

-- 5. Get all interactive elements in Chapter 2 to add time metrics
SELECT 
  ie.id,
  ie.lesson_id,
  l.lesson_number,
  ie.type,
  ie.title,
  ie.configuration,
  ie.order_index
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number = 2
  AND ie.is_active = true
ORDER BY l.lesson_number, ie.order_index;

-- 6. Check current time metrics (should be mostly empty)
SELECT 
  ie.id,
  ie.title,
  ie.configuration->>'timeSavings' as time_savings,
  ie.configuration->>'metrics' as metrics
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number = 2
  AND ie.is_active = true
  AND (
    ie.configuration ? 'timeSavings' OR
    ie.configuration ? 'metrics'
  );