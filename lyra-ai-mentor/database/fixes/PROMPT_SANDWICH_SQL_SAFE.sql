-- SAFE SQL WITH DUPLICATE CHECK - RUN THIS VERSION
-- https://supabase.com/dashboard/project/hfkzwjnlxrwynactcmpe/sql/new

-- First check if it already exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM interactive_elements 
    WHERE title = 'Master the AI Prompt Sandwich' 
    AND lesson_id = 5
  ) THEN
    -- Add Maya's Prompt Sandwich Builder
    INSERT INTO interactive_elements (
      type,
      title,
      content,
      configuration,
      lesson_id,
      order_index,
      is_active,
      is_gated
    ) VALUES (
      'prompt_builder',
      'Master the AI Prompt Sandwich',
      'Learn Maya''s game-changing technique for crafting perfect AI prompts. Build your own prompt sandwich by selecting tone, context, and template layers to generate warm, professional emails in under 5 minutes.',
      '{
        "component": "MayaPromptSandwichBuilder",
        "instructions": "Create a three-layer prompt sandwich by selecting tone, context, and email template",
        "learning_objectives": [
          "Understand how to structure effective AI prompts",
          "Learn to layer tone, context, and purpose for better outputs",
          "Practice creating prompts that maintain your authentic voice",
          "See how proper prompting saves 27 minutes per email"
        ],
        "maya_connection": "This is the exact technique Maya discovered that transformed her email anxiety into confidence",
        "time_savings": "32 minutes → 5 minutes per email",
        "route_component": "MayaPromptSandwichBuilder"
      }'::jsonb,
      5,
      55,
      true,
      false
    );
    
    RAISE NOTICE 'Successfully added Prompt Sandwich Builder!';
  ELSE
    RAISE NOTICE 'Prompt Sandwich Builder already exists - skipping insert';
  END IF;
END $$;

-- Verify the element exists
SELECT 
  id, 
  title, 
  type, 
  order_index, 
  is_active,
  configuration->>'component' as component
FROM interactive_elements 
WHERE lesson_id = 5 
AND title = 'Master the AI Prompt Sandwich';

-- Show the flow around this element
SELECT 
  title,
  order_index,
  CASE 
    WHEN title = 'Master the AI Prompt Sandwich' THEN '🥪 NEW!'
    ELSE ''
  END as status
FROM (
  SELECT title, order_index FROM content_blocks WHERE lesson_id = 5 AND order_index BETWEEN 40 AND 60
  UNION ALL
  SELECT title, order_index FROM interactive_elements WHERE lesson_id = 5 AND is_active = true AND order_index BETWEEN 40 AND 60
) combined
ORDER BY order_index;