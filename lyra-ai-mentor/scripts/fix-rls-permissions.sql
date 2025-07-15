-- Fix RLS Policies for Toolkit Tables
-- This addresses the 403 Forbidden error when saving to toolkit
-- Run this in Supabase SQL Editor

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Users can create own unlocks" ON public.toolkit_items;
DROP POLICY IF EXISTS "Anyone can view active toolkit items" ON public.toolkit_items;
DROP POLICY IF EXISTS "Authenticated users can insert toolkit items" ON public.toolkit_items;
DROP POLICY IF EXISTS "Authenticated users can update own toolkit items" ON public.toolkit_items;

-- Create more permissive policies for toolkit_items
-- Allow anyone (including anon users) to view toolkit items
CREATE POLICY "Anyone can view toolkit items"
    ON public.toolkit_items FOR SELECT
    USING (is_active = TRUE);

-- Allow authenticated users to insert toolkit items
CREATE POLICY "Authenticated users can insert toolkit items"
    ON public.toolkit_items FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update toolkit items
CREATE POLICY "Authenticated users can update toolkit items"
    ON public.toolkit_items FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Ensure anon users can read categories
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.toolkit_categories;
DROP POLICY IF EXISTS "Anyone can view categories" ON public.toolkit_categories;
CREATE POLICY "Anyone can view categories"
    ON public.toolkit_categories FOR SELECT
    USING (TRUE);

-- Ensure anon users can read achievements  
DROP POLICY IF EXISTS "Anyone can view achievements" ON public.toolkit_achievements;
CREATE POLICY "Anyone can view achievements"
    ON public.toolkit_achievements FOR SELECT
    USING (TRUE);

-- For user_toolkit_unlocks, keep user-specific policies
DROP POLICY IF EXISTS "Users can create own unlocks" ON public.user_toolkit_unlocks;
DROP POLICY IF EXISTS "Users can view own unlocks" ON public.user_toolkit_unlocks;
DROP POLICY IF EXISTS "Users can update own unlocks" ON public.user_toolkit_unlocks;
DROP POLICY IF EXISTS "Users can manage own unlocks" ON public.user_toolkit_unlocks;

CREATE POLICY "Users can manage own unlocks"
    ON public.user_toolkit_unlocks FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Grant additional permissions to ensure access
GRANT ALL ON public.toolkit_categories TO anon, authenticated;
GRANT ALL ON public.toolkit_items TO anon, authenticated;
GRANT ALL ON public.toolkit_achievements TO anon, authenticated;
GRANT ALL ON public.user_toolkit_unlocks TO authenticated;

-- Grant sequence permissions (needed for UUID generation)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';