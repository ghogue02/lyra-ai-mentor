-- Update Chapter 2 from "AI in Fundraising" to "AI for Your Daily Work"

-- 1. Delete existing content for Chapter 2
DELETE FROM interactive_elements WHERE lesson_id IN (SELECT id FROM lessons WHERE chapter_id = 2);
DELETE FROM content_blocks WHERE lesson_id IN (SELECT id FROM lessons WHERE chapter_id = 2);
DELETE FROM lessons WHERE chapter_id = 2;

-- 2. Update Chapter 2 details
UPDATE chapters 
SET 
  title = 'AI for Your Daily Work',
  description = 'Transform everyday tasks with universal workflow wins for all non-profit workers',
  icon = 'briefcase',
  duration = '82 min'
WHERE id = 2;

-- 3. Insert new Lessons for Chapter 2
INSERT INTO lessons (id, chapter_id, title, subtitle, order_index, estimated_duration, is_published)
VALUES
  (5, 2, 'AI Email Assistant', 'Write professional emails 3x faster', 10, 20, TRUE),
  (6, 2, 'Document Creation Powerhouse', 'Reports and proposals with AI help', 20, 22, TRUE),
  (7, 2, 'Meeting Master', 'Prep, facilitate, and follow up with AI', 30, 20, TRUE),
  (8, 2, 'Research & Organization Pro', 'Gather info and stay organized', 40, 20, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Content Blocks for Lesson 5 (AI Email Assistant)
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (5, 'text', 'Welcome to Your AI Email Assistant', 'Everyone spends too much time writing emails and worrying if they sound professional. In this lesson, you''ll learn how AI can help you write better emails faster, handle difficult conversations with grace, and follow up consistently.', '{"version": "1.0"}', 10),
  (5, 'text', 'The Challenge: Email Overload', 'Non-profit workers send dozens of emails daily - to donors, volunteers, beneficiaries, board members, and colleagues. Each requires the right tone, clarity, and professionalism. AI can help you craft these messages in minutes instead of hours.', '{"version": "1.0"}', 20),
  (5, 'callout_box', 'Time Saved', 'Studies show that professionals spend 28% of their workday on email. AI tools can reduce this by 50% or more while improving the quality of your communications.', '{"type": "info"}', 30),
  (5, 'text', 'AI Email Tools You''ll Master', 'We''ll explore four essential email tools: the Email Composer for different tones, the Email Responder for quick replies, the Difficult Conversation Helper for challenging messages, and the Follow-up Generator for meeting summaries and action items.', '{"version": "1.0"}', 40),
  (5, 'interactive_element_placeholder', 'Email Composer Demo', 'Interactive email composer for different situations', '{}', 50),
  (5, 'text', 'Professional Tone Variations', 'AI can help you adjust your tone for different audiences. A message to your board chair requires a different approach than an email to a program volunteer. Learn to specify tone requirements: formal, friendly, urgent, or empathetic.', '{"version": "1.0"}', 60),
  (5, 'reflection', 'Your Email Challenges', 'Think about the types of emails that take you the longest to write. Are they fundraising appeals? Volunteer coordination? Board updates? Identifying your pain points helps you use AI more effectively.', '{"prompt": "What types of emails take you the longest to write?", "placeholderText": "For me, it''s usually...", "minLength": 30}', 70),
  (5, 'text', 'Best Practices for AI Email Writing', 'Remember: AI is your assistant, not your replacement. Always review AI-generated emails for accuracy, add personal touches, and ensure they align with your organization''s voice and values.', '{"version": "1.0"}', 80)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Interactive Elements for Lesson 5
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (5, 'ai_email_composer', 'Practice: Write a Professional Email', 'Use AI to compose an email informing your team about a program update. Practice adjusting tone and clarity.', '{"scenarios": ["program_update", "donor_thank_you", "volunteer_recruitment"], "toneOptions": ["professional", "friendly", "urgent"]}', 90),
  (5, 'difficult_conversation_helper', 'Handle a Challenging Email', 'Practice writing an email declining a partnership request while maintaining a positive relationship.', '{"scenarioType": "decline_request", "guidelines": ["be_respectful", "offer_alternatives", "keep_door_open"]}', 100),
  (5, 'lyra_chat', 'Email Writing Workshop', 'Let''s practice writing emails for different situations in your organization. What type of email do you find most challenging?', '{"minimumEngagement": 3, "blockingEnabled": false, "chatType": "persistent"}', 110),
  (5, 'knowledge_check', 'Email Best Practices', 'What should you always do after AI generates an email for you?', '{"question": "What should you always do after AI generates an email?", "options": ["Send it immediately", "Review and personalize it", "Forward to a colleague", "Save as a template"], "correctAnswer": 1, "explanation": "Always review AI-generated content to ensure accuracy and add personal touches."}', 120)
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Content Blocks for Lesson 6 (Document Creation Powerhouse)
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (6, 'text', 'Transform Your Document Creation Process', 'Creating reports, proposals, and documents doesn''t have to be overwhelming. AI can help you generate first drafts, improve existing text, and create reusable templates that save hours of work.', '{"version": "1.0"}', 10),
  (6, 'text', 'Common Document Challenges', 'Non-profit workers create countless documents: grant reports, board presentations, program proposals, impact assessments, and more. Each requires clear structure, compelling content, and professional presentation.', '{"version": "1.0"}', 20),
  (6, 'callout_box', 'Document Creation Stats', 'The average non-profit worker spends 20+ hours per month on reports and proposals. AI can reduce this by 60% while improving document quality and consistency.', '{"type": "info"}', 30),
  (6, 'text', 'Your AI Document Toolkit', 'Master four powerful tools: the Report Generator for structured documents, the Proposal Creator for compelling requests, the Document Improver for polishing drafts, and the Template Generator for reusable formats.', '{"version": "1.0"}', 40),
  (6, 'interactive_element_placeholder', 'Report Generator Demo', 'Create a professional program report with AI assistance', '{}', 50),
  (6, 'text', 'Structure and Flow', 'AI excels at creating logical document structures. Start with an outline, then let AI help fill in each section. This approach ensures comprehensive coverage while maintaining narrative flow.', '{"version": "1.0"}', 60),
  (6, 'text', 'Making Data Compelling', 'Transform dry statistics into compelling narratives. AI can help you present program outcomes, financial data, and impact metrics in ways that resonate with your audience.', '{"version": "1.0"}', 70),
  (6, 'reflection', 'Document Pain Points', 'Which documents take the most time in your role? Grant reports? Board presentations? Program proposals? Understanding your needs helps you leverage AI most effectively.', '{"prompt": "What type of document takes you the longest to create?", "placeholderText": "I struggle most with...", "minLength": 30}', 80)
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Interactive Elements for Lesson 6
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (6, 'report_generator', 'Create a Monthly Program Report', 'Use AI to generate a comprehensive monthly report including achievements, challenges, and next steps.', '{"reportType": "monthly_program", "sections": ["executive_summary", "achievements", "challenges", "metrics", "next_steps"]}', 90),
  (6, 'document_improver', 'Polish Your Draft', 'Take a rough draft and use AI to make it more professional, clear, and compelling.', '{"improvementOptions": ["clarity", "conciseness", "professionalism", "impact"]}', 100),
  (6, 'template_creator', 'Build a Reusable Template', 'Create a meeting summary template you can use repeatedly, saving time on routine documentation.', '{"templateType": "meeting_summary", "customFields": ["date", "attendees", "key_decisions", "action_items"]}', 110),
  (6, 'lyra_chat', 'Document Creation Strategy', 'Let''s outline your next important document together. What are you working on that could benefit from AI assistance?', '{"minimumEngagement": 2, "blockingEnabled": false, "chatType": "persistent"}', 120)
ON CONFLICT (id) DO NOTHING;

-- 8. Insert Content Blocks for Lesson 7 (Meeting Master)
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (7, 'text', 'Make Every Meeting Count', 'Meetings are essential but often unproductive. AI can help you prepare better agendas, capture key decisions, and ensure consistent follow-up - transforming meetings from time drains into productivity boosters.', '{"version": "1.0"}', 10),
  (7, 'text', 'The Meeting Challenge', 'Non-profit teams juggle board meetings, staff meetings, volunteer orientations, and stakeholder consultations. Without proper preparation and follow-up, these meetings can waste valuable time and resources.', '{"version": "1.0"}', 20),
  (7, 'callout_box', 'Meeting Impact', 'Well-run meetings with clear agendas and follow-up can improve team productivity by 30%. AI tools make this level of organization achievable for every meeting.', '{"type": "success"}', 30),
  (7, 'text', 'AI Meeting Tools', 'Learn to use the Agenda Creator for structured planning, the Meeting Prep Assistant for talking points, the Summary Generator for action items, and the Scheduling Helper for coordination.', '{"version": "1.0"}', 40),
  (7, 'interactive_element_placeholder', 'Agenda Creator Demo', 'Build a structured agenda for your next team meeting', '{}', 50),
  (7, 'text', 'Preparation is Key', 'Use AI to research topics, prepare talking points, and anticipate questions. Walking into a meeting well-prepared dramatically improves outcomes and demonstrates professionalism.', '{"version": "1.0"}', 60),
  (7, 'text', 'Capturing and Sharing Outcomes', 'The real value of meetings comes from clear action items and follow-through. AI helps you transform messy notes into structured summaries that drive accountability.', '{"version": "1.0"}', 70)
ON CONFLICT (id) DO NOTHING;

-- 9. Insert Interactive Elements for Lesson 7
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (7, 'agenda_creator', 'Build a Team Meeting Agenda', 'Create a structured agenda with time allocations for an important upcoming meeting.', '{"meetingTypes": ["team_meeting", "board_meeting", "volunteer_orientation"], "timeAllocation": true}', 80),
  (7, 'meeting_prep_assistant', 'Prepare for a Board Conversation', 'Get AI help preparing talking points and anticipating questions for a board chair meeting.', '{"scenarioType": "board_chair_update", "prepElements": ["key_points", "anticipated_questions", "supporting_data"]}', 90),
  (7, 'summary_generator', 'Transform Meeting Notes', 'Convert rough meeting notes into a clear summary with action items and deadlines.', '{"inputType": "rough_notes", "outputElements": ["key_decisions", "action_items", "deadlines", "next_steps"]}', 100),
  (7, 'reflection', 'Meeting Effectiveness', 'How could better meeting preparation and follow-up impact your work? What would you do with the time saved?', '{"prompt": "How would better meetings impact your organization?", "placeholderText": "If our meetings were more effective...", "minLength": 40}', 110)
ON CONFLICT (id) DO NOTHING;

-- 10. Insert Content Blocks for Lesson 8 (Research & Organization Pro)
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (8, 'text', 'Master Information Management', 'Finding reliable information quickly and staying organized are crucial skills. AI can help you research effectively, summarize complex information, prioritize tasks, and plan projects systematically.', '{"version": "1.0"}', 10),
  (8, 'text', 'The Information Overload Problem', 'Non-profit workers navigate grant guidelines, best practices research, policy updates, and sector trends. Without good systems, important information gets lost and decisions lack proper foundation.', '{"version": "1.0"}', 20),
  (8, 'callout_box', 'Research Efficiency', 'AI-powered research tools can reduce information gathering time by 70% while improving the quality and reliability of sources.', '{"type": "info"}', 30),
  (8, 'text', 'Your Research & Organization Toolkit', 'Master the Research Assistant for gathering information, the Information Summarizer for distilling insights, the Task Prioritizer for managing workload, and the Project Planner for complex initiatives.', '{"version": "1.0"}', 40),
  (8, 'interactive_element_placeholder', 'Research Assistant Demo', 'Research best practices for a program challenge', '{}', 50),
  (8, 'text', 'Smart Information Gathering', 'Learn to craft effective research queries, verify source credibility, and synthesize findings from multiple sources. AI helps you work like a professional researcher.', '{"version": "1.0"}', 60),
  (8, 'text', 'From Chaos to Clarity', 'Transform overwhelming to-do lists and complex projects into manageable action plans. AI helps you identify priorities, break down large tasks, and maintain momentum.', '{"version": "1.0"}', 70),
  (8, 'text', 'Building Sustainable Systems', 'The goal isn''t just to organize once, but to create systems that keep you organized. AI helps you develop workflows that prevent future overwhelm.', '{"version": "1.0"}', 80)
ON CONFLICT (id) DO NOTHING;

-- 11. Insert Interactive Elements for Lesson 8
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (8, 'research_assistant', 'Research Program Best Practices', 'Use AI to research evidence-based approaches for a challenge in your programs.', '{"researchTypes": ["best_practices", "case_studies", "academic_research"], "sourceVerification": true}', 90),
  (8, 'information_summarizer', 'Distill a Complex Report', 'Take a lengthy document and create a concise, actionable summary for your team.', '{"summaryLengths": ["1_page", "executive_summary", "bullet_points"], "focusAreas": ["key_findings", "recommendations", "action_items"]}', 100),
  (8, 'task_prioritizer', 'Organize Your Workload', 'Transform an overwhelming to-do list into a prioritized action plan using AI analysis.', '{"priorityFactors": ["urgency", "impact", "effort"], "timeframes": ["today", "this_week", "this_month"]}', 110),
  (8, 'project_planner', 'Plan a Complex Initiative', 'Break down a major project into phases, milestones, and specific tasks.', '{"projectTypes": ["event_planning", "program_launch", "campaign_development"], "planningElements": ["phases", "milestones", "dependencies", "timelines"]}', 120),
  (8, 'lyra_chat', 'Your Organization Challenge', 'What organizational or research challenge should we tackle first? I can help you create a plan to address it systematically.', '{"minimumEngagement": 3, "blockingEnabled": false, "chatType": "persistent"}', 130)
ON CONFLICT (id) DO NOTHING;

-- 12. Add a completion reflection for the entire chapter
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (8, 'reflection', 'Chapter 2 Complete!', 'You''ve learned to use AI for emails, documents, meetings, and research. Which tool will have the biggest immediate impact on your daily work? Set a goal to implement it this week.', '{"prompt": "Which AI tool from this chapter will you implement first?", "placeholderText": "I''m most excited to start using...", "minLength": 50}', 140)
ON CONFLICT (id) DO NOTHING;