
-- Remove the two interactive elements from Chapter 1 (lesson_id 1)
-- Element 9: Practice: AI Implementation Steps (sequence_sorter)
-- Element 10: Test Your Understanding: AI Scenarios (multiple_choice_scenarios)
DELETE FROM interactive_elements 
WHERE lesson_id = 1 AND id IN (9, 10);

-- Update the order_index of remaining interactive elements in Chapter 1
-- The remaining element should be the lyra_chat at the end
UPDATE interactive_elements 
SET order_index = order_index - 2 
WHERE lesson_id = 1 AND order_index > 10;
