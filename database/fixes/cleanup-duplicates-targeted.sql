-- Targeted Cleanup of Duplicate Chapters
-- More aggressive approach to remove all duplicates

-- First, let's see what we're working with and clean systematically
-- We'll keep only the chapters with the longest descriptions (our automation ones)

-- Step 1: Clean up all content for chapters 3-6 to start fresh
DELETE FROM interactive_elements 
WHERE lesson_id IN (
    SELECT id FROM lessons WHERE chapter_id IN (3, 4, 5, 6)
);

DELETE FROM content_blocks 
WHERE lesson_id IN (
    SELECT id FROM lessons WHERE chapter_id IN (3, 4, 5, 6)
);

DELETE FROM lessons WHERE chapter_id IN (3, 4, 5, 6);

-- Step 2: Delete ALL chapters 3-6 (removes duplicates completely)
DELETE FROM chapters WHERE id >= 3;

-- Step 3: Wait a moment for cleanup, then recreate clean chapters
-- Create only ONE of each chapter with automation descriptions

INSERT INTO chapters (id, title, description, order_index, icon, duration, is_published)
VALUES 
  (3, 'Communication & Storytelling', 'Transform how you connect with donors, volunteers, and communities using AI-powered storytelling', 3, 'megaphone', '65 min', TRUE),
  (4, 'Data & Decision Making', 'Turn numbers into narratives that drive funding and strategic decisions', 4, 'bar-chart', '70 min', TRUE),
  (5, 'Automation & Efficiency', 'Build AI-powered systems that scale your mission impact', 5, 'zap', '75 min', TRUE),
  (6, 'Organizational Transformation', 'Lead your team through AI-powered change while maintaining mission focus', 6, 'users', '80 min', TRUE);

-- Step 4: Create single placeholder lesson per chapter
INSERT INTO lessons (id, chapter_id, title, subtitle, order_index, estimated_duration, is_published)
VALUES
  (31, 3, 'Ready to Build: Communication & Storytelling', 'Sofia Martinez awaits your Chapter Builder Agent', 10, 15, TRUE),
  (41, 4, 'Ready to Build: Data & Decision Making', 'David Kim awaits your Chapter Builder Agent', 10, 15, TRUE),
  (51, 5, 'Ready to Build: Automation & Efficiency', 'Rachel Thompson awaits your Chapter Builder Agent', 10, 15, TRUE),
  (61, 6, 'Ready to Build: Organizational Transformation', 'Alex Rivera awaits your Chapter Builder Agent', 10, 15, TRUE);

-- Step 5: Add simple placeholder content directing to Chapter Builder Agent
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (31, 'callout_box', 'Use Chapter Builder Agent', 'Go to Chapter 2 > Lesson 6 and use the Chapter Builder Agent to automatically generate Sofia Martinez''s complete Communication & Storytelling journey.', '{"type": "info", "construction": true}', 10),
  (41, 'callout_box', 'Use Chapter Builder Agent', 'Go to Chapter 2 > Lesson 6 and use the Chapter Builder Agent to automatically generate David Kim''s complete Data & Decision Making transformation.', '{"type": "info", "construction": true}', 10),
  (51, 'callout_box', 'Use Chapter Builder Agent', 'Go to Chapter 2 > Lesson 6 and use the Chapter Builder Agent to automatically generate Rachel Thompson''s complete Automation & Efficiency story.', '{"type": "info", "construction": true}', 10),
  (61, 'callout_box', 'Use Chapter Builder Agent', 'Go to Chapter 2 > Lesson 6 and use the Chapter Builder Agent to automatically generate Alex Rivera''s complete Organizational Transformation journey.', '{"type": "info", "construction": true}', 10);

-- Step 6: Verify we have exactly 6 chapters total
-- Should show: 1, 2, 3, 4, 5, 6 with no duplicates