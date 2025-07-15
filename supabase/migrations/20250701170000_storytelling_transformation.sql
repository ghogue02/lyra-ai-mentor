-- Chapter 2 DreamWorks Storytelling Redesign
-- Transform thin content into engaging narrative with characters Maya & James

-- Replace existing content blocks with story-rich versions
-- Lesson 5: AI Email Assistant - Maya's Email Transformation Story

-- Delete existing content blocks for Lesson 5
DELETE FROM content_blocks WHERE lesson_id = 5;

-- Insert new story-rich content blocks for Lesson 5
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (5, 'text', 'Maya''s Monday Morning Email Crisis', 'Maya Rodriguez stares at her computer screen, her Monday morning coffee growing cold beside a stack of permission slips. It''s 7:30 AM, and she already has 47 unread emails. As Program Director at Hope Gardens Community Center, Maya knows that somewhere in this digital pile are messages that could make or break her week: a parent complaint about new pickup procedures, a board member asking for "urgent" budget details, and probably another volunteer cancellation for the summer camp she''s desperately trying to staff.

This wasn''t what Maya imagined when she left teaching to "make a bigger impact" in nonprofit work. She thought she''d spend her days with kids and families, not wrestling with email anxiety at dawn. But here''s the thing Maya doesn''t know yet: today is about to change everything.', '{"version": "1.0", "character": "Maya Rodriguez", "narrative_function": "Hook and character establishment"}', 10),

  (5, 'text', 'The Hidden Cost of Email Overwhelm', 'Maya''s story isn''t unique. Across the nonprofit sector, passionate leaders like her are drowning in digital communication. She spends nearly 3 hours daily on email—time stolen from the after-school programs that serve 200+ kids in her community. Each message carries emotional weight: a misstep with a parent could lose a child from the program, a delayed response to her board chair could damage her credibility, and volunteer communications require just the right balance of appreciation and clear expectations.

The irony? Maya is a natural communicator. When she talks face-to-face about Hope Gardens'' impact, parents light up and funders lean in. But translate that warmth and expertise into written form? Her confidence evaporates, replaced by second-guessing and endless rewrites that eat up her evenings.', '{"version": "1.0", "character": "Maya Rodriguez", "narrative_function": "Conflict development and stakes"}', 20),

  (5, 'callout_box', 'The Nonprofit Email Crisis', 'Research from the Nonprofit Technology Network shows that program staff spend 28% of their workday on email, with 67% reporting that poor communication tools negatively impact their mission work. Maya''s struggle represents thousands of nonprofit workers nationwide.', '{"type": "info", "source": "NTEN 2024 Report", "emotional_context": "Maya is not alone"}', 30),

  (5, 'text', 'Enter the AI Email Revolution', 'What Maya discovers today will transform not just her Monday mornings, but her entire approach to communication. AI isn''t about replacing the human touch that makes her messages meaningful—it''s about amplifying her natural empathy and expertise while eliminating the time-consuming struggle with tone, structure, and wording.

In the next 20 minutes, Maya will learn to use four game-changing tools: an AI Email Composer that adapts to any situation, a Difficult Conversation Helper for sensitive messages, an intelligent responder for quick but thoughtful replies, and a follow-up generator that turns meeting chaos into clear action items. Each tool preserves Maya''s authentic voice while dramatically improving her efficiency and confidence.', '{"version": "1.0", "character": "Maya Rodriguez", "narrative_function": "Solution introduction and hope"}', 40),

  (5, 'text', 'The Art of AI-Powered Tone', 'Maya''s first breakthrough comes when she realizes AI can help her code-switch between different communication contexts seamlessly. The same warmth she brings to chatting with parents can be translated into a professional update for her board chair, while her classroom management skills can inform firm-but-kind volunteer coordination emails.

The secret isn''t learning to write differently—it''s learning to specify what "different" looks like. Should this email be formal or friendly? Urgent or patient? Instructional or collaborative? AI becomes Maya''s communication coach, helping her match her tone to her intent and her audience''s needs.', '{"version": "1.0", "character": "Maya Rodriguez", "narrative_function": "Learning and discovery"}', 60),

  (5, 'reflection', 'Your Email Pain Points', 'Before we dive into Maya''s hands-on practice, take a moment to reflect on your own email challenges. Are you more like Maya, confident in person but struggling with written communication? Or perhaps you''re like James (our development associate), who worries about striking the right tone with major donors? Understanding your specific pain points will help you get the most from the AI tools Maya is about to master.', '{"prompt": "What types of emails take you the longest to write, and what specific aspects cause you the most stress?", "placeholderText": "For me, the most challenging emails are usually...", "minLength": 50, "character_connection": "Maya and James"}', 70),

  (5, 'text', 'Maya''s Transformation Begins', 'By the end of this lesson, Maya will have written her most challenging emails in a fraction of the usual time—and received better responses than ever before. She''ll discover that AI doesn''t make her communication robotic; it makes it more human by freeing her from the mechanics of writing to focus on the heart of her message.

Most importantly, Maya will reclaim those three daily hours to spend where her heart is: with the kids and families who make her work meaningful. But first, she needs to learn the ground rules for AI-assisted communication that preserves authenticity while dramatically improving efficiency.', '{"version": "1.0", "character": "Maya Rodriguez", "narrative_function": "Promise and transition to action"}', 80);

-- Update interactive elements to tie into Maya's story
DELETE FROM interactive_elements WHERE lesson_id = 5;

INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (5, 'ai_email_composer', 'Help Maya Write the Perfect Parent Response', 'Maya just received this email from a concerned parent: "I''m worried about the new pickup procedures. My work schedule is unpredictable, and I''m afraid I won''t be able to get Marcus on time. Can you help me understand the options?" 

Help Maya craft a response that''s empathetic to the parent''s situation while clearly explaining the policy and offering practical solutions.', '{"scenario": "parent_concern", "character": "Maya Rodriguez", "context": "pickup_policy_change", "tone_goals": ["empathetic", "clear", "solution_focused"], "stakes": "Marcus''s continued participation in the program"}', 90),

  (5, 'difficult_conversation_helper', 'Maya''s Board Chair Challenge', 'Maya needs to respond to this message from her board chair: "Maya, I need the Q3 budget variance report by tomorrow for the executive committee meeting. I know it''s short notice, but the committee specifically requested it."

The problem? Maya doesn''t have the data compiled yet, and creating the report will take at least 6 hours. Help Maya decline the impossible timeline while maintaining her professional relationship and proposing alternatives.', '{"scenario": "impossible_deadline", "character": "Maya Rodriguez", "relationship": "board_chair", "stakes": "professional_credibility", "goals": ["decline_gracefully", "propose_alternatives", "maintain_relationship"]}', 100),

  (5, 'storytelling_agent', 'Design Maya''s Email Transformation Arc', 'Use the DreamWorks storytelling framework to enhance Maya''s email journey. How can we make her challenges more relatable and her victories more inspiring for other nonprofit professionals?', '{"focus": "email_communication", "character": "Maya Rodriguez", "transformation": "email_anxiety_to_confidence"}', 105),

  (5, 'lyra_chat', 'Maya''s Email Strategy Session', 'Imagine you''re sitting down with Maya over coffee. She''s excited about AI email tools but worried about losing her personal touch. What questions would she ask you? What challenges in your own email communication resonate with her story?

Let''s brainstorm how AI can enhance rather than replace the human connection that makes nonprofit communication meaningful.', '{"character": "Maya Rodriguez", "context": "coffee_chat", "minimumEngagement": 3, "blockingEnabled": false, "chatType": "persistent", "emotional_tone": "collaborative_and_encouraging"}', 110),

  (5, 'knowledge_check', 'Maya''s Email Wisdom', 'After her transformation, what would Maya tell a fellow nonprofit director about using AI for email?', '{"question": "What''s the most important principle Maya learned about AI-assisted email communication?", "options": ["AI should write all your emails to save time", "AI helps you communicate more authentically by handling the mechanics", "AI emails should sound robotic to show they''re AI-generated", "AI can only help with formal business emails"], "correctAnswer": 1, "explanation": "Maya discovered that AI amplifies her natural communication style by removing the friction of formatting and structure, allowing her authentic voice and expertise to shine through.", "character": "Maya Rodriguez"}', 120);

-- Sample content for Lesson 6: Document Creation with James's story
DELETE FROM content_blocks WHERE lesson_id = 6;

INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (6, 'text', 'James and the Grant Proposal That Changed Everything', 'James Chen sits in the Urban Wildlife Conservation office at 9 PM, surrounded by printouts of foundation guidelines, half-eaten takeout, and the growing anxiety that he''s in over his head. Tomorrow''s deadline for the Morrison Foundation grant—$75,000 that could fund the endangered butterfly habitat project for two years—looms like a mountain he''s not sure he can climb.

As the organization''s newest development associate, James has passion for the mission but feels like he''s learning to write grant proposals in a foreign language. How do you translate "butterflies are important" into the kind of compelling narrative that convinces foundation officers to invest? How do you balance scientific rigor with emotional appeal? And how do you do it all before your boss arrives in the morning, expecting a polished proposal ready for submission?', '{"version": "1.0", "character": "James Chen", "narrative_function": "Character introduction and stakes"}', 10),

  (6, 'text', 'The Document Struggle Every Nonprofit Knows', 'James''s late-night panic represents a challenge faced by thousands of nonprofit professionals: creating compelling documents under crushing time pressure. Whether it''s grant proposals, board reports, impact assessments, or donor presentations, the ability to transform data and passion into persuasive prose can make the difference between funding and rejection, between board confidence and awkward questions.

The cruel irony? James knows this stuff cold. He can speak for hours about butterfly migration patterns, habitat restoration techniques, and the ecological impact of urbanization. Put him in front of a classroom of volunteers, and he''s magnetic. But ask him to write it down in "foundation language," and he freezes, staring at a blank page while the clock ticks away precious hours.', '{"version": "1.0", "character": "James Chen", "narrative_function": "Conflict development and universal connection"}', 20),

  (6, 'callout_box', 'The Hidden Cost of Document Struggle', 'A recent study found that nonprofit professionals spend an average of 23 hours per month on report writing and proposal creation. For many organizations, this represents 15-20% of total staff time—time that could be spent on direct mission work.', '{"type": "info", "emotional_context": "Time stolen from mission work", "connection": "James represents many nonprofits"}', 30),

  (6, 'text', 'When AI Becomes Your Writing Partner', 'What James discovers tonight will transform not just this proposal, but his entire approach to document creation. AI isn''t about replacing his expertise or passion—it''s about giving structure to his knowledge and confidence to his voice.

In the next 30 minutes, James will learn to use AI as his writing partner: a Document Generator that creates solid first drafts, a Proposal Enhancer that strengthens arguments and improves flow, a Data Storyteller that transforms dry statistics into compelling narratives, and a Template Creator that captures his best work for future use. Each tool amplifies James''s expertise while eliminating the paralysis of the blank page.', '{"version": "1.0", "character": "James Chen", "narrative_function": "Solution introduction and hope"}', 40),

  (6, 'text', 'The Breakthrough: Structure as Liberation', 'James''s first revelation comes when he realizes that AI can provide the structural skeleton that lets his expertise shine. Instead of staring at a blank page wondering how to start, he can begin with a solid outline and spend his energy on what he does best: explaining why butterfly conservation matters and how Urban Wildlife Conservation gets results.

The AI doesn''t write his proposal for him—it gives him the framework to write it brilliantly. It suggests section headers that foundation officers expect, prompts him for the types of evidence that strengthen his case, and helps him organize his thoughts into a logical flow that builds toward a compelling ask.', '{"version": "1.0", "character": "James Chen", "narrative_function": "Learning and discovery"}', 60),

  (6, 'text', 'From Data to Story: James''s Transformation', 'By midnight, James has something he never expected: a grant proposal he''s actually proud of. The butterfly habitat project comes alive on the page, with clear explanations of the problem, innovative solutions, measurable outcomes, and a budget that makes sense. More importantly, James''s voice comes through—his passion for conservation, his respect for the science, and his understanding of what funders need to hear.

The best part? He finished with time to spare, and the process felt collaborative rather than agonizing. James isn''t just submitting a proposal tomorrow; he''s discovering a new way to be an advocate for the causes he believes in.', '{"version": "1.0", "character": "James Chen", "narrative_function": "Resolution and transformation"}', 70);

-- Add interactive elements for Lesson 6 tied to James's story
DELETE FROM interactive_elements WHERE lesson_id = 6;

INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (6, 'document_generator', 'Help James Finish His Grant Proposal', 'James has his outline ready, but he''s stuck on the "Project Impact" section. He needs to explain why butterfly habitat restoration matters for urban ecosystems, but he''s not sure how to make it compelling for foundation officers who might not understand the science.

Help James generate a compelling impact section that balances scientific credibility with emotional appeal.', '{"scenario": "grant_proposal", "character": "James Chen", "section": "project_impact", "audience": "foundation_officers", "challenge": "making_science_accessible", "organization": "Urban Wildlife Conservation"}', 80),

  (6, 'document_improver', 'Polish James''s Executive Summary', 'James wrote this executive summary draft, but he knows it needs work: "Our organization wants to create butterfly habitats in the city. Butterflies are important for ecosystems and we think this project would be good for the community. We need $75,000 to do this work over two years."

Help James transform this rough draft into a compelling executive summary that would excite foundation officers.', '{"character": "James Chen", "document_type": "executive_summary", "improvement_focus": ["clarity", "impact", "specificity", "compelling_language"], "stakes": "$75,000 butterfly habitat project"}', 90),

  (6, 'template_creator', 'Build James''s Grant Proposal Template', 'After his success with the Morrison Foundation proposal, James wants to create a reusable template for future grant applications. Help him design a template that captures the structure and language that works while leaving room for customization.', '{"character": "James Chen", "template_type": "grant_proposal", "organization": "Urban Wildlife Conservation", "focus": "environmental_conservation", "audience": "foundations"}', 100),

  (6, 'lyra_chat', 'James''s Document Creation Breakthrough', 'James just had his breakthrough moment with AI-assisted writing. He wants to share his excitement but also process what this means for his role as a development professional. What questions might he have? What insights about nonprofit writing and AI would resonate with his experience?

Join James for a conversation about how AI changes the game for nonprofit storytelling and document creation.', '{"character": "James Chen", "context": "post_breakthrough", "emotional_tone": "excited_but_thoughtful", "minimumEngagement": 2, "topics": ["ai_writing", "nonprofit_storytelling", "efficiency_vs_authenticity"]}', 110);