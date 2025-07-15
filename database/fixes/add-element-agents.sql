-- Add Interactive Element Agents to Chapter 2
-- These agents work together to audit and enhance all interactive elements across the platform

-- Add Interactive Element Auditor to Maya's lesson (Lesson 5)
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (5, 'interactive_element_auditor', 'Interactive Element Auditor', 
   'Maya discovered that great communication requires continuous improvement. This agent analyzes all interactive elements across chapters 1-6, evaluating story integration, learning alignment, AI connectivity, and engagement potential.

Use this tool to identify which elements need enhancement to better serve nonprofit professionals.', 
   '{"audit_scope": "all_chapters", "evaluation_criteria": ["story_integration", "learning_alignment", "ai_connectivity", "engagement_potential", "content_relevance"], "priority_scoring": true}', 95);

-- Add Interactive Element Builder to James's lesson (Lesson 6)  
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (6, 'interactive_element_builder', 'Interactive Element Builder', 
   'James learned that great documents require the right tools. This agent implements audit recommendations, converting static elements to AI-powered experiences with OpenAI integration.

Transform learning elements to maximize engagement and practical applicability for nonprofit work.', 
   '{"ai_integration": "openai_gpt4", "enhancement_types": ["content_improvement", "type_conversion", "ai_connectivity"], "deployment": "direct_to_database"}', 105);

-- Add Element Workflow Coordinator to James's lesson (Lesson 6)
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  (6, 'element_workflow_coordinator', 'Element Workflow Coordinator', 
   'Just as James created systems for efficient document creation, this coordinator manages the complete element enhancement workflow. It seamlessly connects the auditor and builder agents for systematic improvement.

Use this for end-to-end element optimization across your entire learning platform.', 
   '{"workflow_steps": ["audit", "build", "complete"], "agent_coordination": true, "progress_tracking": true, "integration_ecosystem": "all_agents"}', 110);

-- Update existing Content Audit Agent to reference new element agents
UPDATE interactive_elements 
SET content = content || '

🔧 Pro Tip: After using the Content Audit Agent, run the Interactive Element Auditor to ensure your enhanced content is delivered through engaging, AI-powered interactions that maximize learning impact.'
WHERE lesson_id = 5 AND type = 'content_audit_agent';

-- Update existing Chapter Builder Agent to reference element enhancement
UPDATE interactive_elements 
SET content = content || '

⚡ Next Level: Use the Element Workflow Coordinator to audit and enhance all interactive elements in your newly built chapters, ensuring maximum engagement and AI integration.'
WHERE lesson_id = 6 AND type = 'chapter_builder_agent';

-- Add connecting narrative to show agent ecosystem
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (6, 'callout_box', 'The Complete AI Agent Ecosystem', 
   '🎯 **Master Suite Available**: Maya and James have unlocked the complete toolkit for nonprofit AI transformation:

📝 **Content Quality**: Content Audit Agent → Storytelling Agent  
🔧 **Element Enhancement**: Element Auditor → Element Builder → Workflow Coordinator  
📚 **Chapter Development**: Chapter Builder Agent → Database Debugger  
🛠️ **System Management**: Database Debugger → All Agents Integration

This interconnected ecosystem ensures your learning platform maintains the highest standards while scaling effectively.', 
   '{"type": "success", "ecosystem_complete": true}', 117);