-- Implement Phase Variety in Interactive Elements
-- Goal: Create mix of 1, 2, and 3-phase experiences per lesson

-- Strategy:
-- 1. First element in lesson: 2 phases (warm-up + main)
-- 2. Middle elements: Alternate between 1 and 3 phases
-- 3. Last element: 3 phases (comprehensive practice)

-- Example phase structures:
-- 1-phase: Direct practice
-- 2-phase: Context/Setup → Practice
-- 3-phase: Learn → Apply → Reflect

-- Chapter 2, Lesson 5 (AI Email Assistant) - 3 elements
-- Element 1 (id: 68): 2 phases - Analyze anxiety → Write with confidence
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{phases}',
  '[
    {
      "title": "Understand Maya''s Email Challenge",
      "description": "Analyze what makes email communication anxiety-inducing",
      "duration": "2 minutes",
      "type": "analysis"
    },
    {
      "title": "Transform Anxiety into Connection",
      "description": "Write emails with AI support that build relationships",
      "duration": "5 minutes",
      "type": "practice"
    }
  ]'::jsonb
)
WHERE id = 68;

-- Element 2 (id: 175): Keep as 1 phase (focused skill building)
-- Already single phase

-- Element 3 (id: 171): 3 phases - Scenario → Draft → Refine
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{phases}',
  '[
    {
      "title": "Parent Concern Scenario",
      "description": "Understand the delicate situation Maya faces",
      "duration": "2 minutes",
      "type": "context"
    },
    {
      "title": "Draft Your Response",
      "description": "Use AI to help craft an empathetic email",
      "duration": "5 minutes",
      "type": "creation"
    },
    {
      "title": "Refine for Impact",
      "description": "Polish your email to strengthen parent relationships",
      "duration": "3 minutes",
      "type": "refinement"
    }
  ]'::jsonb
)
WHERE id = 171;

-- Chapter 2, Lesson 6 (Document Creation) - 2 elements
-- Element 1 (id: 152): 3 phases - Challenge → Create → Impact
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{phases}',
  '[
    {
      "title": "Maya''s Grant Writing Crisis",
      "description": "Understand the high-stakes proposal challenge",
      "duration": "3 minutes",
      "type": "scenario"
    },
    {
      "title": "Build Your Proposal",
      "description": "Use AI to create compelling grant content",
      "duration": "10 minutes",
      "type": "creation"
    },
    {
      "title": "Measure Your Impact",
      "description": "See how AI transformed your grant writing time",
      "duration": "2 minutes",
      "type": "reflection"
    }
  ]'::jsonb
)
WHERE id = 152;

-- Element 2 (id: 172): 2 phases - Strategy → Execution
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{phases}',
  '[
    {
      "title": "Strategic Planning",
      "description": "Map out your grant proposal approach",
      "duration": "5 minutes",
      "type": "planning"
    },
    {
      "title": "AI-Powered Writing",
      "description": "Execute your strategy with AI assistance",
      "duration": "10 minutes",
      "type": "execution"
    }
  ]'::jsonb
)
WHERE id = 172;

-- Chapter 2, Lesson 7 (Meeting Master) - 2 elements  
-- Element 1 (id: 173): 2 phases
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{phases}',
  '[
    {
      "title": "Board Meeting Stakes",
      "description": "Understand Maya''s critical meeting challenge",
      "duration": "3 minutes",
      "type": "context"
    },
    {
      "title": "Prepare Like a Pro",
      "description": "Use AI to create comprehensive meeting materials",
      "duration": "7 minutes",
      "type": "preparation"
    }
  ]'::jsonb
)
WHERE id = 173;

-- Element 2 (id: 153): Keep as 1 phase for variety

-- Chapter 2, Lesson 8 (Research) - 2 elements
-- Element 1 (id: 174): 3 phases
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{phases}',
  '[
    {
      "title": "Research Overload",
      "description": "Experience Maya''s information synthesis challenge",
      "duration": "2 minutes",
      "type": "problem"
    },
    {
      "title": "AI-Powered Synthesis",
      "description": "Transform scattered research into insights",
      "duration": "8 minutes",
      "type": "synthesis"
    },
    {
      "title": "Apply Your Findings",
      "description": "Create actionable recommendations",
      "duration": "5 minutes",
      "type": "application"
    }
  ]'::jsonb
)
WHERE id = 174;

-- Verify the updates
SELECT 
  l.order_index as lesson,
  ie.title,
  CASE 
    WHEN ie.configuration ? 'phases' THEN 
      jsonb_array_length(ie.configuration->'phases')
    ELSE 1
  END as phases
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
WHERE l.chapter_id = 2
  AND ie.is_active = true
ORDER BY l.order_index, ie.order_index;