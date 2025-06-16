
-- Add image_url column to posts table
ALTER TABLE public.posts ADD COLUMN image_url TEXT;

-- Create a new storage bucket for post images
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true);

-- Add RLS policies for the new bucket
-- Allow public read access
CREATE POLICY "Public read access for post images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'post-images' );

-- Allow authenticated admins to upload/manage images
CREATE POLICY "Admin can manage post images"
ON storage.objects FOR ALL
TO authenticated
WITH CHECK ( bucket_id = 'post-images' AND public.has_role(auth.uid(), 'admin') );
