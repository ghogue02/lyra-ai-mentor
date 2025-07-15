-- Final Lyra Element Archive Script
-- ==================================

-- This script performs a comprehensive cleanup of all Lyra-related elements
-- and ensures they are properly archived with detailed logging

BEGIN;

-- Step 1: Identify all Lyra elements that are still active
-- (This gives us visibility before making changes)
CREATE TEMP TABLE lyra_elements_to_archive AS
SELECT 
    ie.id,
    ie.element_type,
    ie.title,
    ie.config,
    l.title as lesson_title,
    c.chapter_number,
    c.title as chapter_title
FROM interactive_elements ie
JOIN lesson_elements le ON ie.id = le.element_id
JOIN lessons l ON le.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE ie.is_active = true
    AND (
        ie.element_type IN ('lyra_chat', 'ai_chat', 'chat') OR
        ie.title ILIKE '%lyra%' OR
        ie.config::text ILIKE '%lyra%'
    );

-- Step 2: Show what we're about to archive
SELECT 
    'ELEMENTS TO BE ARCHIVED' as action,
    chapter_number,
    chapter_title,
    lesson_title,
    element_type,
    title
FROM lyra_elements_to_archive
ORDER BY chapter_number, lesson_title;

-- Step 3: Archive the Lyra elements with detailed logging
UPDATE interactive_elements 
SET 
    is_active = false,
    updated_at = NOW(),
    config = COALESCE(config, '{}')::jsonb || jsonb_build_object(
        'archived_reason', 'Replaced by character-specific chat elements',
        'archived_at', NOW()::text,
        'archived_by', 'system_cleanup',
        'original_config', COALESCE(config, '{}')
    )
WHERE id IN (SELECT id FROM lyra_elements_to_archive);

-- Step 4: Verify the archival was successful
SELECT 
    'ARCHIVAL VERIFICATION' as status,
    COUNT(*) as elements_archived
FROM interactive_elements 
WHERE is_active = false
    AND config::text LIKE '%archived_reason%'
    AND config::text LIKE '%character-specific chat elements%';

-- Step 5: Ensure no active Lyra elements remain
SELECT 
    'REMAINING ACTIVE LYRA ELEMENTS' as check_result,
    CASE 
        WHEN COUNT(*) = 0 THEN 'SUCCESS: No active Lyra elements found ✓'
        ELSE 'WARNING: ' || COUNT(*) || ' active Lyra elements still exist!'
    END as message,
    COUNT(*) as count
FROM interactive_elements ie
WHERE ie.is_active = true
    AND (
        ie.element_type IN ('lyra_chat', 'ai_chat', 'chat') OR
        ie.title ILIKE '%lyra%' OR
        ie.config::text ILIKE '%lyra%'
    );

-- Step 6: Show current active character elements for verification
SELECT 
    'ACTIVE CHARACTER ELEMENTS' as verification,
    c.chapter_number,
    l.title as lesson_title,
    ie.element_type,
    ie.title,
    ie.order_index,
    ie.is_gated
FROM interactive_elements ie
JOIN lesson_elements le ON ie.id = le.element_id
JOIN lessons l ON le.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE ie.element_type IN ('sofia_chat', 'david_chat', 'rachel_chat', 'alex_chat')
    AND ie.is_active = true
ORDER BY c.chapter_number, l.order_index;

COMMIT;

-- Final cleanup summary
SELECT 
    'CLEANUP SUMMARY' as report,
    (SELECT COUNT(*) FROM interactive_elements WHERE is_active = false AND config::text LIKE '%character-specific chat elements%') as lyra_elements_archived,
    (SELECT COUNT(*) FROM interactive_elements WHERE element_type IN ('sofia_chat', 'david_chat', 'rachel_chat', 'alex_chat') AND is_active = true) as character_elements_active,
    (SELECT COUNT(*) FROM interactive_elements WHERE is_active = true AND (element_type IN ('lyra_chat', 'ai_chat', 'chat') OR title ILIKE '%lyra%')) as remaining_lyra_elements;