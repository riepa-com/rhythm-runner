-- Create site_status table for storing status of different parts of the site
CREATE TABLE public.site_status (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'online',
  message TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.site_status ENABLE ROW LEVEL SECURITY;

-- Everyone can read status (public)
CREATE POLICY "Anyone can read site status"
ON public.site_status
FOR SELECT
TO anon, authenticated
USING (true);

-- Only admins can update status
CREATE POLICY "Admins can update site status"
ON public.site_status
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert status
CREATE POLICY "Admins can insert site status"
ON public.site_status
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default status entries
INSERT INTO public.site_status (id, status, message) VALUES
  ('main', 'online', NULL),
  ('docs', 'online', NULL),
  ('def-dev', 'online', NULL),
  ('entire-site', 'online', NULL)
ON CONFLICT (id) DO NOTHING;