-- Phase Variety Expansion: Chapters 3-6
-- Progressive complexity with character personality influence

-- CHAPTER 3: SOFIA (Creative Storyteller) - Introduce 4-phase elements
-- Character influence: Narrative-driven, creative flow

-- First element in each lesson: 2 phases (warm-up)
-- Middle elements: Mix of 1, 3, and 4 phases
-- Last element: 4 phases (comprehensive storytelling experience)

-- Lesson 10: Sofia's Silent Crisis
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{phases}',
  '[
    {
      "title": "Discover Sofia''s Crisis",
      "description": "Understand the communication breakdown that threatens programs",
      "duration": "3 minutes",
      "type": "discovery"
    },
    {
      "title": "Uncover the Real Problem",
      "description": "Identify the root cause beyond surface symptoms",
      "duration": "4 minutes", 
      "type": "analysis"
    }
  ]'::jsonb
)
WHERE id = 155; -- Sofia's Silent Crisis Story Creator (2 phases)

UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{phases}',
  '[
    {
      "title": "Read Sofia''s Struggling Email",
      "description": "Analyze the tone and impact of ineffective communication",
      "duration": "2 minutes",
      "type": "analysis"
    },
    {
      "title": "Feel the Disconnect",
      "description": "Experience how poor communication affects relationships",
      "duration": "3 minutes",
      "type": "empathy"
    },
    {
      "title": "Envision Better Connection",
      "description": "Imagine the potential for authentic engagement",
      "duration": "2 minutes",
      "type": "vision"
    },
    {
      "title": "Craft Your Solution",
      "description": "Create a compelling alternative approach",
      "duration": "8 minutes",
      "type": "creation"
    }
  ]'::jsonb
)
WHERE id = 104; -- Analyze Sofia's Struggling Email (4 phases - comprehensive)

-- Lesson 20: Sofia's Voice Discovery  
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{phases}',
  '[
    {
      "title": "Sofia''s Breakthrough Moment",
      "description": "Experience the shift from struggle to clarity",
      "duration": "3 minutes",
      "type": "story"
    },
    {
      "title": "Find Your Voice",
      "description": "Discover your organization''s authentic communication style",
      "duration": "5 minutes",
      "type": "discovery"
    }
  ]'::jsonb
)
WHERE id = 156; -- Sofia's Voice Discovery Journey (2 phases)

UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{phases}',
  '[
    {
      "title": "Charlie''s Original Story",
      "description": "Read the dry, disconnected version",
      "duration": "2 minutes",
      "type": "baseline"
    },
    {
      "title": "Sofia''s Transformation Method",
      "description": "Learn the storytelling framework that changes everything",
      "duration": "4 minutes",
      "type": "method"
    },
    {
      "title": "Rewrite with Heart",
      "description": "Apply the framework to create emotional connection",
      "duration": "8 minutes",
      "type": "practice"
    },
    {
      "title": "Measure the Impact",
      "description": "See how stories drive engagement and action",
      "duration": "3 minutes",
      "type": "validation"
    }
  ]'::jsonb
)
WHERE id = 107; -- Help Sofia Rewrite Charlie's Story (4 phases - Sofia's comprehensive method)

-- CHAPTER 4: DAVID (Analytical Thinker) - Structured 4-phase elements
-- Character influence: Data-driven, methodical progression

-- Lesson 10: David's Data Graveyard
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{phases}',
  '[
    {
      "title": "Confront the Data Graveyard",
      "description": "Face David''s overwhelming spreadsheet crisis",
      "duration": "3 minutes",
      "type": "problem"
    },
    {
      "title": "Diagnose the Disconnect",
      "description": "Analyze why data fails to drive decisions",
      "duration": "4 minutes",
      "type": "analysis"
    }
  ]'::jsonb
)
WHERE id = 159; -- David's Data Graveyard Revival (2 phases)

UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{phases}',
  '[
    {
      "title": "Examine David''s Failed Presentation",
      "description": "Understand why data presentations fall flat",
      "duration": "3 minutes",
      "type": "analysis"
    },
    {
      "title": "Identify the Missing Element",
      "description": "Discover what transforms data into insight",
      "duration": "4 minutes",
      "type": "insight"
    },
    {
      "title": "Structure Your Approach",
      "description": "Build a systematic method for data storytelling",
      "duration": "6 minutes",
      "type": "framework"
    },
    {
      "title": "Validate with Results",
      "description": "Test your approach against real outcomes",
      "duration": "5 minutes",
      "type": "validation"
    }
  ]'::jsonb
)
WHERE id = 76; -- Analyze David's Failed Presentation (4 phases - David's methodical approach)

-- CHAPTER 5: RACHEL (Efficiency Expert) - 5-phase comprehensive systems
-- Character influence: Process optimization, scalable solutions

-- Lesson 10: Rachel's Automation Vision
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{phases}',
  '[
    {
      "title": "Rachel''s Revelation",
      "description": "Experience the moment efficiency meets humanity",
      "duration": "3 minutes",
      "type": "vision"
    },
    {
      "title": "Map Current State",
      "description": "Assess your organization''s automation readiness",
      "duration": "5 minutes",
      "type": "assessment"
    }
  ]'::jsonb
)
WHERE id = 163; -- Rachel's Human-Centered Automation Vision (2 phases)

UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{phases}',
  '[
    {
      "title": "Assess Current Workflows",
      "description": "Map existing processes and pain points",
      "duration": "4 minutes",
      "type": "assessment"
    },
    {
      "title": "Design Human-Centered Solutions",
      "description": "Create automation that enhances rather than replaces",
      "duration": "6 minutes",
      "type": "design"
    },
    {
      "title": "Implement Systematically",
      "description": "Build your automation step by step",
      "duration": "8 minutes",
      "type": "implementation"
    },
    {
      "title": "Optimize for Impact",
      "description": "Fine-tune systems for maximum effectiveness",
      "duration": "5 minutes",
      "type": "optimization"
    },
    {
      "title": "Scale Across Organization",
      "description": "Expand successful automation to all departments",
      "duration": "7 minutes",
      "type": "scaling"
    }
  ]'::jsonb
)
WHERE id = 118; -- Analyze Rachel's Time-Saving Systems (5 phases - Rachel's comprehensive method)

-- CHAPTER 6: ALEX (Visionary Leader) - 5-phase transformational experiences
-- Character influence: Strategic thinking, organizational transformation

-- Lesson 10: Alex's Change Leadership
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{phases}',
  '[
    {
      "title": "Alex''s Leadership Challenge",
      "description": "Understand the complexity of organizational AI adoption",
      "duration": "4 minutes",
      "type": "challenge"
    },
    {
      "title": "Envision Transformation",
      "description": "See the potential for justice-centered AI implementation",
      "duration": "5 minutes",
      "type": "vision"
    }
  ]'::jsonb
)
WHERE id = 167; -- Alex's Change Leadership Strategy (2 phases)

UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{phases}',
  '[
    {
      "title": "Assess Organizational Readiness",
      "description": "Evaluate your organization''s capacity for AI transformation",
      "duration": "5 minutes",
      "type": "assessment"
    },
    {
      "title": "Build Strategic Vision",
      "description": "Create a compelling future state that aligns with values",
      "duration": "7 minutes",
      "type": "visioning"
    },
    {
      "title": "Design Pilot Programs",
      "description": "Develop proof-of-concept initiatives to demonstrate value",
      "duration": "10 minutes",
      "type": "design"
    },
    {
      "title": "Implement with Community",
      "description": "Execute transformation with stakeholder engagement",
      "duration": "8 minutes",
      "type": "implementation"
    },
    {
      "title": "Lead Sector Change",
      "description": "Scale impact beyond your organization to influence the field",
      "duration": "10 minutes",
      "type": "leadership"
    }
  ]'::jsonb
)
WHERE id = 90; -- Assess Citywide Coalition's AI Readiness (5 phases - Alex's transformational approach)

-- Verify phase variety distribution
SELECT 
  c.order_index as chapter,
  l.order_index as lesson,
  ie.title,
  CASE 
    WHEN ie.configuration ? 'phases' THEN 
      jsonb_array_length(ie.configuration->'phases')
    ELSE 1
  END as phase_count
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE c.order_index IN (3, 4, 5, 6)
  AND ie.is_active = true
ORDER BY c.order_index, l.order_index, ie.order_index;