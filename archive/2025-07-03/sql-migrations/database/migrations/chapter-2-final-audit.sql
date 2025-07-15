-- Chapter 2 Final Audit - Comprehensive Assessment
-- Focus: Lessons 5-8 Interactive Elements

-- 1. Current state overview
SELECT 
    l.lesson_number,
    l.title as lesson_title,
    COUNT(DISTINCT ie.id) as element_count,
    COUNT(DISTINCT CASE WHEN ie.element_type = 'ai_exercise' THEN ie.id END) as ai_exercises,
    COUNT(DISTINCT CASE WHEN ie.element_type = 'quiz' THEN ie.id END) as quizzes,
    COUNT(DISTINCT CASE WHEN ie.element_type = 'tool' THEN ie.id END) as tools,
    COUNT(DISTINCT CASE WHEN ie.metadata->>'isAdminOnly' = 'true' THEN ie.id END) as admin_tools,
    COUNT(DISTINCT CASE WHEN ie.active = true THEN ie.id END) as active_elements,
    COUNT(DISTINCT CASE WHEN ie.gated = true THEN ie.id END) as gated_elements
FROM lessons l
LEFT JOIN interactive_elements ie ON l.id = ie.lesson_id
WHERE l.chapter_id = (SELECT id FROM chapters WHERE title = 'Daily Work with AI' LIMIT 1)
AND l.lesson_number IN (5, 6, 7, 8)
GROUP BY l.lesson_number, l.title
ORDER BY l.lesson_number;

-- 2. Detailed element inventory with content quality check
SELECT 
    l.lesson_number,
    l.title as lesson_title,
    ie.element_type,
    ie.component_name,
    ie.title as element_title,
    LENGTH(ie.content::text) as content_length,
    ie.metadata->>'isAdminOnly' as is_admin_only,
    ie.active,
    ie.gated,
    CASE 
        WHEN ie.content::text LIKE '%TODO%' THEN 'Has TODOs'
        WHEN LENGTH(ie.content::text) < 100 THEN 'Very Short Content'
        WHEN ie.content IS NULL THEN 'No Content'
        ELSE 'Content OK'
    END as content_status,
    ie.created_at,
    ie.updated_at
FROM lessons l
JOIN interactive_elements ie ON l.id = ie.lesson_id
WHERE l.chapter_id = (SELECT id FROM chapters WHERE title = 'Daily Work with AI' LIMIT 1)
AND l.lesson_number IN (5, 6, 7, 8)
ORDER BY l.lesson_number, ie.element_type, ie.component_name;

-- 3. Check for missing expected elements (based on typical patterns)
WITH expected_elements AS (
    SELECT 
        lesson_number,
        element_type,
        expected_count
    FROM (VALUES
        (5, 'ai_exercise', 2),
        (5, 'quiz', 1),
        (6, 'ai_exercise', 2),
        (6, 'quiz', 1),
        (7, 'ai_exercise', 2),
        (7, 'quiz', 1),
        (8, 'ai_exercise', 2),
        (8, 'quiz', 1)
    ) AS t(lesson_number, element_type, expected_count)
),
actual_elements AS (
    SELECT 
        l.lesson_number,
        ie.element_type,
        COUNT(DISTINCT ie.id) as actual_count
    FROM lessons l
    LEFT JOIN interactive_elements ie ON l.id = ie.lesson_id
    WHERE l.chapter_id = (SELECT id FROM chapters WHERE title = 'Daily Work with AI' LIMIT 1)
    AND l.lesson_number IN (5, 6, 7, 8)
    GROUP BY l.lesson_number, ie.element_type
)
SELECT 
    e.lesson_number,
    e.element_type,
    e.expected_count,
    COALESCE(a.actual_count, 0) as actual_count,
    e.expected_count - COALESCE(a.actual_count, 0) as missing_count
FROM expected_elements e
LEFT JOIN actual_elements a ON e.lesson_number = a.lesson_number AND e.element_type = a.element_type
WHERE e.expected_count > COALESCE(a.actual_count, 0)
ORDER BY e.lesson_number, e.element_type;

-- 4. Admin tools visibility check
SELECT 
    l.lesson_number,
    ie.component_name,
    ie.title,
    ie.metadata->>'isAdminOnly' as is_admin_only,
    ie.active,
    ie.gated,
    CASE 
        WHEN ie.metadata->>'isAdminOnly' = 'true' AND ie.active = true THEN 'ISSUE: Admin tool is active'
        WHEN ie.metadata->>'isAdminOnly' = 'true' AND ie.active = false THEN 'OK: Admin tool hidden'
        ELSE 'OK: Not admin tool'
    END as visibility_status
FROM lessons l
JOIN interactive_elements ie ON l.id = ie.lesson_id
WHERE l.chapter_id = (SELECT id FROM chapters WHERE title = 'Daily Work with AI' LIMIT 1)
AND l.lesson_number IN (5, 6, 7, 8)
AND (ie.metadata->>'isAdminOnly' = 'true' OR ie.component_name LIKE '%Admin%' OR ie.component_name LIKE '%Debug%')
ORDER BY l.lesson_number, ie.component_name;

-- 5. Content quality assessment
SELECT 
    l.lesson_number,
    l.title as lesson_title,
    COUNT(CASE WHEN LENGTH(ie.content::text) < 100 THEN 1 END) as very_short_content,
    COUNT(CASE WHEN ie.content::text LIKE '%TODO%' THEN 1 END) as has_todos,
    COUNT(CASE WHEN ie.content IS NULL THEN 1 END) as no_content,
    COUNT(CASE WHEN ie.content::text LIKE '%example%' OR ie.content::text LIKE '%Example%' THEN 1 END) as has_examples,
    COUNT(CASE WHEN ie.content::text LIKE '%instruction%' OR ie.content::text LIKE '%step%' THEN 1 END) as has_instructions
FROM lessons l
LEFT JOIN interactive_elements ie ON l.id = ie.lesson_id
WHERE l.chapter_id = (SELECT id FROM chapters WHERE title = 'Daily Work with AI' LIMIT 1)
AND l.lesson_number IN (5, 6, 7, 8)
GROUP BY l.lesson_number, l.title
ORDER BY l.lesson_number;

-- 6. User experience impact assessment
WITH element_stats AS (
    SELECT 
        l.lesson_number,
        COUNT(DISTINCT ie.id) as total_elements,
        COUNT(DISTINCT CASE WHEN ie.active = true AND (ie.metadata->>'isAdminOnly' IS NULL OR ie.metadata->>'isAdminOnly' = 'false') THEN ie.id END) as user_visible_elements,
        COUNT(DISTINCT CASE WHEN ie.element_type = 'ai_exercise' AND ie.active = true THEN ie.id END) as active_ai_exercises
    FROM lessons l
    LEFT JOIN interactive_elements ie ON l.id = ie.lesson_id
    WHERE l.chapter_id = (SELECT id FROM chapters WHERE title = 'Daily Work with AI' LIMIT 1)
    AND l.lesson_number IN (5, 6, 7, 8)
    GROUP BY l.lesson_number
)
SELECT 
    lesson_number,
    total_elements,
    user_visible_elements,
    active_ai_exercises,
    CASE 
        WHEN user_visible_elements = 0 THEN 'CRITICAL: No visible elements'
        WHEN user_visible_elements < 2 THEN 'POOR: Too few elements'
        WHEN active_ai_exercises = 0 THEN 'ISSUE: No AI exercises'
        WHEN user_visible_elements >= 3 THEN 'GOOD: Adequate content'
        ELSE 'FAIR: Minimal content'
    END as ux_assessment
FROM element_stats
ORDER BY lesson_number;

-- 7. Recent update activity
SELECT 
    l.lesson_number,
    COUNT(CASE WHEN ie.updated_at > NOW() - INTERVAL '1 day' THEN 1 END) as updated_today,
    COUNT(CASE WHEN ie.created_at > NOW() - INTERVAL '1 day' THEN 1 END) as created_today,
    MAX(ie.updated_at) as last_update
FROM lessons l
LEFT JOIN interactive_elements ie ON l.id = ie.lesson_id
WHERE l.chapter_id = (SELECT id FROM chapters WHERE title = 'Daily Work with AI' LIMIT 1)
AND l.lesson_number IN (5, 6, 7, 8)
GROUP BY l.lesson_number
ORDER BY l.lesson_number;