
CREATE TABLE public.guestbook (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) > 0 AND char_length(name) <= 100),
  message TEXT NOT NULL CHECK (char_length(message) > 0 AND char_length(message) <= 500),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public can read all guestbook entries"
ON public.guestbook
FOR SELECT
USING (true);

-- Create policy for public insert access
CREATE POLICY "Public can insert new guestbook entries"
ON public.guestbook
FOR INSERT
WITH CHECK (true);
