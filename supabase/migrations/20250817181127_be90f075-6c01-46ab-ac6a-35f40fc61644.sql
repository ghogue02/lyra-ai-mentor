-- Add Carmen character type and HR content types
ALTER TABLE generated_content 
DROP CONSTRAINT IF EXISTS generated_content_character_type_check;

ALTER TABLE generated_content 
ADD CONSTRAINT generated_content_character_type_check 
CHECK (character_type = ANY (ARRAY['maya'::text, 'sofia'::text, 'david'::text, 'rachel'::text, 'alex'::text, 'carmen'::text]));

-- Update content type constraint to include HR-specific types
ALTER TABLE generated_content 
DROP CONSTRAINT IF EXISTS generated_content_content_type_check;

ALTER TABLE generated_content 
ADD CONSTRAINT generated_content_content_type_check 
CHECK (content_type = ANY (ARRAY['email'::text, 'document'::text, 'story'::text, 'analysis'::text, 'automation'::text, 'transformation'::text, 'hr_template'::text, 'evaluation_framework'::text, 'recruitment_tool'::text, 'team_analysis'::text, 'retention_model'::text]));

-- Insert Chapter 7: AI-Powered People Management
INSERT INTO chapters (id, title, description, icon, order_index, duration, is_published)
VALUES (
    7,
    'AI-Powered People Management',
    'Transform your HR practices with Carmen Rodriguez as she revolutionizes performance management, recruitment, team dynamics, and retention using AI-powered tools and frameworks.',
    'users',
    7,
    '180 minutes',
    true
);

-- Insert Lesson 1: Bias-Free Performance Excellence
INSERT INTO lessons (id, chapter_id, title, subtitle, order_index, estimated_duration, is_published)
VALUES (
    71,
    7,
    'Bias-Free Performance Excellence',
    'Transform performance reviews into objective, development-focused conversations',
    1,
    45,
    true
);

-- Insert Lesson 2: Mission-Aligned Talent Acquisition
INSERT INTO lessons (id, chapter_id, title, subtitle, order_index, estimated_duration, is_published)
VALUES (
    72,
    7,
    'Mission-Aligned Talent Acquisition', 
    'Revolutionize recruitment to attract diverse, passionate candidates',
    2,
    45,
    true
);

-- Insert Lesson 3: Intelligent Team Dynamics Optimization
INSERT INTO lessons (id, chapter_id, title, subtitle, order_index, estimated_duration, is_published)
VALUES (
    73,
    7,
    'Intelligent Team Dynamics Optimization',
    'Enhance team communication and collaboration through AI-powered insights',
    3,
    45,
    true
);

-- Insert Lesson 4: Predictive Retention & Growth Planning
INSERT INTO lessons (id, chapter_id, title, subtitle, order_index, estimated_duration, is_published)
VALUES (
    74,
    7,
    'Predictive Retention & Growth Planning',
    'Anticipate staffing needs and prevent turnover through AI-powered analytics',
    4,
    45,
    true
);