-- Create storage bucket for character avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('character-avatars', 'character-avatars', true);

-- Create public read policies for character avatars
CREATE POLICY "Character avatars are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'character-avatars');

-- Allow users to upload character avatars
CREATE POLICY "Users can upload character avatars" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'character-avatars' AND auth.role() = 'authenticated');