-- FIXED SQL - COPY AND PASTE THIS INTO SUPABASE SQL EDITOR
-- https://supabase.com/dashboard/project/hfkzwjnlxrwynactcmpe/sql/new

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

-- Verify it was added
SELECT id, title, type, order_index, is_active 
FROM interactive_elements 
WHERE lesson_id = 5 
AND title = 'Master the AI Prompt Sandwich';