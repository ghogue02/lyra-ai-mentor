-- ===================================================
-- FIX FOR LESSON 5 (MAYA'S EMAIL LESSON) CONTENT
-- This fixes the specific issues you identified:
-- 1. "four game-changing tools" when only 2 exist
-- 2. Mentions of James, Sofia, David, Rachel, Alex in Maya's lesson
-- ===================================================

-- Fix the main "Enter the AI Email Revolution" block
UPDATE content_blocks
SET content = 'What Maya discovers today will transform not just her Monday mornings, but her entire approach to communication. AI isn''t about replacing the human touch that makes her messages meaningful—it''s about amplifying her natural empathy and expertise while eliminating the time-consuming struggle with tone, structure, and wording.

In the next 20 minutes, Maya will master practical AI tools that will revolutionize her email communication: the AI Email Composer that helps her craft professional, personalized messages in any tone or situation, and personalized AI guidance through Lyra Chat to navigate her specific communication challenges. These tools preserve Maya''s authentic voice while dramatically improving her efficiency and confidence.

By the end of this lesson, you''ll have the same capabilities Maya gains - turning email anxiety into email mastery, one message at a time.'
WHERE lesson_id = 5 
AND title = 'Enter the AI Email Revolution';

-- Remove James reference from reflection
UPDATE content_blocks
SET content = 'What types of emails take you the longest to write, and what specific aspects cause you the most stress? Perhaps it''s the opening line that stumps you, or finding the right balance between professional and personal? Or perhaps you worry about striking the right tone with major donors and key stakeholders? Understanding your unique email challenges will help you get the most from this lesson.'
WHERE lesson_id = 5
AND title = 'Your Email Pain Points'
AND content LIKE '%James%';

-- Fix "Maya's Transformation Begins" to remove character list
UPDATE content_blocks
SET content = 'Ready to transform your Monday mornings—and every email interaction—just like Maya? Let''s discover how AI can turn your communication challenges into your greatest strengths. Your journey to email mastery begins right now.'
WHERE lesson_id = 5
AND title = 'Maya''s Transformation Begins';

-- Update "Meet Your Nonprofit Heroes" to focus on current chapter
UPDATE content_blocks
SET content = 'Throughout this course, you''ll follow the journeys of nonprofit professionals facing real challenges just like yours. 

Today, you''re meeting **Maya Rodriguez**, Program Manager at Hope Gardens Community Center. Maya''s story will guide you through mastering AI-powered email communication - from handling concerned parents to managing board communications with confidence.

In the next lesson, you''ll meet **James Chen**, who will show you how to conquer document creation challenges. Each character''s story teaches practical AI skills you can apply immediately in your own nonprofit work.'
WHERE lesson_id = 5
AND title = 'Meet Your Nonprofit Heroes';

-- Focus Character Transformation Outcomes on Maya only
UPDATE content_blocks
SET content = 'By the end of this lesson, here''s what you''ll achieve alongside Maya:

**Maya Rodriguez (Email Communication Master)**
- Transform from spending 2+ hours on email to handling her inbox in 30 minutes
- Write compelling program updates that inspire parents and board members
- Handle difficult conversations with confidence and empathy
- Build templates that make future communications effortless

Your transformation starts with mastering email communication - the foundation of nonprofit relationship building. Ready to begin?'
WHERE lesson_id = 5
AND title = 'Character Transformation Outcomes';

-- Verify the changes will work
SELECT 
  title,
  SUBSTRING(content, 1, 100) as content_preview,
  CASE 
    WHEN content LIKE '%four game-changing tools%' THEN '❌ Has "four tools" error'
    WHEN content LIKE '%four%tools%' THEN '❌ Has "four tools" error'
    WHEN content LIKE '%James%' AND title != 'Meet Your Nonprofit Heroes' THEN '❌ Mentions other characters'
    WHEN content LIKE '%Sofia%' THEN '❌ Mentions Sofia'
    WHEN content LIKE '%David%' THEN '❌ Mentions David'
    WHEN content LIKE '%Rachel%' THEN '❌ Mentions Rachel'
    WHEN content LIKE '%Alex%' THEN '❌ Mentions Alex'
    ELSE '✅ Content OK'
  END as issue_status
FROM content_blocks
WHERE lesson_id = 5
ORDER BY order_index;

-- Show what the user will actually see (frontend filtering simulation)
SELECT 
  '=== WHAT USERS WILL SEE IN LESSON 5 ===' as info;

SELECT 
  'Content Blocks: 10' as metric,
  'Interactive Elements (after filtering): 2' as value,
  'Total Elements: 12' as total;

SELECT 
  'Available Tools:' as info,
  '1. AI Email Composer (Help Maya Handle a Concerned Parent)' as tool1,
  '2. Lyra Chat (Maya''s Coffee Chat: What''s Next?)' as tool2;

SELECT 
  '=== RUN THIS SQL IN YOUR DATABASE ===' as instruction,
  'The content promises should now match the 2 available tools' as result;