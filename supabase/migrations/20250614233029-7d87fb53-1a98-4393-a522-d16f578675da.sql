
-- Create the tags table to store tag information
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add a comment to describe the table
COMMENT ON TABLE public.tags IS 'Stores tags for categorizing blog posts.';

-- Create the join table to associate posts with tags in a many-to-many relationship
CREATE TABLE public.post_tags (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Add a comment to describe the join table
COMMENT ON TABLE public.post_tags IS 'Associates posts with their tags.';

-- Enable Row-Level Security on the new tables
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the 'tags' table
-- 1. Allow public read access to all tags
CREATE POLICY "Allow public read access to tags" ON public.tags
  FOR SELECT
  USING (true);

-- 2. Allow admins to perform any action on tags
CREATE POLICY "Allow admin to manage tags" ON public.tags
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for the 'post_tags' table
-- 1. Allow public read access to all post-tag associations
CREATE POLICY "Allow public read access to post_tags" ON public.post_tags
  FOR SELECT
  USING (true);

-- 2. Allow admins to perform any action on post-tag associations
CREATE POLICY "Allow admin to manage post_tags" ON public.post_tags
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
