-- Clean up old Chapter 2 content
-- Delete lessons 5, 6, 7, 8 and all their associated content

BEGIN;

-- Delete interactive element progress for the old lessons
DELETE FROM public.interactive_element_progress 
WHERE lesson_id IN (5, 6, 7, 8);

-- Delete lesson progress detailed for the old lessons
DELETE FROM public.lesson_progress_detailed 
WHERE lesson_id IN (5, 6, 7, 8);

-- Delete lesson progress for the old lessons
DELETE FROM public.lesson_progress 
WHERE lesson_id IN (5, 6, 7, 8);

-- Delete user interactions for the old lessons
DELETE FROM public.user_interactions 
WHERE lesson_id IN (5, 6, 7, 8);

-- Delete chat conversations for the old lessons
DELETE FROM public.chat_conversations 
WHERE lesson_id IN (5, 6, 7, 8);

-- Delete interactive elements for the old lessons
DELETE FROM public.interactive_elements 
WHERE lesson_id IN (5, 6, 7, 8);

-- Delete content blocks for the old lessons
DELETE FROM public.content_blocks 
WHERE lesson_id IN (5, 6, 7, 8);

-- Delete the old lessons themselves
DELETE FROM public.lessons 
WHERE id IN (5, 6, 7, 8);

-- Clean up any orphaned interactive elements with non-existent types
DELETE FROM public.interactive_elements 
WHERE type IN (
  'document_generator',
  'meeting_prep_assistant', 
  'report_generator',
  'template_creator',
  'research_assistant',
  'difficult_conversation_helper',
  'interactive_element_auditor',
  'automated_element_enhancer',
  'database_debugger',
  'database_content_viewer',
  'element_workflow_coordinator',
  'chapter_builder_agent',
  'content_audit_agent',
  'storytelling_agent'
);

-- Update Chapter 1 lesson order_index to be sequential
UPDATE public.lessons 
SET order_index = 1 
WHERE id = 3 AND chapter_id = 1;

UPDATE public.lessons 
SET order_index = 2 
WHERE id = 27 AND chapter_id = 1;

UPDATE public.lessons 
SET order_index = 3 
WHERE id = 28 AND chapter_id = 1;

UPDATE public.lessons 
SET order_index = 4 
WHERE id = 29 AND chapter_id = 1;

COMMIT;