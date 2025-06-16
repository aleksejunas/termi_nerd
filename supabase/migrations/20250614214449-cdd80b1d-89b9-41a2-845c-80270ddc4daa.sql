
-- 1. Enable Row Level Security on the 'posts' table.
-- This is the foundation for all our access rules.
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy to allow public, read-only access to published posts.
-- This ensures that visitors can still read your blog.
CREATE POLICY "Allow public read access to published posts"
ON public.posts
FOR SELECT
USING (is_published = true);

-- 3. Create a policy that gives users with the 'admin' role full control.
-- This will allow admins to create, view, update, and delete any post.
CREATE POLICY "Allow admins full access to all posts"
ON public.posts
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
