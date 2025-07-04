-- Chapter 4: David Kim - Data & Decision Making
-- Complete chapter with rich character development and data storytelling focus

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

-- Lesson 15: The Data Graveyard
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (15, 'text_block', 'David''s Dilemma', 'David Kim adjusts his glasses and clicks to slide 47 of his quarterly presentation. The Metro Data Alliance boardroom is silent except for the hum of the projector and occasional paper shuffling. Three foundation officers stare at his meticulously crafted charts showing the 34% improvement in youth employment outcomes from their job training program.

"Any questions?" David asks hopefully. The silence stretches. Finally, Jennifer from the Morrison Foundation speaks: "This is... very thorough, David. We''ll review your materials and get back to you."

David knows that tone. It''s the same polite dismissal he''s heard from twelve funders this year. His data is bulletproof – randomized controlled trials, longitudinal tracking, statistical significance tests that would make any researcher proud. Yet somehow, his perfect presentations consistently fail to secure the funding their proven programs desperately need.

Walking back to his office, David passes Sofia Martinez from Riverside Animal Rescue in the hallway. She''s practically glowing after her own foundation meeting. "They funded our entire expansion!" she beams. David forces a smile while wondering what he''s doing wrong.', '{}', 10),

  (15, 'text_block', 'The Pattern of Failure', 'Back in his office, David spreads out rejection letters from the past six months. The feedback is frustratingly consistent: "Impressive data but unclear impact." "Strong methodology but difficult to understand practical implications." "Comprehensive analysis but lacks compelling narrative."

David reviews his latest presentation about their youth employment program. Slide 12 shows correlation coefficients. Slide 23 displays regression analysis results. Slide 31 features a complex multi-variable comparison chart. Every number is accurate, every methodology sound, every conclusion justified.

But as David looks at his presentation with fresh eyes, he realizes what Sofia Martinez understands that he doesn''t: data without story is just intellectual noise. His audience doesn''t need to understand his methodology – they need to feel the impact of their potential investment.

"I''m showing them the recipe when they want to taste the meal," David mutters, staring at a particularly dense statistical table. He''s been treating funders like fellow researchers instead of human beings who make decisions with their hearts as much as their heads.', '{}', 20),

  (15, 'text_block', 'The Coffee Shop Revelation', 'David meets Sofia Martinez for coffee, hoping to understand her fundraising success. "Your data presentations are incredibly thorough," Sofia says diplomatically. "But when you showed me that employment outcome chart last month, I had no idea what it meant for actual people."

Sofia pulls out her phone and shows David her latest donor email about Luna''s successful surgery. "See how I started with Luna''s story, then wove in the broader impact? Donors need to see one life transformed before they can appreciate aggregate outcomes."

"But my programs serve 847 youth annually," David protests. "Individual stories aren''t representative of systemic impact."

"You''re right," Sofia agrees. "But you need both. Start with Marcus Williams, the 19-year-old who went from sleeping in his car to landing a $45,000 apprenticeship through your program. Let people connect with Marcus''s transformation, then show them how your data proves this isn''t luck – it''s a replicable system."

David feels something click. His data doesn''t need less rigor; it needs more humanity. The numbers tell powerful stories – he just hasn''t learned how to let them speak.', '{}', 30);

-- Lesson 15 Interactive Elements (3 components)
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (15, 'data_analyzer', 'Analyze David''s Failed Presentation', 'David needs your help understanding why his data-heavy presentation failed to secure funding. Review his slide deck about youth employment outcomes and identify what''s missing from a funder''s perspective.

Key slides: 47 total slides, 12 statistical charts, 5 methodology explanations, 3 correlation analyses, 1 brief "participant outcomes" summary.

What would make this more compelling to foundation officers?', '{"scenario": "presentation_analysis", "character": "David Kim", "focus": "funder_perspective"}', 35),

  (15, 'difficult_conversation_helper', 'David''s Board Feedback Session', 'David must discuss the latest funding rejections with his executive director. The board is questioning whether David''s data-driven approach is effective for fundraising. Help David prepare talking points that acknowledge the presentation challenges while demonstrating the value of rigorous data analysis.', '{"scenario": "board_accountability", "character": "David Kim", "challenge": "defending_data_approach"}', 50),

  (15, 'lyra_chat', 'David''s Data Frustration Chat', 'David is feeling frustrated that his rigorous research isn''t translating into funding success. He wants to understand how to maintain analytical integrity while making his presentations more compelling to non-technical audiences.', '{"character": "David Kim", "context": "professional_frustration", "minimumEngagement": 2}', 65);

-- Lesson 16: Finding the Story in Numbers
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (16, 'text_block', 'David''s First Story Experiment', 'David opens his laptop and stares at the spreadsheet containing 847 program participant records. Following Sofia''s advice, he searches for "Marcus Williams" and finds row 234: Age 19, Program Entry Date: March 15, Housing Status: Unstable, Employment History: None, Program Completion: Yes, Current Employment: Automotive Apprentice, Current Salary: $45,000.

Those data points barely scratch Marcus''s surface. David decides to dig deeper, pulling interview notes and case manager reports. The real story emerges: Marcus aged out of foster care at 18 with nowhere to go. He lived in his 2003 Honda Civic for four months before learning about Metro Data Alliance''s job training program.

David begins drafting: "Marcus Williams was sleeping in his car when he discovered our automotive training program. Six months later, he''s earning $45,000 as an apprentice mechanic at Johnson Auto Group – not because of luck, but because our data-driven approach identified his strengths and matched them with market demand."

For the first time, David sees how individual transformation and aggregate outcomes can work together. Marcus''s story becomes proof of concept; the broader data becomes proof of scale.', '{}', 10),

  (16, 'text_block', 'The AI Data Storytelling Tool', 'David discovers an AI tool designed specifically for data storytelling. Unlike generic writing assistants, this platform understands statistical concepts and can suggest narrative frameworks for different types of data presentations.

David uploads his youth employment outcomes dataset and asks: "How do I turn these statistics into compelling funder presentations?" The AI analyzes his data and suggests a three-part narrative structure: Setup (the problem these youth face), Intervention (how the program systematically addresses barriers), and Payoff (both individual transformations and population-level outcomes).

The AI helps David identify his most compelling data points: "Your 78% job placement rate is impressive, but your 89% job retention rate after one year is extraordinary – that suggests you''re not just finding jobs, but creating sustainable career pathways." It suggests leading with participant stories like Marcus, then showing how the data proves this success is systematic, not accidental.

David begins to see his spreadsheets differently. Every correlation coefficient represents real people overcoming real barriers. Every percentage point improvement means someone like Marcus getting a second chance.', '{}', 20),

  (16, 'text_block', 'Building the Data Narrative Framework', 'David spends the weekend reconstructing his youth employment presentation using Sofia''s storytelling principles and the AI''s data narrative framework. Instead of starting with methodology, he begins with Marcus sleeping in his car. Instead of correlation tables, he shows the pathway from unstable housing to sustainable employment.

His new slide 3 reads: "Marcus''s transformation wasn''t luck. Our program systematically addresses the three primary barriers to youth employment: skills gaps, social capital deficits, and housing instability. Here''s how we know it works..." Then come the charts, but now they support a human story rather than replacing it.

David tests his new approach with colleagues. "I actually understand what your program does now," says Janet from accounting. "Before, I just saw numbers. Now I see how you''re changing lives systematically."

The breakthrough moment comes when David realizes he doesn''t need to choose between rigorous analysis and compelling storytelling. His data becomes more powerful when it serves human stories, and his stories become more credible when they''re backed by solid data. He''s not dumbing down his research – he''s making it accessible.', '{}', 30);

-- Lesson 16 Interactive Elements (4 components)
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (16, 'data_storyteller', 'Help David Transform Marcus''s Data', 'David has Marcus''s raw data points but needs to transform them into a compelling narrative that demonstrates both individual impact and systematic effectiveness. Help him weave together personal story with supporting statistics.

Marcus''s data: Age 19, homeless for 4 months, completed 6-month automotive program, hired as apprentice mechanic, $45,000 starting salary, part of 78% job placement rate, 89% retention rate.', '{"scenario": "data_to_story", "character": "David Kim", "participant": "Marcus Williams", "program": "youth_employment"}', 35),

  (16, 'document_improver', 'David''s Presentation Transformation', 'David has rewritten his opening slides but they still feel too data-heavy. Help him balance human story with statistical evidence in a way that engages funders emotionally while maintaining analytical credibility.

Current draft: "Our youth employment program demonstrates significant statistical correlation between program completion and employment outcomes (p<0.01), with participants like Marcus Williams achieving 78% placement rates..."', '{"character": "David Kim", "transformation": "data_heavy_to_story_driven", "maintain": ["statistical_accuracy", "credibility"]}', 50),

  (16, 'impact_dashboard_creator', 'David''s Visual Story Dashboard', 'David wants to create an interactive dashboard that tells the story of youth employment transformation through both individual narratives and population-level data. Help him design visualizations that make complex data accessible to non-technical funders.', '{"character": "David Kim", "data_type": "youth_employment_outcomes", "audience": "foundation_officers", "story_integration": true}', 65),

  (16, 'lyra_chat', 'David''s Data Storytelling Breakthrough', 'David is excited about learning to combine personal narratives with statistical evidence. He wants to discuss how this approach might transform other aspects of his organization''s data communication and decision-making processes.', '{"character": "David Kim", "context": "methodology_breakthrough", "minimumEngagement": 2}', 80);

-- Lesson 17: The Million-Dollar Presentation
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (17, 'text_block', 'The High-Stakes Opportunity', 'David receives the email he''s been hoping for: The Hartwell Foundation wants to hear Metro Data Alliance''s pitch for their $1.2 million "Future of Work" initiative. This is the funding opportunity that could expand their youth employment program from serving 847 participants annually to 2,500 across three cities.

David has three weeks to prepare the most important presentation of his career. But this time, he has a secret weapon: his new data storytelling framework. Instead of diving straight into statistical analysis, David starts by identifying the most compelling participant stories that demonstrate different program pathways.

He selects three narratives: Marcus (automotive apprenticeship), Keisha (healthcare certification), and Roberto (information technology bootcamp). Each story represents a different demographic and career track, but all demonstrate the same systematic approach to overcoming employment barriers.

David maps each story against his data: How do individual transformations reflect population-level outcomes? How does qualitative evidence support quantitative findings? How can personal narratives make abstract concepts like "social capital development" tangible for funders?', '{}', 10),

  (17, 'text_block', 'Crafting the Million-Dollar Narrative', 'David''s new presentation opens with a split screen: Marcus sleeping in his Honda Civic (personal story) next to a chart showing 22% of their participants experiencing housing instability at program entry (supporting data). The visual immediately establishes both emotional connection and systemic scale.

"Marcus Williams represents one of 187 young adults who entered our program while experiencing homelessness last year," David begins. "But Marcus''s transformation isn''t unique – it''s replicable. Here''s how we know..." The presentation then weaves between individual journeys and aggregate outcomes, each story proving that success isn''t accidental.

David uses the AI-suggested framework: Problem (youth employment crisis), Solution (systematic intervention), Evidence (data-driven outcomes), Scale (expansion potential). But now his evidence includes both Marcus''s $45,000 salary and the 89% job retention rate that proves Marcus''s success isn''t an outlier.

The presentation climax connects individual impact to societal transformation: "When we help Marcus become financially stable, we''re not just changing one life. We''re reducing homelessness, increasing tax revenue, and creating a model that works. Our data proves this approach can scale."', '{}', 20),

  (17, 'text_block', 'The Presentation Day', 'David stands before five Hartwell Foundation board members, his laptop connected to the conference room projector. His hands are steady now – he''s rehearsed this story dozens of times, and it feels authentic, not scripted.

"Three months ago, Marcus Williams was sleeping in his car," David begins, clicking to a photo of Marcus at his graduation ceremony. "Today, he''s earning $45,000 as an automotive apprentice. But Marcus''s story isn''t remarkable because it''s rare – it''s remarkable because it''s replicable."

The board members lean forward. For the next 30 minutes, David guides them through a presentation that feels more like compelling documentary than academic lecture. Every chart supports a human story; every story validates the broader data pattern.

The questions afterward are different from previous presentations. Instead of "Can you explain your methodology?" they ask "How quickly could you scale to serve 2,500 youth?" Instead of "What''s your theoretical framework?" they ask "Do you have other success stories like Marcus?"

Two weeks later, David receives the call: Hartwell Foundation is funding the full $1.2 million expansion. "Your presentation was the most compelling case we''ve seen this year," the program officer explains. "You made us feel the impact while proving the effectiveness."', '{}', 30);

-- Lesson 17 Interactive Elements (3 components)
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (17, 'ai_content_generator', 'David''s Million-Dollar Opening', 'Help David craft the perfect opening for his high-stakes Hartwell Foundation presentation. He needs to immediately establish emotional connection while demonstrating systematic impact. Use Marcus''s story with supporting data to create maximum impact.

Key elements: Marcus sleeping in car, $1.2M funding opportunity, 847 to 2,500 participant expansion, need to prove replicability not just individual success.', '{"scenario": "high_stakes_presentation", "character": "David Kim", "funding_amount": "$1.2M", "story_integration": "Marcus_automotive"}', 35),

  (17, 'document_generator', 'David''s Data Story Presentation Deck', 'David needs a complete presentation that balances compelling narratives with rigorous data analysis. Help him create a slide deck that tells the story of systematic youth employment transformation while maintaining statistical credibility for foundation officers.', '{"character": "David Kim", "presentation_type": "foundation_funding", "story_subjects": ["Marcus", "Keisha", "Roberto"], "data_integration": "systematic_approach"}', 50),

  (17, 'lyra_chat', 'David''s Pre-Presentation Strategy', 'David is nervous about his upcoming $1.2M presentation but confident in his new storytelling approach. He wants to discuss how to handle potential questions about methodology while maintaining focus on impact and scalability.', '{"character": "David Kim", "context": "high_stakes_preparation", "minimumEngagement": 2}', 65);

-- Lesson 18: Building the Data Storytelling System
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (18, 'text_block', 'David''s New Role', 'Six months after securing the Hartwell Foundation grant, David finds himself in an unexpected position: Chief Data Storytelling Officer. It''s a title Metro Data Alliance created specifically for him, recognizing that his fusion of rigorous analysis with compelling narrative has transformed their organizational effectiveness.

David''s data storytelling approach has spread throughout the organization. Program directors now present quarterly reviews that feature both participant stories and outcome metrics. Grant writers incorporate individual transformations alongside aggregate statistics. Board meetings begin with compelling narratives supported by data dashboards, not endless spreadsheet presentations.

The results speak for themselves: funding secured has increased 340% year-over-year. More importantly, staff across departments report feeling more connected to their mission impact. "I used to see my job as processing applications," explains intake coordinator Maria Santos. "Now I see myself as documenting the beginning of transformation stories."

David realizes he''s built more than a presentation technique – he''s created a organizational culture where data serves human stories rather than replacing them.', '{}', 10),

  (18, 'text_block', 'Teaching the Framework', 'David''s phone rings constantly with requests from other nonprofits wanting to learn his data storytelling methodology. He decides to formalize his approach, creating the "Data + Story Certification Program" for nonprofit professionals who struggle to communicate their impact effectively.

The three-day workshop covers David''s core framework: Story Selection (identifying compelling individual narratives), Data Integration (connecting personal transformation to systematic outcomes), Narrative Architecture (building presentations that engage emotions and validate logic), and Impact Scaling (demonstrating how individual change creates societal transformation).

"The secret isn''t choosing between stories and statistics," David explains to a room full of program directors, evaluators, and development staff. "It''s understanding that every number represents a human being, and every human story validates your broader approach."

Participants leave with templates, AI tools for data analysis, and most importantly, a new perspective on their work. "I thought my job was proving programs work," reflects youth services director Jennifer Walsh. "Now I understand my job is helping people feel why programs matter."', '{}', 20),

  (18, 'text_block', 'David''s Next Challenge', 'As David''s reputation grows, he receives an intriguing email from Rachel Thompson at Harmony Community Center: "David, I''ve heard about your data storytelling work and desperately need your help. I''ve built incredible automated systems that make our operations incredibly efficient, but I can''t seem to communicate why automation matters for mission impact. Our board thinks I''m just a tech enthusiast who''s lost sight of serving people. Can you help me tell the story of how technology actually enhances human connection?"

David is intrigued. His framework has worked brilliantly for youth employment programs, but can it apply to operational efficiency and automation? During their coffee meeting, Rachel shows him dashboards displaying volunteer coordination, donor management, and program scheduling systems that have transformed Harmony''s capacity.

"Your systems are saving 40 hours per week of staff time," David observes, studying her metrics. "That''s 40 additional hours for direct client services. You''re not replacing human connection – you''re amplifying it."

Rachel''s eyes light up. "That''s exactly what I''ve been trying to explain to the board! But when I show them the efficiency charts, they think I care more about productivity than people."

David smiles, recognizing the familiar challenge. "You need to show them Maria first, then the metrics that prove Maria''s story scales."', '{}', 30);

-- Lesson 18 Interactive Elements (4 components)
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (18, 'template_creator', 'David''s Data Storytelling Certification Kit', 'David needs comprehensive templates for his nonprofit data storytelling certification program. Help him create frameworks that other organizations can use to combine individual narratives with systematic data analysis.', '{"character": "David Kim", "program_type": "certification_training", "template_categories": ["story_selection", "data_integration", "presentation_design", "impact_scaling"]}', 35),

  (18, 'impact_dashboard_creator', 'David''s Organizational Transformation Dashboard', 'David wants to create a dashboard showing how his data storytelling approach has transformed Metro Data Alliance''s effectiveness. Include funding outcomes, staff engagement metrics, and presentation success rates with compelling visual narratives.', '{"character": "David Kim", "dashboard_focus": "organizational_transformation", "metrics": ["funding_secured", "staff_engagement", "presentation_success"], "timeframe": "18_months"}', 50),

  (18, 'ai_content_generator', 'David''s Methodology Article', 'David wants to write an article for Nonprofit Quarterly explaining his data storytelling methodology. Help him create content that shares his framework while demonstrating its application through specific examples and measurable outcomes.', '{"character": "David Kim", "article_type": "methodology_guide", "publication": "nonprofit_sector", "focus": "practical_application"}', 65),

  (18, 'lyra_chat', 'David''s Legacy Conversation', 'David is proud of how his data storytelling approach has transformed his organization and others. He''s excited about mentoring Rachel Thompson and wants to discuss how his framework might apply to automation and operational efficiency storytelling.', '{"character": "David Kim", "context": "mentoring_expansion", "minimumEngagement": 3, "emotional_tone": "accomplished_and_forward_looking"}', 80);