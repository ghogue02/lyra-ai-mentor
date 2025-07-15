-- Add Maya's Prompt Sandwich Builder interactive element
-- This should appear after "The AI Email Composer: Your New Best Friend" content block (order_index 50)

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
) VALUES (
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
    'time_savings', '32 minutes → 5 minutes per email'
  ),
  5, -- Lesson 5: Transforming Daily Work with AI
  55, -- Place after "The AI Email Composer" block (50)
  true,
  false,
  true
);

-- Verify the placement
SELECT 
  title,
  type,
  order_index,
  CASE 
    WHEN type = 'interactive_element' THEN 'INTERACTIVE'
    ELSE 'CONTENT'
  END as block_type
FROM (
  SELECT title, 'content_block' as type, order_index 
  FROM content_blocks 
  WHERE lesson_id = 5
  
  UNION ALL
  
  SELECT title, 'interactive_element' as type, order_index 
  FROM interactive_elements 
  WHERE lesson_id = 5 AND is_active = true
) combined
ORDER BY order_index;

-- Update the routing to handle this new component
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{route_component}',
  '"MayaPromptSandwichBuilder"'
)
WHERE title = 'Master the AI Prompt Sandwich'
AND lesson_id = 5;