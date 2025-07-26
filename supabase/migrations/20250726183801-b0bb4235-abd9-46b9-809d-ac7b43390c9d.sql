-- Create Chapter 1 and its lessons
INSERT INTO public.chapters (id, title, description, duration_minutes, icon, order_index, is_visible, is_active)
VALUES (1, 'Meet Lyra, Your AI Learning Companion', 'Discover how Lyra, your AI mentor, can transform your nonprofit work through personalized guidance and real-time assistance', 65, 'user-check', 1, true, true)
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  duration_minutes = EXCLUDED.duration_minutes,
  icon = EXCLUDED.icon,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  is_active = EXCLUDED.is_active;

-- Create Lesson 1: "Hello, I'm Lyra!"
INSERT INTO public.lessons (id, chapter_id, title, subtitle, estimated_duration, order_index, is_visible, is_active)
VALUES (1, 1, 'Hello, I''m Lyra!', 'Your personal AI guide to nonprofit transformation', 15, 1, true, true)
ON CONFLICT (id) DO UPDATE SET 
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  estimated_duration = EXCLUDED.estimated_duration,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  is_active = EXCLUDED.is_active;

-- Create Lesson 2: "Let's Create Something Fun Together!"
INSERT INTO public.lessons (id, chapter_id, title, subtitle, estimated_duration, order_index, is_visible, is_active)
VALUES (2, 1, 'Let''s Create Something Fun Together!', 'Build confidence through fun AI creation experiences', 18, 2, true, true)
ON CONFLICT (id) DO UPDATE SET 
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  estimated_duration = EXCLUDED.estimated_duration,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  is_active = EXCLUDED.is_active;

-- Create Lesson 3: "How to Talk to AI (And Get What You Want)"
INSERT INTO public.lessons (id, chapter_id, title, subtitle, estimated_duration, order_index, is_visible, is_active)
VALUES (3, 1, 'How to Talk to AI (And Get What You Want)', 'Master effective AI communication through guided practice', 20, 3, true, true)
ON CONFLICT (id) DO UPDATE SET 
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  estimated_duration = EXCLUDED.estimated_duration,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  is_active = EXCLUDED.is_active;

-- Create Lesson 4: "Your AI Journey Starts Now"
INSERT INTO public.lessons (id, chapter_id, title, subtitle, estimated_duration, order_index, is_visible, is_active)
VALUES (4, 1, 'Your AI Journey Starts Now', 'Set up your personalized learning path with Lyra''s guidance', 12, 4, true, true)
ON CONFLICT (id) DO UPDATE SET 
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  estimated_duration = EXCLUDED.estimated_duration,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  is_active = EXCLUDED.is_active;