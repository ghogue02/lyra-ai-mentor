-- Seed file for toolkit categories
-- This ensures all required toolkit categories exist in the database
-- Safe to run multiple times (idempotent)

-- Insert toolkit categories with ON CONFLICT to prevent duplicates
INSERT INTO public.toolkit_categories (category_key, name, description, icon, gradient, order_index) VALUES
    ('email', 'Email Templates', 'Professional email templates for every occasion', 'Mail', 'from-blue-500 to-cyan-500', 1),
    ('grants', 'Grant Proposals', 'Winning grant proposal templates and guides', 'FileText', 'from-purple-500 to-pink-500', 2),
    ('data', 'Data Visualizations', 'Interactive charts and data presentation tools', 'BarChart3', 'from-green-500 to-emerald-500', 3),
    ('automation', 'Automation Workflows', 'Time-saving automation templates', 'Workflow', 'from-orange-500 to-red-500', 4),
    ('change', 'Change Management', 'Tools for managing organizational change', 'Users', 'from-indigo-500 to-purple-500', 5),
    ('social', 'Social Media Content', 'Engaging social media templates', 'Share2', 'from-pink-500 to-rose-500', 6),
    ('training', 'Training Materials', 'Educational resources and training templates', 'BookOpen', 'from-teal-500 to-cyan-500', 7),
    ('reports', 'Reports & Presentations', 'Professional report and presentation templates', 'Presentation', 'from-amber-500 to-orange-500', 8)
ON CONFLICT (category_key) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    gradient = EXCLUDED.gradient,
    order_index = EXCLUDED.order_index,
    updated_at = NOW()
WHERE 
    toolkit_categories.name != EXCLUDED.name OR
    toolkit_categories.description != EXCLUDED.description OR
    toolkit_categories.icon != EXCLUDED.icon OR
    toolkit_categories.gradient != EXCLUDED.gradient OR
    toolkit_categories.order_index != EXCLUDED.order_index;

-- Insert some sample toolkit items for each category (only if they don't exist)
-- Email category
INSERT INTO public.toolkit_items (name, category_id, description, is_new, is_featured) 
SELECT 
    'Donor Thank You Template',
    id,
    'Personalized thank you email template for donors',
    true,
    true
FROM public.toolkit_categories WHERE category_key = 'email'
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO public.toolkit_items (name, category_id, description) 
SELECT 
    'Volunteer Recruitment Email',
    id,
    'Engaging email template to recruit volunteers',
    false,
    false
FROM public.toolkit_categories WHERE category_key = 'email'
ON CONFLICT (category_id, name) DO NOTHING;

-- Grants category
INSERT INTO public.toolkit_items (name, category_id, description, is_featured) 
SELECT 
    'Federal Grant Proposal Template',
    id,
    'Comprehensive template for federal grant applications',
    true
FROM public.toolkit_categories WHERE category_key = 'grants'
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO public.toolkit_items (name, category_id, description, is_new) 
SELECT 
    'Foundation LOI Template',
    id,
    'Letter of Intent template for foundation grants',
    true
FROM public.toolkit_categories WHERE category_key = 'grants'
ON CONFLICT (category_id, name) DO NOTHING;

-- Data category
INSERT INTO public.toolkit_items (name, category_id, description) 
SELECT 
    'Impact Dashboard Template',
    id,
    'Interactive dashboard to visualize your impact metrics',
    false
FROM public.toolkit_categories WHERE category_key = 'data'
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO public.toolkit_items (name, category_id, description, is_new) 
SELECT 
    'Donor Analytics Report',
    id,
    'Comprehensive donor analysis and segmentation tool',
    true
FROM public.toolkit_categories WHERE category_key = 'data'
ON CONFLICT (category_id, name) DO NOTHING;

-- Automation category
INSERT INTO public.toolkit_items (name, category_id, description, is_featured) 
SELECT 
    'Email Campaign Automation',
    id,
    'Automated email campaign workflow template',
    true
FROM public.toolkit_categories WHERE category_key = 'automation'
ON CONFLICT (category_id, name) DO NOTHING;

-- Insert basic achievements if they don't exist
INSERT INTO public.toolkit_achievements (achievement_key, name, description, icon, color, criteria_type, criteria_value, order_index, achievement_tier) VALUES
    ('first_unlock', 'First Tool Unlocked', 'Downloaded your first tool', 'Star', 'text-yellow-500', 'unlock_count', 1, 1, 'bronze'),
    ('category_explorer', 'Category Explorer', 'Unlock tools from 3 different categories', 'Grid3X3', 'text-blue-500', 'category_count', 3, 2, 'silver'),
    ('power_user', 'Power User', 'Unlock 10 tools', 'Zap', 'text-purple-500', 'unlock_count', 10, 3, 'gold'),
    ('master_collector', 'Master Collector', 'Unlock all tools in a category', 'Trophy', 'text-gold-500', 'category_complete', 1, 4, 'gold'),
    ('toolkit_legend', 'Toolkit Legend', 'Unlock 50% of all tools', 'Award', 'text-emerald-500', 'special', NULL, 5, 'platinum')
ON CONFLICT (achievement_key) DO NOTHING;

-- Verify categories were inserted/updated
SELECT 
    category_key,
    name,
    description,
    icon,
    gradient,
    order_index,
    created_at,
    updated_at
FROM public.toolkit_categories
ORDER BY order_index;

-- Count items per category
SELECT 
    tc.category_key,
    tc.name as category_name,
    COUNT(ti.id) as item_count
FROM public.toolkit_categories tc
LEFT JOIN public.toolkit_items ti ON tc.id = ti.category_id AND ti.is_active = true
GROUP BY tc.category_key, tc.name, tc.order_index
ORDER BY tc.order_index;