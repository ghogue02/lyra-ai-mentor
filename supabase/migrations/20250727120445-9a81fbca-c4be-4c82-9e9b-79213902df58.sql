-- Upload Sofia's character avatar to the character-avatars bucket
-- This will enable proper branding across the Sofia storytelling journey

-- First, ensure the character-avatars bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('character-avatars', 'character-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for character-avatars bucket to allow public access
CREATE POLICY "Character avatars are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'character-avatars');

CREATE POLICY "Allow public access to character avatars" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'character-avatars');

-- Create a policy for admins to upload character avatars
CREATE POLICY "Admins can upload character avatars" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'character-avatars' AND auth.role() = 'authenticated');