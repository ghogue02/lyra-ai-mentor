-- Chapter 2 Update Queries
-- Execute after verification to fix issues

-- 1. Update any James references in content blocks to Maya
-- First, review results from search query before running updates

-- Example update (customize based on findings):
/*
UPDATE content_blocks
SET content = REPLACE(content, 'James', 'Maya')
WHERE id IN (
  -- Add specific IDs from search results
);
*/

-- 2. Update interactive element configurations
-- Add Maya as character where missing
UPDATE interactive_elements ie
SET configuration = 
  CASE 
    WHEN configuration IS NULL THEN 
      jsonb_build_object('character', 'Maya Rodriguez')
    ELSE 
      jsonb_set(configuration, '{character}', '"Maya Rodriguez"')
  END,
  updated_at = NOW()
FROM lessons l
JOIN chapters c ON l.chapter_id = c.id
WHERE ie.lesson_id = l.id
  AND c.chapter_number = 2
  AND ie.is_active = true
  AND (
    configuration IS NULL OR
    NOT configuration ? 'character' OR
    configuration->>'character' != 'Maya Rodriguez'
  );

-- 3. Add time metrics to all interactive elements
-- Update each element type with appropriate metrics

-- Email elements (Lesson 5)
UPDATE interactive_elements
SET configuration = jsonb_set(
  COALESCE(configuration, '{}'::jsonb),
  '{timeSavings}',
  '{
    "before": "32 minutes of email anxiety",
    "after": "5 minutes of confident communication",
    "metric": "84% time saved"
  }'::jsonb
)
WHERE lesson_id = 5
  AND type IN ('ai_email_composer', 'prompt_builder')
  AND is_active = true;

-- Document elements (Lesson 6)
UPDATE interactive_elements
SET configuration = jsonb_set(
  COALESCE(configuration, '{}'::jsonb),
  '{timeSavings}',
  '{
    "before": "3 weeks of grant rewrites",
    "after": "2 hours to compelling draft",
    "metric": "90% time saved"
  }'::jsonb
)
WHERE lesson_id = 6
  AND type IN ('document_generator', 'grant_writer')
  AND is_active = true;

-- Meeting elements (Lesson 7)
UPDATE interactive_elements
SET configuration = jsonb_set(
  COALESCE(configuration, '{}'::jsonb),
  '{timeSavings}',
  '{
    "before": "60 minutes of meeting prep",
    "after": "15 minutes of strategic planning",
    "metric": "75% time saved"
  }'::jsonb
)
WHERE lesson_id = 7
  AND type IN ('agenda_creator', 'meeting_prep_assistant')
  AND is_active = true;

-- Research elements (Lesson 8)
UPDATE interactive_elements
SET configuration = jsonb_set(
  COALESCE(configuration, '{}'::jsonb),
  '{timeSavings}',
  '{
    "before": "2 hours of manual research",
    "after": "30 minutes of targeted insights",
    "metric": "75% time saved"
  }'::jsonb
)
WHERE lesson_id = 8
  AND type IN ('research_assistant', 'information_summarizer')
  AND is_active = true;

-- 4. Update element titles to include Maya where appropriate
UPDATE interactive_elements
SET title = 
  CASE
    WHEN type = 'document_generator' AND lesson_id = 6 THEN 'Maya''s Grant Proposal Mastery'
    WHEN type = 'agenda_creator' AND lesson_id = 7 THEN 'Maya''s Meeting Agenda Builder'
    WHEN type = 'research_assistant' AND lesson_id = 8 THEN 'Maya''s Research Synthesis Tool'
    ELSE title
  END,
  updated_at = NOW()
WHERE lesson_id IN (SELECT id FROM lessons WHERE chapter_id = 2)
  AND is_active = true
  AND title NOT LIKE '%Maya%';