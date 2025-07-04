-- Fix Character Consistency in Chapter 4 (David's Chapter)
-- Remove Sofia references and replace with David's self-discovery or other appropriate characters

-- Content Block ID 86: Replace Sofia meeting with self-reflection
UPDATE content_blocks
SET content = 'David reviews feedback from his latest presentation, searching for patterns. The rejection letters all point to the same issue: "Your data presentations are incredibly thorough," one funder wrote, "but we had no idea what it meant for actual people."

David pulls out his phone and scrolls through successful grant announcements from other organizations. They all start with stories, not statistics. Real people with real challenges and real transformations. His charts show the same transformations, but buried under layers of methodology and correlation coefficients.'
WHERE id = 86;

-- Content Block ID 87: Remove Sofia's advice reference
UPDATE content_blocks
SET content = 'David opens his laptop and stares at the spreadsheet containing 847 program participant records. A memory from a recent workshop on data storytelling echoes in his mind. He searches for "Marcus Williams" and finds row 234: Age 19, Program Entry Date: March 15, Housing Status: Unstable, Employment History: None, Program Completion: Yes, Current Employment: Full-time, Wage: $18/hour.'
WHERE id = 87;

-- Content Block ID 89: Remove Sofia's storytelling principles reference
UPDATE content_blocks
SET content = 'David spends the weekend reconstructing his youth employment presentation using data storytelling principles he''s been studying. Instead of starting with methodology, he begins with Marcus sleeping in his car. Instead of correlation tables, he shows the pathway from unstable housing to stable employment. The data remains rigorous, but now it breathes with human experience.'
WHERE id = 89;

-- Verify the updates
SELECT id, SUBSTRING(content, 1, 200) as updated_content
FROM content_blocks
WHERE id IN (86, 87, 89);