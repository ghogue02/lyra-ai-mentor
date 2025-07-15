-- Quick check to understand the actual database structure

-- 1. What chapters exist?
SELECT 'CHAPTERS:' as info;
SELECT id, title, order_index FROM chapters ORDER BY order_index;

-- 2. What lessons are in Chapter 2?
SELECT '\nCHAPTER 2 LESSONS:' as info;
SELECT id, title, subtitle FROM lessons WHERE chapter_id = 2 ORDER BY order_index;

-- 3. Where are Maya and James mentioned?
SELECT '\nMAYA MENTIONS IN INTERACTIVE ELEMENTS:' as info;
SELECT 
  ie.lesson_id,
  l.chapter_id,
  l.title as lesson_title,
  ie.type,
  ie.title as element_title
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
WHERE ie.content ILIKE '%maya%' OR ie.title ILIKE '%maya%'
LIMIT 5;

SELECT '\nJAMES MENTIONS IN INTERACTIVE ELEMENTS:' as info;
SELECT 
  ie.lesson_id,
  l.chapter_id,
  l.title as lesson_title,
  ie.type,
  ie.title as element_title
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
WHERE ie.content ILIKE '%james%' OR ie.title ILIKE '%james%'
LIMIT 5;

-- 4. Any agent elements?
SELECT '\nAGENT ELEMENTS:' as info;
SELECT 
  ie.lesson_id,
  l.chapter_id,
  l.title as lesson_title,
  ie.type,
  ie.title as element_title
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
WHERE ie.type LIKE '%agent%' 
   OR ie.type LIKE '%auditor%' 
   OR ie.type LIKE '%builder%'
LIMIT 10;