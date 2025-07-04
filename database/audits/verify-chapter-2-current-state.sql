-- Verify Chapter 2 Current State
-- Get accurate data about what's actually in the database

-- 1. Chapter 2 Basic Info
SELECT 
    'CHAPTER INFO' as section,
    id,
    chapter_number,
    title,
    description,
    icon,
    duration,
    is_published
FROM chapters 
WHERE chapter_number = 2;

-- 2. All Lessons in Chapter 2
SELECT 
    'LESSONS' as section,
    l.id,
    l.lesson_number,
    l.title,
    l.description,
    l.estimated_duration,
    l.is_published,
    l.is_active,
    l.is_gated
FROM lessons l
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number = 2
ORDER BY l.lesson_number;

-- 3. Content Block Count by Lesson
SELECT 
    'CONTENT COUNTS' as section,
    l.lesson_number,
    l.title as lesson_title,
    COUNT(DISTINCT lc.id) as total_content_blocks,
    SUM(CASE WHEN lc.is_visible = true AND lc.is_active = true THEN 1 ELSE 0 END) as visible_active_blocks,
    SUM(CASE WHEN lc.content_data::text ILIKE '%maya%' THEN 1 ELSE 0 END) as maya_mentions,
    SUM(CASE WHEN lc.content_data::text ILIKE '%james%' THEN 1 ELSE 0 END) as james_mentions
FROM lessons l
LEFT JOIN lesson_content lc ON l.id = lc.lesson_id
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number = 2
GROUP BY l.lesson_number, l.title
ORDER BY l.lesson_number;

-- 4. Interactive Element Count by Lesson
SELECT 
    'INTERACTIVE COUNTS' as section,
    l.lesson_number,
    l.title as lesson_title,
    COUNT(DISTINCT ie.id) as total_elements,
    SUM(CASE WHEN ie.is_visible = true AND ie.is_active = true AND ie.is_gated = false THEN 1 ELSE 0 END) as visible_active_ungated,
    STRING_AGG(DISTINCT ie.element_type, ', ') as element_types
FROM lessons l
LEFT JOIN interactive_elements ie ON l.id = ie.lesson_id
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number = 2
GROUP BY l.lesson_number, l.title
ORDER BY l.lesson_number;

-- 5. Character Presence Analysis
SELECT 
    'CHARACTER ANALYSIS' as section,
    l.lesson_number,
    l.title,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM lesson_content lc2 
            WHERE lc2.lesson_id = l.id 
            AND lc2.content_data::text ILIKE '%maya%rodriguez%'
        ) THEN 'Maya Rodriguez (Program Director)'
        WHEN EXISTS (
            SELECT 1 FROM lesson_content lc2 
            WHERE lc2.lesson_id = l.id 
            AND lc2.content_data::text ILIKE '%james%chen%'
        ) THEN 'James Chen (Development Associate)'
        ELSE 'No main character identified'
    END as main_character
FROM lessons l
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number = 2
ORDER BY l.lesson_number;

-- 6. Lesson 7-8 Detailed Status
SELECT 
    'LESSONS 7-8 DETAIL' as section,
    l.lesson_number,
    l.title,
    l.description,
    COUNT(DISTINCT lc.id) as content_blocks,
    COUNT(DISTINCT ie.id) as interactive_elements,
    CASE 
        WHEN COUNT(lc.id) > 0 THEN 'Has content'
        ELSE 'No content found'
    END as content_status,
    CASE 
        WHEN l.lesson_number = 7 THEN 'Meeting Master'
        WHEN l.lesson_number = 8 THEN 'Research & Organization Pro'
        ELSE 'Other'
    END as expected_topic
FROM lessons l
LEFT JOIN lesson_content lc ON l.id = lc.lesson_id AND lc.is_visible = true AND lc.is_active = true
LEFT JOIN interactive_elements ie ON l.id = ie.lesson_id AND ie.is_visible = true AND ie.is_active = true AND ie.is_gated = false
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number = 2 
    AND l.lesson_number IN (7, 8)
GROUP BY l.id, l.lesson_number, l.title, l.description
ORDER BY l.lesson_number;

-- 7. Sample Content from Each Lesson (First Block)
SELECT 
    'SAMPLE CONTENT' as section,
    l.lesson_number,
    l.title as lesson_title,
    lc.content_type,
    lc.title as content_title,
    LEFT(lc.content_data::text, 200) || '...' as content_preview
FROM lessons l
JOIN chapters c ON l.chapter_id = c.id
JOIN LATERAL (
    SELECT * FROM lesson_content 
    WHERE lesson_id = l.id 
    AND is_visible = true 
    AND is_active = true
    ORDER BY content_order 
    LIMIT 1
) lc ON true
WHERE c.chapter_number = 2
ORDER BY l.lesson_number;