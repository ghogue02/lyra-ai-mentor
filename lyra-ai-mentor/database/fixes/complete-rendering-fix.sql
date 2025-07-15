-- =====================================================
-- COMPLETE RENDERING FIX FOR ALL CHAPTERS
-- Run this single file to fix all element visibility issues
-- =====================================================

BEGIN;

-- Step 1: Remove all development/debug element types that shouldn't be in production
DELETE FROM interactive_elements 
WHERE type IN (
  'difficult_conversation_helper',  -- Was removed but still exists
  'interactive_element_auditor',    -- Debug tool
  'automated_element_enhancer',     -- Debug tool
  'database_debugger',              -- Debug tool
  'database_content_viewer',        -- Debug tool
  'element_workflow_coordinator',   -- Debug tool
  'chapter_builder_agent',          -- Admin tool
  'content_audit_agent',            -- Admin tool
  'storytelling_agent'              -- Admin tool
);

-- Step 2: Ensure all remaining elements are visible
UPDATE content_blocks 
SET is_visible = true, is_active = true
WHERE lesson_id IN (SELECT id FROM lessons);

UPDATE interactive_elements 
SET is_visible = true, is_active = true, is_gated = false
WHERE lesson_id IN (SELECT id FROM lessons);

-- Step 3: Fix any data quality issues
UPDATE interactive_elements
SET content = 'Interactive element content'
WHERE content IS NULL OR content = '';

UPDATE interactive_elements
SET configuration = '{}'::jsonb
WHERE configuration IS NULL;

-- Fix extreme order_index values
UPDATE interactive_elements
SET order_index = 90
WHERE order_index > 200;

UPDATE interactive_elements
SET order_index = 10
WHERE order_index < 0;

-- Step 4: Show final results
SELECT 
  '==== RENDERING FIX COMPLETE ====' as status;

-- Summary by chapter
SELECT 
  c.id as chapter_id,
  c.title as chapter_title,
  COUNT(DISTINCT l.id) as lessons,
  COUNT(DISTINCT cb.id) as content_blocks,
  COUNT(DISTINCT ie.id) as interactive_elements,
  COUNT(DISTINCT cb.id) + COUNT(DISTINCT ie.id) as total_elements
FROM chapters c
LEFT JOIN lessons l ON l.chapter_id = c.id
LEFT JOIN content_blocks cb ON cb.lesson_id = l.id AND cb.is_visible = true
LEFT JOIN interactive_elements ie ON ie.lesson_id = l.id AND ie.is_visible = true
GROUP BY c.id, c.title
ORDER BY c.id;

-- Detailed view for Chapter 2
SELECT 
  '==== CHAPTER 2 DETAILS ====' as section;

SELECT 
  l.id as lesson_id,
  l.title as lesson_title,
  COUNT(DISTINCT cb.id) as content_blocks,
  COUNT(DISTINCT ie.id) as interactive_elements,
  COUNT(DISTINCT cb.id) + COUNT(DISTINCT ie.id) as total
FROM lessons l
LEFT JOIN content_blocks cb ON cb.lesson_id = l.id AND cb.is_visible = true
LEFT JOIN interactive_elements ie ON ie.lesson_id = l.id AND ie.is_visible = true
WHERE l.chapter_id = 2
GROUP BY l.id, l.title
ORDER BY l.id;

-- Check for any remaining problematic elements
SELECT 
  '==== REMAINING ISSUES ====' as section;

SELECT 
  type, 
  COUNT(*) as count 
FROM interactive_elements 
WHERE type IN (
  'difficult_conversation_helper',
  'interactive_element_auditor',
  'automated_element_enhancer',
  'database_debugger'
)
GROUP BY type;

COMMIT;

-- Final message
SELECT '
✅ Database fix complete!

Next steps:
1. Clear your browser cache (Cmd+Shift+R)
2. Navigate to any lesson
3. Check the console for debug messages
4. All elements should now render properly

If elements still don''t appear:
- Check browser console for JavaScript errors
- The issue is likely in the React rendering, not the database
' as instructions;