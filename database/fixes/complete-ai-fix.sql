-- Complete AI Fix for Missing Elements
-- This single file fixes both configuration AND content for all 10 missing elements

-- PART 1: Fix AI Configuration
-- =============================================================

-- Update Maya's elements (Chapter 2)
UPDATE interactive_elements
SET configuration = jsonb_build_object(
  'ai_powered', true,
  'llm_model', 'gpt-4o',
  'system_prompt', CASE 
    WHEN type = 'ai_email_composer' THEN 'Help nonprofit professionals write empathetic, professional emails. You are assisting Maya Rodriguez who manages an after-school program.'
    WHEN type = 'difficult_conversation_helper' THEN 'Guide nonprofit professionals through challenging conversations with board members and stakeholders. Focus on maintaining professionalism while advocating for program needs.'
    WHEN type = 'lyra_chat' THEN 'You are Lyra, an AI assistant helping Maya celebrate her email communication success and plan next steps. Be encouraging and help identify new areas for AI adoption.'
  END,
  'features', jsonb_build_object(
    'context_aware', true,
    'nonprofit_focus', true,
    'character_integration', 'Maya Rodriguez'
  ),
  'api_config', jsonb_build_object(
    'temperature', 0.7,
    'max_tokens', CASE 
      WHEN type = 'ai_email_composer' THEN 800
      WHEN type = 'difficult_conversation_helper' THEN 1000
      WHEN type = 'lyra_chat' THEN 500
    END,
    'response_format', 'conversational'
  ),
  'character_context', 'Maya Rodriguez',
  'lesson_context', 'AI Email Assistant',
  'chapter_context', 'AI for Your Daily Work',
  'nonprofit_focus', true,
  'learning_objectives', json_build_array(
    'Compose professional emails 3x faster using AI assistance',
    'Maintain authentic voice while leveraging AI suggestions',
    'Apply appropriate tone for different nonprofit audiences'
  )
)
WHERE id IN (68, 69, 70);

-- Update James's elements (Chapter 2) 
UPDATE interactive_elements
SET configuration = jsonb_build_object(
  'ai_powered', true,
  'llm_model', 'gpt-4o',
  'system_prompt', CASE 
    WHEN type = 'document_generator' THEN 'Help create compelling grant proposals for youth development programs. Focus on data-driven narratives that showcase program impact.'
    WHEN type = 'document_improver' THEN 'Enhance grant proposals and executive summaries by improving clarity, impact, and emotional resonance while maintaining accuracy.'
    WHEN type = 'template_creator' THEN 'Create reusable templates for grant applications that capture successful patterns while allowing customization for different funders.'
  END,
  'features', jsonb_build_object(
    'document_types', json_build_array('grant_proposal', 'executive_summary', 'impact_report'),
    'tone_adjustment', true,
    'data_integration', true,
    'template_library', true
  ),
  'api_config', jsonb_build_object(
    'temperature', 0.6,
    'max_tokens', CASE 
      WHEN type = 'document_generator' THEN 2000
      WHEN type = 'document_improver' THEN 1500
      WHEN type = 'template_creator' THEN 1500
    END,
    'response_format', 'document_sections'
  ),
  'character_context', 'Maya Rodriguez',
  'lesson_context', 'Document Creation Powerhouse',
  'chapter_context', 'AI for Your Daily Work',
  'nonprofit_focus', true,
  'learning_objectives', json_build_array(
    'Generate compelling grant proposals and reports with AI',
    'Balance data presentation with emotional storytelling',
    'Create documents that resonate with funders and stakeholders'
  )
)
WHERE id IN (71, 72, 73);

-- Update Database Debugger (utility element)
UPDATE interactive_elements
SET configuration = jsonb_build_object(
  'ai_powered', true,
  'llm_model', 'gpt-4o',
  'system_prompt', 'Assist in debugging database issues and understanding data relationships in the learning platform.',
  'features', jsonb_build_object(
    'diagnostic_tools', true,
    'query_generation', true,
    'error_analysis', true
  ),
  'api_config', jsonb_build_object(
    'temperature', 0.3,
    'max_tokens', 1000,
    'response_format', 'technical'
  ),
  'character_context', 'General',
  'nonprofit_focus', true,
  'utility_element', true
)
WHERE id = 75;

-- Update Sofia's elements (Chapter 3)
UPDATE interactive_elements
SET configuration = jsonb_build_object(
  'ai_powered', true,
  'llm_model', 'gpt-4o',
  'system_prompt', CASE 
    WHEN type = 'ai_content_generator' THEN 'Help Sofia Martinez transform data-heavy content into compelling stories for donors and community members. Focus on emotional connection.'
    WHEN type = 'difficult_conversation_helper' THEN 'Guide Sofia through challenging board meetings where she needs to present difficult truths while maintaining support.'
    WHEN type = 'lyra_chat' THEN 'You are Lyra, helping Sofia navigate a crisis communication situation. Provide strategic advice for maintaining stakeholder trust.'
  END,
  'features', jsonb_build_object(
    'storytelling_frameworks', json_build_array('problem_solution', 'transformation', 'impact_journey'),
    'audience_optimization', true,
    'crisis_management', true,
    'tone_coaching', true
  ),
  'api_config', jsonb_build_object(
    'temperature', CASE 
      WHEN type = 'ai_content_generator' THEN 0.8
      WHEN type = 'difficult_conversation_helper' THEN 0.6
      WHEN type = 'lyra_chat' THEN 0.7
    END,
    'max_tokens', CASE 
      WHEN type = 'ai_content_generator' THEN 1000
      WHEN type = 'difficult_conversation_helper' THEN 800
      WHEN type = 'lyra_chat' THEN 500
    END,
    'response_format', 'conversational'
  ),
  'character_context', 'Sofia Martinez',
  'lesson_context', CASE
    WHEN id = 104 THEN 'The Silent Crisis'
    WHEN id = 105 THEN 'Finding Her Voice'
    WHEN id = 106 THEN 'The Breakthrough Story'
  END,
  'chapter_context', 'Communication & Storytelling',
  'nonprofit_focus', true,
  'learning_objectives', json_build_array(
    'Transform data into compelling narratives',
    'Navigate difficult conversations with confidence',
    'Build trust through authentic communication'
  )
)
WHERE id IN (104, 105, 106);

-- PART 2: Fix Content Enhancement
-- =============================================================

-- Update Maya's elements content
UPDATE interactive_elements
SET content = 
  CASE
    WHEN content LIKE '%Maya Rodriguez%' THEN content
    ELSE 'Maya Rodriguez is facing a challenge that many nonprofit professionals encounter. ' || content
  END ||
  CASE
    WHEN content LIKE '%nonprofit%' THEN ''
    ELSE E'\n\nThis scenario reflects common challenges in nonprofit work. Apply these AI-powered techniques to strengthen your organization''s donor communications and stakeholder relationships.'
  END ||
  CASE
    WHEN content LIKE '%🎯%' THEN ''
    ELSE E'\n\n🎯 Learning Focus: Master AI-powered email communication and difficult conversations'
  END ||
  CASE
    WHEN content LIKE '%🤖%' THEN ''
    ELSE E'\n\n🤖 AI Capabilities: This tool uses advanced language models to ' ||
      CASE 
        WHEN type = 'ai_email_composer' THEN 'generate professional, empathetic email responses tailored to your nonprofit context.'
        WHEN type = 'difficult_conversation_helper' THEN 'provide coaching and suggestions for challenging professional situations.'
        WHEN type = 'lyra_chat' THEN 'provide conversational guidance and celebrate your progress in AI adoption.'
      END
  END
WHERE id IN (68, 69, 70);

-- Update James's elements content
UPDATE interactive_elements
SET content = 
  CASE 
    WHEN id = 71 THEN 'Maya Rodriguez is facing a challenge that many nonprofit professionals encounter. Help James (Maya''s colleague) complete his first AI-powered grant proposal for expanding the after-school program to serve 50 more students.'
    WHEN id = 72 THEN 'Maya Rodriguez is facing a challenge that many nonprofit professionals encounter. James needs to polish his executive summary to make it compelling for the foundation''s board. The data is strong, but the story needs to shine.'
    WHEN id = 73 THEN 'Maya Rodriguez is facing a challenge that many nonprofit professionals encounter. After James''s grant success, help him create a reusable template that captures the winning formula while allowing customization for different funders.'
  END ||
  E'\n\nThis scenario reflects common challenges in nonprofit work. Apply these AI-powered techniques to strengthen your organization''s grant writing and fundraising.' ||
  E'\n\n🎯 Learning Focus: Create compelling documents with AI assistance' ||
  E'\n\n🤖 AI Capabilities: This tool uses advanced language models to ' ||
  CASE 
    WHEN type = 'document_generator' THEN 'create compelling grant proposals and reports that balance data with storytelling.'
    WHEN type = 'document_improver' THEN 'enhance existing documents by improving clarity, impact, and emotional resonance while maintaining accuracy.'
    WHEN type = 'template_creator' THEN 'generate reusable templates that capture successful communication patterns.'
  END
WHERE id IN (71, 72, 73);

-- Update Sofia's elements content
UPDATE interactive_elements
SET content = 
  CASE
    WHEN content LIKE '%Sofia Martinez%' THEN content
    ELSE 'Sofia Martinez is facing a challenge that many nonprofit professionals encounter. ' || content
  END ||
  CASE
    WHEN content LIKE '%nonprofit%' THEN ''
    ELSE E'\n\nThis scenario reflects common challenges in nonprofit work. Apply these AI-powered techniques to strengthen your organization''s communication and storytelling.'
  END ||
  CASE
    WHEN content LIKE '%🎯%' THEN ''
    ELSE E'\n\n🎯 Learning Focus: Transform data into compelling narratives that inspire action'
  END ||
  CASE
    WHEN content LIKE '%🤖%' THEN ''
    ELSE E'\n\n🤖 AI Capabilities: This tool uses advanced language models to ' ||
      CASE 
        WHEN type = 'ai_content_generator' THEN 'transform statistics and data into emotionally resonant stories.'
        WHEN type = 'difficult_conversation_helper' THEN 'navigate challenging conversations with board members and stakeholders.'
        WHEN type = 'lyra_chat' THEN 'provide strategic communication advice during crisis situations.'
      END
  END
WHERE id IN (104, 105, 106);

-- Update Database Debugger content
UPDATE interactive_elements
SET content = content ||
  CASE
    WHEN content LIKE '%🎯%' THEN ''
    ELSE E'\n\n🎯 Learning Focus: Understand and troubleshoot technical implementations'
  END ||
  CASE
    WHEN content LIKE '%🤖%' THEN ''
    ELSE E'\n\n🤖 AI Capabilities: This tool uses advanced language models to assist in debugging database issues and understanding data relationships.'
  END
WHERE id = 75;

-- PART 3: Final Verification
-- =============================================================

SELECT 
  '=== VERIFICATION RESULTS ===' as section,
  COUNT(*) as total_fixed,
  COUNT(CASE WHEN configuration::text LIKE '%ai_powered": true%' THEN 1 END) as has_ai_config,
  COUNT(CASE WHEN content LIKE '%🎯%' THEN 1 END) as has_learning_focus,
  COUNT(CASE WHEN content LIKE '%🤖%' THEN 1 END) as has_ai_description
FROM interactive_elements
WHERE id IN (68, 69, 70, 71, 72, 73, 75, 104, 105, 106);

-- Show fixed elements
SELECT 
  id,
  type,
  title,
  configuration->>'llm_model' as model,
  configuration->>'character_context' as character,
  CASE 
    WHEN configuration::text LIKE '%ai_powered": true%' 
     AND content LIKE '%🎯%' 
     AND content LIKE '%🤖%' 
    THEN '✅ Fully Fixed'
    ELSE '⚠️ Needs Review'
  END as status
FROM interactive_elements
WHERE id IN (68, 69, 70, 71, 72, 73, 75, 104, 105, 106)
ORDER BY id;