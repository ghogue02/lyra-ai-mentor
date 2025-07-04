-- Ensure Character Element Priority Script
-- ========================================

-- This script specifically ensures that character chat elements have the highest 
-- visibility priority by setting them to order_index = 1 and moving other elements down

BEGIN;

-- Step 1: Set all character chat elements to order_index = 1 (highest priority)
UPDATE interactive_elements 
SET order_index = 1, 
    updated_at = NOW()
WHERE element_type IN ('sofia_chat', 'david_chat', 'rachel_chat', 'alex_chat')
    AND is_active = true;

-- Step 2: Move all other active elements to higher order_index values
-- This ensures character elements always appear first
UPDATE interactive_elements 
SET order_index = CASE 
    -- Common element types with logical ordering
    WHEN element_type = 'text' THEN 10
    WHEN element_type = 'reflection' THEN 20
    WHEN element_type = 'multiple_choice' THEN 30
    WHEN element_type = 'drag_drop' THEN 40
    WHEN element_type = 'sequence_sorter' THEN 50
    WHEN element_type = 'interactive_element_placeholder' THEN 60
    -- Any other elements get high numbers
    ELSE GREATEST(order_index + 100, 100)
END,
updated_at = NOW()
WHERE element_type NOT IN ('sofia_chat', 'david_chat', 'rachel_chat', 'alex_chat')
    AND is_active = true
    AND order_index < 10;

-- Step 3: Ensure character elements are not gated (immediately visible)
UPDATE interactive_elements 
SET is_gated = false,
    updated_at = NOW()
WHERE element_type IN ('sofia_chat', 'david_chat', 'rachel_chat', 'alex_chat')
    AND is_active = true
    AND is_gated = true;

-- Step 4: Final verification - show the current state
SELECT 
    'CHARACTER ELEMENT PRIORITY CHECK' as status,
    c.chapter_number,
    l.title as lesson_title,
    ie.element_type,
    ie.title,
    ie.order_index,
    ie.is_active,
    ie.is_gated,
    'PRIORITY: ' || 
    CASE 
        WHEN ie.order_index = 1 THEN 'HIGHEST ✓'
        WHEN ie.order_index < 10 THEN 'HIGH'
        WHEN ie.order_index < 50 THEN 'MEDIUM'
        ELSE 'LOW'
    END as priority_level
FROM interactive_elements ie
JOIN lesson_elements le ON ie.id = le.element_id
JOIN lessons l ON le.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number BETWEEN 3 AND 6
    AND ie.is_active = true
ORDER BY c.chapter_number, l.order_index, ie.order_index;

COMMIT;

-- Post-execution summary
SELECT 
    'SUMMARY: Character Elements After Priority Fix' as report_type,
    COUNT(*) as total_character_elements,
    COUNT(CASE WHEN order_index = 1 THEN 1 END) as elements_with_highest_priority,
    COUNT(CASE WHEN is_gated = false THEN 1 END) as immediately_visible_elements
FROM interactive_elements 
WHERE element_type IN ('sofia_chat', 'david_chat', 'rachel_chat', 'alex_chat')
    AND is_active = true;