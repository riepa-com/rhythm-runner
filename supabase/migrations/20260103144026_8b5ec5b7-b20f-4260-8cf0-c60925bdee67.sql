-- =============================================
-- VIP SYSTEM
-- =============================================

-- Create VIPs table
CREATE TABLE public.vips (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    granted_by uuid REFERENCES auth.users(id),
    granted_at timestamp with time zone DEFAULT now(),
    reason text,
    UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.vips ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can manage VIPs
CREATE POLICY "Admins can manage VIPs"
ON public.vips
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Users can check if they are VIP
CREATE POLICY "Users can check own VIP status"
ON public.vips
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Function to check VIP status
CREATE OR REPLACE FUNCTION public.is_vip(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.vips
    WHERE user_id = _user_id
  )
$$;

-- =============================================
-- SITE LOCK FEATURE
-- =============================================

-- Create site locks table
CREATE TABLE public.site_locks (
    id text PRIMARY KEY DEFAULT 'global',
    is_locked boolean DEFAULT false,
    lock_reason text,
    locked_at timestamp with time zone,
    locked_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.site_locks ENABLE ROW LEVEL SECURITY;

-- Insert default row
INSERT INTO public.site_locks (id, is_locked) VALUES ('global', false);

-- Policy: Anyone can read site lock status
CREATE POLICY "Anyone can read site lock status"
ON public.site_locks
FOR SELECT
USING (true);

-- Policy: Admins can update site lock
CREATE POLICY "Admins can update site lock"
ON public.site_locks
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- NAVI AI BOT MESSAGES
-- =============================================

-- Create NAVI messages table
CREATE TABLE public.navi_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    message text NOT NULL,
    priority text DEFAULT 'info' CHECK (priority IN ('info', 'warning', 'critical')),
    target_audience text DEFAULT 'all' CHECK (target_audience IN ('all', 'online', 'admins', 'vips')),
    sent_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.navi_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can manage NAVI messages
CREATE POLICY "Admins can manage NAVI messages"
ON public.navi_messages
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Users can read NAVI messages targeted to them
CREATE POLICY "Users can read NAVI messages"
ON public.navi_messages
FOR SELECT
TO authenticated
USING (
    target_audience = 'all' OR
    (target_audience = 'admins' AND public.has_role(auth.uid(), 'admin')) OR
    (target_audience = 'vips' AND public.is_vip(auth.uid()))
);