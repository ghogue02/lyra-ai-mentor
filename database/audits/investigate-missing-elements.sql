-- Investigate Why Elements Were Missed
-- Let's understand what happened with these 10 elements

-- 1. Check creation/update timestamps
SELECT 
  id,
  type,
  title,
  created_at,
  updated_at,
  CASE 
    WHEN configuration IS NULL THEN 'NULL config'
    WHEN configuration::text = '{}' THEN 'Empty config'
    WHEN configuration::text LIKE '%ai_powered%' THEN 'Has AI'
    ELSE 'Missing AI'
  END as config_status,
  LENGTH(configuration::text) as config_length
FROM interactive_elements
WHERE id IN (68, 69, 70, 71, 72, 73, 75, 104, 105, 106)
ORDER BY id;

-- 2. Check if these are newer elements (created after enhancement)
SELECT 
  'Potentially New Elements' as check_type,
  COUNT(*) as count,
  MAX(created_at) as latest_creation,
  MIN(created_at) as earliest_creation
FROM interactive_elements
WHERE id IN (68, 69, 70, 71, 72, 73, 75, 104, 105, 106);

-- 3. Compare with successfully enhanced elements
SELECT 
  'Configuration Comparison' as analysis,
  COUNT(CASE WHEN id IN (68, 69, 70, 71, 72, 73, 75, 104, 105, 106) THEN 1 END) as missing_ai_elements,
  COUNT(CASE WHEN id NOT IN (68, 69, 70, 71, 72, 73, 75, 104, 105, 106) AND configuration::text LIKE '%ai_powered%' THEN 1 END) as has_ai_elements,
  COUNT(CASE WHEN configuration IS NULL OR configuration::text = '{}' THEN 1 END) as empty_configs
FROM interactive_elements;

-- 4. Check lesson distribution of missing elements
SELECT 
  l.id as lesson_id,
  l.title as lesson_title,
  c.title as chapter_title,
  COUNT(ie.id) as missing_ai_count,
  STRING_AGG(ie.id::text, ', ' ORDER BY ie.id) as element_ids
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
JOIN chapters c ON l.chapter_id = c.id
WHERE ie.id IN (68, 69, 70, 71, 72, 73, 75, 104, 105, 106)
GROUP BY l.id, l.title, c.title
ORDER BY l.id;

-- 5. Full details of missing elements
SELECT 
  ie.id,
  ie.lesson_id,
  l.title as lesson,
  ie.type,
  ie.title,
  COALESCE(ie.configuration::text, 'NULL') as current_config
FROM interactive_elements ie
JOIN lessons l ON ie.lesson_id = l.id
WHERE ie.id IN (68, 69, 70, 71, 72, 73, 75, 104, 105, 106)
ORDER BY ie.id;