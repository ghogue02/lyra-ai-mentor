-- Chapter 5: Rachel Thompson - Automation & Efficiency  
-- Complete chapter with rich character development and automation storytelling focus

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
    description = 'Join Rachel Thompson as she transforms automation from "cold technology" into systems that amplify human connection and mission impact',
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

-- Lesson 19: The Misunderstood Systems Builder
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (19, 'text_block', 'Rachel''s Passion Project Under Fire', 'Rachel Thompson sits in the Harmony Community Center boardroom, watching twelve pairs of eyes stare skeptically at her laptop screen. She''s spent six months building an integrated automation system that has revolutionized their operations: volunteer scheduling that reduced coordination time from 8 hours to 45 minutes weekly, donor management that automatically tracks engagement and suggests optimal contact timing, and program registration that eliminated the three-day processing backlog.

"Rachel, these systems are impressive," board chair Margaret Chen says carefully, "but we''re concerned you''ve lost sight of our mission. Community centers are about human connection, not technological efficiency."

Rachel''s heart sinks. She''s saved the organization 40 hours per week of administrative work – time their small staff can now spend on direct client services. But looking at her dashboard-heavy presentation, she realizes how her message appears: cold, impersonal, focused on metrics rather than mission.

"I understand your concerns," Rachel responds, though inside she''s screaming. Her automation hasn''t reduced human connection; it''s amplified it. But she''s failed to communicate that truth effectively.', '{}', 10),

  (19, 'text_block', 'The Efficiency Trap', 'After the board meeting, Rachel walks through Harmony''s programs with fresh eyes. In the children''s after-school area, she sees Maria Santos using the extra time Rachel''s scheduling system provided to work one-on-one with Jamie, a shy eight-year-old who''s been struggling since his parents'' divorce. Maria used to spend her afternoon calling volunteers to confirm shifts; now she spends it building relationships.

In the senior center, volunteer coordinator Tom Williams has time to actually talk with elderly participants instead of frantically managing scheduling conflicts. Rachel''s system automatically handles volunteer preferences, availability, and program needs – freeing Tom to focus on the lonely widow who needs someone to listen, not just someone to serve lunch.

But Rachel''s board presentation showed none of this human impact. Her slides featured efficiency metrics, time savings calculations, and system architecture diagrams. She talked about "optimized workflows" and "automated processes" without connecting them to Maria''s extra time with Jamie or Tom''s conversations with isolated seniors.

Rachel realizes she''s fallen into the classic tech trap: focusing on the tool instead of the transformation it enables.', '{}', 20),

  (19, 'text_block', 'The Crisis Point', 'Three days after the board meeting, Executive Director Patricia Williams calls Rachel into her office. "The board is questioning whether your position aligns with our mission," Patricia says gently. "They''re wondering if we need a 'Community Technology Coordinator' or just better administrative support."

Rachel feels her world tilting. She''s passionate about using technology to amplify human-centered nonprofit work, but she''s somehow convinced leadership that she cares more about systems than people. The irony is painful – her automation exists specifically to create more capacity for meaningful human interaction.

"I need to help them see what I see," Rachel tells her partner that evening. "When Maria has time to comfort Jamie instead of calling volunteers, that''s not efficiency for efficiency''s sake. That''s technology serving humanity."

Rachel remembers David Kim''s recent presentation to their organization about data storytelling. He transformed boring statistics into compelling narratives by connecting individual impact to systematic outcomes. Maybe Rachel needs a similar approach – showing how automated efficiency creates space for human connection rather than replacing it.', '{}', 30);

-- Lesson 19 Interactive Elements (3 components)
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (19, 'workflow_automator', 'Analyze Rachel''s Time-Saving Systems', 'Rachel needs to demonstrate the human impact of her automation systems. Help her calculate and visualize how her volunteer scheduling, donor management, and registration systems create additional capacity for direct client services.

Current time savings: Volunteer coordination (8 hours to 45 minutes weekly), donor management (6 hours to 1 hour weekly), registration processing (3 days to automated). Total staff affected: 8 people.', '{"scenario": "impact_analysis", "character": "Rachel Thompson", "focus": "human_impact_of_automation"}', 35),

  (19, 'difficult_conversation_helper', 'Rachel''s Board Defense Strategy', 'Rachel must address the board''s concern that she prioritizes technology over human connection. Help her prepare talking points that reframe automation as mission amplification rather than efficiency for its own sake.', '{"scenario": "board_defense", "character": "Rachel Thompson", "challenge": "reframing_technology_as_mission_support"}', 50),

  (19, 'lyra_chat', 'Rachel''s Identity Crisis Chat', 'Rachel is questioning whether her passion for automation truly aligns with nonprofit values. She feels misunderstood and wants to explore how to better communicate the human-centered purpose behind her technological solutions.', '{"character": "Rachel Thompson", "context": "professional_identity_crisis", "minimumEngagement": 2}', 65);

-- Lesson 20: Discovering Human-Centered Automation
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (20, 'text_block', 'Rachel''s Coffee Shop Epiphany', 'Rachel meets David Kim at the same coffee shop where he learned storytelling from Sofia Martinez. "I saw your data storytelling presentation," Rachel begins. "You transformed how people see statistics by connecting them to human stories. I think I need to do something similar with automation."

David nods thoughtfully. "Show me what your systems actually do," he says, pulling out his notebook. Rachel explains the volunteer scheduling automation: "Instead of Tom spending two hours every Tuesday calling volunteers to fill Thursday''s senior lunch program, the system automatically matches volunteer availability with program needs and sends confirmations."

"And what does Tom do with those two hours now?" David asks.

Rachel''s eyes light up. "He started a weekly coffee chat for seniors who seem isolated. Last month, he helped Mrs. Patterson reconnect with her estranged daughter. He never had time for those deeper conversations when he was drowning in scheduling logistics."

David smiles. "There''s your story. Tom''s coffee chat exists because of your automation. Mrs. Patterson''s family reunion happened because technology handled the administrative work, freeing Tom to focus on human connection."

Rachel suddenly sees her work differently. She''s not building systems; she''s creating space for mission impact.', '{}', 10),

  (20, 'text_block', 'The Human-Centered Framework', 'David introduces Rachel to an AI tool designed for impact storytelling. "Upload your automation data and tell me what problems each system solves," the AI prompts. Rachel begins documenting not just time savings, but capacity creation.

The volunteer scheduling system doesn''t just reduce coordination time; it ensures programs are consistently staffed, reducing last-minute cancellations that disappoint participants. The donor management automation doesn''t just track contacts; it identifies supporters who might be interested in volunteering, creating deeper community engagement.

The AI helps Rachel develop a new framework: "Human-Centered Automation" that positions technology as mission amplification rather than operational efficiency. Every automated process should answer three questions: How does this create more time for human connection? How does this improve participant experience? How does this strengthen community relationships?

Rachel begins rewriting her system documentation with this lens. Instead of "Automated volunteer scheduling reduces administrative overhead by 87%," she writes "Automated volunteer scheduling ensures seniors never experience lunch program cancellations due to understaffing, while creating 8 hours weekly for deeper relationship building."', '{}', 20),

  (20, 'text_block', 'Testing the New Narrative', 'Rachel decides to test her reframed automation story with Patricia, the Executive Director. Instead of leading with system features, she starts with impact: "Patricia, remember when Mrs. Patterson was so isolated that she stopped coming to senior lunch? Tom''s new coffee chat program helped her reconnect with her daughter. That program exists because automation freed Tom from scheduling logistics."

Patricia''s expression shifts from polite interest to genuine engagement. "I didn't realize the connection between your systems and Tom''s new programming."

Rachel continues: "Our registration automation doesn''t just process forms faster – it eliminated the three-day waiting period that was causing families to seek services elsewhere. Last month, we enrolled 23 additional children in after-school care because parents could register immediately when they needed help."

"This is completely different from your board presentation," Patricia observes. "You''re showing me how technology serves our mission, not replaces human elements."

Rachel nods excitedly. "I built these systems to amplify human connection, but I was communicating them as efficiency improvements. No wonder the board was concerned about our priorities."

For the first time in weeks, Rachel feels confident about her role at Harmony Community Center.', '{}', 30);

-- Lesson 20 Interactive Elements (4 components)
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (20, 'data_storyteller', 'Rachel''s Human-Centered Automation Stories', 'Help Rachel transform her efficiency metrics into human impact narratives. Focus on how her volunteer scheduling system created space for Tom''s coffee chat program and Mrs. Patterson''s family reunion.

System data: Volunteer scheduling saves 8 hours/week, Tom started coffee chat program, Mrs. Patterson reconnected with daughter, 15 seniors attend weekly, reduced isolation measurably improved.', '{"scenario": "automation_to_human_impact", "character": "Rachel Thompson", "focus": "relationship_building_enabled_by_efficiency"}', 35),

  (20, 'template_creator', 'Rachel''s Human-Centered Automation Framework', 'Rachel needs a template for evaluating and communicating automation projects using her new human-centered approach. Help her create a framework that answers: How does this create time for human connection? How does this improve participant experience? How does this strengthen community relationships?', '{"character": "Rachel Thompson", "framework_type": "human_centered_automation", "evaluation_criteria": ["human_connection", "participant_experience", "community_relationships"]}', 50),

  (20, 'process_optimizer', 'Rachel''s Impact-Driven System Design', 'Rachel wants to redesign her donor management automation to more clearly demonstrate human-centered outcomes. Help her optimize the system to track not just efficiency metrics but relationship-building and community engagement indicators.', '{"character": "Rachel Thompson", "system_type": "donor_management", "optimization_focus": "relationship_and_engagement_metrics"}', 65),

  (20, 'lyra_chat', 'Rachel''s Automation Philosophy Chat', 'Rachel is excited about her new human-centered automation framework but wants to discuss how to maintain this perspective when building future systems. She''s passionate about technology that amplifies rather than replaces human connection.', '{"character": "Rachel Thompson", "context": "philosophical_breakthrough", "minimumEngagement": 2}', 80);

-- Lesson 21: The Transformation Story
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (21, 'text_block', 'Rachel''s Redemption Presentation', 'Rachel stands before the same board that questioned her mission alignment just six weeks ago. But this time, her laptop stays closed. Instead, she begins with a story: "Mrs. Patterson hadn''t spoken to her daughter in three years when she started attending our senior lunch program. She was one of our most isolated participants – arriving early, eating quickly, leaving before social time."

The board members lean forward, clearly not expecting this opening. Rachel continues: "Six weeks ago, Mrs. Patterson called her daughter for the first time in years. They''re planning a Thanksgiving reunion. This transformation happened because Tom Williams finally had time to start coffee chat sessions with seniors who seemed lonely."

Rachel pauses, making eye contact around the room. "Tom''s coffee chat program exists because my volunteer scheduling automation freed him from eight hours of weekly coordination calls. Mrs. Patterson''s family reunion happened because technology handled administrative work, creating space for human connection."

Board chair Margaret Chen looks surprised. "Rachel, this sounds completely different from your previous presentation."

"Same systems, different story," Rachel replies. "I was showing you the efficiency when I should have been showing you the impact."', '{}', 10),

  (21, 'text_block', 'The Data Behind the Stories', 'Rachel opens her laptop, but the screen shows a different kind of dashboard – one focused on human outcomes rather than system metrics. "Our automation has created 40 hours per week of additional capacity for direct client services. Here''s how staff are using that time..."

The slide shows photos and brief descriptions: Maria Santos providing one-on-one reading support to struggling students. Tom Williams leading coffee chats and grief support groups. Registration coordinator Amy Chen conducting home visits for families who need additional resources.

"Before automation, Amy processed applications during business hours and made follow-up calls after 6 PM on her personal time," Rachel explains. "Now she can visit families during the day because the system handles routine processing. Last month, her home visits identified three cases of food insecurity that we addressed immediately."

The board sees efficiency metrics, but now they''re connected to mission outcomes. "Your automation isn''t replacing human services," board member Dr. James Rodriguez observes. "It''s amplifying them."

"Exactly," Rachel confirms. "Technology should make nonprofits more human, not less human."', '{}', 20),

  (21, 'text_block', 'The Scaling Vision', 'Rachel''s presentation concludes with a vision for human-centered automation across all of Harmony''s programs. "Imagine if our youth mentorship program had automated matching based on interests and availability – mentors could spend their first meetings building relationships instead of filling out paperwork. Picture our food pantry with inventory automation that prevents shortages – clients never face empty shelves, and volunteers have time to provide nutritional counseling."

The board''s questions are different this time. Instead of expressing concern about mission drift, they''re asking about implementation timelines and resource requirements. "How quickly could you automate our volunteer background check process?" asks treasurer Lisa Park. "Our safety coordinator spends 12 hours weekly on administrative follow-up that could be devoted to training and support."

After the meeting, Patricia Williams pulls Rachel aside. "The board voted unanimously to approve your automation expansion proposal. More importantly, they want to create a new position: Director of Human-Centered Technology. They recognize that your approach isn''t just improving our operations – it''s advancing our mission."

Rachel feels tears of relief and validation. She''s proven that technology and humanity aren''t opposing forces; when designed thoughtfully, automation amplifies the human elements that make nonprofits effective.', '{}', 30);

-- Lesson 21 Interactive Elements (3 components)
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (21, 'ai_content_generator', 'Rachel''s Board Redemption Presentation', 'Help Rachel craft her redemption presentation that reframes automation as mission amplification. Start with Mrs. Patterson''s story, connect it to Tom''s capacity, and demonstrate how efficiency creates space for human connection.

Key elements: Mrs. Patterson''s isolation and family reunion, Tom''s coffee chat program, 8 hours/week freed from scheduling, board''s previous concerns about technology over humanity.', '{"scenario": "board_redemption", "character": "Rachel Thompson", "narrative_arc": "human_impact_of_automation", "emotional_journey": "isolation_to_connection"}', 35),

  (21, 'impact_dashboard_creator', 'Rachel''s Human-Centered Impact Dashboard', 'Rachel needs a dashboard that shows automation impact through human outcomes rather than just efficiency metrics. Include staff capacity utilization, participant engagement improvements, and relationship-building indicators.', '{"character": "Rachel Thompson", "dashboard_focus": "human_centered_automation_impact", "metrics": ["staff_capacity_utilization", "participant_engagement", "relationship_building"], "visual_style": "story_driven"}', 50),

  (21, 'lyra_chat', 'Rachel''s Validation Celebration', 'Rachel is thrilled about the board''s response and her new Director of Human-Centered Technology position. She wants to discuss how this validation changes her approach to future automation projects and her role in the nonprofit technology community.', '{"character": "Rachel Thompson", "context": "professional_validation", "minimumEngagement": 2, "emotional_tone": "triumphant_and_forward_looking"}', 65);

-- Lesson 22: Building the Automation Ecosystem
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (22, 'text_block', 'Rachel''s Expanded Role', 'Six months into her role as Director of Human-Centered Technology, Rachel has become the go-to resource for nonprofits struggling to balance efficiency with mission focus. Her "Automation for Human Impact" methodology is being implemented by organizations across the region, each adapting her framework to their specific programs and populations.

Rachel''s team has grown to include two part-time technology coordinators and a community engagement specialist who helps measure the human impact of automated systems. Together, they''ve created an ecosystem where technology decisions are evaluated based on their potential to create more meaningful human connections rather than just operational efficiency.

The results speak for themselves: Harmony Community Center now serves 340% more clients with the same staff size, not because they''ve automated human services, but because they''ve automated administrative barriers that prevented staff from focusing on relationship building and direct support.

Rachel receives calls weekly from executive directors asking: "How do we implement technology without losing our humanity?" Her answer is always the same: "Stop asking whether technology serves efficiency and start asking whether it serves your mission."', '{}', 10),

  (22, 'text_block', 'The Nonprofit Technology Revolution', 'Rachel keynotes the Regional Nonprofit Technology Conference, addressing 200 leaders who''ve struggled with the same efficiency-versus-humanity false choice she once faced. Her presentation, "Technology That Makes Nonprofits More Human," challenges conventional thinking about automation in mission-driven organizations.

"We''ve been asking the wrong question," Rachel tells the audience. "Instead of ''How can technology make us more efficient?'' we should ask ''How can technology create more space for the human elements that define our impact?''"

She shares case studies from twelve organizations that have implemented her human-centered automation framework: a homeless shelter where automated intake processes reduced wait times from 3 hours to 45 minutes, allowing case managers to conduct comprehensive needs assessments on the same day. A youth mentorship program where automated matching algorithms connect mentors and mentees based on interests and availability, creating stronger relationships and better outcomes.

"Technology isn''t the enemy of human connection," Rachel concludes. "Poor technology implementation is the enemy of human connection. When we design systems that amplify rather than replace human capabilities, automation becomes a tool for mission advancement."', '{}', 20),

  (22, 'text_block', 'Rachel''s Next Challenge', 'As Rachel''s influence grows, she receives an unexpected invitation from Alex Rivera, Executive Director of Citywide Coalition for Change, a advocacy organization working on systemic social justice issues. "Rachel, I''ve heard about your human-centered automation work and need your perspective on a different challenge," Alex explains during their video call.

"My organization is facing a transformation crisis. We need to integrate AI tools across our advocacy, organizing, and policy work, but our board and staff are divided. Some see AI as essential for scaling our impact, others view it as a threat to our grassroots values. I need someone who understands how to navigate technology adoption while maintaining organizational soul."

Rachel is intrigued. Her automation work has focused on direct service organizations, but advocacy and organizing present different challenges. "What''s your biggest concern?" she asks.

"We''re fighting systems of oppression that increasingly use AI against the communities we serve," Alex responds. "Our staff worry that adopting AI tools makes us complicit in those same systems. But I think thoughtful AI integration could actually strengthen our resistance and amplify marginalized voices."

Rachel recognizes the familiar tension between efficiency and values, but in a more complex context. "You need organizational transformation that honors your justice values while embracing tools that can advance your mission," she observes. "That''s not just a technology challenge – it''s a change leadership challenge."', '{}', 30);

-- Lesson 22 Interactive Elements (4 components)
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (22, 'workflow_automator', 'Rachel''s Nonprofit Technology Ecosystem', 'Help Rachel design a comprehensive automation ecosystem for nonprofits that maintains human-centered values while maximizing operational efficiency. Include volunteer management, donor relations, program delivery, and impact measurement systems.', '{"character": "Rachel Thompson", "ecosystem_scope": "comprehensive_nonprofit_operations", "design_principle": "human_centered_automation", "organizational_types": ["direct_service", "advocacy", "community_organizing"]}', 35),

  (22, 'template_creator', 'Rachel''s Technology Implementation Framework', 'Rachel needs a framework that other nonprofits can use to evaluate and implement technology solutions using her human-centered approach. Create templates for technology assessment, implementation planning, and impact measurement.', '{"character": "Rachel Thompson", "framework_type": "technology_implementation", "evaluation_criteria": ["mission_alignment", "human_impact", "capacity_building"], "implementation_phases": ["assessment", "planning", "pilot", "scale", "measure"]}', 50),

  (22, 'ai_content_generator', 'Rachel''s Conference Keynote Speech', 'Help Rachel write her keynote speech "Technology That Makes Nonprofits More Human" for the Regional Nonprofit Technology Conference. Include compelling case studies, practical frameworks, and inspiration for 200 nonprofit leaders.', '{"character": "Rachel Thompson", "speech_type": "conference_keynote", "audience": "nonprofit_technology_leaders", "theme": "human_centered_automation", "case_studies": true}', 65),

  (22, 'lyra_chat', 'Rachel''s Leadership Evolution Chat', 'Rachel has evolved from a systems builder to a thought leader in human-centered technology. She''s excited about mentoring Alex Rivera on organizational transformation and wants to discuss how her automation expertise applies to broader change management challenges.', '{"character": "Rachel Thompson", "context": "thought_leadership_transition", "minimumEngagement": 3, "emotional_tone": "confident_and_mentoring"}', 80);