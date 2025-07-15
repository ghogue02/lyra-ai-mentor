-- Fix Chapter 2 Interactive Element Alignment
-- Direct SQL approach to bypass any RLS issues

-- Lesson 5 corrections
UPDATE interactive_elements SET order_index = 45 WHERE id = 68;  -- Turn Maya's Email Anxiety into Connection
UPDATE interactive_elements SET order_index = 135 WHERE id = 171; -- Maya's Parent Response Email Helper

-- Lesson 6 corrections  
UPDATE interactive_elements SET order_index = 15 WHERE id = 152; -- Maya's Grant Proposal Challenge
UPDATE interactive_elements SET order_index = 45 WHERE id = 172; -- Maya's Strategic Grant Proposal Builder

-- Lesson 7 corrections
UPDATE interactive_elements SET order_index = 15 WHERE id = 173; -- Maya's Critical Board Meeting Preparation
UPDATE interactive_elements SET order_index = 25 WHERE id = 153; -- Maya's Emergency Board Meeting Prep

-- Lesson 8 corrections
UPDATE interactive_elements SET order_index = 15 WHERE id = 174; -- Maya's Research Synthesis Wizard
UPDATE interactive_elements SET order_index = 25 WHERE id = 154; -- Maya's Research Synthesis Challenge

-- Verification query
SELECT 
    ie.id,
    ie.lesson_id,
    ie.title,
    ie.order_index,
    CASE 
        WHEN ie.id = 68 AND ie.order_index = 45 THEN '✅'
        WHEN ie.id = 171 AND ie.order_index = 135 THEN '✅'
        WHEN ie.id = 152 AND ie.order_index = 15 THEN '✅'
        WHEN ie.id = 172 AND ie.order_index = 45 THEN '✅'
        WHEN ie.id = 173 AND ie.order_index = 15 THEN '✅'
        WHEN ie.id = 153 AND ie.order_index = 25 THEN '✅'
        WHEN ie.id = 174 AND ie.order_index = 15 THEN '✅'
        WHEN ie.id = 154 AND ie.order_index = 25 THEN '✅'
        ELSE '❌'
    END as status
FROM interactive_elements ie
WHERE ie.id IN (68, 171, 152, 172, 173, 153, 174, 154)
ORDER BY ie.lesson_id, ie.order_index;