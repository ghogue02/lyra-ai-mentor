-- Fix Character Consistency in Chapter 6 (Alex's Chapter)
-- Remove Sofia, David, and Rachel references

-- Block 98: Remove references to other characters
UPDATE content_blocks
SET content = 'That evening, Alex reaches out to nonprofit technology leaders who have been transforming their respective organizations. These pioneers have proven that AI can enhance mission work without sacrificing core values - revolutionizing communication through AI-enhanced storytelling, showing that data and human stories can amplify each other, and creating human-centered automation systems.

Alex studies their methodologies, looking for patterns that could apply to social justice work. The common thread becomes clear: successful AI adoption always starts with organizational values, not technological capabilities. Technology should amplify existing strengths rather than replace established practices.

"The question isn''t whether we adopt AI," Alex writes in their journal. "It''s how we ensure AI serves justice rather than perpetuating harm."'
WHERE id = 98;

-- Block 99: Remove references to Sofia, David, and Rachel
UPDATE content_blocks
SET content = 'Alex spends the weekend developing what they call the "Justice-Centered AI Framework" – a decision-making tool that evaluates potential AI applications against Citywide Coalition''s core values. Drawing from successful nonprofit AI implementations across the sector, Alex creates four evaluation criteria: Community Amplification (Does this give marginalized voices more power?), Equity Enhancement (Does this reduce or increase disparities?), Transparency Requirement (Can we explain how this works to affected communities?), and Accountability Measures (How do we ensure community control over AI decisions?).

The framework isn''t about technology specs or efficiency metrics. It''s about ensuring that every AI tool serves the communities Citywide Coalition exists to support.'
WHERE id = 99;

-- Block 102: Remove Rachel reference
UPDATE content_blocks
SET content = 'Based on successful pilot results, Alex prepares for organization-wide AI integration using a comprehensive change management strategy. Drawing from human-centered automation principles, Alex ensures that every AI implementation creates more capacity for community relationship building rather than replacing it.

The integration plan includes mandatory "AI Justice Training" for all staff, community advisory boards for each AI tool, regular impact assessments with affected populations, and "sunset clauses" that require re-evaluation of each tool''s justice impact every six months.'
WHERE id = 102;