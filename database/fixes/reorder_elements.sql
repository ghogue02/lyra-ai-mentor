
-- First, let's identify the current order of elements and then reorder them
-- The "Test Your Understanding: AI Scenarios" should come after "You're already using AI"

-- Update the AI Scenarios element to have order_index 4 (after "You're already using AI" which is at 3)
UPDATE interactive_elements 
SET order_index = 4 
WHERE lesson_id = 1 
  AND type = 'multiple_choice_scenarios' 
  AND title = 'Test Your Understanding: AI Scenarios';

-- Move the "Practice: AI Implementation Steps" element to order_index 5
UPDATE interactive_elements 
SET order_index = 5 
WHERE lesson_id = 1 
  AND type = 'sequence_sorter' 
  AND title = 'Practice: AI Implementation Steps';

-- Move the "Create Your AI Impact Story" element to order_index 6  
UPDATE interactive_elements 
SET order_index = 6 
WHERE lesson_id = 1 
  AND type = 'ai_impact_story_creator' 
  AND title = 'Create Your AI Impact Story';
