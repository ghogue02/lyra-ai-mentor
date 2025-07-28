-- Run this SQL in the Supabase Dashboard SQL Editor
-- Create generated_content table for storing AI-generated content

CREATE TABLE IF NOT EXISTS generated_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    character_type TEXT NOT NULL CHECK (character_type IN ('maya', 'sofia', 'david', 'rachel', 'alex', 'lyra')),
    content_type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_generated_content_user_id ON generated_content(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_character_type ON generated_content(character_type);
CREATE INDEX IF NOT EXISTS idx_generated_content_content_type ON generated_content(content_type);
CREATE INDEX IF NOT EXISTS idx_generated_content_approval_status ON generated_content(approval_status);
CREATE INDEX IF NOT EXISTS idx_generated_content_created_at ON generated_content(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own generated content" ON generated_content 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own generated content" ON generated_content 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generated content" ON generated_content 
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow anonymous users to insert content (for the Edge Function)
CREATE POLICY "Allow anonymous content generation" ON generated_content 
    FOR INSERT WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_generated_content_updated_at 
    BEFORE UPDATE ON generated_content 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON generated_content TO authenticated;
GRANT ALL ON generated_content TO anon;