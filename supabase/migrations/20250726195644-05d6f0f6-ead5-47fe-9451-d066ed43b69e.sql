-- Add 3 new lessons to Chapter 1 starting from the next available ID
INSERT INTO public.lessons (chapter_id, title, subtitle, order_index, estimated_duration, is_published) VALUES
(1, 'Your AI Learning Journey', 'Discover how AI will transform your nonprofit work', 2, 12, true),
(1, 'Understanding AI Assistance', 'Learn the fundamentals of AI-powered productivity', 3, 15, true),
(1, 'Setting Your Learning Goals', 'Define your path to AI mastery', 4, 10, true);