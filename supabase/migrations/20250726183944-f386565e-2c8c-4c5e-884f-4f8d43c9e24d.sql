-- Create interactive elements for Chapter 1

-- Lesson 1: Lyra's Welcome Chat
INSERT INTO public.interactive_elements (id, lesson_id, type, title, content, configuration, order_index, is_visible, is_active, is_gated)
VALUES (1, 1, 'lyra_chat', 'Meet Lyra', 'Have your first conversation with Lyra, your AI learning companion', '{"blockingEnabled": true, "minimumExchanges": 5, "suggested_task": "Tell Lyra about your nonprofit work and what challenges you face. Ask her about herself too!"}', 1, true, true, false)
ON CONFLICT (id) DO UPDATE SET 
  lesson_id = EXCLUDED.lesson_id,
  type = EXCLUDED.type,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  configuration = EXCLUDED.configuration,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  is_active = EXCLUDED.is_active,
  is_gated = EXCLUDED.is_gated;

-- Lesson 1: AI Personality Quiz
INSERT INTO public.interactive_elements (id, lesson_id, type, title, content, configuration, order_index, is_visible, is_active, is_gated)
VALUES (2, 1, 'ai_personality_quiz', 'Discover Your AI Communication Style', 'Take a fun quiz to learn how you naturally communicate with AI', '{"questions": [{"text": "When asking for help, I prefer to:", "options": ["Give all details upfront", "Start simple and add details", "Ask open-ended questions", "Be very specific about what I want"]}, {"text": "My ideal AI assistant would be:", "options": ["Professional and direct", "Friendly and conversational", "Creative and inspiring", "Patient and explanatory"]}, {"text": "When learning something new, I:", "options": ["Like step-by-step instructions", "Prefer to explore and discover", "Want to see examples first", "Need the big picture context"]}]}', 2, true, true, false)
ON CONFLICT (id) DO UPDATE SET 
  lesson_id = EXCLUDED.lesson_id,
  type = EXCLUDED.type,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  configuration = EXCLUDED.configuration,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  is_active = EXCLUDED.is_active,
  is_gated = EXCLUDED.is_gated;

-- Lesson 2: Personal Avatar Creator
INSERT INTO public.interactive_elements (id, lesson_id, type, title, content, configuration, order_index, is_visible, is_active, is_gated)
VALUES (3, 2, 'ai_avatar_creator', 'Create Your Nonprofit Superhero Avatar', 'Use AI to generate a personalized superhero avatar based on your nonprofit work', '{"prompts": ["A superhero representing [cause] with powers of [skill]", "A modern nonprofit leader with [superpower] abilities", "A compassionate hero fighting for [mission]"], "style_options": ["Comic book style", "Professional illustration", "Watercolor art", "Digital art"]}', 1, true, true, false)
ON CONFLICT (id) DO UPDATE SET 
  lesson_id = EXCLUDED.lesson_id,
  type = EXCLUDED.type,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  configuration = EXCLUDED.configuration,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  is_active = EXCLUDED.is_active,
  is_gated = EXCLUDED.is_gated;

-- Lesson 2: Nonprofit Motto Generator
INSERT INTO public.interactive_elements (id, lesson_id, type, title, content, configuration, order_index, is_visible, is_active, is_gated)
VALUES (4, 2, 'ai_motto_generator', 'Generate Inspiring Mottos', 'Let AI create powerful mottos for your organization', '{"prompt_template": "Create 5 inspiring mottos for a nonprofit focused on [cause] that serves [audience] with values of [values]", "examples": ["Empowering communities through education", "Building bridges, breaking barriers", "Where hope meets action"]}', 2, true, true, false)
ON CONFLICT (id) DO UPDATE SET 
  lesson_id = EXCLUDED.lesson_id,
  type = EXCLUDED.type,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  configuration = EXCLUDED.configuration,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  is_active = EXCLUDED.is_active,
  is_gated = EXCLUDED.is_gated;

-- Lesson 2: Dream Team Builder
INSERT INTO public.interactive_elements (id, lesson_id, type, title, content, configuration, order_index, is_visible, is_active, is_gated)
VALUES (5, 2, 'ai_dream_team', 'Build Your Historical Dream Team', 'Discover which historical figures would join your cause', '{"prompt_template": "Create a fun story about 3 historical figures who would be passionate about [cause] and how they would help with [mission]. Make it entertaining and inspiring!", "historical_categories": ["Leaders", "Artists", "Scientists", "Activists", "Inventors"]}', 3, true, true, false)
ON CONFLICT (id) DO UPDATE SET 
  lesson_id = EXCLUDED.lesson_id,
  type = EXCLUDED.type,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  configuration = EXCLUDED.configuration,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  is_active = EXCLUDED.is_active,
  is_gated = EXCLUDED.is_gated;

-- Lesson 3: Prompt Practice Playground
INSERT INTO public.interactive_elements (id, lesson_id, type, title, content, configuration, order_index, is_visible, is_active, is_gated)
VALUES (6, 3, 'ai_prompt_practice', 'Prompt Practice Playground', 'Practice writing effective AI prompts with real-time feedback', '{"scenarios": [{"context": "Writing a volunteer recruitment email", "bad_prompt": "Write an email", "good_prompt": "Write a warm, compelling email to recruit volunteers for our food bank, emphasizing the community impact and flexible scheduling options"}, {"context": "Creating social media content", "bad_prompt": "Make a post", "good_prompt": "Create an inspiring Instagram post about our literacy program that includes a call-to-action and uses storytelling to show impact"}]}', 1, true, true, false)
ON CONFLICT (id) DO UPDATE SET 
  lesson_id = EXCLUDED.lesson_id,
  type = EXCLUDED.type,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  configuration = EXCLUDED.configuration,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  is_active = EXCLUDED.is_active,
  is_gated = EXCLUDED.is_gated;

-- Lesson 3: AI Communication Simulator
INSERT INTO public.interactive_elements (id, lesson_id, type, title, content, configuration, order_index, is_visible, is_active, is_gated)
VALUES (7, 3, 'ai_communication_sim', 'AI Communication Simulator', 'Role-play conversations with different AI personalities', '{"personalities": [{"name": "Detail-Oriented AI", "description": "Loves specifics and comprehensive information"}, {"name": "Creative AI", "description": "Focuses on innovative and inspiring solutions"}, {"name": "Practical AI", "description": "Emphasizes actionable, realistic approaches"}], "scenarios": ["Planning a fundraising event", "Solving a volunteer retention problem", "Creating a marketing strategy"]}', 2, true, true, false)
ON CONFLICT (id) DO UPDATE SET 
  lesson_id = EXCLUDED.lesson_id,
  type = EXCLUDED.type,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  configuration = EXCLUDED.configuration,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  is_active = EXCLUDED.is_active,
  is_gated = EXCLUDED.is_gated;

-- Lesson 4: Success Visualization Generator
INSERT INTO public.interactive_elements (id, lesson_id, type, title, content, configuration, order_index, is_visible, is_active, is_gated)
VALUES (8, 4, 'ai_success_visualizer', 'Visualize Your AI-Powered Future', 'Generate an inspiring vision of your organization using AI tools', '{"prompt_template": "Create an inspiring vision statement for how [organization] will transform [community/cause] over the next year using AI tools to enhance [specific_goals]. Make it motivational and specific to their mission.", "vision_elements": ["Impact goals", "Community benefits", "Innovation opportunities", "Growth potential"]}', 1, true, true, false)
ON CONFLICT (id) DO UPDATE SET 
  lesson_id = EXCLUDED.lesson_id,
  type = EXCLUDED.type,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  configuration = EXCLUDED.configuration,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  is_active = EXCLUDED.is_active,
  is_gated = EXCLUDED.is_gated;

-- Lesson 4: Lyra's Mentorship Setup
INSERT INTO public.interactive_elements (id, lesson_id, type, title, content, configuration, order_index, is_visible, is_active, is_gated)
VALUES (9, 4, 'lyra_chat', 'Set Up Your Learning Journey', 'Have a heart-to-heart with Lyra about your learning goals and how she can best support you', '{"blockingEnabled": false, "minimumExchanges": 3, "suggested_task": "Share your learning goals with Lyra and discuss how you prefer to learn. Talk about what excites and worries you about using AI."}', 2, true, true, false)
ON CONFLICT (id) DO UPDATE SET 
  lesson_id = EXCLUDED.lesson_id,
  type = EXCLUDED.type,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  configuration = EXCLUDED.configuration,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  is_active = EXCLUDED.is_active,
  is_gated = EXCLUDED.is_gated;