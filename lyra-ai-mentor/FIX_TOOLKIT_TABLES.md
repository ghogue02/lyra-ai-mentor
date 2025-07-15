# Fix for Missing toolkit_categories Table

## Problem Summary
The application is encountering 404 errors because the `toolkit_categories` table (and related toolkit tables) are missing from the Supabase database. These tables are defined in the migration file `20250707_my_toolkit_storage.sql` but apparently haven't been applied to the production database.

## Missing Tables
1. `toolkit_categories` - Main categories for toolkit items
2. `toolkit_items` - Individual toolkit tools/resources
3. `user_toolkit_unlocks` - Tracks which tools users have unlocked
4. `toolkit_achievements` - Achievement definitions
5. `user_toolkit_achievements` - User achievement progress

## Solution

### Option 1: Run the Migration File (Recommended)
If you have access to run migrations, execute the migration file:
```bash
supabase migration up
```

### Option 2: Manual SQL Execution
If migrations aren't working, run this SQL directly in the Supabase SQL editor:

```sql
-- Create toolkit_categories table
CREATE TABLE IF NOT EXISTS public.toolkit_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    gradient TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create toolkit_items table
CREATE TABLE IF NOT EXISTS public.toolkit_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES public.toolkit_categories(id) ON DELETE CASCADE,
    description TEXT,
    preview_url TEXT,
    download_url TEXT,
    file_size INTEGER,
    file_type TEXT,
    is_new BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    required_level INTEGER DEFAULT 1,
    required_achievements TEXT[] DEFAULT '{}',
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(category_id, name)
);

-- Create user_toolkit_unlocks table
CREATE TABLE IF NOT EXISTS public.user_toolkit_unlocks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    toolkit_item_id UUID NOT NULL REFERENCES public.toolkit_items(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    download_count INTEGER DEFAULT 0,
    last_downloaded_at TIMESTAMPTZ,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    rated_at TIMESTAMPTZ,
    user_notes TEXT,
    UNIQUE(user_id, toolkit_item_id)
);

-- Create toolkit_achievements table
CREATE TABLE IF NOT EXISTS public.toolkit_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    achievement_key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    criteria_type TEXT NOT NULL CHECK (criteria_type IN (
        'unlock_count', 'category_count', 'category_complete',
        'download_count', 'rating_count', 'streak_days', 'special'
    )),
    criteria_value INTEGER,
    criteria_metadata JSONB DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    achievement_tier TEXT CHECK (achievement_tier IN ('bronze', 'silver', 'gold', 'platinum')) DEFAULT 'bronze',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_toolkit_achievements table
CREATE TABLE IF NOT EXISTS public.user_toolkit_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.toolkit_achievements(id) ON DELETE CASCADE,
    current_value INTEGER DEFAULT 0,
    target_value INTEGER,
    is_unlocked BOOLEAN DEFAULT FALSE,
    unlocked_at TIMESTAMPTZ,
    notification_shown BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, achievement_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_toolkit_items_category ON public.toolkit_items(category_id);
CREATE INDEX IF NOT EXISTS idx_toolkit_items_active ON public.toolkit_items(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_toolkit_items_new ON public.toolkit_items(is_new) WHERE is_new = TRUE;
CREATE INDEX IF NOT EXISTS idx_toolkit_items_rating ON public.toolkit_items(average_rating DESC) WHERE rating_count > 0;

CREATE INDEX IF NOT EXISTS idx_user_toolkit_unlocks_user ON public.user_toolkit_unlocks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_toolkit_unlocks_item ON public.user_toolkit_unlocks(toolkit_item_id);
CREATE INDEX IF NOT EXISTS idx_user_toolkit_unlocks_composite ON public.user_toolkit_unlocks(user_id, toolkit_item_id);

CREATE INDEX IF NOT EXISTS idx_user_toolkit_achievements_user ON public.user_toolkit_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_toolkit_achievements_unlocked ON public.user_toolkit_achievements(user_id, is_unlocked);

-- Enable RLS
ALTER TABLE public.toolkit_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toolkit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_toolkit_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toolkit_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_toolkit_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active categories"
    ON public.toolkit_categories FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Anyone can view active toolkit items"
    ON public.toolkit_items FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Users can view own unlocks"
    ON public.user_toolkit_unlocks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own unlocks"
    ON public.user_toolkit_unlocks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own unlocks"
    ON public.user_toolkit_unlocks FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view achievements"
    ON public.toolkit_achievements FOR SELECT
    USING (TRUE);

CREATE POLICY "Users can view own achievement progress"
    ON public.user_toolkit_achievements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own achievement progress"
    ON public.user_toolkit_achievements FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own achievement progress"
    ON public.user_toolkit_achievements FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create update trigger for updated_at (requires handle_updated_at function)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_toolkit_categories_updated_at
    BEFORE UPDATE ON public.toolkit_categories
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_toolkit_items_updated_at
    BEFORE UPDATE ON public.toolkit_items
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_toolkit_achievements_updated_at
    BEFORE UPDATE ON public.toolkit_achievements
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Helper functions
CREATE OR REPLACE FUNCTION public.increment_toolkit_download(
    p_user_id UUID,
    p_item_id UUID
) RETURNS VOID AS $$
BEGIN
    UPDATE public.user_toolkit_unlocks
    SET download_count = download_count + 1,
        last_downloaded_at = NOW()
    WHERE user_id = p_user_id AND toolkit_item_id = p_item_id;
    
    UPDATE public.toolkit_items
    SET download_count = download_count + 1
    WHERE id = p_item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.rate_toolkit_item(
    p_user_id UUID,
    p_item_id UUID,
    p_rating INTEGER
) RETURNS VOID AS $$
DECLARE
    v_old_rating INTEGER;
BEGIN
    SELECT rating INTO v_old_rating
    FROM public.user_toolkit_unlocks
    WHERE user_id = p_user_id AND toolkit_item_id = p_item_id;
    
    UPDATE public.user_toolkit_unlocks
    SET rating = p_rating, rated_at = NOW()
    WHERE user_id = p_user_id AND toolkit_item_id = p_item_id;
    
    IF v_old_rating IS NULL THEN
        UPDATE public.toolkit_items
        SET rating_sum = rating_sum + p_rating,
            rating_count = rating_count + 1
        WHERE id = p_item_id;
    ELSE
        UPDATE public.toolkit_items
        SET rating_sum = rating_sum - v_old_rating + p_rating
        WHERE id = p_item_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert initial data
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

INSERT INTO public.toolkit_achievements (achievement_key, name, description, icon, color, criteria_type, criteria_value, order_index, achievement_tier) VALUES
    ('first_unlock', 'First Tool Unlocked', 'Downloaded your first tool', 'Star', 'text-yellow-500', 'unlock_count', 1, 1, 'bronze'),
    ('category_explorer', 'Category Explorer', 'Unlock tools from 3 different categories', 'Grid3X3', 'text-blue-500', 'category_count', 3, 2, 'silver'),
    ('power_user', 'Power User', 'Unlock 10 tools', 'Zap', 'text-purple-500', 'unlock_count', 10, 3, 'gold'),
    ('master_collector', 'Master Collector', 'Unlock all tools in a category', 'Trophy', 'text-gold-500', 'category_complete', 1, 4, 'gold'),
    ('toolkit_legend', 'Toolkit Legend', 'Unlock 50% of all tools', 'Award', 'text-emerald-500', 'special', NULL, 5, 'platinum')
ON CONFLICT (achievement_key) DO NOTHING;
```

### Option 3: Run Seed Data
After creating the tables, run the seed data to populate categories and sample items:
```bash
# From the project root
psql $DATABASE_URL < supabase/seeds/toolkit-categories.sql
```

## Verification Steps
After running the SQL:

1. Verify tables exist:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'toolkit_%'
ORDER BY table_name;
```

2. Verify categories were inserted:
```sql
SELECT * FROM public.toolkit_categories ORDER BY order_index;
```

3. Test the service is working:
- Navigate to any page that uses the toolkit
- Check browser console for errors
- The 404 errors should be resolved

## Additional Notes
- The migration includes RLS (Row Level Security) policies to ensure users can only access their own data
- The tables include various indexes for performance optimization
- There are helper functions for common operations like recording downloads and ratings
- The schema supports achievements and gamification features

## TypeScript Types Update Needed
After creating the tables, you'll need to regenerate the Supabase types:
```bash
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

This will add the toolkit table types to the TypeScript definitions.