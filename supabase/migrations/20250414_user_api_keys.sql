
-- Create a table for storing user API keys if it doesn't exist already
CREATE TABLE IF NOT EXISTS public.user_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  provider_id TEXT NOT NULL,
  api_key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, provider_id)
);

-- Add Row Level Security
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view only their own API keys
CREATE POLICY "Users can view their own API keys" 
  ON public.user_api_keys 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to insert their own API keys
CREATE POLICY "Users can insert their own API keys" 
  ON public.user_api_keys 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to update their own API keys
CREATE POLICY "Users can update their own API keys" 
  ON public.user_api_keys 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to delete their own API keys
CREATE POLICY "Users can delete their own API keys" 
  ON public.user_api_keys 
  FOR DELETE 
  USING (auth.uid() = user_id);
