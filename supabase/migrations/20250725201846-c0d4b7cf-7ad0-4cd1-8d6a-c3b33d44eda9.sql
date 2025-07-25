-- Create categories for Maya's journey rewards
INSERT INTO toolkit_categories (category_key, name, description, icon, gradient, order_index, is_active) VALUES
('journey-rewards', 'Journey Rewards', 'Exclusive templates and tools unlocked by completing learning journeys', '🏆', 'from-amber-500 to-orange-500', 5, true),
('personalized-templates', 'My Custom Templates', 'Personalized templates created from your journey work', '📝', 'from-purple-500 to-pink-500', 6, true)
ON CONFLICT (category_key) DO NOTHING;

-- Get category IDs
DO $$
DECLARE
    journey_rewards_id uuid;
    personalized_templates_id uuid;
BEGIN
    SELECT id INTO journey_rewards_id FROM toolkit_categories WHERE category_key = 'journey-rewards';
    SELECT id INTO personalized_templates_id FROM toolkit_categories WHERE category_key = 'personalized-templates';
    
    -- Insert Maya's PACE Framework Journey rewards
    INSERT INTO toolkit_items (
        name, 
        category_id, 
        description, 
        file_type, 
        is_new, 
        is_featured, 
        is_premium, 
        is_active,
        preview_url,
        metadata
    ) VALUES 
    (
        'PACE Framework Master Template',
        journey_rewards_id,
        'Complete PACE framework template with examples from Maya''s journey. Perfect for any communication challenge.',
        'template',
        true,
        true,
        false,
        true,
        null,
        jsonb_build_object(
            'journey_id', 'maya-pace',
            'template_type', 'pace_framework',
            'unlock_trigger', 'maya_journey_complete',
            'template_content', jsonb_build_object(
                'Purpose', 'Clear template for defining your communication purpose',
                'Audience', 'Framework for understanding your audience deeply',
                'Connection', 'Strategies for building emotional connection',
                'Engagement', 'Methods for creating compelling engagement'
            )
        )
    ),
    (
        'Professional Email Crisis Template',
        journey_rewards_id,
        'Maya''s proven template for handling difficult workplace communications with grace and professionalism.',
        'template',
        true,
        false,
        false,
        true,
        null,
        jsonb_build_object(
            'journey_id', 'maya-pace',
            'template_type', 'email_template',
            'unlock_trigger', 'maya_journey_complete',
            'use_cases', jsonb_build_array('deadline_missed', 'mistake_acknowledgment', 'difficult_news')
        )
    ),
    (
        'Multi-Audience Tone Adaptation Guide',
        journey_rewards_id,
        'Master tone adaptation for any audience. Based on Maya''s breakthrough with board, staff, and community communications.',
        'guide',
        true,
        true,
        false,
        true,
        null,
        jsonb_build_object(
            'journey_id', 'maya-tone-mastery',
            'template_type', 'tone_guide',
            'unlock_trigger', 'maya_tone_complete',
            'tone_types', jsonb_build_array('professional', 'empathetic', 'reassuring'),
            'audience_types', jsonb_build_array('executives', 'teams', 'community')
        )
    ),
    (
        'Crisis Communication Multi-Template Pack',
        journey_rewards_id,
        'Three tone-adapted templates for the same message: professional for executives, empathetic for teams, reassuring for community.',
        'template_pack',
        true,
        true,
        false,
        true,
        null,
        jsonb_build_object(
            'journey_id', 'maya-tone-mastery',
            'template_type', 'multi_tone_pack',
            'unlock_trigger', 'maya_tone_complete',
            'templates_included', 3
        )
    )
    ON CONFLICT (name) DO NOTHING;
END $$;