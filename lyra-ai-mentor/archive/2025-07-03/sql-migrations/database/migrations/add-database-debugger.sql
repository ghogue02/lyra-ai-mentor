-- Add Database Debugger to Chapter 2, Lesson 6
-- This will help diagnose and fix the duplicate chapters issue

INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (6, 'database_debugger', 'Database Debugger', 'This debugging tool shows exactly what chapters exist in the database and can clean up duplicates. Use this to understand why duplicates are appearing on the dashboard and fix them directly.', '{"debug_mode": true, "show_raw_data": true, "cleanup_enabled": true}', 25);