-- Comprehensive Analysis of Chapter 2 Interactive Elements (Lessons 5-8)

-- 1. Get all interactive elements in Chapter 2 lessons 5-8
SELECT 
  ie.id,
  ie.lesson_id,
  l.title as lesson_title,
  l.lesson_number,
  ie.type,
  ie.title,
  ie.description,
  ie.is_active,
  ie.configuration::text as config,
  CASE 
    WHEN ie.configuration IS NULL THEN 'NULL'
    WHEN ie.configuration::text = '{}' THEN 'EMPTY'
    WHEN ie.configuration::text LIKE '%ai_powered%' THEN 'AI_ENABLED'
    WHEN ie.configuration::text LIKE '%title%' OR ie.configuration::text LIKE '%description%' THEN 'BASIC_CONFIG'
    ELSE 'UNKNOWN'
  END as config_status,
  ie.created_at,
  ie.updated_at
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number = 2 
  AND l.lesson_number BETWEEN 5 AND 8
ORDER BY l.lesson_number, ie.id;

-- 2. Count elements by lesson
SELECT 
  l.lesson_number,
  l.title as lesson_title,
  COUNT(ie.id) as element_count,
  COUNT(CASE WHEN ie.is_active = true THEN 1 END) as active_count,
  COUNT(CASE WHEN ie.configuration::text LIKE '%ai_powered%' THEN 1 END) as ai_enabled_count
FROM lessons l
JOIN chapters c ON l.chapter_id = c.id
LEFT JOIN interactive_elements ie ON ie.lesson_id = l.id
WHERE c.chapter_number = 2 
  AND l.lesson_number BETWEEN 5 AND 8
GROUP BY l.lesson_number, l.title
ORDER BY l.lesson_number;

-- 3. Analyze element types and purposes
SELECT 
  ie.type,
  COUNT(*) as count,
  STRING_AGG(DISTINCT ie.title, ', ') as element_titles,
  CASE 
    WHEN ie.type LIKE '%debug%' OR ie.type LIKE '%test%' OR ie.title LIKE '%Debug%' OR ie.title LIKE '%Test%' THEN 'DEBUG/TEST'
    WHEN ie.type LIKE '%admin%' OR ie.title LIKE '%Admin%' THEN 'ADMIN'
    WHEN ie.type IN ('ai_email_composer', 'ai_social_media_generator', 'grant_writer', 'data_analyzer') THEN 'EDUCATIONAL'
    ELSE 'UNKNOWN'
  END as category
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number = 2 
  AND l.lesson_number BETWEEN 5 AND 8
GROUP BY ie.type
ORDER BY count DESC;

-- 4. Check for missing elements in lessons 7-8
SELECT 
  l.lesson_number,
  l.title as lesson_title,
  COALESCE(COUNT(ie.id), 0) as element_count
FROM lessons l
JOIN chapters c ON l.chapter_id = c.id
LEFT JOIN interactive_elements ie ON ie.lesson_id = l.id
WHERE c.chapter_number = 2 
  AND l.lesson_number IN (7, 8)
GROUP BY l.lesson_number, l.title
ORDER BY l.lesson_number;

-- 5. Full detail view for analysis
SELECT 
  'LESSON ' || l.lesson_number || ': ' || l.title as lesson_info,
  ie.id,
  ie.type,
  ie.title,
  ie.description,
  ie.is_active,
  CASE 
    WHEN ie.type LIKE '%debug%' OR ie.type LIKE '%test%' OR ie.title LIKE '%Debug%' OR ie.title LIKE '%Test%' THEN 'DEBUG/TEST - SHOULD BE REMOVED'
    WHEN ie.type LIKE '%admin%' OR ie.title LIKE '%Admin%' THEN 'ADMIN - SHOULD BE HIDDEN'
    WHEN ie.type IN ('ai_email_composer', 'ai_social_media_generator', 'grant_writer', 'data_analyzer', 'automation_builder') THEN 'EDUCATIONAL - KEEP VISIBLE'
    ELSE 'NEEDS REVIEW'
  END as recommendation,
  ie.configuration::text as config
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number = 2 
  AND l.lesson_number BETWEEN 5 AND 8
ORDER BY l.lesson_number, ie.id;