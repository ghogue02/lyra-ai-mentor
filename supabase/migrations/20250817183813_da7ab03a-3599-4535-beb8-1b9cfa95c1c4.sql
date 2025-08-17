-- Create Chapter 7 and its lessons
INSERT INTO chapters (id, title, description, character_type, order_index, is_active) VALUES 
(7, 'AI-Powered People Management', 'Transform your HR practices with Carmen''s compassionate approach to AI-powered people management, from recruitment to retention with human-centered solutions.', 'alex', 7, true)
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  character_type = EXCLUDED.character_type;

-- Insert Chapter 7 lessons
INSERT INTO lessons (id, chapter_id, title, description, order_index, estimated_duration, learning_objectives, lesson_type, is_active) VALUES 
(71, 7, 'Bias-Free Performance Excellence', 'Learn to create objective, development-focused performance evaluations that eliminate unconscious bias while promoting meaningful growth conversations with your team.', 1, 25, '["Identify common sources of bias in performance evaluations", "Design competency-based evaluation frameworks", "Create objective behavioral indicators", "Facilitate development-focused performance conversations", "Use AI tools to ensure evaluation consistency"]', 'interactive', true),
(72, 7, 'AI-Enhanced Recruitment Strategy', 'Master the art of attracting and selecting diverse talent using AI-powered screening tools that remove bias while identifying the best candidates for your mission.', 2, 30, '["Develop inclusive job descriptions using AI analysis", "Create bias-free screening criteria", "Use AI tools for candidate assessment", "Design equitable interview processes", "Build diverse talent pipelines"]', 'interactive', true),
(73, 7, 'People Analytics for Growth', 'Harness the power of people data to create personalized development plans, predict retention risks, and build stronger, more engaged teams.', 3, 28, '["Analyze employee engagement data patterns", "Create predictive retention models", "Design personalized development pathways", "Use analytics to improve team dynamics", "Measure the impact of people initiatives"]', 'interactive', true),
(74, 7, 'Human-Centered HR Automation', 'Automate routine HR tasks while maintaining the personal touch that makes your organization special, creating more time for meaningful human connections.', 4, 32, '["Identify automation opportunities in HR processes", "Design human-centered automated workflows", "Maintain personal connection through automation", "Measure automation impact on employee experience", "Create feedback loops for continuous improvement"]', 'interactive', true)
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  learning_objectives = EXCLUDED.learning_objectives;