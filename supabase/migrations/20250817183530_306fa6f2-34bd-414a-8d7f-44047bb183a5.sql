-- Add Carmen character type and new HR content types
ALTER TABLE characters 
ADD CONSTRAINT check_character_type 
CHECK (character_type IN ('lyra', 'maya', 'aiden', 'zara', 'david', 'alex', 'carmen'));

ALTER TABLE content_blocks 
ADD CONSTRAINT check_content_type 
CHECK (content_type IN ('introduction', 'lesson', 'exercise', 'summary', 'challenge', 'reflection', 'workshop', 'scenario', 'case_study', 'assessment', 'milestone', 'interactive', 'hr_analytics', 'people_insights', 'performance_metrics', 'talent_acquisition', 'employee_engagement', 'retention_strategies'));

-- Insert Carmen character if not exists
INSERT INTO characters (character_type, name, description, personality_traits, background_story, expertise_areas, communication_style, visual_description, character_arc_data)
VALUES (
  'carmen',
  'Carmen Rodriguez',
  'Compassionate HR Director who transforms traditional people management with AI-powered solutions while maintaining human connection.',
  '["Empathetic", "Data-driven", "People-focused", "Innovative", "Strategic", "Collaborative"]',
  'Carmen Rodriguez has spent 15 years in HR, witnessing the evolution from paper files to digital systems. As HR Director at a mid-sized nonprofit, she champions using AI to enhance human potential rather than replace human judgment. Her journey involves learning to balance efficiency with empathy, using AI tools to create more personalized employee experiences while ensuring no one feels like just a number.',
  '["Human Resources", "People Analytics", "Employee Engagement", "Talent Management", "Performance Management", "Organizational Development", "AI-powered HR Tools", "Diversity and Inclusion"]',
  'Warm and approachable, Carmen speaks with genuine care for people while backing her insights with solid data. She uses storytelling to make HR metrics meaningful and always frames AI capabilities in terms of how they serve human flourishing.',
  'Carmen has shoulder-length curly brown hair often pulled back in a professional but approachable style. She favors business casual attire in warm earth tones - rust orange blazers, cream blouses, and comfortable yet polished shoes. Her workspace features family photos, plants, and both traditional HR books and modern AI guides, reflecting her blend of human intuition and technological innovation.',
  '{
    "current_challenge": "Implementing AI-powered HR solutions while maintaining personal touch",
    "growth_arc": ["Skeptical of AI in HR", "Learning AI capabilities", "Discovering human-AI collaboration", "Mastering AI-enhanced people management"],
    "key_relationships": ["Mentors other HR professionals", "Collaborates with IT teams", "Advocates for employees"],
    "transformation_metrics": {
      "recruitment_efficiency": "60% faster candidate screening",
      "employee_satisfaction": "25% increase in engagement scores",
      "retention_improvement": "30% reduction in turnover"
    }
  }'
) ON CONFLICT (character_type) DO NOTHING;