-- Comprehensive Database Content Audit

-- 1. Show all chapters
SELECT '=== ALL CHAPTERS ===' as section;
SELECT id, title, description, order_index, is_published 
FROM chapters 
ORDER BY order_index;

-- 2. Show all lessons with their chapter
SELECT '=== ALL LESSONS BY CHAPTER ===' as section;
SELECT 
  c.id as chapter_id,
  c.title as chapter_title,
  l.id as lesson_id,
  l.title as lesson_title,
  l.subtitle,
  l.order_index
FROM chapters c
LEFT JOIN lessons l ON c.id = l.chapter_id
ORDER BY c.order_index, l.order_index;

-- 3. Check Chapter 2 specifically
SELECT '=== CHAPTER 2 DETAILS ===' as section;
SELECT * FROM chapters WHERE id = 2;

-- 4. Check Chapter 2 lessons
SELECT '=== CHAPTER 2 LESSONS ===' as section;
SELECT id, title, subtitle, order_index 
FROM lessons 
WHERE chapter_id = 2
ORDER BY order_index;

-- 5. Check for any Maya or James content in content blocks
SELECT '=== MAYA/JAMES CONTENT BLOCKS ===' as section;
SELECT 
  l.chapter_id,
  l.id as lesson_id,
  l.title as lesson_title,
  cb.title as block_title,
  SUBSTRING(cb.content, 1, 100) as content_preview
FROM content_blocks cb
JOIN lessons l ON cb.lesson_id = l.id
WHERE LOWER(cb.content) LIKE '%maya%' 
   OR LOWER(cb.content) LIKE '%james%'
ORDER BY l.chapter_id, l.id;

-- 6. Check for any agent-related interactive elements
SELECT '=== AGENT INTERACTIVE ELEMENTS ===' as section;
SELECT 
  l.chapter_id,
  l.id as lesson_id,
  l.title as lesson_title,
  ie.type,
  ie.title as element_title
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
WHERE ie.type LIKE '%agent%'
   OR ie.type LIKE '%auditor%'
   OR ie.type LIKE '%builder%'
   OR ie.type LIKE '%coordinator%'
ORDER BY l.chapter_id, l.id;

-- 7. Check all interactive elements in lessons 5-8
SELECT '=== INTERACTIVE ELEMENTS IN LESSONS 5-8 ===' as section;
SELECT 
  ie.lesson_id,
  ie.type,
  ie.title,
  ie.order_index
FROM interactive_elements ie
WHERE ie.lesson_id IN (5, 6, 7, 8)
ORDER BY ie.lesson_id, ie.order_index;

-- 8. Find where Maya and James might be
SELECT '=== SEARCH FOR MAYA AND JAMES LESSONS ===' as section;
SELECT 
  l.id as lesson_id,
  l.chapter_id,
  l.title,
  l.subtitle
FROM lessons l
WHERE LOWER(l.title) LIKE '%maya%' 
   OR LOWER(l.title) LIKE '%james%'
   OR LOWER(l.subtitle) LIKE '%maya%'
   OR LOWER(l.subtitle) LIKE '%james%';