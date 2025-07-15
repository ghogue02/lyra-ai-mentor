-- Add Maya's Prompt Sandwich Builder interactive element
-- Run this SQL directly in Supabase SQL Editor

-- First check if it already exists
SELECT COUNT(*) as existing_count 
FROM interactive_elements 
WHERE title = 'Master the AI Prompt Sandwich' 
AND lesson_id = 5;

-- Insert the element (only if it doesn't exist)
INSERT INTO interactive_elements (
  type,
  title,
  content,
  configuration,
  lesson_id,
  order_index,
  is_active,
  is_gated,
  required_for_completion
) 
SELECT
  'prompt_builder',
  'Master the AI Prompt Sandwich',
  'Learn Maya''s game-changing technique for crafting perfect AI prompts. Build your own prompt sandwich by selecting tone, context, and template layers to generate warm, professional emails in under 5 minutes.',
  jsonb_build_object(
    'component', 'MayaPromptSandwichBuilder',
    'instructions', 'Create a three-layer prompt sandwich by selecting tone, context, and email template',
    'learning_objectives', jsonb_build_array(
      'Understand how to structure effective AI prompts',
      'Learn to layer tone, context, and purpose for better outputs',
      'Practice creating prompts that maintain your authentic voice',
      'See how proper prompting saves 27 minutes per email'
    ),
    'maya_connection', 'This is the exact technique Maya discovered that transformed her email anxiety into confidence',
    'time_savings', '32 minutes → 5 minutes per email',
    'route_component', 'MayaPromptSandwichBuilder'
  ),
  5, -- Lesson 5
  55, -- After "The AI Email Composer" block
  true,
  false,
  true
WHERE NOT EXISTS (
  SELECT 1 
  FROM interactive_elements 
  WHERE title = 'Master the AI Prompt Sandwich' 
  AND lesson_id = 5
);

-- Verify the insertion
SELECT 
  id,
  type,
  title,
  order_index,
  is_active,
  configuration->>'component' as component
FROM interactive_elements
WHERE lesson_id = 5
AND order_index BETWEEN 45 AND 65
ORDER BY order_index;

-- Show the complete flow around this element
SELECT 
  'content' as block_type,
  title,
  order_index
FROM content_blocks
WHERE lesson_id = 5
AND order_index BETWEEN 40 AND 60

UNION ALL

SELECT 
  'interactive' as block_type,
  title,
  order_index
FROM interactive_elements
WHERE lesson_id = 5
AND is_active = true
AND order_index BETWEEN 40 AND 60

ORDER BY order_index;