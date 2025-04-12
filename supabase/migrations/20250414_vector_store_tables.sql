
-- Create vector store tables

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create vector collections table
CREATE TABLE IF NOT EXISTS public.agent_vector_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.user_agents ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(agent_id, name)
);

-- Create vector documents table
CREATE TABLE IF NOT EXISTS public.agent_vector_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.user_agents ON DELETE CASCADE,
  collection_name TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  embedding VECTOR(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Function to perform similarity search
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(1536),
  collection_name TEXT,
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM
    agent_vector_documents AS documents
  WHERE
    documents.collection_name = match_documents.collection_name
    AND 1 - (documents.embedding <=> query_embedding) > match_threshold
  ORDER BY
    documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
DROP TRIGGER IF EXISTS update_vector_collections_timestamp ON public.agent_vector_collections;
CREATE TRIGGER update_vector_collections_timestamp
  BEFORE UPDATE ON public.agent_vector_collections
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS update_vector_documents_timestamp ON public.agent_vector_documents;
CREATE TRIGGER update_vector_documents_timestamp
  BEFORE UPDATE ON public.agent_vector_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- Enable RLS
ALTER TABLE public.agent_vector_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_vector_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own vector collections" 
  ON public.agent_vector_collections 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own vector documents" 
  ON public.agent_vector_documents 
  USING (auth.uid() = user_id);

-- Create index for faster similarity search
CREATE INDEX IF NOT EXISTS agent_vector_documents_embedding_idx 
  ON public.agent_vector_documents 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
