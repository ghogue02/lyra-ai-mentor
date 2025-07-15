-- Add Database Content Viewer to help diagnose where content is located

-- First, let's see what's in Chapter 1, Lesson 1 (usually the first accessible lesson)
SELECT id, title FROM lessons WHERE chapter_id = 1 LIMIT 1;

-- Add Database Content Viewer to the first lesson of Chapter 1
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (1, 'database_content_viewer', 'Database Content Viewer', 
   'Use this tool to explore all chapters, lessons, and interactive elements in your database. This will help you find where Maya, James, and all agent content is located.

Click through chapters to see their lessons and interactive elements. Search for specific content or agent elements.', 
   '{"view_mode": "explorer", "search_enabled": true, "show_maya_james": true}', 999);

-- Also add it to whatever the first lesson of Chapter 2 is (if it exists)
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
SELECT 
  id, 
  'database_content_viewer', 
  'Database Content Viewer',
  'Use this tool to explore all chapters, lessons, and interactive elements in your database. This will help you find where Maya, James, and all agent content is located.',
  '{"view_mode": "explorer", "search_enabled": true, "show_maya_james": true}',
  999
FROM lessons 
WHERE chapter_id = 2 
ORDER BY order_index 
LIMIT 1;