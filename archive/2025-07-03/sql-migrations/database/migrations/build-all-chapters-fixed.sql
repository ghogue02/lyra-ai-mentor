-- COMPLETE CHAPTERS 2-6 BUILD (FIXED QUOTES)
-- Run this single file to deploy all chapter content

-- ================================
-- CHAPTER 2 REFINEMENT 
-- ================================

-- Clean up existing Chapter 2 interactive elements
DELETE FROM interactive_elements WHERE lesson_id IN (5, 6, 7, 8);

-- Lesson 5 (Maya's Email Assistant) - 3 key components integrated with story
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  -- Maya's parent email challenge
  (5, 'ai_email_composer', 'Help Maya Write the Parent Response', 
   'Maya just received this email from a concerned parent: I am worried about the new pickup procedures. My work schedule is unpredictable, and I am afraid I will not be able to get Marcus on time. Can you help me understand the options?

Maya wants to respond with empathy while clearly explaining the policy. Help her craft the perfect response.', 
   '{"scenario": "parent_concern", "character": "Maya Rodriguez", "context": "pickup_policy_change", "tone_goals": ["empathetic", "clear", "solution_focused"]}', 50),

  -- Maya's board chair challenge
  (5, 'difficult_conversation_helper', 'Maya''s Board Chair Challenge', 
   'Now Maya faces her biggest test. The board chair just emailed: Maya, I need the Q3 budget variance report by tomorrow for the executive committee meeting. I know it is short notice, but the committee specifically requested it.

Maya does not have the data compiled yet, and creating the report will take 6+ hours. Help her decline gracefully while maintaining the relationship.', 
   '{"scenario": "impossible_deadline", "character": "Maya Rodriguez", "relationship": "board_chair", "stakes": "professional_credibility"}', 70),

  -- Maya's reflection and mentoring
  (5, 'lyra_chat', 'Maya''s Coffee Chat: What''s Next?', 
   'Maya has mastered AI-powered email communication and wants to share her excitement with you. She is curious about your email challenges and eager to help you apply what she has learned.

What email situations in your nonprofit work could benefit from Maya''s new AI-powered approach?', 
   '{"character": "Maya Rodriguez", "context": "post_transformation", "minimumEngagement": 2, "emotional_tone": "excited_and_helpful"}', 90);

-- Lesson 6 (James's Document Creation) - 4 key components integrated with story
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  -- James's grant proposal crisis
  (6, 'document_generator', 'Help James Complete His Grant Proposal', 
   'It is 10 PM and James is stuck on the Project Impact section for the Morrison Foundation grant. He needs to explain why butterfly habitat restoration matters for urban ecosystems, but foundation officers might not understand the science.

Help James generate an impact section that balances scientific credibility with emotional appeal.', 
   '{"scenario": "grant_proposal", "character": "James Chen", "section": "project_impact", "audience": "foundation_officers", "challenge": "making_science_accessible"}', 40),

  -- James polishes his rough draft
  (6, 'document_improver', 'Polish James''s Executive Summary', 
   'James wrote this rough executive summary: Our organization wants to create butterfly habitats in the city. Butterflies are important for ecosystems and we think this project would be good for the community. We need $75,000 to do this work over two years.

Help James transform this into something that would make foundation officers excited to fund the project.', 
   '{"character": "James Chen", "document_type": "executive_summary", "improvement_focus": ["clarity", "impact", "compelling_language"], "stakes": "$75,000 butterfly habitat project"}', 60),

  -- James builds his template system
  (6, 'template_creator', 'Build James''s Success Template', 
   'After winning the Morrison Foundation grant, James wants to capture what worked so he can replicate it. Help him create a grant proposal template that preserves the structure and language that succeeded.', 
   '{"character": "James Chen", "template_type": "grant_proposal", "organization": "Urban Wildlife Conservation", "success_story": "Morrison Foundation win"}', 80),

  -- James celebrates and mentors others
  (6, 'chapter_builder_agent', 'James''s Next Challenge: Build More Chapters', 
   'James has conquered grant writing and wants to help other nonprofit professionals transform their work. Use his success as inspiration to automatically generate complete chapters for Sofia (Communication), David (Data), Rachel (Automation), and Alex (Transformation).', 
   '{"automation_level": "full", "inspired_by": "James Chen success", "next_characters": ["Sofia Martinez", "David Kim", "Rachel Thompson", "Alex Rivera"]}', 100);

-- ================================
-- CHAPTER 3: SOFIA MARTINEZ 
-- ================================

-- Clean up any existing Chapter 3 content
DELETE FROM interactive_elements WHERE lesson_id IN (
    SELECT id FROM lessons WHERE chapter_id = 3
);
DELETE FROM content_blocks WHERE lesson_id IN (
    SELECT id FROM lessons WHERE chapter_id = 3
);
DELETE FROM lessons WHERE chapter_id = 3;

-- Update Chapter 3 with rich description
UPDATE chapters 
SET title = 'Communication & Storytelling',
    description = 'Join Sofia Martinez as she transforms her nonprofit communication from overlooked to unforgettable using AI-powered storytelling techniques',
    duration = '85 min',
    is_published = true
WHERE id = 3;

-- Create Chapter 3 lessons
INSERT INTO lessons (id, chapter_id, title, subtitle, order_index, estimated_duration, is_published)
VALUES
  (11, 3, 'The Silent Crisis', 'Sofia discovers why her donor communications are not working', 10, 20, true),
  (12, 3, 'Finding Her Voice', 'Sofia learns the power of AI-enhanced storytelling', 20, 22, true),
  (13, 3, 'The Breakthrough Story', 'Sofia creates her first compelling donor narrative', 30, 23, true),
  (14, 3, 'Scaling Impact', 'Sofia builds a storytelling system that transforms everything', 40, 20, true);

-- Chapter 3 Content and Interactive Elements
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (11, 'text_block', 'Sofia''s Frustration', 'Sofia Martinez stares at her computer screen at 8:47 PM, surrounded by empty coffee cups and crumpled printouts. As Communications Director for Riverside Animal Rescue, she has been crafting the perfect donor newsletter for three weeks. The rescue desperately needs $50,000 for a new medical wing, but their last three fundraising campaigns fell flat.

Same old stories, same disappointing results, Sofia mutters, scrolling through their donor database. Open rates: 12%. Click-through rates: 2%. Donations: barely enough to cover postage. Meanwhile, other nonprofits seem to effortlessly capture hearts and wallets with their communications.

Sofia knows their work saving abandoned animals is incredible – last month alone they rescued 47 dogs from a puppy mill operation. So why can''t she make people care enough to give?', '{}', 10);

INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (11, 'ai_content_generator', 'Analyze Sofia''s Struggling Email', 'Sofia needs your help analyzing why her donor email is not working. Read her current draft and identify what is preventing it from connecting with donors emotionally.

Current draft: Dear Supporter, Our Q3 statistics show significant progress. We rescued 47 animals, achieved a 94% adoption rate, and expanded our volunteer program by 23%. Your continued support enables these operational improvements. Please consider increasing your donation to help us maintain this trajectory.

What would make this more compelling?', '{"scenario": "email_analysis", "character": "Sofia Martinez", "focus": "emotional_connection"}', 35);

-- ================================
-- CHAPTER 4: DAVID KIM 
-- ================================

-- Clean up any existing Chapter 4 content  
DELETE FROM interactive_elements WHERE lesson_id IN (
    SELECT id FROM lessons WHERE chapter_id = 4
);
DELETE FROM content_blocks WHERE lesson_id IN (
    SELECT id FROM lessons WHERE chapter_id = 4
);
DELETE FROM lessons WHERE chapter_id = 4;

-- Update Chapter 4 with rich description
UPDATE chapters 
SET title = 'Data & Decision Making',
    description = 'Follow David Kim as he transforms overwhelming spreadsheets into compelling narratives that drive funding and strategic decisions',
    duration = '92 min',
    is_published = true
WHERE id = 4;

-- Create Chapter 4 lessons
INSERT INTO lessons (id, chapter_id, title, subtitle, order_index, estimated_duration, is_published)
VALUES
  (15, 4, 'The Data Graveyard', 'David discovers why his perfect data presentations fall flat', 10, 23, true),
  (16, 4, 'Finding the Story in Numbers', 'David learns to transform statistics into narratives', 20, 24, true),
  (17, 4, 'The Million-Dollar Presentation', 'David creates his first data-driven compelling case', 30, 25, true),
  (18, 4, 'Building the Data Storytelling System', 'David scales his approach to transform organizational decision-making', 40, 20, true);

INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (15, 'text_block', 'David''s Dilemma', 'David Kim adjusts his glasses and clicks to slide 47 of his quarterly presentation. The Metro Data Alliance boardroom is silent except for the hum of the projector and occasional paper shuffling. Three foundation officers stare at his meticulously crafted charts showing the 34% improvement in youth employment outcomes from their job training program.

Any questions? David asks hopefully. The silence stretches. Finally, Jennifer from the Morrison Foundation speaks: This is... very thorough, David. We will review your materials and get back to you.

David knows that tone. It is the same polite dismissal he has heard from twelve funders this year. His data is bulletproof – randomized controlled trials, longitudinal tracking, statistical significance tests that would make any researcher proud. Yet somehow, his perfect presentations consistently fail to secure the funding their proven programs desperately need.', '{}', 10);

-- ================================
-- CHAPTER 5: RACHEL THOMPSON 
-- ================================

-- Clean up any existing Chapter 5 content
DELETE FROM interactive_elements WHERE lesson_id IN (
    SELECT id FROM lessons WHERE chapter_id = 5
);
DELETE FROM content_blocks WHERE lesson_id IN (
    SELECT id FROM lessons WHERE chapter_id = 5
);
DELETE FROM lessons WHERE chapter_id = 5;

-- Update Chapter 5 with rich description
UPDATE chapters 
SET title = 'Automation & Efficiency',
    description = 'Join Rachel Thompson as she transforms automation from cold technology into systems that amplify human connection and mission impact',
    duration = '95 min',
    is_published = true
WHERE id = 5;

-- Create Chapter 5 lessons  
INSERT INTO lessons (id, chapter_id, title, subtitle, order_index, estimated_duration, is_published)
VALUES
  (19, 5, 'The Misunderstood Systems Builder', 'Rachel faces board criticism for prioritizing technology over people', 10, 25, true),
  (20, 5, 'Discovering Human-Centered Automation', 'Rachel learns to see technology as mission amplification', 20, 24, true),
  (21, 5, 'The Transformation Story', 'Rachel demonstrates how automation creates more time for human connection', 30, 26, true),
  (22, 5, 'Building the Automation Ecosystem', 'Rachel scales her approach to transform organizational capacity', 40, 20, true);

INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (19, 'text_block', 'Rachel''s Passion Project Under Fire', 'Rachel Thompson sits in the Harmony Community Center boardroom, watching twelve pairs of eyes stare skeptically at her laptop screen. She has spent six months building an integrated automation system that has revolutionized their operations: volunteer scheduling that reduced coordination time from 8 hours to 45 minutes weekly, donor management that automatically tracks engagement and suggests optimal contact timing, and program registration that eliminated the three-day processing backlog.

Rachel, these systems are impressive, board chair Margaret Chen says carefully, but we are concerned you have lost sight of our mission. Community centers are about human connection, not technological efficiency.

Rachel''s heart sinks. She has saved the organization 40 hours per week of administrative work – time their small staff can now spend on direct client services. But looking at her dashboard-heavy presentation, she realizes how her message appears: cold, impersonal, focused on metrics rather than mission.', '{}', 10);

-- ================================
-- CHAPTER 6: ALEX RIVERA 
-- ================================

-- Clean up any existing Chapter 6 content
DELETE FROM interactive_elements WHERE lesson_id IN (
    SELECT id FROM lessons WHERE chapter_id = 6
);
DELETE FROM content_blocks WHERE lesson_id IN (
    SELECT id FROM lessons WHERE chapter_id = 6
);
DELETE FROM lessons WHERE chapter_id = 6;

-- Update Chapter 6 with rich description
UPDATE chapters 
SET title = 'Organizational Transformation',
    description = 'Follow Alex Rivera as they navigate the complex challenge of transforming a social justice organization through ethical AI adoption while maintaining core values',
    duration = '100 min',
    is_published = true
WHERE id = 6;

-- Create Chapter 6 lessons
INSERT INTO lessons (id, chapter_id, title, subtitle, order_index, estimated_duration, is_published)
VALUES
  (23, 6, 'The Great Divide', 'Alex faces organizational resistance to AI adoption in social justice work', 10, 27, true),
  (24, 6, 'Building the Vision', 'Alex learns to bridge technology and values using insights from expert mentors', 20, 26, true),
  (25, 6, 'The Transformation Strategy', 'Alex implements a comprehensive change management approach', 30, 25, true),
  (26, 6, 'Leading the Future', 'Alex scales ethical AI adoption across the nonprofit sector', 40, 22, true);

INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (23, 'text_block', 'Alex''s Impossible Choice', 'Alex Rivera stares at the flip chart covering the conference room wall at Citywide Coalition for Change, where two columns of staff concerns create a stark divide. AI Opportunities lists powerful possibilities: automated research for policy advocacy, predictive modeling for organizing campaigns, AI-assisted grant writing to fund expansion. AI Threats reveals deeper fears: surveillance technologies targeting their communities, algorithmic bias reinforcing systemic oppression, corporate tools that could compromise grassroots authenticity.

We are fighting systems that increasingly use AI against the people we serve, argues organizing director Carmen Santos. Adopting these same tools feels like collaboration with oppression.

Policy researcher Marcus Kim counters: While we debate ethics, well-funded opposition groups are using AI to suppress voting, spread disinformation, and target our communities. We are bringing knives to a gunfight.', '{}', 10);

-- Add some key interactive elements for each chapter
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  -- Chapter 3 key interactive elements
  (12, 'ai_content_generator', 'Help Sofia Rewrite Charlie''s Story', 'Sofia wants to transform Charlie''s story from a basic adoption update into a compelling donor narrative. Help her apply the storytelling framework to create something that will make donors feel the impact of their support.

Basic facts: Charlie, 13-year-old beagle, surrendered when owner moved to care facility, was depressed for 2 weeks, matched with retired teacher Margaret who needed companionship.', '{"scenario": "story_transformation", "character": "Sofia Martinez", "framework": "problem_intervention_resolution_impact"}', 35),

  -- Chapter 4 key interactive elements  
  (16, 'data_storyteller', 'Help David Transform Marcus''s Data', 'David has Marcus''s raw data points but needs to transform them into a compelling narrative that demonstrates both individual impact and systematic effectiveness. Help him weave together personal story with supporting statistics.

Marcus''s data: Age 19, homeless for 4 months, completed 6-month automotive program, hired as apprentice mechanic, $45,000 starting salary, part of 78% job placement rate, 89% retention rate.', '{"scenario": "data_to_story", "character": "David Kim", "participant": "Marcus Williams", "program": "youth_employment"}', 35),

  -- Chapter 5 key interactive elements
  (20, 'data_storyteller', 'Rachel''s Human-Centered Automation Stories', 'Help Rachel transform her efficiency metrics into human impact narratives. Focus on how her volunteer scheduling system created space for Tom''s coffee chat program and Mrs. Patterson''s family reunion.

System data: Volunteer scheduling saves 8 hours/week, Tom started coffee chat program, Mrs. Patterson reconnected with daughter, 15 seniors attend weekly, reduced isolation measurably improved.', '{"scenario": "automation_to_human_impact", "character": "Rachel Thompson", "focus": "relationship_building_enabled_by_efficiency"}', 35),

  -- Chapter 6 key interactive elements
  (24, 'ai_governance_builder', 'Alex''s Justice-Centered AI Framework', 'Help Alex develop a comprehensive governance framework for evaluating AI tools against social justice values. Include decision-making criteria, community feedback mechanisms, and accountability measures that ensure AI adoption advances rather than compromises their mission.', '{"character": "Alex Rivera", "framework_type": "justice_centered_ai_governance", "evaluation_criteria": ["community_amplification", "transparency", "human_centered_design", "justice_alignment"]}', 35);

-- Add Database Debugger if not already exists
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
SELECT 6, 'database_debugger', 'Database Debugger', 'This debugging tool shows exactly what chapters exist in the database and can clean up duplicates. Use this to understand why duplicates are appearing on the dashboard and fix them directly.', '{"debug_mode": true, "show_raw_data": true, "cleanup_enabled": true}', 25
WHERE NOT EXISTS (
    SELECT 1 FROM interactive_elements WHERE lesson_id = 6 AND type = 'database_debugger'
);