-- Add Time Metrics to Interactive Elements Across All Chapters
-- Based on judgment protocol: tool usage, process improvement, content generation

-- CHAPTER 3: COMMUNICATION & STORYTELLING (Sofia)
-- Elements that need time metrics based on tool usage and content generation

-- Sofia's story creation tools
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{timeSavings}',
  '{
    "before": "45 minutes to craft compelling stories",
    "after": "10-15 minutes with AI assistance",
    "metric": "65-75% time saved"
  }'::jsonb
)
WHERE id IN (155, 104); -- AI content generators for story creation

-- Document improvement tools
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{timeSavings}',
  '{
    "before": "2 hours of rewrites and edits",
    "after": "30-45 minutes with AI guidance",
    "metric": "60-70% time saved"
  }'::jsonb
)
WHERE id IN (156, 107, 108); -- Document improvers

-- Template and system creation
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{timeSavings}',
  '{
    "before": "3-4 hours to build from scratch",
    "after": "45-60 minutes with AI templates",
    "metric": "70-75% time saved"
  }'::jsonb
)
WHERE id IN (109, 114); -- Template creators

-- Email and campaign tools
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{timeSavings}',
  '{
    "before": "60 minutes per campaign email",
    "after": "15-20 minutes with AI drafting",
    "metric": "65-75% time saved"
  }'::jsonb
)
WHERE id IN (111, 115); -- Email composers

-- Social media generation
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{timeSavings}',
  '{
    "before": "45 minutes for multi-platform posts",
    "after": "10-15 minutes with AI generation",
    "metric": "65-75% time saved"
  }'::jsonb
)
WHERE id = 112;

-- Content calendar builder
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{timeSavings}',
  '{
    "before": "2-3 hours monthly planning",
    "after": "30-45 minutes with AI assistance",
    "metric": "70-80% time saved"
  }'::jsonb
)
WHERE id = 116;

-- CHAPTER 4: DATA & DECISION MAKING (David)
-- Elements focused on data analysis and presentation

-- Data analysis tools
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{timeSavings}',
  '{
    "before": "2-3 hours of manual analysis",
    "after": "30-45 minutes with AI insights",
    "metric": "70-80% time saved"
  }'::jsonb
)
WHERE id = 76;

-- Data storytelling tools
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{timeSavings}',
  '{
    "before": "90 minutes to find compelling narratives",
    "after": "20-30 minutes with AI assistance",
    "metric": "65-75% time saved"
  }'::jsonb
)
WHERE id = 79;

-- Presentation and document improvement
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{timeSavings}',
  '{
    "before": "2 hours crafting presentations",
    "after": "45 minutes with AI support",
    "metric": "60-65% time saved"
  }'::jsonb
)
WHERE id IN (80, 84);

-- Dashboard creation
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{timeSavings}',
  '{
    "before": "4-5 hours building dashboards",
    "after": "1-2 hours with AI templates",
    "metric": "60-75% time saved"
  }'::jsonb
)
WHERE id = 81;

-- Content generation for data insights
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{timeSavings}',
  '{
    "before": "60 minutes writing data stories",
    "after": "15-20 minutes with AI drafting",
    "metric": "65-75% time saved"
  }'::jsonb
)
WHERE id IN (83, 88);

-- Template creation for data systems
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{timeSavings}',
  '{
    "before": "3-4 hours developing frameworks",
    "after": "1 hour with AI assistance",
    "metric": "70-75% time saved"
  }'::jsonb
)
WHERE id = 86;

-- CHAPTER 5: AUTOMATION & EFFICIENCY (Rachel)
-- Elements focused on workflow optimization

-- Workflow automation tools
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{timeSavings}',
  '{
    "before": "8 hours mapping and building workflows",
    "after": "2-3 hours with AI optimization",
    "metric": "60-70% time saved"
  }'::jsonb
)
WHERE id IN (118, 128);

-- Process optimization
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{timeSavings}',
  '{
    "before": "6 hours analyzing processes",
    "after": "1.5-2 hours with AI analysis",
    "metric": "65-75% time saved"
  }'::jsonb
)
WHERE id = 123;

-- System documentation and templates
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{timeSavings}',
  '{
    "before": "4 hours creating documentation",
    "after": "1 hour with AI templates",
    "metric": "75% time saved"
  }'::jsonb
)
WHERE id IN (122, 129);

-- Story and content generation
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{timeSavings}',
  '{
    "before": "90 minutes writing case studies",
    "after": "20-30 minutes with AI assistance",
    "metric": "65-75% time saved"
  }'::jsonb
)
WHERE id IN (121, 125, 130);

-- CHAPTER 6: ORGANIZATIONAL TRANSFORMATION (Alex)
-- Only add metrics to concrete tool/process elements

-- Impact measurement and reporting
UPDATE interactive_elements
SET configuration = jsonb_set(
  configuration,
  '{timeSavings}',
  '{
    "before": "4-5 hours compiling impact reports",
    "after": "1-2 hours with AI analysis",
    "metric": "60-75% time saved"
  }'::jsonb
)
WHERE id = 102;

-- Note: Most Chapter 6 elements are strategic/governance focused
-- and don't fit our time metrics criteria yet

-- Verify the updates
SELECT 
  c.order_index as chapter,
  COUNT(*) as total_elements,
  COUNT(CASE WHEN ie.configuration->>'timeSavings' IS NOT NULL THEN 1 END) as with_metrics,
  ROUND(COUNT(CASE WHEN ie.configuration->>'timeSavings' IS NOT NULL THEN 1 END) * 100.0 / COUNT(*), 1) as percentage
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE ie.is_active = true
GROUP BY c.order_index
ORDER BY c.order_index;