-- Fresh review of Chapter 2 content
-- Get comprehensive data about what's actually in the database

-- First, get all Chapter 2 lessons with their titles and descriptions
SELECT 
    'LESSON OVERVIEW' as section,
    l.id,
    l.lesson_number,
    l.title,
    l.description,
    l.estimated_duration,
    l.is_published
FROM lessons l
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number = 2
ORDER BY l.lesson_number;

-- Get the actual content for each lesson
SELECT 
    'LESSON CONTENT' as section,
    l.lesson_number,
    l.title,
    lc.content_type,
    lc.content_order,
    LEFT(lc.content_data::text, 500) as content_preview
FROM lesson_content lc
JOIN lessons l ON lc.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number = 2
ORDER BY l.lesson_number, lc.content_order;

-- Get all interactive elements for Chapter 2
SELECT 
    'INTERACTIVE ELEMENTS' as section,
    l.lesson_number,
    l.title as lesson_title,
    ie.element_type,
    ie.component_name,
    LEFT(ie.props::text, 300) as props_preview,
    ie.is_visible,
    ie.is_active
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number = 2
ORDER BY l.lesson_number, ie.element_order;

-- Check for character mentions in content
SELECT 
    'CHARACTER ANALYSIS' as section,
    l.lesson_number,
    l.title,
    CASE 
        WHEN lc.content_data::text ILIKE '%maya%' THEN 'Maya mentioned'
        WHEN lc.content_data::text ILIKE '%james%' THEN 'James mentioned'
        WHEN lc.content_data::text ILIKE '%alex%' THEN 'Alex mentioned'
        WHEN lc.content_data::text ILIKE '%sophia%' OR lc.content_data::text ILIKE '%sofia%' THEN 'Sophia/Sofia mentioned'
        WHEN lc.content_data::text ILIKE '%david%' THEN 'David mentioned'
        WHEN lc.content_data::text ILIKE '%rachel%' THEN 'Rachel mentioned'
        ELSE 'No main character mentioned'
    END as character_presence,
    lc.content_type
FROM lesson_content lc
JOIN lessons l ON lc.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number = 2
    AND (lc.content_data::text ILIKE '%maya%' 
         OR lc.content_data::text ILIKE '%james%'
         OR lc.content_data::text ILIKE '%alex%'
         OR lc.content_data::text ILIKE '%sophia%'
         OR lc.content_data::text ILIKE '%sofia%'
         OR lc.content_data::text ILIKE '%david%'
         OR lc.content_data::text ILIKE '%rachel%')
ORDER BY l.lesson_number;

-- Specifically check lessons 7 and 8
SELECT 
    'LESSONS 7-8 STATUS' as section,
    l.lesson_number,
    l.title,
    l.is_published,
    COUNT(lc.id) as content_blocks,
    COUNT(ie.id) as interactive_elements
FROM lessons l
LEFT JOIN lesson_content lc ON l.lesson_id = lc.lesson_id
LEFT JOIN interactive_elements ie ON l.id = ie.lesson_id
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number = 2 
    AND l.lesson_number IN (7, 8)
GROUP BY l.id, l.lesson_number, l.title, l.is_published
ORDER BY l.lesson_number;

-- Get full content for lessons 7-8 if they exist
SELECT 
    'LESSONS 7-8 CONTENT' as section,
    l.lesson_number,
    l.title,
    lc.content_type,
    lc.content_data::text as full_content
FROM lesson_content lc
JOIN lessons l ON lc.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number = 2 
    AND l.lesson_number IN (7, 8)
ORDER BY l.lesson_number, lc.content_order;