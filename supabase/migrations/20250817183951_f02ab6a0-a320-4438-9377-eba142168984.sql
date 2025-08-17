-- Create Chapter 7 and its lessons  
INSERT INTO chapters (id, title, description, order_index, is_published) VALUES 
(7, 'AI-Powered People Management', 'Transform your HR practices with Carmen''s compassionate approach to AI-powered people management, from recruitment to retention with human-centered solutions.', 7, true)
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- Insert Chapter 7 lessons
INSERT INTO lessons (id, chapter_id, title, subtitle, order_index, estimated_duration, is_published) VALUES 
(71, 7, 'Bias-Free Performance Excellence', 'Learn to create objective, development-focused performance evaluations that eliminate unconscious bias while promoting meaningful growth conversations with your team.', 1, 25, true),
(72, 7, 'AI-Enhanced Recruitment Strategy', 'Master the art of attracting and selecting diverse talent using AI-powered screening tools that remove bias while identifying the best candidates for your mission.', 2, 30, true),
(73, 7, 'People Analytics for Growth', 'Harness the power of people data to create personalized development plans, predict retention risks, and build stronger, more engaged teams.', 3, 28, true),
(74, 7, 'Human-Centered HR Automation', 'Automate routine HR tasks while maintaining the personal touch that makes your organization special, creating more time for meaningful human connections.', 4, 32, true)
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle;