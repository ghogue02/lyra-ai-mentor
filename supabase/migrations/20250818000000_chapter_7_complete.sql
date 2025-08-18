-- Chapter 7: AI-Powered People Management - Complete Implementation
-- Date: 2025-08-18
-- Purpose: Create Chapter 7 with Carmen as the guide for HR transformation

-- =========================================================================
-- PART 1: CREATE CHAPTER 7 AND LESSONS
-- =========================================================================

-- Insert Chapter 7
INSERT INTO chapters (id, title, description, order_index, icon, duration, is_published) VALUES 
(7, 'AI-Powered People Management', 'Transform your HR practices with Carmen''s compassionate approach to AI-powered people management, from recruitment to retention with human-centered solutions.', 7, 'users', 115, true)
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  duration = EXCLUDED.duration,
  is_published = EXCLUDED.is_published;

-- Insert Chapter 7 lessons
INSERT INTO lessons (id, chapter_id, title, subtitle, order_index, estimated_duration, is_published) VALUES 
(71, 7, 'Bias-Free Performance Excellence', 'Learn to create objective, development-focused performance evaluations that eliminate unconscious bias while promoting meaningful growth conversations with your team.', 1, 25, true),
(72, 7, 'AI-Enhanced Recruitment Strategy', 'Master the art of attracting and selecting diverse talent using AI-powered screening tools that remove bias while identifying the best candidates for your mission.', 2, 30, true),
(73, 7, 'People Analytics for Growth', 'Harness the power of people data to create personalized development plans, predict retention risks, and build stronger, more engaged teams.', 3, 28, true),
(74, 7, 'Human-Centered HR Automation', 'Automate routine HR tasks while maintaining the personal touch that makes your organization special, creating more time for meaningful human connections.', 4, 32, true)
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  order_index = EXCLUDED.order_index,
  estimated_duration = EXCLUDED.estimated_duration,
  is_published = EXCLUDED.is_published;

-- =========================================================================
-- PART 2: LESSON 71 - BIAS-FREE PERFORMANCE EXCELLENCE
-- =========================================================================

INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index, is_active) VALUES
-- Introduction
(71, 'text', 'Welcome to Performance Excellence', 'Hi there! I''m Carmen, and I''m thrilled to guide you through revolutionizing your performance management approach. After years of watching traditional performance reviews fail both managers and employees, I''ve discovered how AI can help us create truly fair, development-focused evaluations that people actually look forward to. Let''s transform this critical HR function together.', '{"version": "1.0"}', 10, true),

-- Character introduction
(71, 'lyra_chat', 'Meet Carmen, Your HR Guide', 'I''ve spent my career helping organizations build people-first HR practices. I believe that performance management should empower growth, not create anxiety. Through AI-powered tools, we can eliminate unconscious bias, focus on development, and create meaningful conversations that strengthen your team. Ready to revolutionize your approach?', '{"characterId": "carmen", "minimumEngagement": 2, "blockingEnabled": false, "chatType": "persistent"}', 20, true),

-- Core concept
(71, 'text', 'The Performance Revolution', 'Traditional performance reviews often reflect manager bias more than employee performance. Studies show that identical work samples receive dramatically different ratings based on the employee''s name, gender, or background. AI-powered performance tools can help us focus on actual contributions, growth patterns, and development opportunities rather than subjective impressions.', '{"version": "1.0"}', 30, true),

-- Interactive framework builder
(71, 'workshop', 'Build Your Bias-Free Framework', 'Let''s create a personalized performance framework for your organization. I''ll guide you through selecting metrics, setting development goals, and designing growth-focused conversations that work for your team''s unique needs.', '{"type": "performance_framework", "steps": ["current_assessment", "metric_selection", "goal_setting", "conversation_design"], "aiEnabled": true, "characterPersona": "carmen"}', 40, true),

-- Carmen''s insights
(71, 'text', 'Carmen''s Performance Philosophy', 'Here''s what I''ve learned: the best performance conversations happen when we focus on future potential rather than past mistakes. AI helps us identify growth patterns, suggest development opportunities, and track progress in ways that feel supportive rather than punitive. It''s about building people up, not breaking them down.', '{"version": "1.0"}', 50, true),

-- Practical application
(71, 'reflection', 'Designing Your Growth Conversations', 'Think about your current performance review process. What would change if every conversation focused on unlocking potential rather than documenting problems? How might AI help you identify development opportunities you''re currently missing?', '{"prompt": "How would you redesign your performance conversations to focus on growth and potential?", "placeholderText": "For example, I would start each conversation by...", "minLength": 50}', 60, true)

ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- PART 3: LESSON 72 - AI-ENHANCED RECRUITMENT STRATEGY
-- =========================================================================

INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index, is_active) VALUES
-- Introduction
(72, 'text', 'Revolutionizing Recruitment', 'Recruitment is where equity begins. Traditional hiring processes are riddled with unconscious bias - from resume screening to interview questions. But here''s the exciting part: AI can help us build recruitment systems that actually find the best candidates while promoting diversity and inclusion. Let''s create a hiring process your organization can be proud of.', '{"version": "1.0"}', 10, true),

-- Strategic approach
(72, 'text', 'The Bias-Free Hiring Pipeline', 'AI-powered recruitment tools can anonymize applications, analyze job descriptions for biased language, and even suggest interview questions that predict success. Companies using these tools see 23% more diverse candidate pools and 31% better retention rates. The technology exists - now let''s learn how to use it effectively.', '{"version": "1.0"}', 20, true),

-- Interactive strategy builder
(72, 'workshop', 'Design Your Recruitment Strategy', 'Let''s build a comprehensive recruitment strategy tailored to your organization''s needs. We''ll identify your biggest hiring challenges and design AI-powered solutions that attract diverse talent while maintaining your mission focus.', '{"type": "recruitment_strategy", "steps": ["challenge_assessment", "pipeline_design", "tool_selection", "implementation_plan"], "aiEnabled": true, "characterPersona": "carmen"}', 30, true),

-- Carmen''s guidance
(72, 'lyra_chat', 'Carmen''s Recruitment Wisdom', 'The best hiring decisions happen when we focus on potential and cultural alignment rather than perfect resume matches. I''ve seen AI tools help organizations discover amazing candidates they would have overlooked. What matters most in your hiring process?', '{"characterId": "carmen", "minimumEngagement": 2, "blockingEnabled": false, "chatType": "persistent"}', 40, true),

-- Implementation focus
(72, 'text', 'From Strategy to Action', 'Implementation is where strategy meets reality. The key is starting with one part of your recruitment process - maybe resume screening or interview scheduling - and gradually expanding your AI toolkit. Small wins build confidence and demonstrate value to your team and leadership.', '{"version": "1.0"}', 50, true),

-- Action planning
(72, 'reflection', 'Your Recruitment Action Plan', 'Considering your current hiring challenges, which aspect of recruitment would benefit most from AI enhancement? What would success look like for your organization?', '{"prompt": "What''s your first step toward AI-enhanced recruitment?", "placeholderText": "My organization would benefit most from...", "minLength": 40}', 60, true)

ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- PART 4: LESSON 73 - PEOPLE ANALYTICS FOR GROWTH
-- =========================================================================

INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index, is_active) VALUES
-- Introduction
(73, 'text', 'The Power of People Data', 'Your organization generates incredible amounts of data about employee engagement, performance, and growth - but most of it goes unused. People analytics can help you predict retention risks, identify high-potential employees, and create personalized development plans. Let''s turn your people data into strategic advantage.', '{"version": "1.0"}', 10, true),

-- Analytics foundation
(73, 'text', 'Building Your Analytics Foundation', 'People analytics isn''t about surveillance - it''s about insight. By analyzing patterns in performance data, engagement surveys, and career progression, we can identify what makes employees thrive in your organization. This intelligence helps us create better experiences for everyone.', '{"version": "1.0"}', 20, true),

-- Interactive analytics workshop
(73, 'workshop', 'Create Your People Analytics Strategy', 'Let''s design a people analytics approach that respects privacy while generating actionable insights. We''ll identify key metrics, design data collection methods, and create reporting systems that drive better decision-making.', '{"type": "people_analytics", "steps": ["data_inventory", "metric_selection", "privacy_design", "insight_planning"], "aiEnabled": true, "characterPersona": "carmen"}', 30, true),

-- Carmen''s perspective
(73, 'text', 'Carmen''s Analytics Philosophy', 'I believe people analytics should empower both managers and employees. When we share insights transparently - showing people their growth patterns, suggesting development opportunities, and highlighting their contributions - analytics becomes a tool for mutual success rather than top-down control.', '{"version": "1.0"}', 40, true),

-- Practical implementation
(73, 'lyra_chat', 'Implementing People Analytics', 'Starting with people analytics can feel overwhelming, but it doesn''t have to be. What aspects of your team''s performance or engagement are you most curious about? Let''s identify where analytics could make the biggest immediate impact.', '{"characterId": "carmen", "minimumEngagement": 2, "blockingEnabled": false, "chatType": "persistent"}', 50, true),

-- Future vision
(73, 'reflection', 'Your Analytics Vision', 'Imagine having clear insights into what makes your employees thrive, early warning signs of disengagement, and personalized development recommendations for each team member. What decisions would you make differently with this information?', '{"prompt": "How would people analytics change your leadership approach?", "placeholderText": "With better people data, I would...", "minLength": 45}', 60, true)

ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- PART 5: LESSON 74 - HUMAN-CENTERED HR AUTOMATION
-- =========================================================================

INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index, is_active) VALUES
-- Introduction
(74, 'text', 'Automation with Heart', 'HR automation shouldn''t make your workplace feel robotic - it should free up time for the human connections that matter most. When we automate routine tasks thoughtfully, we create space for meaningful conversations, strategic thinking, and the relationship-building that makes organizations thrive.', '{"version": "1.0"}', 10, true),

-- Strategic approach
(74, 'text', 'The Human-Centered Approach', 'The best HR automation enhances rather than replaces human judgment. We can automate scheduling, document processing, and routine communications while ensuring that important decisions still involve human insight and empathy. It''s about working smarter, not becoming less human.', '{"version": "1.0"}', 20, true),

-- Interactive automation planning
(74, 'workshop', 'Design Your HR Automation Strategy', 'Let''s identify which HR tasks are ready for automation and which require human touch. We''ll create an implementation roadmap that saves time while preserving the personal relationships that make your organization special.', '{"type": "hr_automation", "steps": ["task_analysis", "automation_prioritization", "human_touchpoint_design", "implementation_roadmap"], "aiEnabled": true, "characterPersona": "carmen"}', 30, true),

-- Carmen''s wisdom
(74, 'lyra_chat', 'Balancing Efficiency and Humanity', 'I''ve learned that the best HR automation feels invisible to employees while dramatically improving their experience. What HR processes in your organization feel unnecessarily complicated or time-consuming? Let''s identify opportunities for thoughtful automation.', '{"characterId": "carmen", "minimumEngagement": 3, "blockingEnabled": false, "chatType": "persistent"}', 40, true),

-- Implementation guidance
(74, 'text', 'Making Automation Work', 'Successful HR automation starts with understanding your current workflows and identifying pain points. Then we can select tools that integrate seamlessly with your existing systems while improving the employee experience. The goal is to automate the administrative work so you can focus on the strategic and relational aspects of HR.', '{"version": "1.0"}', 50, true),

-- Vision for the future
(74, 'reflection', 'Your Automated Future', 'Envision your ideal HR workflow: administrative tasks happen seamlessly in the background while you focus on coaching, strategic planning, and building meaningful relationships with your team. What becomes possible when routine work is automated?', '{"prompt": "How would HR automation change your daily work and impact?", "placeholderText": "If routine HR tasks were automated, I could spend more time...", "minLength": 50}', 60, true),

-- Chapter conclusion
(74, 'text', 'Your People-First AI Journey', 'Congratulations on completing your journey into AI-powered people management! You now have the frameworks and strategies to transform your HR practices while keeping humanity at the center. Remember: the best AI tools amplify your ability to care for and develop your team. The future of HR is both more efficient and more human.', '{"version": "1.0"}', 70, true)

ON CONFLICT (id) DO NOTHING;