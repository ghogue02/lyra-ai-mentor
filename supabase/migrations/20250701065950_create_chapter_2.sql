
-- supabase/migrations/20250701065950_create_chapter_2.sql

-- 1. Insert Chapter 2
INSERT INTO chapters (id, title, description, order_index, icon, duration, is_published)
VALUES (2, 'AI in Fundraising', 'Discover how AI can revolutionize your fundraising efforts, from donor prospecting to campaign optimization.', 2, 'gem', '25 min', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Lessons for Chapter 2
INSERT INTO lessons (id, chapter_id, title, subtitle, order_index, estimated_duration, is_published)
VALUES
  (3, 2, 'The New Era of Fundraising', 'How AI is changing the game for non-profits', 10, 8, TRUE),
  (4, 2, 'Practical AI Tools', 'Hands-on with AI tools for fundraising', 20, 12, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Content Blocks for Lesson 3
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  -- Lesson 3: The New Era of Fundraising
  (3, 'text', 'Welcome to the Future of Fundraising', 'The world of non-profit fundraising is on the cusp of a major transformation, and AI is the driving force. This chapter will explore how you can leverage AI to not only enhance your efficiency but also to build deeper, more meaningful connections with your supporters.', '{"version": "1.0"}', 10),
  (3, 'text', 'Beyond the Buzzwords: What AI Really Means for You', 'AI in fundraising isn''t about futuristic robots; it''s about practical tools that help you understand your donors better, predict their behavior, and personalize your outreach at scale. We''ll demystify the jargon and focus on real-world applications.', '{"version": "1.0"}', 20),
  (3, 'callout_box', 'Key Statistic', 'Organizations using AI for fundraising have seen an average increase of 15-30% in donor retention rates. This highlights the power of personalized engagement.', '{"type": "info"}', 30),
  (3, 'text', 'Identifying and Segmenting Donors', 'One of the most powerful uses of AI is in analyzing your existing donor data to identify patterns. AI models can help you segment your audience based on giving capacity, engagement level, and communication preferences, allowing for highly targeted campaigns.', '{"version": "1.0"}', 40),
  (3, 'image', 'Donor Segmentation Example', 'A visual representation of how AI can group donors into different segments for targeted outreach.', '{"url": "public/placeholder.svg", "alt": "AI Donor Segmentation"}', 50)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Interactive Elements for Lesson 3
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (3, 'lyra_chat', 'Discuss Your Fundraising Challenges', 'Let''s talk about your current fundraising process. What are your biggest challenges? Where do you see the most opportunity for improvement?', '{"minimumEngagement": 3, "blockingEnabled": true, "chatType": "persistent"}', 60),
  (3, 'knowledge_check', 'Check Your Understanding', 'What is a primary benefit of using AI in donor segmentation?', '{"question": "What is a primary benefit of using AI in donor segmentation?", "options": ["Sending more emails", "Personalizing outreach at scale", "Reducing the number of donors"], "correctAnswer": 1, "explanation": "AI allows for deep personalization across a large donor base, which is difficult to achieve manually."}', 70)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Content Blocks for Lesson 4
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  -- Lesson 4: Practical AI Tools
  (4, 'text', 'From Theory to Practice', 'Now that you understand the concepts, let''s get hands-on with some AI tools that can help you today. We''ll focus on accessible and affordable solutions designed for non-profits.', '{"version": "1.0"}', 10),
  (4, 'text', 'AI-Powered Grant Writing Assistants', 'Tools like Grantable and ChatGPT can help you draft compelling grant proposals faster. They can assist with research, writing, and editing, freeing up your time to focus on strategy and relationships.', '{"version": "1.0"}', 20),
  (4, 'interactive_element_placeholder', 'Grant Writing Assistant Demo', 'This is where an interactive demo of a grant writing assistant would go.', '{}', 30),
  (4, 'text', 'Predictive Analytics for Donor Behavior', 'Platforms like DonorSearch and Windfall use AI to predict which of your supporters are most likely to give a major gift. This allows you to focus your cultivation efforts where they''ll have the most impact.', '{"version": "1.0"}', 40),
  (4, 'reflection', 'Applying AI to Your Work', 'Think about your current fundraising workflow. Where could one of the tools we''ve discussed make the biggest immediate impact? Jot down a few ideas.', '{"prompt": "Where could you apply AI in your fundraising workflow for the biggest impact?", "placeholderText": "For example, I could use a grant writing assistant to...", "minLength": 30}', 50)
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Interactive Elements for Lesson 4
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (4, 'lyra_chat', 'Choosing the Right Tools', 'Feeling overwhelmed by the options? Let''s chat about your specific needs and I can help you identify the best starting point for your organization.', '{"minimumEngagement": 2, "blockingEnabled": false, "chatType": "persistent"}', 60),
  (4, 'sequence_sorter', 'The Fundraising Funnel', 'Arrange the steps of a modern, AI-enhanced fundraising funnel into the correct order.', '{"items": ["AI-Powered Prospecting", "Personalized Email Outreach", "Automated Follow-ups", "Major Gift Prediction", "Stewardship & Reporting"], "correctOrder": [0, 1, 2, 3, 4]}', 70)
ON CONFLICT (id) DO NOTHING;
