
-- Create a table for storing user API keys
CREATE TABLE IF NOT EXISTS public.user_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
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

-- Create a table for document embeddings if it doesn't exist
CREATE TABLE IF NOT EXISTS public.document_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_name TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(768),  -- Adjust dimensions based on embedding model
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create an index for vector similarity search
CREATE INDEX IF NOT EXISTS document_embeddings_embedding_idx ON document_embeddings USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);

-- Add Row Level Security to embeddings
ALTER TABLE public.document_embeddings ENABLE ROW LEVEL SECURITY;

-- Create a general policy to allow all authenticated users to select embeddings
CREATE POLICY "Authenticated users can select embeddings" 
  ON public.document_embeddings 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Create a general policy to allow all authenticated users to insert embeddings
CREATE POLICY "Authenticated users can insert embeddings" 
  ON public.document_embeddings 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);
