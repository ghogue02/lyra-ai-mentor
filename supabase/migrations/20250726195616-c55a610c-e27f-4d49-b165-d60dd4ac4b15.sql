-- Add 3 new lessons to Chapter 1
INSERT INTO public.lessons (chapter_id, title, subtitle, order_index, estimated_duration, is_published) VALUES
(1, 'Your AI Learning Journey', 'Discover how AI will transform your nonprofit work', 2, 12, true),
(1, 'Understanding AI Assistance', 'Learn the fundamentals of AI-powered productivity', 3, 15, true),
(1, 'Setting Your Learning Goals', 'Define your path to AI mastery', 4, 10, true);

-- Get the IDs of the newly created lessons and add content
WITH new_lessons AS (
  SELECT id, title FROM lessons 
  WHERE chapter_id = 1 AND order_index IN (2, 3, 4)
  ORDER BY order_index
)
-- Add content blocks for "Your AI Learning Journey" lesson
INSERT INTO public.content_blocks (lesson_id, type, title, content, order_index, is_visible, is_active)
SELECT id, 'text', 'Welcome to Your AI Transformation', 'As a nonprofit professional, you''re about to embark on a journey that will revolutionize how you work. AI isn''t just a buzzword—it''s a powerful ally that can amplify your impact and free up your time for what matters most: serving your mission.', 1, true, true
FROM new_lessons WHERE title = 'Your AI Learning Journey'
UNION ALL
SELECT id, 'text', 'Why AI Matters for Nonprofits', 'Nonprofits face unique challenges: limited resources, high expectations, and the constant pressure to do more with less. AI can help you overcome these challenges by automating routine tasks, providing insights from your data, and enhancing your communication with supporters.', 2, true, true
FROM new_lessons WHERE title = 'Your AI Learning Journey'
UNION ALL
SELECT id, 'text', 'What You''ll Learn', 'Throughout this program, you''ll discover practical AI tools and techniques that fit seamlessly into your nonprofit workflow. From grant writing assistance to donor communication, from program evaluation to volunteer management—AI will become your secret weapon for greater impact.', 3, true, true
FROM new_lessons WHERE title = 'Your AI Learning Journey'
UNION ALL
-- Add content blocks for "Understanding AI Assistance" lesson
SELECT id, 'text', 'What is AI Assistance?', 'AI assistance refers to artificial intelligence tools that help you complete tasks more efficiently and effectively. Think of AI as your digital teammate—one that never gets tired, works 24/7, and can process information at lightning speed.', 1, true, true
FROM new_lessons WHERE title = 'Understanding AI Assistance'
UNION ALL
SELECT id, 'text', 'Common AI Applications in Nonprofits', 'AI can help with writing compelling grant proposals, analyzing donor data to identify trends, creating engaging social media content, automating email responses, and even predicting which fundraising strategies will be most effective.', 2, true, true
FROM new_lessons WHERE title = 'Understanding AI Assistance'
UNION ALL
SELECT id, 'text', 'Getting Started with AI', 'The key to success with AI is starting small and building confidence. Begin with simple tasks like improving your writing or organizing your data, then gradually expand to more complex applications as you become comfortable with the technology.', 3, true, true
FROM new_lessons WHERE title = 'Understanding AI Assistance'
UNION ALL
-- Add content blocks for "Setting Your Learning Goals" lesson
SELECT id, 'text', 'Define Your AI Goals', 'Success with AI starts with clear objectives. What specific challenges in your nonprofit work could AI help solve? Perhaps you want to streamline your grant writing process, improve donor communication, or better analyze program outcomes.', 1, true, true
FROM new_lessons WHERE title = 'Setting Your Learning Goals'
UNION ALL
SELECT id, 'text', 'Assess Your Starting Point', 'Take a moment to honestly evaluate your current relationship with technology. Are you comfortable with new tools, or do you prefer familiar processes? Understanding your starting point helps us tailor your learning experience.', 2, true, true
FROM new_lessons WHERE title = 'Setting Your Learning Goals'
UNION ALL
SELECT id, 'text', 'Create Your Action Plan', 'By the end of this program, you''ll have a personalized roadmap for implementing AI in your nonprofit. This isn''t about replacing human connection—it''s about enhancing your ability to create meaningful change in your community.', 3, true, true
FROM new_lessons WHERE title = 'Setting Your Learning Goals';

-- Add interactive elements for each new lesson
WITH new_lessons AS (
  SELECT id, title FROM lessons 
  WHERE chapter_id = 1 AND order_index IN (2, 3, 4)
  ORDER BY order_index
)
INSERT INTO public.interactive_elements (lesson_id, type, title, content, order_index, is_visible, is_active, configuration)
SELECT id, 'lyra_chat', 'Chat with Lyra: Your AI Journey', 'Ready to explore how AI can transform your nonprofit work? I''m here to answer your questions and help you understand the possibilities ahead.', 1, true, true, '{"character": "lyra", "context": "ai_learning_journey", "initial_message": "Hi! I''m excited to help you discover how AI can amplify your nonprofit''s impact. What aspect of your work would you most like AI to help with?"}'
FROM new_lessons WHERE title = 'Your AI Learning Journey'
UNION ALL
SELECT id, 'lyra_chat', 'Chat with Lyra: AI Fundamentals', 'Let''s dive deeper into AI concepts and how they apply to your specific nonprofit context. I can help clarify any questions you have about AI assistance.', 1, true, true, '{"character": "lyra", "context": "ai_fundamentals", "initial_message": "Understanding AI doesn''t have to be complicated! What would you like to know about how AI can assist with your nonprofit work?"}'
FROM new_lessons WHERE title = 'Understanding AI Assistance'
UNION ALL
SELECT id, 'lyra_chat', 'Chat with Lyra: Goal Setting', 'Let''s work together to identify your AI learning goals and create a plan that fits your nonprofit''s unique needs and challenges.', 1, true, true, '{"character": "lyra", "context": "goal_setting", "initial_message": "I''d love to help you set meaningful AI goals for your nonprofit. What''s your biggest challenge right now that you think AI might help solve?"}'
FROM new_lessons WHERE title = 'Setting Your Learning Goals';