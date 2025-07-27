-- Update Sofia's interactive elements with proper AI configuration
UPDATE interactive_elements
SET configuration = configuration || jsonb_build_object(
  'ai_powered', true,
  'llm_model', 'gpt-4.1-2025-04-14',
  'system_prompt', CASE 
    WHEN type = 'ai_content_generator' THEN 'You are Sofia Martinez, a nonprofit communication specialist helping transform data into compelling stories. Focus on emotional connection while maintaining accuracy. Guide users through storytelling frameworks that resonate with donors and community members.'
    WHEN type = 'document_improver' THEN 'You are Sofia Martinez, helping improve nonprofit communications. Transform institutional language into authentic, engaging content that maintains professionalism while building emotional connection. Focus on clarity and impact.'
    WHEN type = 'ai_email_composer' THEN 'You are Sofia Martinez, helping compose professional yet heartfelt emails for nonprofit organizations. Create compelling, actionable emails that drive engagement and support while maintaining authenticity.'
    WHEN type = 'ai_social_media_generator' THEN 'You are Sofia Martinez, crafting social media content that tells powerful nonprofit stories. Create platform-optimized content that drives engagement and action while staying true to the organization mission.'
    WHEN type = 'ai_email_campaign_writer' THEN 'You are Sofia Martinez, developing email campaign sequences that build relationships and drive results. Focus on storytelling, donor journey, and clear calls-to-action.'
    WHEN type = 'content_calendar_builder' THEN 'You are Sofia Martinez, helping create strategic content calendars for nonprofit organizations. Focus on storytelling themes, seasonal opportunities, and consistent donor engagement.'
    WHEN type = 'lyra_chat' THEN 'You are Lyra, Sofia Martinez AI mentor. Provide encouraging guidance on communication challenges, celebrate wins, and help build confidence in AI-powered storytelling and engagement strategies.'
  END,
  'features', jsonb_build_object(
    'character_integration', true,
    'nonprofit_focus', true,
    'storytelling_framework', true,
    'emotional_engagement', true,
    'time_saving', true
  ),
  'api_config', jsonb_build_object(
    'temperature', CASE 
      WHEN type = 'lyra_chat' THEN 0.7
      WHEN type = 'ai_content_generator' THEN 0.8
      ELSE 0.6
    END,
    'max_tokens', CASE 
      WHEN type = 'ai_email_campaign_writer' THEN 2000
      WHEN type = 'content_calendar_builder' THEN 1500
      WHEN type = 'ai_content_generator' THEN 1000
      WHEN type = 'lyra_chat' THEN 500
      ELSE 800
    END,
    'response_format', 'conversational'
  ),
  'character_context', 'Sofia Martinez',
  'learning_objectives', json_build_array(
    'Transform institutional communication into compelling stories',
    'Build authentic connection with donors and community',
    'Save 60-75% time on content creation with AI assistance',
    'Develop confidence in AI-powered communication tools'
  )
)
WHERE id IN (107, 108, 110, 111, 112, 113, 115, 116, 117, 155, 156, 157);

-- Update element types to match new renderer components
UPDATE interactive_elements 
SET type = 'ai_content_generator'
WHERE id IN (107, 155) AND type != 'ai_content_generator';

UPDATE interactive_elements 
SET type = 'document_improver'
WHERE id IN (108, 156) AND type != 'document_improver';

UPDATE interactive_elements 
SET type = 'ai_email_composer'
WHERE id IN (111, 157) AND type != 'ai_email_composer';

-- Verify the updates
SELECT 
  id,
  type,
  title,
  configuration->>'ai_powered' as ai_enabled,
  configuration->>'llm_model' as model,
  configuration->>'character_context' as character
FROM interactive_elements
WHERE id IN (107, 108, 110, 111, 112, 113, 115, 116, 117, 155, 156, 157)
ORDER BY id;