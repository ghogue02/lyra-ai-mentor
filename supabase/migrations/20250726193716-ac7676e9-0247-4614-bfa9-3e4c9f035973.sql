-- Clean up old Chapter 1 content and create minimal lesson for routing

-- Delete old Chapter 1 interactive elements
DELETE FROM interactive_elements WHERE lesson_id IN (
  SELECT id FROM lessons WHERE chapter_id = 1
);

-- Delete old Chapter 1 content blocks  
DELETE FROM content_blocks WHERE lesson_id IN (
  SELECT id FROM lessons WHERE chapter_id = 1
);

-- Delete lesson progress for old Chapter 1 lessons
DELETE FROM lesson_progress WHERE lesson_id IN (
  SELECT id FROM lessons WHERE chapter_id = 1
);

-- Delete lesson progress detailed for old Chapter 1 lessons
DELETE FROM lesson_progress_detailed WHERE lesson_id IN (
  SELECT id FROM lessons WHERE chapter_id = 1
);

-- Delete old Chapter 1 lessons
DELETE FROM lessons WHERE chapter_id = 1;

-- Create a single minimal lesson for Chapter 1 routing
INSERT INTO lessons (title, subtitle, chapter_id, order_index, estimated_duration, is_published)
VALUES (
  'Hello, I''m Lyra!',
  'Your AI mentor introduction',
  1,
  1,
  10,
  true
);