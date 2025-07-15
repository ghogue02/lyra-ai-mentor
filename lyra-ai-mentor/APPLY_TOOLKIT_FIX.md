# 🚨 URGENT: Apply Toolkit Database Fix

The toolkit tables are **missing** from your Supabase database. Follow these steps to fix the error:

## Step 1: Open Supabase SQL Editor

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on "SQL Editor" in the left sidebar

## Step 2: Run This SQL Script

Copy and paste this ENTIRE script into the SQL editor and click "Run":

```sql
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
    metadata JSONB DEFAULT '{}',
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_toolkit_items_category ON public.toolkit_items(category_id);
CREATE INDEX IF NOT EXISTS idx_toolkit_items_active ON public.toolkit_items(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_toolkit_unlocks_user ON public.user_toolkit_unlocks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_toolkit_unlocks_item ON public.user_toolkit_unlocks(toolkit_item_id);

-- Enable Row Level Security
ALTER TABLE public.toolkit_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toolkit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_toolkit_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toolkit_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_toolkit_achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view achievements"
    ON public.toolkit_achievements FOR SELECT
    USING (TRUE);

CREATE POLICY "Users can view own achievement progress"
    ON public.user_toolkit_achievements FOR SELECT
    USING (auth.uid() = user_id);

-- Insert required categories
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

-- Insert basic achievements
INSERT INTO public.toolkit_achievements (achievement_key, name, description, icon, color, criteria_type, criteria_value, order_index, achievement_tier) VALUES
    ('first_unlock', 'First Tool Unlocked', 'Downloaded your first tool', 'Star', 'text-yellow-500', 'unlock_count', 1, 1, 'bronze'),
    ('category_explorer', 'Category Explorer', 'Unlock tools from 3 different categories', 'Grid3X3', 'text-blue-500', 'category_count', 3, 2, 'silver'),
    ('power_user', 'Power User', 'Unlock 10 tools', 'Zap', 'text-purple-500', 'unlock_count', 10, 3, 'gold')
ON CONFLICT (achievement_key) DO NOTHING;

-- Add sample toolkit items for testing
INSERT INTO public.toolkit_items (name, category_id, description, file_type, is_new, is_active) 
SELECT 
    'PACE Email Template',
    id,
    'Professional email template using the PACE framework',
    'pace_email',
    true,
    true
FROM public.toolkit_categories 
WHERE category_key = 'email'
ON CONFLICT DO NOTHING;
```

## Step 3: Verify Success

After running the script, you should see a success message. To verify:

1. Still in the SQL Editor, run this query:
```sql
SELECT * FROM public.toolkit_categories ORDER BY order_index;
```

You should see 8 categories listed.

## Step 4: Test in Your App

1. Go back to your app
2. Navigate to the Maya email composer
3. Generate an email
4. Click "Save to MyToolkit"
5. The error should be gone!

## Step 5: Run Verification (Optional)

From your terminal:
```bash
cd "/Users/greghogue/Lyra New/lyra-ai-mentor"
node scripts/verify-toolkit-fix.js
```

All checks should now pass! ✅

## If You Still Get Errors

1. Make sure you're in the correct Supabase project
2. Check that Row Level Security (RLS) is enabled but has the policies shown above
3. Try refreshing your browser and clearing cache
4. Check the Supabase logs for any specific errors

## Success Indicators

- No more 404 errors in browser console
- "Save to MyToolkit" button works
- Verification script shows all green checkmarks

---

**Note**: This fix is applying the migration that was already written but not executed on your production database.