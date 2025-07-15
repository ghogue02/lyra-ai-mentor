-- Quick Element Diagnosis Script
-- ===============================

-- This script provides a quick overview of element visibility issues

-- 1. Check for active Lyra elements (should be zero)
SELECT 
    'Active Lyra Elements' as check_name,
    COUNT(*) as issue_count,
    STRING_AGG(DISTINCT ie.element_type, ', ') as element_types
FROM interactive_elements ie
WHERE ie.element_type IN ('lyra_chat', 'ai_chat', 'chat')
    AND (ie.title ILIKE '%lyra%' OR ie.config::text ILIKE '%lyra%')
    AND ie.is_active = true;

-- 2. Check character element distribution
SELECT 
    'Character Elements by Chapter' as check_name,
    c.chapter_number,
    ie.element_type,
    COUNT(*) as count,
    STRING_AGG(ie.order_index::text, ', ') as order_indexes
FROM interactive_elements ie
JOIN lesson_elements le ON ie.id = le.element_id
JOIN lessons l ON le.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE ie.element_type IN ('sofia_chat', 'david_chat', 'rachel_chat', 'alex_chat')
    AND ie.is_active = true
GROUP BY c.chapter_number, ie.element_type
ORDER BY c.chapter_number, ie.element_type;

-- 3. Check for order_index conflicts (elements with same order_index in same lesson)
SELECT 
    'Order Index Conflicts' as check_name,
    l.id as lesson_id,
    l.title as lesson_title,
    ie.order_index,
    COUNT(*) as elements_with_same_index,
    STRING_AGG(ie.element_type, ', ') as conflicting_types
FROM interactive_elements ie
JOIN lesson_elements le ON ie.id = le.element_id
JOIN lessons l ON le.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number BETWEEN 3 AND 6
    AND ie.is_active = true
GROUP BY l.id, l.title, ie.order_index
HAVING COUNT(*) > 1
ORDER BY l.id, ie.order_index;

-- 4. Check lessons with too many active elements (>5 might cause visibility issues)
SELECT 
    'Lessons with Many Elements' as check_name,
    c.chapter_number,
    l.title as lesson_title,
    COUNT(*) as active_element_count
FROM interactive_elements ie
JOIN lesson_elements le ON ie.id = le.element_id
JOIN lessons l ON le.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE ie.is_active = true
    AND c.chapter_number BETWEEN 3 AND 6
GROUP BY c.chapter_number, l.id, l.title
HAVING COUNT(*) > 5
ORDER BY COUNT(*) DESC;

-- 5. Check for misaligned character-chapter combinations
SELECT 
    'Misaligned Character-Chapter' as check_name,
    c.chapter_number,
    ie.element_type,
    COUNT(*) as misaligned_count
FROM interactive_elements ie
JOIN lesson_elements le ON ie.id = le.element_id
JOIN lessons l ON le.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE ie.element_type IN ('sofia_chat', 'david_chat', 'rachel_chat', 'alex_chat')
    AND ie.is_active = true
    AND (
        (c.chapter_number = 3 AND ie.element_type != 'sofia_chat') OR
        (c.chapter_number = 4 AND ie.element_type != 'david_chat') OR
        (c.chapter_number = 5 AND ie.element_type != 'rachel_chat') OR
        (c.chapter_number = 6 AND ie.element_type != 'alex_chat')
    )
GROUP BY c.chapter_number, ie.element_type
ORDER BY c.chapter_number;