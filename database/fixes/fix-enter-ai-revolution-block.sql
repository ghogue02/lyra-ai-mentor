-- Fix the specific "Enter the AI Email Revolution" content block in Lesson 5
-- This block currently has incorrect tool count and inappropriate character mentions

UPDATE content_blocks
SET content = 'What Maya discovers today will transform not just her Monday mornings, but her entire approach to communication. AI isn''t about replacing the human touch that makes her messages meaningful—it''s about amplifying her natural empathy and expertise while eliminating the time-consuming struggle with tone, structure, and wording.

In the next 20 minutes, Maya will master practical AI tools that will revolutionize her email communication: the AI Email Composer that helps her craft professional, personalized messages in any tone or situation, and personalized AI guidance through Lyra Chat to navigate her specific communication challenges. These tools preserve Maya''s authentic voice while dramatically improving her efficiency and confidence.

By the end of this lesson, you''ll have the same capabilities Maya gains - turning email anxiety into email mastery, one message at a time.'
WHERE lesson_id = 5 
AND title = 'Enter the AI Email Revolution';

-- Also fix the "Your Email Pain Points" reflection to remove James reference
UPDATE content_blocks
SET content = REPLACE(
  content,
  'Or perhaps you''re like James (our development associate), who worries about striking the right tone with major donors?',
  'Or perhaps you worry about striking the right tone with major donors and key stakeholders?'
)
WHERE lesson_id = 5
AND title = 'Your Email Pain Points';

-- Fix "Maya's Transformation Begins" to remove the "Coming up" section
UPDATE content_blocks
SET content = 'Ready to transform your Monday mornings—and every email interaction—just like Maya? Let''s discover how AI can turn your communication challenges into your greatest strengths. Your journey to email mastery begins right now.'
WHERE lesson_id = 5
AND title = 'Maya''s Transformation Begins';

-- Update "Meet Your Nonprofit Heroes" to focus on Maya only
UPDATE content_blocks
SET content = 'Throughout this course, you''ll follow the journeys of nonprofit professionals facing real challenges just like yours. 

Today, you''re meeting **Maya Rodriguez**, Program Manager at Hope Gardens Community Center. Maya''s story will guide you through mastering AI-powered email communication - from handling concerned parents to managing board communications with confidence.

In the next lesson, you''ll meet **James Chen**, who will show you how to conquer document creation challenges. Each character''s story teaches practical AI skills you can apply immediately in your own nonprofit work.'
WHERE lesson_id = 5
AND title = 'Meet Your Nonprofit Heroes';

-- Update "Character Transformation Outcomes" to show only Maya's outcomes
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

-- Verify the changes
SELECT 
  title,
  CASE 
    WHEN content LIKE '%four game-changing tools%' THEN '❌ Still has "four tools" error'
    WHEN content LIKE '%James%' AND title != 'Meet Your Nonprofit Heroes' THEN '❌ Still mentions other characters'
    ELSE '✅ Fixed'
  END as status,
  LENGTH(content) as content_length
FROM content_blocks
WHERE lesson_id = 5
AND (
  title IN ('Enter the AI Email Revolution', 'Your Email Pain Points', 'Maya''s Transformation Begins', 'Meet Your Nonprofit Heroes', 'Character Transformation Outcomes')
)
ORDER BY order_index;