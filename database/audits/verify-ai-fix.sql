-- Verify AI Fix Results
-- Run this after applying fix-missing-ai-elements.sql

-- 1. Overall AI Coverage (should be 100%)
SELECT 
  'After Fix: AI Coverage' as status,
  COUNT(*) as total_elements,
  COUNT(CASE WHEN configuration::text LIKE '%ai_powered%' THEN 1 END) as ai_enabled,
  COUNT(CASE WHEN configuration::text NOT LIKE '%ai_powered%' OR configuration IS NULL THEN 1 END) as still_missing,
  ROUND(COUNT(CASE WHEN configuration::text LIKE '%ai_powered%' THEN 1 END)::numeric / COUNT(*)::numeric * 100, 2) || '%' as coverage_percentage
FROM interactive_elements;

-- 2. Check the 10 previously missing elements
SELECT 
  id,
  type,
  title,
  configuration->>'ai_powered' as ai_powered,
  configuration->>'llm_model' as model,
  configuration->>'character_context' as character,
  CASE 
    WHEN configuration::text LIKE '%ai_powered": true%' THEN '✅ Fixed'
    ELSE '❌ Still Missing'
  END as status
FROM interactive_elements
WHERE id IN (68, 69, 70, 71, 72, 73, 75, 104, 105, 106)
ORDER BY id;

-- 3. Verify all elements have GPT-4o
SELECT 
  'Model Distribution' as check,
  configuration->>'llm_model' as model,
  COUNT(*) as count
FROM interactive_elements
WHERE configuration IS NOT NULL
GROUP BY configuration->>'llm_model'
ORDER BY count DESC;

-- 4. Final check for any remaining issues
SELECT 
  id,
  type,
  title,
  'Missing: ' || 
  CASE 
    WHEN configuration IS NULL THEN 'Configuration is NULL'
    WHEN configuration::text = '{}' THEN 'Configuration is empty'
    WHEN configuration::text NOT LIKE '%ai_powered%' THEN 'No ai_powered field'
    WHEN configuration::text NOT LIKE '%llm_model%' THEN 'No llm_model field'
    ELSE 'Unknown issue'
  END as issue
FROM interactive_elements
WHERE configuration IS NULL 
   OR configuration::text = '{}'
   OR configuration::text NOT LIKE '%ai_powered%'
   OR configuration::text NOT LIKE '%llm_model%'
LIMIT 20;

-- 5. Success Summary
SELECT 
  'Enhancement Complete' as milestone,
  COUNT(*) as total_interactive_elements,
  COUNT(CASE WHEN configuration::text LIKE '%gpt-4o%' THEN 1 END) as using_gpt_4o,
  COUNT(CASE WHEN content LIKE '%nonprofit%' THEN 1 END) as has_nonprofit_context,
  COUNT(CASE WHEN content LIKE '%🎯%' THEN 1 END) as has_learning_focus,
  COUNT(CASE WHEN content LIKE '%🤖%' THEN 1 END) as has_ai_description
FROM interactive_elements;