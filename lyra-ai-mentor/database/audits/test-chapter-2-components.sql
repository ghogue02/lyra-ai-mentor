-- Chapter 2 Component Testing Script
-- Run this after implementing the fixes to verify everything works

-- Test 1: Verify all expected components exist and are visible
SELECT 
    'Component Existence Test' as test_name,
    CASE 
        WHEN COUNT(*) >= 16 THEN '✅ PASS - All components exist'
        ELSE '❌ FAIL - Missing components: ' || (16 - COUNT(*))::text
    END as result
FROM interactive_elements 
WHERE lesson_id IN (5, 6, 7, 8) 
AND is_visible = true 
AND is_active = true;

-- Test 2: Verify admin tools are hidden
SELECT 
    'Admin Tools Hidden Test' as test_name,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ PASS - No admin tools visible'
        ELSE '❌ FAIL - Admin tools still visible: ' || COUNT(*)::text
    END as result
FROM interactive_elements 
WHERE lesson_id IN (5, 6, 7, 8) 
AND (type LIKE '%_agent%' OR type LIKE '%debug%')
AND is_visible = true;

-- Test 3: Verify lesson distribution
WITH lesson_counts AS (
    SELECT 
        lesson_id,
        COUNT(*) as element_count
    FROM interactive_elements 
    WHERE lesson_id IN (5, 6, 7, 8) 
    AND is_visible = true 
    AND is_active = true
    GROUP BY lesson_id
)
SELECT 
    'Lesson Distribution Test' as test_name,
    CASE 
        WHEN MIN(element_count) >= 3 AND MAX(element_count) <= 6 THEN '✅ PASS - Balanced distribution'
        ELSE '❌ FAIL - Uneven distribution'
    END as result
FROM lesson_counts;

-- Test 4: Verify specific component types exist
SELECT 
    'Required Component Types Test' as test_name,
    CASE 
        WHEN ai_email > 0 AND document_gen > 0 AND meeting_prep > 0 AND research > 0 THEN '✅ PASS - All core types present'
        ELSE '❌ FAIL - Missing core component types'
    END as result
FROM (
    SELECT 
        COUNT(CASE WHEN type = 'ai_email_composer' THEN 1 END) as ai_email,
        COUNT(CASE WHEN type = 'document_generator' THEN 1 END) as document_gen,
        COUNT(CASE WHEN type = 'agenda_creator' THEN 1 END) as meeting_prep,
        COUNT(CASE WHEN type = 'research_assistant' THEN 1 END) as research
    FROM interactive_elements 
    WHERE lesson_id IN (5, 6, 7, 8) 
    AND is_visible = true
) as type_counts;

-- Test 5: Configuration validity
SELECT 
    'Configuration Test' as test_name,
    CASE 
        WHEN COUNT(CASE WHEN configuration IS NULL THEN 1 END) = 0 THEN '✅ PASS - All elements have configuration'
        ELSE '❌ FAIL - Elements with null configuration: ' || COUNT(CASE WHEN configuration IS NULL THEN 1 END)::text
    END as result
FROM interactive_elements 
WHERE lesson_id IN (5, 6, 7, 8) 
AND is_visible = true;

-- Detailed breakdown by lesson
SELECT '=== DETAILED LESSON BREAKDOWN ===' as section;

SELECT 
    l.lesson_number || ': ' || l.title as lesson,
    ie.type,
    ie.title,
    ie.is_visible,
    ie.is_active,
    CASE 
        WHEN ie.configuration IS NOT NULL THEN '✅ Configured'
        ELSE '❌ No Config'
    END as config_status
FROM lessons l
JOIN interactive_elements ie ON ie.lesson_id = l.id
WHERE l.id IN (5, 6, 7, 8)
ORDER BY l.lesson_number, ie.order_index;

-- Summary report
SELECT '=== TESTING SUMMARY ===' as section;

SELECT 
    'Total Elements' as metric,
    COUNT(*) as count
FROM interactive_elements 
WHERE lesson_id IN (5, 6, 7, 8) 
AND is_visible = true;

SELECT 
    'Elements by Lesson' as breakdown,
    l.lesson_number,
    l.title,
    COUNT(ie.id) as element_count
FROM lessons l
LEFT JOIN interactive_elements ie ON ie.lesson_id = l.id AND ie.is_visible = true
WHERE l.id IN (5, 6, 7, 8)
GROUP BY l.lesson_number, l.title
ORDER BY l.lesson_number;

-- Component type analysis
SELECT 
    'Component Types' as analysis,
    ie.type,
    COUNT(*) as count,
    STRING_AGG(DISTINCT l.lesson_number::text, ', ') as lessons
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
WHERE l.id IN (5, 6, 7, 8) 
AND ie.is_visible = true
GROUP BY ie.type
ORDER BY count DESC;

-- Final status
SELECT 
CASE 
    WHEN (
        SELECT COUNT(*) FROM interactive_elements 
        WHERE lesson_id IN (5, 6, 7, 8) AND is_visible = true
    ) >= 16 THEN 
    '🎉 CHAPTER 2 READY FOR TESTING!

All interactive elements are now in place:
- Lesson 5: Maya''s Email Transformation
- Lesson 6: James''s Document Creation  
- Lesson 7: Meeting Master Tools
- Lesson 8: Research & Organization Pro

Next: Test each component manually in the browser'
    ELSE 
    '⚠️  IMPLEMENTATION INCOMPLETE
    
Some elements are still missing. Run the fix script first.'
END as final_status;