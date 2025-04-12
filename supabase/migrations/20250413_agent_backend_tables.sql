
-- Create agent orchestration tables

-- Table for agent workflows (LangGraph-based orchestration)
CREATE TABLE IF NOT EXISTS public.agent_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  workflow_type TEXT NOT NULL CHECK (workflow_type IN ('sequential', 'conditional', 'team')),
  nodes JSONB NOT NULL DEFAULT '[]'::JSONB,
  edges JSONB NOT NULL DEFAULT '[]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table for model configurations
CREATE TABLE IF NOT EXISTS public.model_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  model_id TEXT NOT NULL,
  api_key TEXT,
  parameters JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, name)
);

-- Add encryption for API keys
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add function to encrypt API keys
CREATE OR REPLACE FUNCTION encrypt_api_key() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.api_key IS NOT NULL THEN
    NEW.api_key = pgp_sym_encrypt(NEW.api_key, current_setting('app.settings.jwt_secret'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for encrypting API keys
DROP TRIGGER IF EXISTS encrypt_api_key_trigger ON public.model_configurations;
CREATE TRIGGER encrypt_api_key_trigger
  BEFORE INSERT OR UPDATE OF api_key ON public.model_configurations
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_api_key();

-- Function to decrypt API keys
CREATE OR REPLACE FUNCTION decrypt_api_key(encrypted_key TEXT) RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_decrypt(encrypted_key::bytea, current_setting('app.settings.jwt_secret'));
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Table for conversations
CREATE TABLE IF NOT EXISTS public.agent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.user_agents ON DELETE CASCADE,
  workflow_id UUID REFERENCES public.agent_workflows,
  thread_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'error')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(agent_id, thread_id)
);

-- Table for conversation messages
CREATE TABLE IF NOT EXISTS public.agent_conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.agent_conversations ON DELETE CASCADE,
  agent_id UUID REFERENCES public.user_agents ON DELETE SET NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'function')),
  content TEXT NOT NULL,
  token_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table for agent state management
CREATE TABLE IF NOT EXISTS public.agent_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.agent_conversations ON DELETE CASCADE,
  state_data JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(conversation_id)
);

-- Table for agent analytics
CREATE TABLE IF NOT EXISTS public.agent_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  agent_id UUID REFERENCES public.user_agents ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.agent_conversations ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.agent_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own workflows" 
  ON public.agent_workflows 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own model configurations" 
  ON public.model_configurations 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own conversations" 
  ON public.agent_conversations 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view messages in their conversations" 
  ON public.agent_conversation_messages 
  USING (EXISTS (
    SELECT 1 FROM public.agent_conversations 
    WHERE public.agent_conversations.id = public.agent_conversation_messages.conversation_id 
    AND public.agent_conversations.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage state for their conversations" 
  ON public.agent_state 
  USING (EXISTS (
    SELECT 1 FROM public.agent_conversations 
    WHERE public.agent_conversations.id = public.agent_state.conversation_id 
    AND public.agent_conversations.user_id = auth.uid()
  ));

CREATE POLICY "Users can view their own analytics" 
  ON public.agent_analytics 
  USING (auth.uid() = user_id);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
DROP TRIGGER IF EXISTS update_workflows_timestamp ON public.agent_workflows;
CREATE TRIGGER update_workflows_timestamp
  BEFORE UPDATE ON public.agent_workflows
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS update_model_configurations_timestamp ON public.model_configurations;
CREATE TRIGGER update_model_configurations_timestamp
  BEFORE UPDATE ON public.model_configurations
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS update_agent_state_timestamp ON public.agent_state;
CREATE TRIGGER update_agent_state_timestamp
  BEFORE UPDATE ON public.agent_state
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- Insert default model configurations
INSERT INTO public.model_configurations (user_id, name, provider, model_id, parameters)
VALUES 
('00000000-0000-0000-0000-000000000000', 'OpenAI GPT-4o', 'openai', 'gpt-4o', '{"temperature": 0.7, "max_tokens": 4096}'),
('00000000-0000-0000-0000-000000000000', 'OpenAI GPT-3.5 Turbo', 'openai', 'gpt-3.5-turbo', '{"temperature": 0.7, "max_tokens": 4096}'),
('00000000-0000-0000-0000-000000000000', 'Claude 3 Opus', 'anthropic', 'claude-3-opus-20240229', '{"temperature": 0.7, "max_tokens": 4096}'),
('00000000-0000-0000-0000-000000000000', 'Claude 3.5 Sonnet', 'anthropic', 'claude-3-5-sonnet-20240620', '{"temperature": 0.7, "max_tokens": 4096}'),
('00000000-0000-0000-0000-000000000000', 'Claude 3.7 Sonnet', 'anthropic', 'claude-3-7-sonnet', '{"temperature": 0.7, "max_tokens": 4096}');
