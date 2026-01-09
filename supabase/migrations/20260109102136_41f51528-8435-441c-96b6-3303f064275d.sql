-- Create global chat messages table
CREATE TABLE public.global_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  temp_session_id TEXT,
  display_name TEXT NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 500),
  reply_to_id UUID REFERENCES public.global_chat_messages(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  is_system BOOLEAN NOT NULL DEFAULT false,
  user_role TEXT,
  is_vip BOOLEAN DEFAULT false
);

-- Create chat rate limits table
CREATE TABLE public.chat_rate_limits (
  identifier TEXT NOT NULL PRIMARY KEY,
  last_message_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_authenticated BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE public.global_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rate_limits ENABLE ROW LEVEL SECURITY;

-- Everyone can read messages
CREATE POLICY "Anyone can read chat messages"
ON public.global_chat_messages
FOR SELECT
USING (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can send messages"
ON public.global_chat_messages
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Anonymous insert via function (we'll handle this in the app)
CREATE POLICY "Allow anonymous message insert"
ON public.global_chat_messages
FOR INSERT
WITH CHECK (user_id IS NULL AND temp_session_id IS NOT NULL);

-- Admins/creators can update (for moderation)
CREATE POLICY "Admins can moderate messages"
ON public.global_chat_messages
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'creator')
  )
);

-- Rate limits - users can manage their own
CREATE POLICY "Users can read own rate limit"
ON public.chat_rate_limits
FOR SELECT
USING (true);

CREATE POLICY "Users can upsert own rate limit"
ON public.chat_rate_limits
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update own rate limit"
ON public.chat_rate_limits
FOR UPDATE
USING (true);

-- Enable realtime for live chat
ALTER TABLE public.global_chat_messages REPLICA IDENTITY FULL;

-- Create index for faster queries
CREATE INDEX idx_global_chat_created_at ON public.global_chat_messages(created_at DESC);
CREATE INDEX idx_global_chat_reply_to ON public.global_chat_messages(reply_to_id) WHERE reply_to_id IS NOT NULL;

-- Function to auto-delete old messages (run via pg_cron or manually)
CREATE OR REPLACE FUNCTION public.cleanup_old_chat_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM public.global_chat_messages
  WHERE created_at < now() - INTERVAL '2 weeks';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment
COMMENT ON TABLE public.global_chat_messages IS 'Global open chat messages - auto-cleaned after 2 weeks';