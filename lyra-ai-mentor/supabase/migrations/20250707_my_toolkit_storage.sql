-- Create MyToolkit storage tables
-- This migration creates tables for toolkit categories, items, user unlocks, and achievements

-- Table for toolkit categories
CREATE TABLE IF NOT EXISTS public.toolkit_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Category identification
    category_key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    gradient TEXT NOT NULL, -- CSS gradient class
    
    -- Ordering and visibility
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for toolkit items (tools)
CREATE TABLE IF NOT EXISTS public.toolkit_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Tool identification
    name TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES public.toolkit_categories(id) ON DELETE CASCADE,
    
    -- Tool metadata
    description TEXT,
    preview_url TEXT,
    download_url TEXT,
    file_size INTEGER, -- in bytes
    file_type TEXT,
    
    -- Status flags
    is_new BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Requirements
    required_level INTEGER DEFAULT 1,
    required_achievements TEXT[] DEFAULT '{}',
    
    -- Statistics (aggregated for performance)
    download_count INTEGER DEFAULT 0,
    unlock_count INTEGER DEFAULT 0,
    rating_sum NUMERIC DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    average_rating NUMERIC GENERATED ALWAYS AS (
        CASE 
            WHEN rating_count > 0 THEN rating_sum / rating_count 
            ELSE 0 
        END
    ) STORED,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Add unique constraint for name within category
    UNIQUE(category_id, name)
);

-- Table for user toolkit unlocks
CREATE TABLE IF NOT EXISTS public.user_toolkit_unlocks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Relationships
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    toolkit_item_id UUID NOT NULL REFERENCES public.toolkit_items(id) ON DELETE CASCADE,
    
    -- Unlock details
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    download_count INTEGER DEFAULT 0,
    last_downloaded_at TIMESTAMPTZ,
    
    -- User rating
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    rated_at TIMESTAMPTZ,
    
    -- Notes or feedback
    user_notes TEXT,
    
    -- Unique constraint to prevent duplicate unlocks
    UNIQUE(user_id, toolkit_item_id)
);

-- Table for toolkit achievements
CREATE TABLE IF NOT EXISTS public.toolkit_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Achievement identification
    achievement_key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL, -- Tailwind color class
    
    -- Achievement criteria
    criteria_type TEXT NOT NULL CHECK (criteria_type IN (
        'unlock_count',        -- Unlock X tools
        'category_count',      -- Unlock tools from X categories
        'category_complete',   -- Unlock all tools in a category
        'download_count',      -- Download X times
        'rating_count',        -- Rate X tools
        'streak_days',         -- Use toolkit X days in a row
        'special'              -- Special achievements
    )),
    criteria_value INTEGER,
    criteria_metadata JSONB DEFAULT '{}',
    
    -- Display order
    order_index INTEGER DEFAULT 0,
    achievement_tier TEXT CHECK (achievement_tier IN ('bronze', 'silver', 'gold', 'platinum')) DEFAULT 'bronze',
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for user achievement progress
CREATE TABLE IF NOT EXISTS public.user_toolkit_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Relationships
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.toolkit_achievements(id) ON DELETE CASCADE,
    
    -- Progress tracking
    current_value INTEGER DEFAULT 0,
    target_value INTEGER,
    is_unlocked BOOLEAN DEFAULT FALSE,
    unlocked_at TIMESTAMPTZ,
    
    -- Notification status
    notification_shown BOOLEAN DEFAULT FALSE,
    
    -- Unique constraint
    UNIQUE(user_id, achievement_id)
);

-- Create indexes for performance
CREATE INDEX idx_toolkit_items_category ON public.toolkit_items(category_id);
CREATE INDEX idx_toolkit_items_active ON public.toolkit_items(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_toolkit_items_new ON public.toolkit_items(is_new) WHERE is_new = TRUE;
CREATE INDEX idx_toolkit_items_rating ON public.toolkit_items(average_rating DESC) WHERE rating_count > 0;

CREATE INDEX idx_user_toolkit_unlocks_user ON public.user_toolkit_unlocks(user_id);
CREATE INDEX idx_user_toolkit_unlocks_item ON public.user_toolkit_unlocks(toolkit_item_id);
CREATE INDEX idx_user_toolkit_unlocks_composite ON public.user_toolkit_unlocks(user_id, toolkit_item_id);

CREATE INDEX idx_user_toolkit_achievements_user ON public.user_toolkit_achievements(user_id);
CREATE INDEX idx_user_toolkit_achievements_unlocked ON public.user_toolkit_achievements(user_id, is_unlocked);

-- Enable RLS
ALTER TABLE public.toolkit_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toolkit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_toolkit_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toolkit_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_toolkit_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Categories: Everyone can view
CREATE POLICY "Anyone can view active categories"
    ON public.toolkit_categories
    FOR SELECT
    USING (is_active = TRUE);

-- Items: Everyone can view active items
CREATE POLICY "Anyone can view active toolkit items"
    ON public.toolkit_items
    FOR SELECT
    USING (is_active = TRUE);

-- User unlocks: Users can view and manage their own
CREATE POLICY "Users can view own unlocks"
    ON public.user_toolkit_unlocks
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own unlocks"
    ON public.user_toolkit_unlocks
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own unlocks"
    ON public.user_toolkit_unlocks
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Achievements: Everyone can view
CREATE POLICY "Anyone can view achievements"
    ON public.toolkit_achievements
    FOR SELECT
    USING (TRUE);

-- User achievements: Users can view and manage their own
CREATE POLICY "Users can view own achievement progress"
    ON public.user_toolkit_achievements
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own achievement progress"
    ON public.user_toolkit_achievements
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own achievement progress"
    ON public.user_toolkit_achievements
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_toolkit_categories_updated_at
    BEFORE UPDATE ON public.toolkit_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_toolkit_items_updated_at
    BEFORE UPDATE ON public.toolkit_items
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_toolkit_achievements_updated_at
    BEFORE UPDATE ON public.toolkit_achievements
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to increment download count
CREATE OR REPLACE FUNCTION public.increment_toolkit_download(
    p_user_id UUID,
    p_item_id UUID
) RETURNS VOID AS $$
BEGIN
    -- Update user unlock record
    UPDATE public.user_toolkit_unlocks
    SET download_count = download_count + 1,
        last_downloaded_at = NOW()
    WHERE user_id = p_user_id AND toolkit_item_id = p_item_id;
    
    -- Update item total download count
    UPDATE public.toolkit_items
    SET download_count = download_count + 1
    WHERE id = p_item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to rate a toolkit item
CREATE OR REPLACE FUNCTION public.rate_toolkit_item(
    p_user_id UUID,
    p_item_id UUID,
    p_rating INTEGER
) RETURNS VOID AS $$
DECLARE
    v_old_rating INTEGER;
BEGIN
    -- Get old rating if exists
    SELECT rating INTO v_old_rating
    FROM public.user_toolkit_unlocks
    WHERE user_id = p_user_id AND toolkit_item_id = p_item_id;
    
    -- Update user unlock record
    UPDATE public.user_toolkit_unlocks
    SET rating = p_rating,
        rated_at = NOW()
    WHERE user_id = p_user_id AND toolkit_item_id = p_item_id;
    
    -- Update item rating statistics
    IF v_old_rating IS NULL THEN
        -- New rating
        UPDATE public.toolkit_items
        SET rating_sum = rating_sum + p_rating,
            rating_count = rating_count + 1
        WHERE id = p_item_id;
    ELSE
        -- Update existing rating
        UPDATE public.toolkit_items
        SET rating_sum = rating_sum - v_old_rating + p_rating
        WHERE id = p_item_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check and update achievement progress
CREATE OR REPLACE FUNCTION public.check_toolkit_achievements(
    p_user_id UUID
) RETURNS TABLE (
    achievement_id UUID,
    achievement_name TEXT,
    newly_unlocked BOOLEAN
) AS $$
DECLARE
    v_unlock_count INTEGER;
    v_category_count INTEGER;
    v_download_count INTEGER;
    v_rating_count INTEGER;
BEGIN
    -- Get user statistics
    SELECT COUNT(DISTINCT uti.id), COUNT(DISTINCT ti.category_id), SUM(uti.download_count), COUNT(uti.rating)
    INTO v_unlock_count, v_category_count, v_download_count, v_rating_count
    FROM public.user_toolkit_unlocks uti
    JOIN public.toolkit_items ti ON uti.toolkit_item_id = ti.id
    WHERE uti.user_id = p_user_id;
    
    -- Check each achievement
    RETURN QUERY
    WITH achievement_checks AS (
        SELECT 
            ta.id,
            ta.name,
            ta.criteria_type,
            ta.criteria_value,
            CASE ta.criteria_type
                WHEN 'unlock_count' THEN v_unlock_count >= ta.criteria_value
                WHEN 'category_count' THEN v_category_count >= ta.criteria_value
                WHEN 'download_count' THEN v_download_count >= ta.criteria_value
                WHEN 'rating_count' THEN v_rating_count >= ta.criteria_value
                ELSE FALSE
            END AS should_be_unlocked
        FROM public.toolkit_achievements ta
    )
    INSERT INTO public.user_toolkit_achievements (user_id, achievement_id, current_value, target_value, is_unlocked, unlocked_at)
    SELECT 
        p_user_id,
        ac.id,
        CASE ac.criteria_type
            WHEN 'unlock_count' THEN v_unlock_count
            WHEN 'category_count' THEN v_category_count
            WHEN 'download_count' THEN v_download_count
            WHEN 'rating_count' THEN v_rating_count
            ELSE 0
        END,
        ac.criteria_value,
        ac.should_be_unlocked,
        CASE WHEN ac.should_be_unlocked THEN NOW() ELSE NULL END
    FROM achievement_checks ac
    ON CONFLICT (user_id, achievement_id) DO UPDATE
    SET 
        current_value = EXCLUDED.current_value,
        is_unlocked = EXCLUDED.is_unlocked,
        unlocked_at = CASE 
            WHEN NOT user_toolkit_achievements.is_unlocked AND EXCLUDED.is_unlocked 
            THEN NOW() 
            ELSE user_toolkit_achievements.unlocked_at 
        END
    RETURNING 
        user_toolkit_achievements.achievement_id,
        (SELECT name FROM public.toolkit_achievements WHERE id = user_toolkit_achievements.achievement_id),
        (NOT user_toolkit_achievements.is_unlocked AND EXCLUDED.is_unlocked) AS newly_unlocked;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert initial data

-- Categories
INSERT INTO public.toolkit_categories (category_key, name, description, icon, gradient, order_index) VALUES
    ('email', 'Email Templates', 'Professional email templates for every occasion', 'Mail', 'from-blue-500 to-cyan-500', 1),
    ('grants', 'Grant Proposals', 'Winning grant proposal templates and guides', 'FileText', 'from-purple-500 to-pink-500', 2),
    ('data', 'Data Visualizations', 'Interactive charts and data presentation tools', 'BarChart3', 'from-green-500 to-emerald-500', 3),
    ('automation', 'Automation Workflows', 'Time-saving automation templates', 'Workflow', 'from-orange-500 to-red-500', 4),
    ('change', 'Change Management', 'Tools for managing organizational change', 'Users', 'from-indigo-500 to-purple-500', 5),
    ('social', 'Social Media Content', 'Engaging social media templates', 'Share2', 'from-pink-500 to-rose-500', 6),
    ('training', 'Training Materials', 'Educational resources and training templates', 'BookOpen', 'from-teal-500 to-cyan-500', 7),
    ('reports', 'Reports & Presentations', 'Professional report and presentation templates', 'Presentation', 'from-amber-500 to-orange-500', 8)
ON CONFLICT (category_key) DO NOTHING;

-- Achievements
INSERT INTO public.toolkit_achievements (achievement_key, name, description, icon, color, criteria_type, criteria_value, order_index, achievement_tier) VALUES
    ('first_unlock', 'First Tool Unlocked', 'Downloaded your first tool', 'Star', 'text-yellow-500', 'unlock_count', 1, 1, 'bronze'),
    ('category_explorer', 'Category Explorer', 'Unlock tools from 3 different categories', 'Grid3X3', 'text-blue-500', 'category_count', 3, 2, 'silver'),
    ('power_user', 'Power User', 'Unlock 10 tools', 'Zap', 'text-purple-500', 'unlock_count', 10, 3, 'gold'),
    ('master_collector', 'Master Collector', 'Unlock all tools in a category', 'Trophy', 'text-gold-500', 'category_complete', 1, 4, 'gold'),
    ('toolkit_legend', 'Toolkit Legend', 'Unlock 50% of all tools', 'Award', 'text-emerald-500', 'special', NULL, 5, 'platinum')
ON CONFLICT (achievement_key) DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE public.toolkit_categories IS 'Categories for organizing toolkit items';
COMMENT ON TABLE public.toolkit_items IS 'Individual toolkit items/tools available for download';
COMMENT ON TABLE public.user_toolkit_unlocks IS 'Tracks which tools users have unlocked';
COMMENT ON TABLE public.toolkit_achievements IS 'Achievement definitions for toolkit usage';
COMMENT ON TABLE public.user_toolkit_achievements IS 'Tracks user progress on toolkit achievements';