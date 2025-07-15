-- Fix Missing Content Enhancement
-- This updates the content for the 10 elements that were missed, adding learning focus and AI capabilities

-- Update Maya's elements content (IDs 68-70)
UPDATE interactive_elements
SET content = content || 
  E'\n\nThis scenario reflects common challenges in nonprofit work. Apply these AI-powered techniques to strengthen your organization''s donor communications and stakeholder relationships.' ||
  E'\n\n🎯 Learning Focus: Master AI-powered email communication and difficult conversations' ||
  E'\n\n🤖 AI Capabilities: This tool uses advanced language models to ' ||
  CASE 
    WHEN type = 'ai_email_composer' THEN 'generate professional, empathetic email responses tailored to your nonprofit context.'
    WHEN type = 'difficult_conversation_helper' THEN 'provide coaching and suggestions for challenging professional situations.'
    WHEN type = 'lyra_chat' THEN 'provide conversational guidance and celebrate your progress in AI adoption.'
  END
WHERE id IN (68, 69, 70)
  AND content NOT LIKE '%🎯 Learning Focus:%';

-- Update James's elements content (IDs 71-73)
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
WHERE id IN (71, 72, 73)
  AND content NOT LIKE '%🎯 Learning Focus:%';

-- Update Sofia's elements content (IDs 104-106)
UPDATE interactive_elements
SET content = 
  CASE
    WHEN content LIKE '%Sofia%' THEN content
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
WHERE id IN (104, 105, 106)
  AND (content NOT LIKE '%🎯 Learning Focus:%' OR content NOT LIKE '%Sofia Martinez%');

-- Update Database Debugger content (ID 75)
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
WHERE id = 75
  AND content NOT LIKE '%🎯 Learning Focus:%';

-- Verify content updates
SELECT 
  id,
  type,
  title,
  CASE 
    WHEN content LIKE '%Maya Rodriguez%' OR content LIKE '%Sofia Martinez%' THEN '✅ Has Character'
    ELSE '❌ Missing Character'
  END as character_check,
  CASE 
    WHEN content LIKE '%🎯 Learning Focus:%' THEN '✅ Has Learning'
    ELSE '❌ Missing Learning'
  END as learning_check,
  CASE 
    WHEN content LIKE '%🤖 AI Capabilities:%' THEN '✅ Has AI Info'
    ELSE '❌ Missing AI Info'
  END as ai_check,
  LENGTH(content) as content_length
FROM interactive_elements
WHERE id IN (68, 69, 70, 71, 72, 73, 75, 104, 105, 106)
ORDER BY id;