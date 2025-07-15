-- Investigation: Check Lyra Elements and Element Visibility Issues
-- =================================================================

-- 1. Check for any Lyra elements that are still active (should be archived)
SELECT 
    le.lesson_id,
    l.title as lesson_title,
    c.title as chapter_title,
    c.chapter_number,
    ie.element_type,
    ie.title,
    ie.is_active,
    ie.is_gated,
    ie.order_index,
    ie.created_at
FROM interactive_elements ie
JOIN lesson_elements le ON ie.id = le.element_id
JOIN lessons l ON le.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE ie.element_type IN ('lyra_chat', 'ai_chat', 'chat')
    AND ie.title ILIKE '%lyra%'
    AND ie.is_active = true
ORDER BY c.chapter_number, l.order_index;

-- 2. Count active elements per lesson in chapters 3-6
SELECT 
    c.chapter_number,
    c.title as chapter_title,
    l.id as lesson_id,
    l.title as lesson_title,
    COUNT(CASE WHEN ie.is_active = true THEN 1 END) as active_elements,
    COUNT(CASE WHEN ie.is_active = false THEN 1 END) as inactive_elements,
    COUNT(*) as total_elements,
    STRING_AGG(
        CASE WHEN ie.is_active = true 
        THEN ie.element_type || ' (' || ie.order_index || ')' 
        END, ', ' ORDER BY ie.order_index
    ) as active_element_types
FROM lessons l
JOIN chapters c ON l.chapter_id = c.id
LEFT JOIN lesson_elements le ON l.id = le.lesson_id
LEFT JOIN interactive_elements ie ON le.element_id = ie.id
WHERE c.chapter_number BETWEEN 3 AND 6
GROUP BY c.chapter_number, c.title, l.id, l.title
ORDER BY c.chapter_number, l.order_index;

-- 3. Check for order_index conflicts - elements with same or lower order_index than new character elements
SELECT 
    c.chapter_number,
    c.title as chapter_title,
    l.title as lesson_title,
    ie.element_type,
    ie.title,
    ie.order_index,
    ie.is_active,
    CASE 
        WHEN ie.element_type IN ('sofia_chat', 'david_chat', 'rachel_chat', 'alex_chat') THEN 'NEW CHARACTER'
        WHEN ie.title ILIKE '%lyra%' THEN 'LYRA ELEMENT'
        ELSE 'OTHER'
    END as element_category
FROM interactive_elements ie
JOIN lesson_elements le ON ie.id = le.element_id
JOIN lessons l ON le.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number BETWEEN 3 AND 6
    AND ie.is_active = true
ORDER BY c.chapter_number, l.order_index, ie.order_index;

-- 4. Detailed view of potential conflicts - active elements with order_index <= 10
SELECT 
    c.chapter_number,
    l.title as lesson_title,
    ie.element_type,
    ie.title,
    ie.order_index,
    ie.config,
    CASE 
        WHEN ie.order_index = 10 AND ie.element_type IN ('sofia_chat', 'david_chat', 'rachel_chat', 'alex_chat') 
        THEN 'NEW CHARACTER - CORRECT'
        WHEN ie.order_index < 10 THEN 'POTENTIALLY BLOCKING'
        WHEN ie.order_index = 10 AND ie.element_type NOT IN ('sofia_chat', 'david_chat', 'rachel_chat', 'alex_chat')
        THEN 'CONFLICT - SAME ORDER_INDEX'
        ELSE 'OK'
    END as status
FROM interactive_elements ie
JOIN lesson_elements le ON ie.id = le.element_id
JOIN lessons l ON le.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number BETWEEN 3 AND 6
    AND ie.is_active = true
    AND ie.order_index <= 10
ORDER BY c.chapter_number, l.order_index, ie.order_index;

-- 5. Find any duplicate active elements for the same lesson
SELECT 
    l.id as lesson_id,
    l.title as lesson_title,
    ie.element_type,
    COUNT(*) as duplicate_count,
    STRING_AGG(ie.id::text, ', ') as element_ids,
    STRING_AGG(ie.title, ' | ') as titles,
    STRING_AGG(ie.order_index::text, ', ') as order_indexes
FROM interactive_elements ie
JOIN lesson_elements le ON ie.id = le.element_id
JOIN lessons l ON le.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number BETWEEN 3 AND 6
    AND ie.is_active = true
GROUP BY l.id, l.title, ie.element_type
HAVING COUNT(*) > 1
ORDER BY l.id, ie.element_type;

-- 6. Check specifically for the new character elements
SELECT 
    c.chapter_number,
    c.title as chapter_title,
    l.title as lesson_title,
    ie.element_type,
    ie.title,
    ie.order_index,
    ie.is_active,
    ie.is_gated,
    ie.created_at,
    CASE 
        WHEN c.chapter_number = 3 AND ie.element_type != 'sofia_chat' THEN 'WRONG TYPE FOR CHAPTER 3'
        WHEN c.chapter_number = 4 AND ie.element_type != 'david_chat' THEN 'WRONG TYPE FOR CHAPTER 4'
        WHEN c.chapter_number = 5 AND ie.element_type != 'rachel_chat' THEN 'WRONG TYPE FOR CHAPTER 5'
        WHEN c.chapter_number = 6 AND ie.element_type != 'alex_chat' THEN 'WRONG TYPE FOR CHAPTER 6'
        ELSE 'CORRECT'
    END as validation
FROM interactive_elements ie
JOIN lesson_elements le ON ie.id = le.element_id
JOIN lessons l ON le.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE ie.element_type IN ('sofia_chat', 'david_chat', 'rachel_chat', 'alex_chat')
    AND ie.is_active = true
ORDER BY c.chapter_number, l.order_index;