-- Add 3 new lessons to Chapter 1 to match Chapter 2's structure
INSERT INTO public.lessons (chapter_id, title, subtitle, order_index, estimated_duration, is_published) VALUES
(1, 'Your AI Learning Journey', 'Discover how AI will transform your nonprofit work', 2, 12, true),
(1, 'Understanding AI Assistance', 'Learn the fundamentals of AI-powered productivity', 3, 15, true),
(1, 'Setting Your Learning Goals', 'Define your path to AI mastery', 4, 10, true);

-- Add content blocks for Lesson 2: Your AI Learning Journey
INSERT INTO public.content_blocks (lesson_id, type, title, content, order_index, is_visible, is_active) VALUES
(4, 'text', 'Welcome to Your AI Transformation', 'As a nonprofit professional, you''re about to embark on a journey that will revolutionize how you work. AI isn''t just a buzzword—it''s a powerful ally that can amplify your impact and free up your time for what matters most: serving your mission.', 1, true, true),
(4, 'text', 'Why AI Matters for Nonprofits', 'Nonprofits face unique challenges: limited resources, high expectations, and the constant pressure to do more with less. AI can help you overcome these challenges by automating routine tasks, providing insights from your data, and enhancing your communication with supporters.', 2, true, true),
(4, 'text', 'What You''ll Learn', 'Throughout this program, you''ll discover practical AI tools and techniques that fit seamlessly into your nonprofit workflow. From grant writing assistance to donor communication, from program evaluation to volunteer management—AI will become your secret weapon for greater impact.', 3, true, true);

-- Add content blocks for Lesson 3: Understanding AI Assistance  
INSERT INTO public.content_blocks (lesson_id, type, title, content, order_index, is_visible, is_active) VALUES
(5, 'text', 'What is AI Assistance?', 'AI assistance refers to artificial intelligence tools that help you complete tasks more efficiently and effectively. Think of AI as your digital teammate—one that never gets tired, works 24/7, and can process information at lightning speed.', 1, true, true),
(5, 'text', 'Common AI Applications in Nonprofits', 'AI can help with writing compelling grant proposals, analyzing donor data to identify trends, creating engaging social media content, automating email responses, and even predicting which fundraising strategies will be most effective.', 2, true, true),
(5, 'text', 'Getting Started with AI', 'The key to success with AI is starting small and building confidence. Begin with simple tasks like improving your writing or organizing your data, then gradually expand to more complex applications as you become comfortable with the technology.', 3, true, true);

-- Add content blocks for Lesson 4: Setting Your Learning Goals
INSERT INTO public.content_blocks (lesson_id, type, title, content, order_index, is_visible, is_active) VALUES
(6, 'text', 'Define Your AI Goals', 'Success with AI starts with clear objectives. What specific challenges in your nonprofit work could AI help solve? Perhaps you want to streamline your grant writing process, improve donor communication, or better analyze program outcomes.', 1, true, true),
(6, 'text', 'Assess Your Starting Point', 'Take a moment to honestly evaluate your current relationship with technology. Are you comfortable with new tools, or do you prefer familiar processes? Understanding your starting point helps us tailor your learning experience.', 2, true, true),
(6, 'text', 'Create Your Action Plan', 'By the end of this program, you''ll have a personalized roadmap for implementing AI in your nonprofit. This isn''t about replacing human connection—it''s about enhancing your ability to create meaningful change in your community.', 3, true, true);

-- Add interactive elements for each lesson
INSERT INTO public.interactive_elements (lesson_id, type, title, content, order_index, is_visible, is_active, configuration) VALUES
(4, 'lyra_chat', 'Chat with Lyra: Your AI Journey', 'Ready to explore how AI can transform your nonprofit work? I''m here to answer your questions and help you understand the possibilities ahead.', 1, true, true, '{"character": "lyra", "context": "ai_learning_journey", "initial_message": "Hi! I''m excited to help you discover how AI can amplify your nonprofit''s impact. What aspect of your work would you most like AI to help with?"}'),
(5, 'lyra_chat', 'Chat with Lyra: AI Fundamentals', 'Let''s dive deeper into AI concepts and how they apply to your specific nonprofit context. I can help clarify any questions you have about AI assistance.', 1, true, true, '{"character": "lyra", "context": "ai_fundamentals", "initial_message": "Understanding AI doesn''t have to be complicated! What would you like to know about how AI can assist with your nonprofit work?"}'),
(6, 'lyra_chat', 'Chat with Lyra: Goal Setting', 'Let''s work together to identify your AI learning goals and create a plan that fits your nonprofit''s unique needs and challenges.', 1, true, true, '{"character": "lyra", "context": "goal_setting", "initial_message": "I''d love to help you set meaningful AI goals for your nonprofit. What''s your biggest challenge right now that you think AI might help solve?"}');