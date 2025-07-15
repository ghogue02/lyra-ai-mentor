-- Test Enhancement Results
-- Run this AFTER using the Automated Element Enhancer to verify improvements

-- 1. Verify AI Integration Coverage
SELECT 
  'AI Integration Coverage' as metric,
  COUNT(*) as total_elements,
  COUNT(CASE WHEN configuration::text LIKE '%ai_powered%' THEN 1 END) as ai_integrated,
  ROUND(COUNT(CASE WHEN configuration::text LIKE '%ai_powered%' THEN 1 END)::numeric / COUNT(*)::numeric * 100, 2) || '%' as ai_coverage,
  COUNT(CASE WHEN configuration::text LIKE '%gpt-4o%' THEN 1 END) as using_gpt4
FROM interactive_elements;

-- 2. Verify Nonprofit Context Improvement
SELECT 
  'Nonprofit Context' as metric,
  COUNT(*) as total_elements,
  COUNT(CASE WHEN content LIKE '%nonprofit%' OR content LIKE '%donor%' OR content LIKE '%mission%' OR content LIKE '%volunteer%' OR content LIKE '%grant%' THEN 1 END) as has_context,
  ROUND(COUNT(CASE WHEN content LIKE '%nonprofit%' OR content LIKE '%donor%' OR content LIKE '%mission%' OR content LIKE '%volunteer%' OR content LIKE '%grant%' THEN 1 END)::numeric / COUNT(*)::numeric * 100, 2) || '%' as context_coverage
FROM interactive_elements;

-- 3. Check Element Type Upgrades
SELECT 
  type,
  COUNT(*) as count,
  CASE 
    WHEN type IN ('lyra_chat', 'ai_content_generator', 'workflow_automator') THEN 'AI-Powered'
    WHEN type IN ('reflection', 'knowledge_check', 'callout_box') THEN 'Static (Should be upgraded)'
    ELSE 'Other'
  END as category
FROM interactive_elements
GROUP BY type
ORDER BY category, count DESC;

-- 4. Verify Character Integration
SELECT 
  c.title as chapter,
  COUNT(ie.id) as total_elements,
  COUNT(CASE WHEN ie.content LIKE '%Maya%' OR ie.content LIKE '%Sofia%' OR ie.content LIKE '%David%' OR ie.content LIKE '%Rachel%' OR ie.content LIKE '%Alex%' THEN 1 END) as has_character,
  ROUND(COUNT(CASE WHEN ie.content LIKE '%Maya%' OR ie.content LIKE '%Sofia%' OR ie.content LIKE '%David%' OR ie.content LIKE '%Rachel%' OR ie.content LIKE '%Alex%' THEN 1 END)::numeric / COUNT(ie.id)::numeric * 100, 2) || '%' as character_coverage
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
GROUP BY c.id, c.title
ORDER BY c.id;

-- 5. Content Quality Improvement
SELECT 
  'Content Quality' as metric,
  AVG(LENGTH(content)) as avg_content_length,
  MIN(LENGTH(content)) as min_content_length,
  MAX(LENGTH(content)) as max_content_length,
  COUNT(CASE WHEN LENGTH(content) > 500 THEN 1 END) as rich_content_count,
  COUNT(CASE WHEN content LIKE '%🎯%' THEN 1 END) as has_learning_focus,
  COUNT(CASE WHEN content LIKE '%🤖%' THEN 1 END) as has_ai_description
FROM interactive_elements;

-- 6. Sample Enhanced Elements
SELECT 
  ie.type,
  ie.title,
  SUBSTRING(ie.content, 1, 200) || '...' as enhanced_content_preview,
  ie.configuration->>'ai_powered' as ai_powered,
  ie.configuration->>'llm_model' as llm_model
FROM interactive_elements ie
WHERE ie.configuration::text LIKE '%ai_powered%'
  AND ie.content LIKE '%nonprofit%'
  AND LENGTH(ie.content) > 500
ORDER BY RANDOM()
LIMIT 5;

-- 7. Elements Still Needing Enhancement (if any)
SELECT 
  ie.id,
  ie.type,
  ie.title,
  'Missing: ' || 
  CASE WHEN ie.configuration::text NOT LIKE '%ai_powered%' THEN 'AI Integration, ' ELSE '' END ||
  CASE WHEN ie.content NOT LIKE '%nonprofit%' AND ie.content NOT LIKE '%donor%' THEN 'Nonprofit Context, ' ELSE '' END ||
  CASE WHEN LENGTH(ie.content) < 200 THEN 'Rich Content' ELSE '' END as issues
FROM interactive_elements ie
WHERE ie.configuration::text NOT LIKE '%ai_powered%'
   OR (ie.content NOT LIKE '%nonprofit%' AND ie.content NOT LIKE '%donor%')
   OR LENGTH(ie.content) < 200
LIMIT 10;