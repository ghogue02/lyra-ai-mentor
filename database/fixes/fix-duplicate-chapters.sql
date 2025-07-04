-- Fix Duplicate Chapters Issue
-- Remove old placeholder chapters and keep the new automation-ready ones

-- First, let's see what we have and clean up systematically

-- Delete any lessons that might be associated with duplicate chapters
-- We'll keep the lessons we just created (31, 41, 51, 61) and remove any others for chapters 3-6

-- Remove any old lessons for chapters 3-6 that aren't our new placeholder lessons
DELETE FROM interactive_elements 
WHERE lesson_id IN (
    SELECT id FROM lessons 
    WHERE chapter_id IN (3, 4, 5, 6) 
    AND id NOT IN (31, 41, 51, 61)
);

DELETE FROM content_blocks 
WHERE lesson_id IN (
    SELECT id FROM lessons 
    WHERE chapter_id IN (3, 4, 5, 6) 
    AND id NOT IN (31, 41, 51, 61)
);

DELETE FROM lessons 
WHERE chapter_id IN (3, 4, 5, 6) 
AND id NOT IN (31, 41, 51, 61);

-- Now ensure we have clean, single chapters 3-6 with our automation descriptions
-- Delete and recreate to avoid any conflicts

DELETE FROM chapters WHERE id IN (3, 4, 5, 6);

-- Recreate chapters 3-6 with proper automation descriptions
INSERT INTO chapters (id, title, description, order_index, icon, duration, is_published)
VALUES 
  (3, 'Communication & Storytelling', 'Transform how you connect with donors, volunteers, and communities using AI-powered storytelling (Auto-buildable with Chapter Builder Agent)', 3, 'megaphone', '85 min', TRUE),
  (4, 'Data & Decision Making', 'Turn numbers into narratives that drive funding and strategic decisions (Auto-buildable with Chapter Builder Agent)', 4, 'bar-chart', '92 min', TRUE),
  (5, 'Automation & Efficiency', 'Build AI-powered systems that scale your mission impact (Auto-buildable with Chapter Builder Agent)', 5, 'zap', '95 min', TRUE),
  (6, 'Organizational Transformation', 'Lead your team through AI-powered change while maintaining mission focus (Auto-buildable with Chapter Builder Agent)', 6, 'users', '100 min', TRUE);

-- Recreate our placeholder lessons (since we deleted chapters above)
INSERT INTO lessons (id, chapter_id, title, subtitle, order_index, estimated_duration, is_published)
VALUES
  (31, 3, 'Coming Soon: Communication & Storytelling', 'Sofia Martinez''s journey begins here', 10, 15, TRUE),
  (41, 4, 'Coming Soon: Data & Decision Making', 'David Kim''s data transformation story', 10, 15, TRUE),
  (51, 5, 'Coming Soon: Automation & Efficiency', 'Rachel Thompson''s workflow revolution', 10, 15, TRUE),
  (61, 6, 'Coming Soon: Organizational Transformation', 'Alex Rivera''s leadership journey', 10, 15, TRUE);

-- Recreate placeholder content
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (31, 'callout_box', 'Chapter Under Construction', 'This chapter is ready to be built! Use the Chapter Builder Agent in Chapter 2 > Lesson 6 to automatically generate Sofia Martinez''s complete Communication & Storytelling journey with rich character development and integrated AI components.', '{"type": "info", "construction": true}', 10),
  (41, 'callout_box', 'Chapter Under Construction', 'This chapter is ready to be built! Use the Chapter Builder Agent in Chapter 2 > Lesson 6 to automatically generate David Kim''s complete Data & Decision Making transformation with compelling narratives and hands-on analytics tools.', '{"type": "info", "construction": true}', 10),
  (51, 'callout_box', 'Chapter Under Construction', 'This chapter is ready to be built! Use the Chapter Builder Agent in Chapter 2 > Lesson 6 to automatically generate Rachel Thompson''s complete Automation & Efficiency story with workflow solutions and process optimization.', '{"type": "info", "construction": true}', 10),
  (61, 'callout_box', 'Chapter Under Construction', 'This chapter is ready to be built! Use the Chapter Builder Agent in Chapter 2 > Lesson 6 to automatically generate Alex Rivera''s complete Organizational Transformation leadership journey with change management strategies.', '{"type": "info", "construction": true}', 10);

-- Recreate Chapter Builder Agent buttons in each placeholder chapter
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (31, 'chapter_builder_agent', 'Auto-Build This Chapter', 'Click here to automatically generate Sofia Martinez''s complete Communication & Storytelling chapter with rich narratives and AI components.', '{"target_chapter": 3, "character": "Sofia Martinez", "focus": "communication_storytelling"}', 20),
  (41, 'chapter_builder_agent', 'Auto-Build This Chapter', 'Click here to automatically generate David Kim''s complete Data & Decision Making chapter with compelling data stories and analytics tools.', '{"target_chapter": 4, "character": "David Kim", "focus": "data_decision_making"}', 20),
  (51, 'chapter_builder_agent', 'Auto-Build This Chapter', 'Click here to automatically generate Rachel Thompson''s complete Automation & Efficiency chapter with workflow optimization and process improvement.', '{"target_chapter": 5, "character": "Rachel Thompson", "focus": "automation_efficiency"}', 20),
  (61, 'chapter_builder_agent', 'Auto-Build This Chapter', 'Click here to automatically generate Alex Rivera''s complete Organizational Transformation chapter with change management and leadership strategies.', '{"target_chapter": 6, "character": "Alex Rivera", "focus": "organizational_transformation"}', 20);

-- Ensure all chapters are published and in correct order
UPDATE chapters SET is_published = true WHERE id IN (1, 2, 3, 4, 5, 6);