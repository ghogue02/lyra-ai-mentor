-- Fix Script: Element Visibility Priority Issues
-- ============================================

-- This script addresses three main issues:
-- 1. Archive any remaining active Lyra elements
-- 2. Adjust order_index to ensure new character elements have priority
-- 3. Clean up duplicate or conflicting elements

BEGIN;

-- 1. ARCHIVE ALL REMAINING LYRA ELEMENTS
-- Archive any Lyra chat elements that are still active
UPDATE interactive_elements 
SET is_active = false, 
    updated_at = NOW(),
    -- Add note to config about archival
    config = COALESCE(config, '{}')::jsonb || '{"archived_reason": "Replaced by character-specific chat elements", "archived_at": "' || NOW()::text || '"}'::jsonb
WHERE element_type IN ('lyra_chat', 'ai_chat', 'chat')
    AND (title ILIKE '%lyra%' OR config::text ILIKE '%lyra%')
    AND is_active = true;

-- 2. ENSURE CHARACTER ELEMENTS HAVE PROPER PRIORITY
-- Set character chat elements to order_index = 1 (highest priority)
UPDATE interactive_elements 
SET order_index = 1, 
    updated_at = NOW()
WHERE element_type IN ('sofia_chat', 'david_chat', 'rachel_chat', 'alex_chat')
    AND is_active = true;

-- 3. ADJUST OTHER ACTIVE ELEMENTS TO LOWER PRIORITY
-- Move other active elements to higher order_index values to avoid conflicts
UPDATE interactive_elements 
SET order_index = CASE 
    WHEN element_type = 'text' THEN 10
    WHEN element_type = 'reflection' THEN 20
    WHEN element_type = 'interactive_element_placeholder' THEN 30
    WHEN element_type = 'sequence_sorter' THEN 40
    WHEN element_type = 'multiple_choice' THEN 50
    WHEN element_type = 'drag_drop' THEN 60
    ELSE order_index + 100
END,
updated_at = NOW()
WHERE element_type NOT IN ('sofia_chat', 'david_chat', 'rachel_chat', 'alex_chat')
    AND is_active = true
    AND order_index <= 10;

-- 4. CLEAN UP DUPLICATE CHARACTER ELEMENTS
-- If there are multiple character elements for the same lesson, keep only the most recent one
WITH duplicate_elements AS (
    SELECT 
        le.lesson_id,
        ie.element_type,
        ie.id,
        ROW_NUMBER() OVER (PARTITION BY le.lesson_id, ie.element_type ORDER BY ie.created_at DESC) as rn
    FROM interactive_elements ie
    JOIN lesson_elements le ON ie.id = le.element_id
    WHERE ie.element_type IN ('sofia_chat', 'david_chat', 'rachel_chat', 'alex_chat')
        AND ie.is_active = true
)
UPDATE interactive_elements 
SET is_active = false,
    updated_at = NOW(),
    config = COALESCE(config, '{}')::jsonb || '{"archived_reason": "Duplicate character element", "archived_at": "' || NOW()::text || '"}'::jsonb
WHERE id IN (
    SELECT id FROM duplicate_elements WHERE rn > 1
);

-- 5. VERIFY CHARACTER-CHAPTER ALIGNMENT
-- Ensure the right characters are in the right chapters
UPDATE interactive_elements 
SET is_active = false,
    updated_at = NOW(),
    config = COALESCE(config, '{}')::jsonb || '{"archived_reason": "Wrong character for chapter", "archived_at": "' || NOW()::text || '"}'::jsonb
WHERE id IN (
    SELECT ie.id
    FROM interactive_elements ie
    JOIN lesson_elements le ON ie.id = le.element_id
    JOIN lessons l ON le.lesson_id = l.id
    JOIN chapters c ON l.chapter_id = c.id
    WHERE (
        (c.chapter_number = 3 AND ie.element_type != 'sofia_chat') OR
        (c.chapter_number = 4 AND ie.element_type != 'david_chat') OR
        (c.chapter_number = 5 AND ie.element_type != 'rachel_chat') OR
        (c.chapter_number = 6 AND ie.element_type != 'alex_chat')
    ) AND ie.element_type IN ('sofia_chat', 'david_chat', 'rachel_chat', 'alex_chat')
    AND ie.is_active = true
);

-- 6. UPDATE VISIBILITY SETTINGS
-- Ensure character elements are not gated and are visible
UPDATE interactive_elements 
SET is_gated = false,
    updated_at = NOW()
WHERE element_type IN ('sofia_chat', 'david_chat', 'rachel_chat', 'alex_chat')
    AND is_active = true;

COMMIT;

-- 7. VERIFICATION QUERIES (Run these after the fixes)
-- Count elements per lesson after fixes
SELECT 
    c.chapter_number,
    l.title as lesson_title,
    COUNT(CASE WHEN ie.is_active = true THEN 1 END) as active_elements,
    STRING_AGG(
        CASE WHEN ie.is_active = true 
        THEN ie.element_type || ' (idx:' || ie.order_index || ')' 
        END, ', ' ORDER BY ie.order_index
    ) as active_element_summary
FROM lessons l
JOIN chapters c ON l.chapter_id = c.id
LEFT JOIN lesson_elements le ON l.id = le.lesson_id
LEFT JOIN interactive_elements ie ON le.element_id = ie.id
WHERE c.chapter_number BETWEEN 3 AND 6
GROUP BY c.chapter_number, l.id, l.title
ORDER BY c.chapter_number, l.order_index;

-- Verify character elements are properly configured
SELECT 
    c.chapter_number,
    c.title as chapter_title,
    COUNT(*) as character_elements,
    STRING_AGG(ie.element_type, ', ') as element_types,
    STRING_AGG(ie.order_index::text, ', ') as order_indexes
FROM interactive_elements ie
JOIN lesson_elements le ON ie.id = le.element_id
JOIN lessons l ON le.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE ie.element_type IN ('sofia_chat', 'david_chat', 'rachel_chat', 'alex_chat')
    AND ie.is_active = true
GROUP BY c.chapter_number, c.title
ORDER BY c.chapter_number;