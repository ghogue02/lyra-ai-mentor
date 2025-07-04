-- Verify Enhancement Success
-- Run this to confirm all improvements are in the database

-- 1. Check AI Integration Coverage
SELECT 
  'AI Integration' as metric,
  COUNT(*) as total_elements,
  COUNT(CASE WHEN configuration::text LIKE '%ai_powered%' THEN 1 END) as ai_integrated,
  COUNT(CASE WHEN configuration::text LIKE '%gpt-4o%' THEN 1 END) as using_gpt4o,
  ROUND(COUNT(CASE WHEN configuration::text LIKE '%ai_powered%' THEN 1 END)::numeric / COUNT(*)::numeric * 100, 2) || '%' as coverage
FROM interactive_elements;

-- 2. Check Content Quality Improvements
SELECT 
  'Content Enrichment' as metric,
  AVG(LENGTH(content)) as avg_content_length,
  COUNT(CASE WHEN content LIKE '%🎯 Learning Focus:%' THEN 1 END) as has_learning_focus,
  COUNT(CASE WHEN content LIKE '%🤖 AI Capabilities:%' THEN 1 END) as has_ai_description,
  COUNT(CASE WHEN LENGTH(content) > 500 THEN 1 END) as rich_content_count
FROM interactive_elements;

-- 3. Verify Character Integration by Chapter
SELECT 
  c.id as chapter_id,
  c.title as chapter_title,
  COUNT(ie.id) as total_elements,
  COUNT(CASE 
    WHEN c.id = 2 AND ie.content LIKE '%Maya%' THEN 1
    WHEN c.id = 3 AND ie.content LIKE '%Sofia%' THEN 1
    WHEN c.id = 4 AND ie.content LIKE '%David%' THEN 1
    WHEN c.id = 5 AND ie.content LIKE '%Rachel%' THEN 1
    WHEN c.id = 6 AND ie.content LIKE '%Alex%' THEN 1
  END) as has_character_story,
  COUNT(CASE 
    WHEN c.id = 2 AND configuration::text LIKE '%Maya Rodriguez%' THEN 1
    WHEN c.id = 3 AND configuration::text LIKE '%Sofia Martinez%' THEN 1
    WHEN c.id = 4 AND configuration::text LIKE '%David Kim%' THEN 1
    WHEN c.id = 5 AND configuration::text LIKE '%Rachel Thompson%' THEN 1
    WHEN c.id = 6 AND configuration::text LIKE '%Alex Rivera%' THEN 1
  END) as has_character_config
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
GROUP BY c.id, c.title
ORDER BY c.id;

-- 4. Check Nonprofit Context Saturation
SELECT 
  'Nonprofit Context' as metric,
  COUNT(*) as total_elements,
  COUNT(CASE WHEN LOWER(content) LIKE '%nonprofit%' THEN 1 END) as mentions_nonprofit,
  COUNT(CASE WHEN LOWER(content) LIKE '%donor%' THEN 1 END) as mentions_donor,
  COUNT(CASE WHEN LOWER(content) LIKE '%mission%' THEN 1 END) as mentions_mission,
  COUNT(CASE WHEN LOWER(content) LIKE '%volunteer%' THEN 1 END) as mentions_volunteer,
  COUNT(CASE WHEN LOWER(content) LIKE '%grant%' THEN 1 END) as mentions_grant
FROM interactive_elements;

-- 5. Verify Type Upgrades
SELECT 
  type,
  COUNT(*) as count,
  COUNT(CASE WHEN configuration::text LIKE '%ai_powered": true%' THEN 1 END) as ai_enabled
FROM interactive_elements
GROUP BY type
ORDER BY count DESC
LIMIT 10;

-- 6. Sample Enhanced Elements
SELECT 
  ie.type,
  ie.title,
  LEFT(ie.content, 150) || '...' as content_preview,
  configuration->>'llm_model' as ai_model,
  c.title as chapter
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE configuration::text LIKE '%ai_powered": true%'
  AND LENGTH(content) > 500
  AND content LIKE '%🎯%'
ORDER BY RANDOM()
LIMIT 5;

-- 7. Elements Still Needing Attention (should be empty)
SELECT 
  ie.id,
  ie.type,
  ie.title,
  CASE 
    WHEN configuration::text NOT LIKE '%ai_powered%' THEN 'Missing AI'
    WHEN LENGTH(content) < 200 THEN 'Short content'
    WHEN content NOT LIKE '%nonprofit%' AND content NOT LIKE '%mission%' THEN 'Missing context'
    ELSE 'Other'
  END as issue
FROM interactive_elements ie
WHERE configuration::text NOT LIKE '%ai_powered%'
   OR LENGTH(content) < 200
   OR (content NOT LIKE '%nonprofit%' AND content NOT LIKE '%mission%')
LIMIT 10;