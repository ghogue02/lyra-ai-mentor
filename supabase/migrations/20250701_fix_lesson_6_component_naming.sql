-- Fix component naming for Chapter 2 Lesson 2 (Document Creation Powerhouse)
-- Updates report_generator to document_generator to match component expectations

-- Update the interactive element type from report_generator to document_generator
UPDATE interactive_elements
SET type = 'document_generator'
WHERE lesson_id = 6 AND type = 'report_generator';

-- This ensures consistency between the database and the component code
-- The re-test report confirms this naming is what the InteractiveElementRenderer expects