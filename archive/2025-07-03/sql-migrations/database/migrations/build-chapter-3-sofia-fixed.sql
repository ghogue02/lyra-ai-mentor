-- Chapter 3: Sofia Martinez - Communication & Storytelling (FIXED QUOTES)
-- Complete chapter with rich character development and integrated AI components

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
    description = 'Join Sofia Martinez as she transforms her nonprofit''s communication from overlooked to unforgettable using AI-powered storytelling techniques',
    duration = '85 min',
    is_published = true
WHERE id = 3;

-- Create Chapter 3 lessons
INSERT INTO lessons (id, chapter_id, title, subtitle, order_index, estimated_duration, is_published)
VALUES
  (11, 3, 'The Silent Crisis', 'Sofia discovers why her donor communications aren''t working', 10, 20, true),
  (12, 3, 'Finding Her Voice', 'Sofia learns the power of AI-enhanced storytelling', 20, 22, true),
  (13, 3, 'The Breakthrough Story', 'Sofia creates her first compelling donor narrative', 30, 23, true),
  (14, 3, 'Scaling Impact', 'Sofia builds a storytelling system that transforms everything', 40, 20, true);

-- Lesson 11: The Silent Crisis
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (11, 'text_block', 'Sofia''s Frustration', 'Sofia Martinez stares at her computer screen at 8:47 PM, surrounded by empty coffee cups and crumpled printouts. As Communications Director for Riverside Animal Rescue, she''s been crafting the perfect donor newsletter for three weeks. The rescue desperately needs $50,000 for a new medical wing, but their last three fundraising campaigns fell flat.

Same old stories, same disappointing results, Sofia mutters, scrolling through their donor database. Open rates: 12%. Click-through rates: 2%. Donations: barely enough to cover postage. Meanwhile, other nonprofits seem to effortlessly capture hearts and wallets with their communications.

Sofia knows their work saving abandoned animals is incredible – last month alone they rescued 47 dogs from a puppy mill operation. So why can''t she make people care enough to give?', '{}', 10),

  (11, 'text_block', 'The Pattern Emerges', 'Sofia pulls up successful fundraising emails from other organizations, studying them with growing frustration. Help us save Bella, reads one subject line that raised $75,000. Emergency: Winter Storm Threatens Homeless Pets raised $125,000 in 48 hours.

Her emails, by contrast, read like annual reports: Q3 Rescue Statistics Update and Monthly Operational Overview. The data is impressive – 847 animals saved this year, 94% adoption rate, 12 community partnerships – but it feels cold, impersonal.

I''m a communications professional, Sofia thinks. I have a Master''s degree in Nonprofit Management. Why am I failing at the one thing I''m supposed to be good at? She''s missing something fundamental about how great stories actually work.', '{}', 20),

  (11, 'text_block', 'The Discovery Moment', 'Sofia''s phone buzzes with a text from her colleague Maya Rodriguez: Check out this email tool I found – it helped me write in 10 minutes what used to take me 2 hours! Attached is a link to an AI writing assistant.

AI for writing? Sofia is skeptical but desperate. She uploads one of her failed fundraising emails and asks the AI to analyze what''s missing. The response surprises her: This email focuses on statistics rather than emotional connection. Readers need to feel the impact, not just understand it.

The AI suggests rewriting her opening: Instead of We rescued 47 dogs this month, try Daisy was found shivering in a cardboard box, her ribs visible through matted fur. Today, she''s playing fetch in her forever home – one of 47 happy endings we created together this month.

Sofia feels a spark of hope. Maybe there''s a way to make her communications as compelling as their mission.', '{}', 30);

-- Lesson 11 Interactive Elements (3 components)
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (11, 'ai_content_generator', 'Analyze Sofia''s Struggling Email', 'Sofia needs your help analyzing why her donor email isn''t working. Read her current draft and identify what''s preventing it from connecting with donors emotionally.

Current draft: Dear Supporter, Our Q3 statistics show significant progress. We rescued 47 animals, achieved a 94% adoption rate, and expanded our volunteer program by 23%. Your continued support enables these operational improvements. Please consider increasing your donation to help us maintain this trajectory.

What would make this more compelling?', '{"scenario": "email_analysis", "character": "Sofia Martinez", "focus": "emotional_connection"}', 35),

  (11, 'difficult_conversation_helper', 'Sofia''s Board Meeting Challenge', 'Sofia must present the communication failures to her board next week. The Executive Director expects explanations for the declining donor response rates. Help Sofia prepare talking points that acknowledge the problems while showing her plan for improvement.', '{"scenario": "board_presentation", "character": "Sofia Martinez", "challenge": "explaining_poor_results"}', 50),

  (11, 'lyra_chat', 'Sofia''s Crisis Conversation', 'Sofia is feeling overwhelmed by her communication challenges. She wants to understand what successful nonprofit communicators do differently and how AI might help her transform her approach.', '{"character": "Sofia Martinez", "context": "professional_crisis", "minimumEngagement": 2}', 65);

-- Lesson 12: Finding Her Voice  
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (12, 'text_block', 'The AI Writing Session', 'Sofia decides to experiment with AI-powered storytelling. She opens the tool Maya recommended and starts with their most recent rescue: a senior dog named Charlie who was surrendered when his elderly owner moved to assisted living.

Tell me about Charlie, Sofia types. The AI asks follow-up questions: What was his emotional state when he arrived? What challenges did he face? What was his breakthrough moment? Sofia realizes she''s never thought about their rescues as individual stories with emotional arcs.

As she describes Charlie''s journey – from confused and grieving to finding peace with a retired teacher who needed companionship as much as he did – the AI helps her craft something beautiful: Charlie didn''t understand why his world disappeared overnight. Thirteen years of morning walks and evening treats, gone. When he arrived at Riverside Animal Rescue, his eyes held the heartbreak only seniors understand...

Sofia reads the generated story three times, feeling tears well up. This is what was missing from her communications – the emotional truth behind the statistics.', '{}', 10),

  (12, 'text_block', 'The Storytelling Framework', 'The AI introduces Sofia to the nonprofit storytelling framework: Problem, Intervention, Resolution, and Impact. Every compelling donor story needs these four elements, but most organizations skip straight to statistics.

Sofia maps out Charlie''s story: Problem (senior dog abandoned, grieving). Intervention (Riverside''s patient rehabilitation and matching process). Resolution (perfect adoption with retired teacher). Impact (two lives transformed, donor investment validated).

But how do I scale this? Sofia wonders. I can''t write a novel for every animal. The AI explains that powerful stories don''t need to be long – they need to be specific. Instead of we help many animals, focus on one compelling case that represents the broader impact.

Sofia starts seeing patterns in their most successful adoptions. The stories that stick share common elements: vulnerability, hope, transformation, and a clear role for the donor in making it possible.', '{}', 20),

  (12, 'text_block', 'The Voice Breakthrough', 'Sofia experiments with different narrative voices. Her previous emails were written in institutional voice – formal, distant, report-like. The AI helps her find storyteller voice – warm, specific, emotionally honest.

Old Sofia: Our organization facilitated 47 successful adoptions in Q3.
New Sofia: Forty-seven second chances. Forty-seven families completed. Forty-seven stories that started with nobody wanted me and ended with I am home.

The difference is profound. Sofia realizes she''s been hiding behind professionalism when donors actually want authenticity. People give to causes that move them, not organizations that impress them.

She practices rewriting their mission statement: Instead of Riverside Animal Rescue provides comprehensive animal welfare services, she tries Every animal deserves someone who sees their worth. We are the bridge between abandoned and adored.

Sofia feels something shift inside her. She''s not just learning new writing techniques – she''s rediscovering why she became a nonprofit communicator in the first place.', '{}', 30);

-- Lesson 12 Interactive Elements (4 components)
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (12, 'ai_content_generator', 'Help Sofia Rewrite Charlie''s Story', 'Sofia wants to transform Charlie''s story from a basic adoption update into a compelling donor narrative. Help her apply the storytelling framework to create something that will make donors feel the impact of their support.

Basic facts: Charlie, 13-year-old beagle, surrendered when owner moved to care facility, was depressed for 2 weeks, matched with retired teacher Margaret who needed companionship.', '{"scenario": "story_transformation", "character": "Sofia Martinez", "framework": "problem_intervention_resolution_impact"}', 35),

  (12, 'document_improver', 'Sofia''s Voice Transformation Exercise', 'Sofia has written a draft email but it still sounds too institutional. Help her rewrite it using storyteller voice instead of institutional voice while maintaining professionalism.

Draft: Our facility continues to maintain high operational standards in animal care delivery while achieving optimal adoption placement rates through systematic matching protocols.', '{"character": "Sofia Martinez", "transformation": "institutional_to_storyteller", "maintain": ["professionalism", "accuracy"]}', 50),

  (12, 'template_creator', 'Build Sofia''s Storytelling Template', 'Sofia wants to create a template she can use for future animal stories. Help her build a framework that incorporates the Problem-Intervention-Resolution-Impact structure while maintaining emotional connection.', '{"character": "Sofia Martinez", "template_type": "animal_story", "framework": "storytelling_structure"}', 65),

  (12, 'lyra_chat', 'Sofia''s Creative Confidence Chat', 'Sofia is excited about her storytelling breakthrough but nervous about implementing it. She wants to discuss how to maintain authenticity while scaling her new approach across all communications.', '{"character": "Sofia Martinez", "context": "creative_breakthrough", "minimumEngagement": 2}', 80);

-- Lesson 13: The Breakthrough Story
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (13, 'text_block', 'Sofia''s First Campaign', 'Sofia stares at her computer, cursor blinking in an empty email template. Tomorrow marks the deadline for their emergency medical fund campaign – they need $15,000 for surgical equipment repairs. Previous medical appeals have failed miserably; donors seem to care more about cute adoption stories than medical expenses.

But Sofia has a new strategy. Instead of leading with financial needs, she''ll tell the story of Luna, a pregnant German Shepherd who arrived three days ago with dangerous complications that require emergency C-section. Without the surgical equipment, Luna and her puppies won''t survive.

Sofia begins writing: Luna''s contractions started at 2 AM, but something was wrong. Instead of the relief of impending birth, her eyes showed panic. Our veterinarian knew immediately – this was the kind of emergency that tests everything we stand for.

The words flow differently now. Sofia isn''t just reporting medical expenses; she''s sharing the story of life hanging in the balance and the equipment that makes miracles possible.', '{}', 10),

  (13, 'text_block', 'The Emotional Architecture', 'Sofia carefully constructs the emotional journey of her email. She learned from the AI that great fundraising stories follow a specific arc: establish stakes, show vulnerability, demonstrate intervention, reveal transformation, and invite partnership.

She describes Luna''s arrival in vivid detail – the scared mother-to-be, the urgency of the situation, the critical decision point. Then she reveals the equipment failure: Our surgical monitor flickered and died just as Dr. Martinez prepared for the emergency C-section. In that moment, we faced every rescue organization''s nightmare – having the expertise to save lives but not the tools.

Sofia doesn''t immediately ask for money. Instead, she shows the impact: Thanks to our backup equipment (purchased with funds from supporters like you), Luna delivered six healthy puppies at 4:17 AM. But this close call revealed a dangerous gap in our medical capabilities.

The ask comes naturally: Your $50 gift helps ensure we are always ready for the next Luna. Because when lives hang in the balance, maybe next time is not an option.', '{}', 20),

  (13, 'text_block', 'The Campaign Launch', 'Sofia hits send on her Luna campaign email to 2,847 subscribers at 9 AM on Tuesday. By noon, her phone won''t stop buzzing. The campaign has already raised $3,200 – more than their last three appeals combined.

The responses overwhelm her: I have been getting your emails for two years, but this is the first time I really understood what my donations do. Luna''s story brought me to tears – please use my $100 where it''s needed most. I am a vet tech and know exactly how terrifying equipment failures are during emergency surgery. Here is $200.

But the most meaningful response comes from Margaret, Charlie''s adopter: Sofia, I don''t know how you did it, but your email made me feel like I was right there in the surgical suite. I am increasing my monthly giving because now I understand – you are not just rescuing animals, you are rescuing families.

By Friday, the campaign has exceeded its goal by 40%. Sofia realizes she hasn''t just learned to write better emails – she''s discovered how to help donors see their role in the mission.', '{}', 30);

-- Lesson 13 Interactive Elements (3 components)
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (13, 'ai_email_composer', 'Sofia''s Luna Campaign Email', 'Help Sofia craft the perfect fundraising email about Luna''s emergency. Apply the emotional architecture she learned: establish stakes, show vulnerability, demonstrate intervention, reveal transformation, and invite partnership.

Key details: Luna (pregnant German Shepherd), emergency C-section needed, equipment failure during surgery, successful birth of 6 puppies, need $15,000 for equipment replacement.', '{"scenario": "emergency_fundraising", "character": "Sofia Martinez", "emotional_arc": true, "target_amount": "$15,000"}', 35),

  (13, 'ai_social_media_generator', 'Sofia''s Multi-Platform Launch', 'Sofia wants to extend Luna''s story across social media platforms. Help her create platform-specific content that maintains the emotional impact while fitting each platform''s format and audience expectations.', '{"character": "Sofia Martinez", "story": "Luna_emergency", "platforms": ["facebook", "instagram", "twitter"], "tone": "emotional_storytelling"}', 50),

  (13, 'lyra_chat', 'Sofia''s Success Celebration', 'Sofia is thrilled about her campaign''s success but wants to understand what made it work so she can replicate it. She''s eager to discuss the storytelling techniques and emotional architecture that created such strong donor response.', '{"character": "Sofia Martinez", "context": "campaign_success", "minimumEngagement": 2, "emotional_tone": "excited_and_analytical"}', 65);

-- Lesson 14: Scaling Impact
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (14, 'text_block', 'The System Sofia Built', 'Three months after her Luna campaign breakthrough, Sofia has transformed Riverside Animal Rescue''s entire communication strategy. Their monthly newsletter now features one compelling animal story, strategically placed donor impact updates, and a clear emotional call-to-action. Open rates have jumped from 12% to 47%. Average donation size has increased by 230%.

But Sofia''s real innovation is her Story Bank system. Using AI-powered templates, she documents every rescue''s journey: intake photos, personality notes, medical challenges, behavioral progress, adoption updates. When fundraising opportunities arise, she has a library of compelling narratives ready to deploy.

The AI doesn''t write our stories, Sofia explains to other nonprofit communications directors who visit to learn her methods. It helps us recognize the stories that are already there. Every animal we rescue has a narrative arc – we just needed to learn how to see it and share it.

Her latest email about Max, a pit bull who overcame severe anxiety to become a therapy dog for trauma survivors, raised $23,000 in one week for their behavioral rehabilitation program.', '{}', 10),

  (14, 'text_block', 'Teaching Others', 'Sofia''s success hasn''t gone unnoticed. The Regional Nonprofit Coalition asks her to lead a workshop on AI-Enhanced Storytelling for Maximum Impact. As she prepares her presentation, Sofia reflects on her transformation journey.

I used to think storytelling was fluff, she admits to the 47 communications professionals gathered in the conference room. I believed donors wanted facts, figures, proof of efficiency. I was wrong. Donors want to feel their impact, not just understand it.

Sofia demonstrates her process: Start with one specific story. Use AI to identify emotional touchpoints. Build the narrative arc. Connect individual impact to broader mission. Always end with a clear way for donors to be part of the next chapter.

The workshop participants are amazed by the before-and-after examples. Sofia''s old emails look like annual reports; her new ones read like compelling short stories that happen to include donation requests.

The secret, Sofia concludes, isn''t manipulation. It''s authenticity. AI helped me find my authentic voice as a storyteller, not replace it.', '{}', 20),

  (14, 'text_block', 'Sofia''s New Challenge', 'As Sofia''s reputation grows, she receives an unexpected phone call. David Kim from Metro Data Alliance, a nonprofit focused on helping organizations use data effectively, wants to collaborate. His organization has incredible impact measurement capabilities but struggles to communicate their results in compelling ways.

I can prove our programs work, David explains during their coffee meeting. I have beautiful charts, regression analyses, longitudinal studies. But when I present to funders, their eyes glaze over. I need to learn what you have mastered – how to turn data into stories that move people.

Sofia realizes her next challenge: scaling her storytelling expertise beyond animal rescue. Can the narrative techniques that work for Luna and Max also work for youth programs, environmental initiatives, or economic development? She''s about to find out.

Every number tells a story, Sofia muses after David leaves. We just need to learn how to listen for it. She opens her AI writing assistant and begins exploring how data visualization and storytelling might work together. The next chapter of her professional journey is about to begin.', '{}', 30);

-- Lesson 14 Interactive Elements (4 components)
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (14, 'template_creator', 'Sofia''s Story Bank System', 'Help Sofia create a comprehensive template system for documenting and deploying animal stories. This should include intake documentation, story development prompts, and various output formats for different communication needs.', '{"character": "Sofia Martinez", "system_type": "story_documentation", "output_formats": ["email", "social_media", "newsletter", "grant_narrative"]}', 35),

  (14, 'ai_email_campaign_writer', 'Sofia''s Max Campaign', 'Sofia wants to create a comprehensive email campaign about Max, the anxious pit bull who became a therapy dog. Help her develop a multi-email sequence that tells his complete transformation story while raising funds for the behavioral rehabilitation program.', '{"character": "Sofia Martinez", "story_arc": "Max_therapy_dog", "campaign_goal": "behavioral_rehabilitation_funding", "sequence_length": 3}', 50),

  (14, 'content_calendar_builder', 'Sofia''s Strategic Communication Calendar', 'Sofia needs a 6-month content calendar that balances compelling animal stories with other organizational communication needs. Help her create a strategic plan that maximizes emotional impact while covering all necessary updates.', '{"character": "Sofia Martinez", "timeframe": "6_months", "content_types": ["animal_stories", "impact_updates", "volunteer_spotlights", "donor_appreciation"], "frequency": "weekly"}', 65),

  (14, 'lyra_chat', 'Sofia''s Mentoring Moment', 'Sofia is excited about her upcoming collaboration with David Kim and wants to discuss how storytelling principles might apply to data-driven organizations. She''s also proud of how far she''s come and wants to inspire others facing similar communication challenges.', '{"character": "Sofia Martinez", "context": "mentoring_others", "minimumEngagement": 3, "emotional_tone": "inspiring_and_confident"}', 80);