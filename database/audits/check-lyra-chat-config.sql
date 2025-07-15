-- Check lyra_chat configuration in Lesson 5
SELECT 
  id,
  type,
  title,
  configuration,
  order_index
FROM interactive_elements
WHERE lesson_id = 5 AND type = 'lyra_chat';

-- Check order of all elements in Lesson 5
SELECT 
  type,
  title,
  order_index
FROM interactive_elements
WHERE lesson_id = 5
ORDER BY order_index;