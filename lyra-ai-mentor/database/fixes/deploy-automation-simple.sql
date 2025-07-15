-- Deploy Full Automation Agent System (Simple Version)
-- No ON CONFLICT clauses to avoid constraint errors

-- Step 1: Create missing chapters 3-6 first
INSERT INTO chapters (id, title, description, order_index, icon, duration, is_published)
VALUES 
  (3, 'Communication & Storytelling', 'Transform how you connect with donors, volunteers, and communities using AI-powered storytelling (Auto-buildable with Chapter Builder Agent)', 3, 'megaphone', '85 min', TRUE),
  (4, 'Data & Decision Making', 'Turn numbers into narratives that drive funding and strategic decisions (Auto-buildable with Chapter Builder Agent)', 4, 'bar-chart', '92 min', TRUE),
  (5, 'Automation & Efficiency', 'Build AI-powered systems that scale your mission impact (Auto-buildable with Chapter Builder Agent)', 5, 'zap', '95 min', TRUE),
  (6, 'Organizational Transformation', 'Lead your team through AI-powered change while maintaining mission focus (Auto-buildable with Chapter Builder Agent)', 6, 'users', '100 min', TRUE);

-- Step 2: Apply content audit fixes (remove any remaining external references)
UPDATE content_blocks 
SET content = REPLACE(content, 'DreamWorks', 'professional storytelling')
WHERE content LIKE '%DreamWorks%';

UPDATE content_blocks 
SET title = REPLACE(title, 'DreamWorks', 'Professional Storytelling')
WHERE title LIKE '%DreamWorks%';

UPDATE interactive_elements 
SET content = REPLACE(content, 'DreamWorks storytelling framework', 'professional storytelling techniques')
WHERE content LIKE '%DreamWorks storytelling framework%';

UPDATE interactive_elements 
SET content = REPLACE(content, 'DreamWorks', 'professional storytelling')
WHERE content LIKE '%DreamWorks%';

UPDATE interactive_elements 
SET title = REPLACE(title, 'DreamWorks', 'Professional Storytelling')
WHERE title LIKE '%DreamWorks%';

-- Step 3: Add Content Audit Agent to Maya's lesson (only if not exists)
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
SELECT 5, 'content_audit_agent', 'Audit Content for Nonprofit Focus', 'Ensure all learning content maintains focus on nonprofit transformation and avoids inappropriate external references. This tool scans content to verify it speaks directly to nonprofit professionals and their unique challenges.', '{"audit_focus": "nonprofit_transformation", "remove_external_references": true, "maintain_professional_tone": true}', 107
WHERE NOT EXISTS (
    SELECT 1 FROM interactive_elements WHERE lesson_id = 5 AND type = 'content_audit_agent'
);

-- Step 4: Add Chapter Builder Agent to James's lesson (only if not exists)
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
SELECT 6, 'chapter_builder_agent', 'Build Complete Chapters Automatically', 'Generate full chapters with rich character storylines, engaging content, and integrated AI components. This automation agent creates lessons, content blocks, and interactive elements, then deploys them directly to the database.', '{"automation_level": "full", "content_style": "character_driven", "component_integration": "automatic", "deployment": "direct_to_database"}', 115
WHERE NOT EXISTS (
    SELECT 1 FROM interactive_elements WHERE lesson_id = 6 AND type = 'chapter_builder_agent'
);

-- Step 5: Add placeholder lessons for chapters 3-6
INSERT INTO lessons (id, chapter_id, title, subtitle, order_index, estimated_duration, is_published)
VALUES
  (31, 3, 'Coming Soon: Communication & Storytelling', 'Sofia Martinez''s journey begins here', 10, 15, TRUE),
  (41, 4, 'Coming Soon: Data & Decision Making', 'David Kim''s data transformation story', 10, 15, TRUE),
  (51, 5, 'Coming Soon: Automation & Efficiency', 'Rachel Thompson''s workflow revolution', 10, 15, TRUE),
  (61, 6, 'Coming Soon: Organizational Transformation', 'Alex Rivera''s leadership journey', 10, 15, TRUE);

-- Step 6: Add placeholder content for new chapters
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (31, 'callout_box', 'Chapter Under Construction', 'This chapter is ready to be built! Use the Chapter Builder Agent in Chapter 2 > Lesson 6 to automatically generate Sofia Martinez''s complete Communication & Storytelling journey with rich character development and integrated AI components.', '{"type": "info", "construction": true}', 10),
  (41, 'callout_box', 'Chapter Under Construction', 'This chapter is ready to be built! Use the Chapter Builder Agent in Chapter 2 > Lesson 6 to automatically generate David Kim''s complete Data & Decision Making transformation with compelling narratives and hands-on analytics tools.', '{"type": "info", "construction": true}', 10),
  (51, 'callout_box', 'Chapter Under Construction', 'This chapter is ready to be built! Use the Chapter Builder Agent in Chapter 2 > Lesson 6 to automatically generate Rachel Thompson''s complete Automation & Efficiency story with workflow solutions and process optimization.', '{"type": "info", "construction": true}', 10),
  (61, 'callout_box', 'Chapter Under Construction', 'This chapter is ready to be built! Use the Chapter Builder Agent in Chapter 2 > Lesson 6 to automatically generate Alex Rivera''s complete Organizational Transformation leadership journey with change management strategies.', '{"type": "info", "construction": true}', 10);

-- Step 7: Add Chapter Builder Agent to each placeholder chapter
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (31, 'chapter_builder_agent', 'Auto-Build This Chapter', 'Click here to automatically generate Sofia Martinez''s complete Communication & Storytelling chapter with rich narratives and AI components.', '{"target_chapter": 3, "character": "Sofia Martinez", "focus": "communication_storytelling"}', 20),
  (41, 'chapter_builder_agent', 'Auto-Build This Chapter', 'Click here to automatically generate David Kim''s complete Data & Decision Making chapter with compelling data stories and analytics tools.', '{"target_chapter": 4, "character": "David Kim", "focus": "data_decision_making"}', 20),
  (51, 'chapter_builder_agent', 'Auto-Build This Chapter', 'Click here to automatically generate Rachel Thompson''s complete Automation & Efficiency chapter with workflow optimization and process improvement.', '{"target_chapter": 5, "character": "Rachel Thompson", "focus": "automation_efficiency"}', 20),
  (61, 'chapter_builder_agent', 'Auto-Build This Chapter', 'Click here to automatically generate Alex Rivera''s complete Organizational Transformation chapter with change management and leadership strategies.', '{"target_chapter": 6, "character": "Alex Rivera", "focus": "organizational_transformation"}', 20);

-- Step 8: Add navigation helpers to existing Chapter 2 lessons (only if not exists)
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
SELECT 5, 'callout_box', 'Automation Agents Available', 'Want to expand the course? Use the Content Audit Agent below to ensure quality, and the Chapter Builder Agent in Lesson 6 to automatically generate complete chapters with character storylines and AI components.', '{"type": "success", "automation_available": true}', 128
WHERE NOT EXISTS (
    SELECT 1 FROM content_blocks WHERE lesson_id = 5 AND title = 'Automation Agents Available'
);

INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
SELECT 6, 'callout_box', 'Ready to Build More Chapters?', 'James''s document creation skills are just the beginning. Use the Chapter Builder Agent below to automatically generate Chapters 3-6 with complete character storylines for Sofia (Communication), David (Data), Rachel (Automation), and Alex (Transformation).', '{"type": "info", "chapter_expansion": true}', 116
WHERE NOT EXISTS (
    SELECT 1 FROM content_blocks WHERE lesson_id = 6 AND title = 'Ready to Build More Chapters?'
);

-- Step 9: Add success confirmation (only if not exists)
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
SELECT 6, 'callout_box', 'Automation System Active', 'Full automation system is now deployed! All chapters are unlocked, the Content Audit Agent ensures quality, and the Chapter Builder Agent can generate complete chapters automatically. Chapters 3-6 are ready to be built with one click.', '{"type": "success", "automation_complete": true}', 118
WHERE NOT EXISTS (
    SELECT 1 FROM content_blocks WHERE lesson_id = 6 AND title = 'Automation System Active'
);

-- Step 10: Ensure all chapters are published
UPDATE chapters SET is_published = true WHERE id IN (1, 2, 3, 4, 5, 6);