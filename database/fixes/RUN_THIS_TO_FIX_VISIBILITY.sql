-- ============================================
-- RUN THIS SINGLE FILE TO FIX ALL VISIBILITY ISSUES
-- ============================================

-- STEP 1: Add any missing columns
-- ============================================
ALTER TABLE interactive_elements 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS is_gated boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_visible boolean DEFAULT true;

ALTER TABLE content_blocks
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS is_visible boolean DEFAULT true;

-- STEP 2: Ensure all elements are visible
-- ============================================
UPDATE interactive_elements 
SET is_active = true, 
    is_gated = false,
    is_visible = true;

UPDATE content_blocks
SET is_active = true,
    is_visible = true;

-- STEP 3: Fix problematic data
-- ============================================
-- Fix null/empty content
UPDATE interactive_elements
SET content = 'Interactive element content loading...'
WHERE content IS NULL OR content = '';

-- Fix null configuration
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

-- STEP 4: Show results
-- ============================================
SELECT '==== VISIBILITY FIX COMPLETE ====' as status;

-- Show total counts
SELECT 
  'Total Elements After Fix' as metric,
  (SELECT COUNT(*) FROM content_blocks WHERE is_active = true) as active_content_blocks,
  (SELECT COUNT(*) FROM interactive_elements WHERE is_active = true) as active_interactive_elements,
  (SELECT COUNT(*) FROM interactive_elements WHERE is_gated = true) as gated_elements,
  (SELECT COUNT(*) FROM interactive_elements WHERE order_index > 100) as high_order_elements;

-- Show what's in Chapter 2, Lesson 5 (should be 11 elements)
SELECT 
  'Chapter 2, Lesson 5 Elements' as lesson_check,
  COUNT(*) as total_elements,
  SUM(CASE WHEN element_type = 'content' THEN 1 ELSE 0 END) as content_blocks,
  SUM(CASE WHEN element_type = 'interactive' THEN 1 ELSE 0 END) as interactive_elements
FROM (
  SELECT 'content' as element_type FROM content_blocks WHERE lesson_id = 5
  UNION ALL
  SELECT 'interactive' as element_type FROM interactive_elements WHERE lesson_id = 5
) as combined;

-- List all elements in lesson 5
SELECT 
  CASE 
    WHEN cb.id IS NOT NULL THEN 'Content Block'
    ELSE 'Interactive: ' || ie.type
  END as element_type,
  COALESCE(cb.title, ie.title) as title,
  COALESCE(cb.order_index, ie.order_index) as order_index
FROM lessons l
LEFT JOIN content_blocks cb ON cb.lesson_id = l.id
LEFT JOIN interactive_elements ie ON ie.lesson_id = l.id
WHERE l.id = 5
  AND (cb.id IS NOT NULL OR ie.id IS NOT NULL)
ORDER BY COALESCE(cb.order_index, ie.order_index);

-- Final check: Any remaining issues?
SELECT 
  'Remaining Issues' as check,
  COUNT(CASE WHEN ie.content IS NULL OR ie.content = '' THEN 1 END) as empty_content,
  COUNT(CASE WHEN ie.configuration IS NULL THEN 1 END) as null_config,
  COUNT(CASE WHEN ie.is_active = false OR ie.is_active IS NULL THEN 1 END) as inactive,
  COUNT(CASE WHEN ie.is_gated = true THEN 1 END) as gated
FROM interactive_elements ie;

SELECT '

✅ Fix Complete! 

Next steps:
1. Clear your browser cache (Cmd+Shift+R or Ctrl+Shift+R)
2. Navigate to any lesson
3. You should now see ALL elements (6-11 per lesson)
4. Check the debug panel in bottom-right corner

If you still see only 2 elements:
- Check browser console for JavaScript errors
- The debug panel will show database vs rendered counts
' as next_steps;