-- Chapter 6: Alex Rivera - Organizational Transformation
-- Complete chapter with rich character development and change leadership focus

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

-- Lesson 23: The Great Divide
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (23, 'text_block', 'Alex''s Impossible Choice', 'Alex Rivera stares at the flip chart covering the conference room wall at Citywide Coalition for Change, where two columns of staff concerns create a stark divide. "AI Opportunities" lists powerful possibilities: automated research for policy advocacy, predictive modeling for organizing campaigns, AI-assisted grant writing to fund expansion. "AI Threats" reveals deeper fears: surveillance technologies targeting their communities, algorithmic bias reinforcing systemic oppression, corporate tools that could compromise grassroots authenticity.

"We''re fighting systems that increasingly use AI against the people we serve," argues organizing director Carmen Santos. "Adopting these same tools feels like collaboration with oppression."

Policy researcher Marcus Kim counters: "While we debate ethics, well-funded opposition groups are using AI to suppress voting, spread disinformation, and target our communities. We''re bringing knives to a gunfight."

Alex feels the weight of leadership as they facilitate this heated discussion. As Executive Director, they must navigate between staff who see AI as essential for scaling impact and those who view it as fundamentally incompatible with social justice values. The organization''s future effectiveness – and unity – hangs in the balance.', '{}', 10),

  (23, 'text_block', 'The Values Crisis', 'The staff meeting continues for three contentious hours, revealing fault lines Alex didn''t realize existed. Veteran organizer Dr. Patricia Williams argues that their 40-year-old organization succeeded through human relationship building, door-to-door organizing, and authentic community engagement. "AI tools will distance us from the communities we serve," she insists.

Younger staff members like digital strategist Jordan Chen push back: "Our opponents are using sophisticated AI for voter suppression and disinformation campaigns. Refusing to use AI ethically means we''re disadvantaging the communities we claim to serve."

Alex realizes this isn''t just a technology adoption decision – it''s a fundamental question about organizational identity. Can Citywide Coalition maintain its grassroots values while embracing tools that could amplify their advocacy impact? Is there a way to use AI that strengthens rather than undermines their commitment to social justice?

"We need more than a technology strategy," Alex concludes as the meeting winds down. "We need a transformation framework that honors our values while expanding our capabilities." But Alex has no idea how to build such a framework – until they remember recent conversations with Sofia Martinez, David Kim, and Rachel Thompson.', '{}', 20),

  (23, 'text_block', 'The Expert Network', 'That evening, Alex reaches out to the nonprofit professionals whose work has been transforming their respective organizations. Sofia Martinez revolutionized donor communication through AI-enhanced storytelling. David Kim proved that data and human stories can amplify each other rather than compete. Rachel Thompson demonstrated how automation can create more space for human connection rather than replacing it.

"Each of you faced resistance when introducing AI tools," Alex observes during their video call. "How did you navigate the tension between innovation and organizational values?"

Sofia shares her breakthrough: "I stopped presenting AI as a replacement for human creativity and started showing how it amplifies authentic storytelling. The key was proving that AI helped me become more human in my communications, not less."

David nods: "My board thought data would make us cold and corporate. I had to demonstrate that rigorous analysis actually makes our human impact stories more credible and compelling."

Rachel adds: "The transformation happened when people saw that automation created more time for relationship building, not less. But it required intentional design and constant communication about our underlying values."

Alex feels hope stirring. Maybe the answer isn''t choosing between AI and values, but finding AI applications that advance rather than compromise their social justice mission.', '{}', 30);

-- Lesson 23 Interactive Elements (3 components)
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (23, 'ai_readiness_assessor', 'Assess Citywide Coalition''s AI Readiness', 'Help Alex evaluate their organization''s readiness for AI adoption considering both opportunities and resistance. Analyze staff concerns, organizational values, and potential AI applications to create a comprehensive readiness assessment.

Organization context: 40-year social justice advocacy organization, divided staff opinions, focuses on policy advocacy and community organizing, strong grassroots values, concerns about surveillance and bias.', '{"scenario": "organizational_ai_readiness", "character": "Alex Rivera", "organization_type": "social_justice_advocacy", "focus": "values_alignment"}', 35),

  (23, 'difficult_conversation_helper', 'Alex''s Values vs Innovation Discussion', 'Alex needs to facilitate ongoing conversations between staff members who see AI as essential and those who view it as compromising their values. Help them prepare talking points that acknowledge both perspectives while moving toward constructive solutions.', '{"scenario": "values_technology_tension", "character": "Alex Rivera", "challenge": "bridging_organizational_divide"}', 50),

  (23, 'lyra_chat', 'Alex''s Leadership Dilemma Chat', 'Alex is feeling overwhelmed by the responsibility of making AI adoption decisions that could fundamentally change their organization''s culture and effectiveness. They want to explore different approaches to navigating this transformation challenge.', '{"character": "Alex Rivera", "context": "leadership_transformation_challenge", "minimumEngagement": 2}', 65);

-- Lesson 24: Building the Vision
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (24, 'text_block', 'The Framework Development', 'Alex spends the weekend developing what they call the "Justice-Centered AI Framework" – a decision-making tool that evaluates potential AI applications against Citywide Coalition''s core values. Working with insights from Sofia, David, and Rachel, Alex creates four evaluation criteria: Community Amplification (Does this tool amplify marginalized voices?), Transparency and Accountability (Can we explain how and why the AI makes decisions?), Human-Centered Design (Does this create more capacity for relationship building?), and Justice Alignment (Does this advance rather than compromise our social justice mission?).

Alex tests the framework against potential AI applications. Automated research for policy advocacy scores high on efficiency but requires careful evaluation for bias in data sources. AI-assisted grant writing could increase funding capacity but needs human oversight to maintain authentic organizational voice. Predictive modeling for organizing campaigns offers strategic advantages but demands transparency about assumptions and limitations.

"Every AI tool isn''t automatically good or bad," Alex realizes. "The question is whether we can implement it in ways that advance our values." The framework provides structure for these nuanced decisions while ensuring community voice remains central to their technology choices.', '{}', 10),

  (24, 'text_block', 'The Pilot Program Strategy', 'Alex proposes a careful pilot program approach to the next staff meeting. "Instead of debating AI adoption in abstract terms, let''s test specific applications using our Justice-Centered AI Framework," they suggest. The pilot will focus on three low-risk, high-impact areas: research automation for policy analysis, communication enhancement for community outreach, and administrative efficiency for volunteer coordination.

"Each pilot includes community feedback mechanisms," Alex explains, addressing Dr. Williams'' concerns about authentic engagement. "We''ll survey community members about whether AI-enhanced communications feel genuine and helpful. If our tools create barriers to relationship building, we''ll modify or discontinue them."

Marcus Kim volunteers to lead the research automation pilot, working with David Kim''s data storytelling methodology to ensure AI analysis supports rather than replaces human judgment. Carmen Santos agrees to test communication tools with Sofia Martinez''s guidance, focusing on amplifying community voices rather than replacing authentic storytelling.

"This feels different from adopting technology for technology''s sake," observes longtime organizer Maria Gonzalez. "We''re asking whether each tool makes us better advocates for our communities."', '{}', 20),

  (24, 'text_block', 'The Early Wins', 'Six weeks into the pilot program, Alex is cautiously optimistic about early results. Marcus''s policy research automation has identified legislative patterns and funding opportunities that previously required weeks of manual analysis. But more importantly, the AI tools have surfaced community voices and grassroots research that inform their policy positions.

"I''m not using AI to replace community input," Marcus explains during the pilot review meeting. "I''m using it to analyze thousands of public comments, social media posts, and survey responses to identify themes and priorities I might have missed. The AI helps me listen more effectively to community voice, not substitute my judgment for it."

Carmen''s communication pilot has shown similar promise. AI-assisted storytelling tools help amplify individual community member experiences while maintaining authentic voice and emotional impact. "The AI doesn''t write our stories," Carmen shares. "It helps us structure community narratives more compellingly and suggests ways to connect individual experiences to systemic issues."

Even Dr. Williams acknowledges the potential: "I was wrong to assume all AI tools would distance us from communities. These applications seem to be helping us engage more effectively."', '{}', 30);

-- Lesson 24 Interactive Elements (4 components)
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (24, 'ai_governance_builder', 'Alex''s Justice-Centered AI Framework', 'Help Alex develop a comprehensive governance framework for evaluating AI tools against social justice values. Include decision-making criteria, community feedback mechanisms, and accountability measures that ensure AI adoption advances rather than compromises their mission.', '{"character": "Alex Rivera", "framework_type": "justice_centered_ai_governance", "evaluation_criteria": ["community_amplification", "transparency", "human_centered_design", "justice_alignment"]}', 35),

  (24, 'change_leader', 'Alex''s Pilot Program Implementation Strategy', 'Alex needs a change management strategy for implementing AI pilots while building organizational consensus. Help them design an approach that addresses resistance, builds buy-in, and creates feedback loops for continuous improvement.', '{"character": "Alex Rivera", "change_type": "ai_pilot_implementation", "organization_context": "social_justice_advocacy", "resistance_factors": ["values_concerns", "technology_skepticism"], "success_metrics": ["community_engagement", "mission_advancement"]}', 50),

  (24, 'template_creator', 'Alex''s AI Evaluation Toolkit', 'Alex wants to create templates that other social justice organizations can use to evaluate AI tools using justice-centered criteria. Develop assessment tools that help organizations make ethical technology decisions aligned with their values.', '{"character": "Alex Rivera", "toolkit_type": "ai_evaluation_for_social_justice", "target_audience": "nonprofit_social_justice_organizations", "evaluation_categories": ["bias_assessment", "community_impact", "values_alignment"]}', 65),

  (24, 'lyra_chat', 'Alex''s Framework Validation Chat', 'Alex is excited about their Justice-Centered AI Framework but wants to discuss potential blind spots and implementation challenges. They''re particularly interested in ensuring community voice remains central to their technology decisions.', '{"character": "Alex Rivera", "context": "framework_development_validation", "minimumEngagement": 2}', 80);

-- Lesson 25: The Transformation Strategy
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (25, 'text_block', 'The Organization-Wide Rollout', 'Based on successful pilot results, Alex prepares for organization-wide AI integration using a comprehensive change management strategy. Drawing from Rachel Thompson''s human-centered automation expertise, Alex ensures that every AI implementation creates more capacity for community relationship building rather than replacing human connection.

The rollout strategy includes four phases: Education and Values Alignment (helping all staff understand how AI can advance social justice), Participatory Design (involving community members in tool selection and evaluation), Gradual Implementation (rolling out AI applications incrementally with continuous feedback), and Impact Assessment (measuring both efficiency gains and community engagement outcomes).

"We''re not just adopting AI tools," Alex explains to the full staff. "We''re modeling how social justice organizations can use technology ethically and effectively. Other advocacy groups are watching our approach – we have an opportunity to influence how the entire sector thinks about AI."

Alex partners with Sofia Martinez to develop communication strategies that tell the story of their transformation, with David Kim to measure both quantitative outcomes and qualitative community impact, and with Rachel Thompson to ensure their automated systems amplify rather than replace human-centered advocacy work.', '{}', 10),

  (25, 'text_block', 'The Community Engagement Innovation', 'Alex''s most innovative strategy involves creating a Community AI Advisory Board composed of residents from neighborhoods most affected by their advocacy work. This group reviews proposed AI applications, provides feedback on tool effectiveness, and ensures technology decisions serve community needs rather than organizational convenience.

"Community members are the experts on what amplifies versus diminishes their voices," Alex explains to visiting nonprofit leaders. "Our AI Advisory Board includes formerly incarcerated individuals evaluating criminal justice reform tools, immigrant community leaders reviewing language translation applications, and housing advocates assessing gentrification analysis models."

The Advisory Board''s first major decision involves rejecting a predictive policing data tool that could have supported their criminal justice reform work. "This AI reproduces the same biases we''re fighting," explains Advisory Board member Rev. James Thompson. "We need tools that challenge rather than reinforce systemic oppression."

Instead, the Board approves an AI application that analyzes public records to identify patterns of housing discrimination – a tool that amplifies community experiences with landlord bias by surfacing systematic evidence that supports individual tenant stories.', '{}', 20),

  (25, 'text_block', 'The Ripple Effect', 'Alex''s justice-centered AI approach attracts attention from advocacy organizations nationally. The "Citywide Model" becomes a case study in ethical technology adoption that honors community voice while scaling organizational impact. Alex receives invitations to keynote conferences, consult with other nonprofits, and collaborate with technology developers on community-centered AI design.

"What started as our internal challenge has become a movement," Alex reflects during their six-month transformation review. Their organization now serves as a testing ground for AI tools designed specifically for social justice work, with community feedback directly influencing technology development.

The quantitative results are impressive: 67% increase in policy research efficiency, 43% improvement in community engagement metrics, 89% staff satisfaction with AI integration process. But Alex is most proud of qualitative outcomes: community members report feeling more heard and represented, staff describe feeling more capable of advancing justice goals, and partner organizations are adopting similar ethical technology frameworks.

"We proved that AI and social justice values aren''t contradictory," Alex concludes. "When technology serves community voice rather than replacing it, AI becomes a tool for liberation rather than oppression."', '{}', 30);

-- Lesson 25 Interactive Elements (3 components)
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (25, 'change_leader', 'Alex''s Organization-Wide AI Transformation Plan', 'Help Alex design a comprehensive change management strategy for rolling out AI across their entire organization. Include stakeholder engagement, timeline management, resistance mitigation, and success measurement approaches.', '{"character": "Alex Rivera", "transformation_scope": "organization_wide_ai_adoption", "change_methodology": "justice_centered", "stakeholders": ["staff", "community", "board", "partners"]}', 35),

  (25, 'ai_governance_builder', 'Alex''s Community AI Advisory Board Framework', 'Alex wants to create a replicable model for community governance of AI adoption in social justice organizations. Help them design structures, processes, and decision-making protocols that center community voice in technology choices.', '{"character": "Alex Rivera", "governance_model": "community_ai_advisory_board", "decision_authority": "community_centered", "evaluation_process": "participatory"}', 50),

  (25, 'lyra_chat', 'Alex''s Transformation Leadership Reflection', 'Alex is proud of their organization''s successful AI transformation and wants to discuss the leadership lessons learned. They''re particularly interested in how this experience has shaped their understanding of change management in social justice contexts.', '{"character": "Alex Rivera", "context": "transformation_success_reflection", "minimumEngagement": 2, "emotional_tone": "accomplished_and_reflective"}', 65);

-- Lesson 26: Leading the Future
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (26, 'text_block', 'Alex''s Sector Leadership', 'One year after beginning their AI transformation journey, Alex Rivera has become a recognized leader in ethical technology adoption for social justice organizations. The "Justice-Centered AI Framework" they developed with community input is now used by 127 advocacy organizations across North America. Alex''s book "Technology for Liberation: AI and Social Justice in Practice" becomes required reading in nonprofit management programs.

But Alex''s greatest pride lies in the community of practice they''ve fostered. Monthly "AI for Justice" virtual gatherings bring together advocacy leaders, community members, and technology developers to share lessons, address challenges, and collaborate on tool development. These sessions have produced open-source AI applications designed specifically for grassroots organizing, policy advocacy, and community engagement.

"We''ve moved beyond asking whether social justice organizations should use AI," Alex explains during their TED talk. "We''re asking how AI can be designed and implemented to advance rather than undermine liberation movements."

Alex''s network now includes Sofia Martinez (communication storytelling), David Kim (data narrative), Rachel Thompson (human-centered automation), plus dozens of other practitioners who''ve proven that ethical AI adoption is possible when values guide technology choices rather than the reverse.', '{}', 10),

  (26, 'text_block', 'The Innovation Lab', 'Alex''s latest initiative involves launching the "Justice AI Innovation Lab" – a collaborative space where community organizations, technology developers, and affected communities co-design AI tools for social change. Unlike traditional tech development that creates solutions first and finds users later, the Innovation Lab starts with community-identified problems and builds AI applications to address specific justice challenges.

Current Lab projects include: an AI tool that analyzes municipal budgets to identify spending patterns that disadvantage marginalized communities, a language processing application that helps immigrant rights organizations track policy changes across multiple jurisdictions, and a pattern recognition system that identifies voter suppression tactics in real-time during elections.

"Every tool we develop includes community governance mechanisms," Alex explains to visiting foundations. "Affected communities control how their data is used, how algorithms make decisions, and whether tools continue to serve their needs."

The Innovation Lab has attracted funding from progressive foundations and technology companies committed to social impact. More importantly, it''s produced AI applications that demonstrably advance community organizing and policy advocacy goals while maintaining authentic grassroots voice.', '{}', 20),

  (26, 'text_block', 'The Legacy Vision', 'As Alex prepares to transition leadership of Citywide Coalition to focus full-time on the Justice AI Innovation Lab, they reflect on the transformation journey that started with organizational resistance to AI adoption. What began as an internal challenge has become a nationwide movement demonstrating that technology and social justice values can be mutually reinforcing.

"Five years ago, we saw AI as either essential for scaling impact or fundamentally incompatible with our values," Alex recalls during their farewell speech to Citywide Coalition staff. "We''ve proven that this was a false choice. When community voice guides technology development, AI becomes a tool for amplifying rather than replacing grassroots power."

Alex''s successor, Carmen Santos, represents the next generation of social justice leaders who view ethical AI as integral to effective advocacy. Under Carmen''s leadership, Citywide Coalition will pilot new AI applications for legislative tracking, coalition building, and community mobilization – all designed using Alex''s justice-centered framework.

"The future of social justice depends partly on our ability to use technology ethically and effectively," Alex concludes. "Not because technology is a silver bullet, but because our opponents increasingly use AI against the communities we serve. We have a responsibility to ensure AI serves liberation rather than oppression."

Alex''s phone buzzes with a text from Maya Rodriguez: "Saw your TED talk! Amazing how far we''ve all come since struggling with basic AI tools. Ready to change the world together?"', '{}', 30);

-- Lesson 26 Interactive Elements (4 components)
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (26, 'innovation_roadmap', 'Alex''s Justice AI Innovation Lab Roadmap', 'Help Alex develop a comprehensive roadmap for the Justice AI Innovation Lab that includes community partnerships, technology development priorities, funding strategies, and impact measurement frameworks.', '{"character": "Alex Rivera", "innovation_focus": "justice_centered_ai_development", "partnership_model": "community_co_design", "development_priorities": ["community_governance", "bias_mitigation", "grassroots_amplification"]}', 35),

  (26, 'ai_governance_builder', 'Alex''s Sector-Wide AI Ethics Framework', 'Alex wants to create governance standards that the entire social justice sector can adopt for ethical AI use. Help them design principles, accountability mechanisms, and implementation guidelines that ensure AI serves liberation rather than oppression.', '{"character": "Alex Rivera", "governance_scope": "sector_wide_standards", "target_audience": "social_justice_organizations", "ethical_principles": ["community_control", "transparency", "justice_alignment", "bias_mitigation"]}', 50),

  (26, 'impact_measurement', 'Alex''s Transformation Impact Assessment', 'Alex needs to measure the broader impact of their justice-centered AI work across the organizations and communities they''ve influenced. Help them design assessment tools that capture both quantitative outcomes and qualitative community experiences.', '{"character": "Alex Rivera", "impact_scope": "sector_transformation", "measurement_categories": ["organizational_effectiveness", "community_empowerment", "justice_advancement"], "assessment_methods": ["quantitative_metrics", "community_feedback", "case_studies"]}', 65),

  (26, 'lyra_chat', 'Alex''s Legacy and Future Vision Chat', 'Alex is transitioning from organizational leadership to sector-wide innovation work. They want to discuss their vision for how AI can serve social justice movements and their hopes for the next generation of advocacy leaders.', '{"character": "Alex Rivera", "context": "legacy_and_future_vision", "minimumEngagement": 3, "emotional_tone": "visionary_and_inspiring"}', 80);

-- Add connections between all characters in final lesson
UPDATE content_blocks 
SET content = content || '

🌟 Alex''s transformation journey connects all the pioneers who proved AI can amplify rather than replace human values: Maya Martinez revolutionized storytelling, James Chen mastered document creation, Sofia Martinez transformed communication, David Kim bridged data and narrative, and Rachel Thompson built human-centered automation. Together, they''ve created a model for ethical AI adoption that serves justice rather than profit.'
WHERE lesson_id = 26 AND title LIKE '%Legacy Vision%';