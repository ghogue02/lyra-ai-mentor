-- Refine Chapter 2 Interactive Components
-- Reduce to 3-4 per lesson and better integrate with storytelling

-- Clean up existing Chapter 2 interactive elements to start fresh
DELETE FROM interactive_elements WHERE lesson_id IN (5, 6, 7, 8);

-- Lesson 5 (Maya's Email Assistant) - Refined to 3 key components
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  -- Maya's core email challenge - placed right after she discovers AI
  (5, 'ai_email_composer', 'Help Maya Write the Parent Response', 'Maya just received this email from a concerned parent: "I''m worried about the new pickup procedures. My work schedule is unpredictable, and I''m afraid I won''t be able to get Marcus on time. Can you help me understand the options?" 

Help Maya craft a response that''s empathetic while clearly explaining the policy.', '{"scenario": "parent_concern", "character": "Maya Rodriguez", "context": "pickup_policy_change", "tone_goals": ["empathetic", "clear", "solution_focused"]}', 50),

  -- Maya's difficult conversation - placed after she learns about tone control
  (5, 'difficult_conversation_helper', 'Maya''s Board Chair Challenge', 'Now Maya faces her biggest test. The board chair just emailed: "Maya, I need the Q3 budget variance report by tomorrow for the executive committee meeting. I know it''s short notice, but the committee specifically requested it."

Maya doesn''t have the data compiled yet, and creating the report will take 6+ hours. Help her decline gracefully while maintaining the relationship.', '{"scenario": "impossible_deadline", "character": "Maya Rodriguez", "relationship": "board_chair", "stakes": "professional_credibility"}', 70),

  -- Maya's reflection and next steps - at the end of her journey
  (5, 'lyra_chat', 'Maya''s Coffee Chat: What''s Next?', 'Maya has mastered AI-powered email communication and wants to share her excitement with you. She''s curious about your email challenges and eager to help you apply what she''s learned.

What email situations in your nonprofit work could benefit from Maya''s new AI-powered approach?', '{"character": "Maya Rodriguez", "context": "post_transformation", "minimumEngagement": 2, "emotional_tone": "excited_and_helpful"}', 90);

-- Lesson 6 (James's Document Creation) - Refined to 4 key components  
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  -- James's grant proposal crisis - right when he''s stuck
  (6, 'document_generator', 'Help James Complete His Grant Proposal', 'It''s 10 PM and James is stuck on the "Project Impact" section for the Morrison Foundation grant. He needs to explain why butterfly habitat restoration matters for urban ecosystems, but foundation officers might not understand the science.

Help James generate an impact section that balances scientific credibility with emotional appeal.', '{"scenario": "grant_proposal", "character": "James Chen", "section": "project_impact", "audience": "foundation_officers", "challenge": "making_science_accessible"}', 40),

  -- James polishes his rough draft - after he gets unstuck  
  (6, 'document_improver', 'Polish James''s Executive Summary', 'James wrote this rough executive summary: "Our organization wants to create butterfly habitats in the city. Butterflies are important for ecosystems and we think this project would be good for the community. We need $75,000 to do this work over two years."

Help James transform this into something that would make foundation officers excited to fund the project.', '{"character": "James Chen", "document_type": "executive_summary", "improvement_focus": ["clarity", "impact", "compelling_language"], "stakes": "$75,000 butterfly habitat project"}', 60),

  -- James builds his template system - after his success
  (6, 'template_creator', 'Build James''s Success Template', 'After winning the Morrison Foundation grant, James wants to capture what worked so he can replicate it. Help him create a grant proposal template that preserves the structure and language that succeeded.', '{"character": "James Chen", "template_type": "grant_proposal", "organization": "Urban Wildlife Conservation", "success_story": "Morrison Foundation win"}', 80),

  -- James celebrates and mentors others
  (6, 'chapter_builder_agent', 'James''s Next Challenge: Build More Chapters', 'James has conquered grant writing and wants to help other nonprofit professionals transform their work. Use his success as inspiration to automatically generate complete chapters for Sofia (Communication), David (Data), Rachel (Automation), and Alex (Transformation).', '{"automation_level": "full", "inspired_by": "James Chen success", "next_characters": ["Sofia Martinez", "David Kim", "Rachel Thompson", "Alex Rivera"]}', 100);

-- Add a connection between Maya and James in their content
UPDATE content_blocks 
SET content = content || '

Meet James Chen, your fellow nonprofit professional who''s about to discover how AI transforms document creation just like you transformed email communication.'
WHERE lesson_id = 5 AND title LIKE '%Transformation%';

UPDATE content_blocks 
SET content = content || '

You''re following the same path as Maya Rodriguez, who conquered email overwhelm using AI. Now it''s your turn to master document creation.'
WHERE lesson_id = 6 AND title LIKE '%Data to Story%' OR title LIKE '%midnight%';