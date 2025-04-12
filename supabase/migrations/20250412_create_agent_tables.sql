
-- Create agent tables
CREATE TABLE IF NOT EXISTS public.agent_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  popularity TEXT NOT NULL CHECK (popularity IN ('high', 'medium', 'low')),
  icon TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT NOT NULL CHECK (status IN ('online', 'offline', 'error')),
  icon TEXT,
  system_prompt TEXT,
  config JSONB NOT NULL DEFAULT '{}'::JSONB,
  template_id UUID REFERENCES public.agent_templates,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.agent_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.user_agents ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  tool_type TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.agent_knowledge_bases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.user_agents ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  vectorstore_type TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.agent_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_base_id UUID NOT NULL REFERENCES public.agent_knowledge_bases ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  monthly_price DECIMAL(10,2) NOT NULL,
  annual_price DECIMAL(10,2) NOT NULL,
  features JSONB NOT NULL DEFAULT '{}'::JSONB,
  limits JSONB NOT NULL DEFAULT '{}'::JSONB,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  payment_provider TEXT,
  payment_provider_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Add RLS policies
ALTER TABLE public.agent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_knowledge_bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Agent templates are viewable by all authenticated users
CREATE POLICY "Agent templates are viewable by all users" 
  ON public.agent_templates FOR SELECT 
  TO authenticated 
  USING (true);

-- Users can view, insert, update, and delete their own agents
CREATE POLICY "Users can view their own agents" 
  ON public.user_agents FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own agents" 
  ON public.user_agents FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agents" 
  ON public.user_agents FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agents" 
  ON public.user_agents FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Users can manage tools for their own agents
CREATE POLICY "Users can view tools for their own agents" 
  ON public.agent_tools FOR SELECT 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.user_agents 
    WHERE public.user_agents.id = public.agent_tools.agent_id 
    AND public.user_agents.user_id = auth.uid()
  ));

CREATE POLICY "Users can create tools for their own agents" 
  ON public.agent_tools FOR INSERT 
  TO authenticated 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_agents 
    WHERE public.user_agents.id = public.agent_tools.agent_id 
    AND public.user_agents.user_id = auth.uid()
  ));

CREATE POLICY "Users can update tools for their own agents" 
  ON public.agent_tools FOR UPDATE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.user_agents 
    WHERE public.user_agents.id = public.agent_tools.agent_id 
    AND public.user_agents.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete tools for their own agents" 
  ON public.agent_tools FOR DELETE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.user_agents 
    WHERE public.user_agents.id = public.agent_tools.agent_id 
    AND public.user_agents.user_id = auth.uid()
  ));

-- Users can manage knowledge bases for their own agents
CREATE POLICY "Users can view knowledge bases for their own agents" 
  ON public.agent_knowledge_bases FOR SELECT 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.user_agents 
    WHERE public.user_agents.id = public.agent_knowledge_bases.agent_id 
    AND public.user_agents.user_id = auth.uid()
  ));

CREATE POLICY "Users can create knowledge bases for their own agents" 
  ON public.agent_knowledge_bases FOR INSERT 
  TO authenticated 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_agents 
    WHERE public.user_agents.id = public.agent_knowledge_bases.agent_id 
    AND public.user_agents.user_id = auth.uid()
  ));

CREATE POLICY "Users can update knowledge bases for their own agents" 
  ON public.agent_knowledge_bases FOR UPDATE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.user_agents 
    WHERE public.user_agents.id = public.agent_knowledge_bases.agent_id 
    AND public.user_agents.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete knowledge bases for their own agents" 
  ON public.agent_knowledge_bases FOR DELETE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.user_agents 
    WHERE public.user_agents.id = public.agent_knowledge_bases.agent_id 
    AND public.user_agents.user_id = auth.uid()
  ));

-- Users can manage documents for their own knowledge bases
CREATE POLICY "Users can view documents for their own knowledge bases" 
  ON public.agent_documents FOR SELECT 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.agent_knowledge_bases 
    JOIN public.user_agents ON public.agent_knowledge_bases.agent_id = public.user_agents.id
    WHERE public.agent_knowledge_bases.id = public.agent_documents.knowledge_base_id 
    AND public.user_agents.user_id = auth.uid()
  ));

CREATE POLICY "Users can create documents for their own knowledge bases" 
  ON public.agent_documents FOR INSERT 
  TO authenticated 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.agent_knowledge_bases 
    JOIN public.user_agents ON public.agent_knowledge_bases.agent_id = public.user_agents.id
    WHERE public.agent_knowledge_bases.id = public.agent_documents.knowledge_base_id 
    AND public.user_agents.user_id = auth.uid()
  ));

CREATE POLICY "Users can update documents for their own knowledge bases" 
  ON public.agent_documents FOR UPDATE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.agent_knowledge_bases 
    JOIN public.user_agents ON public.agent_knowledge_bases.agent_id = public.user_agents.id
    WHERE public.agent_knowledge_bases.id = public.agent_documents.knowledge_base_id 
    AND public.user_agents.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete documents for their own knowledge bases" 
  ON public.agent_documents FOR DELETE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.agent_knowledge_bases 
    JOIN public.user_agents ON public.agent_knowledge_bases.agent_id = public.user_agents.id
    WHERE public.agent_knowledge_bases.id = public.agent_documents.knowledge_base_id 
    AND public.user_agents.user_id = auth.uid()
  ));

-- Subscription plans are viewable by all authenticated users
CREATE POLICY "Subscription plans are viewable by all users" 
  ON public.subscription_plans FOR SELECT 
  TO authenticated 
  USING (is_active = true);

-- Users can view their own subscriptions
CREATE POLICY "Users can view their own subscriptions" 
  ON public.user_subscriptions FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, description, monthly_price, annual_price, features, limits)
VALUES 
('Free', 'For individuals and small projects', 0, 0, 
  '{"basic_templates": true, "community_support": true, "basic_integrations": true}',
  '{"max_agents": 2, "messages_per_month": 1000, "vector_store_size_mb": 100, "custom_tools": 0}'
),
('Pro', 'For professionals and growing businesses', 29, 24,
  '{"all_templates": true, "priority_support": true, "advanced_integrations": true, "custom_tools": true, "team_collaboration": true}',
  '{"max_agents": 10, "messages_per_month": 10000, "vector_store_size_mb": 1024, "custom_tools": 5}'
),
('Enterprise', 'For large organizations with custom needs', 99, 84,
  '{"all_templates": true, "priority_support": true, "all_integrations": true, "custom_tools": true, "team_collaboration": true, "white_labeling": true, "enterprise_security": true}',
  '{"max_agents": 999999, "messages_per_month": 999999, "vector_store_size_mb": 10240, "custom_tools": 999999}'
);

-- Insert default agent templates
INSERT INTO public.agent_templates (name, description, category, popularity, icon, system_prompt)
VALUES 
('Customer Support', 'Handle customer inquiries and route to specialized support agents.', 'support', 'high', 'Bot', 
 'You are a helpful customer support agent. Your goal is to assist customers with their inquiries and route complex issues to specialized teams when necessary.'),
('Healthcare Assistant', 'Triage patient questions and provide medical information.', 'healthcare', 'medium', 'Bot',
 'You are a healthcare assistant. You can help triage patient questions and provide general medical information. For serious medical concerns, you should recommend consulting with a healthcare professional.'),
('Security Monitor', 'Analyze security alerts and provide incident response.', 'security', 'medium', 'Bot',
 'You are a security monitoring assistant. You help analyze security alerts and provide guidance on incident response procedures.'),
('Data Analyst', 'Process data, generate insights and create visualizations.', 'analytics', 'high', 'Bot',
 'You are a data analysis assistant. You help process data, generate insights, and suggest visualizations that would be helpful for understanding the data.'),
('HR Assistant', 'Answer employee questions and manage HR processes.', 'hr', 'low', 'Bot',
 'You are an HR assistant. You help answer employee questions about company policies, benefits, and manage common HR processes.'),
('Knowledge Base', 'Search and retrieve information from company documents.', 'knowledge', 'high', 'Bot',
 'You are a knowledge base assistant. Your primary role is to search and retrieve accurate information from company documents and provide clear, concise answers.');

-- Create function to automatically create a free subscription for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER AS $$
DECLARE
  free_plan_id UUID;
BEGIN
  -- Get the ID of the free plan
  SELECT id INTO free_plan_id FROM public.subscription_plans WHERE name = 'Free' LIMIT 1;
  
  -- Create a subscription for the new user
  INSERT INTO public.user_subscriptions (
    user_id,
    plan_id,
    status,
    current_period_start,
    current_period_end,
    cancel_at_period_end
  ) VALUES (
    NEW.id,
    free_plan_id,
    'active',
    now(),
    (now() + interval '100 years'),
    false
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_subscription();

-- Create function to check user subscription limits
CREATE OR REPLACE FUNCTION public.check_user_agent_limit()
RETURNS TRIGGER AS $$
DECLARE
  agent_count INTEGER;
  max_agents INTEGER;
  user_plan UUID;
BEGIN
  -- Count the user's existing agents
  SELECT COUNT(*) INTO agent_count
  FROM public.user_agents
  WHERE user_id = NEW.user_id;

  -- Get the user's subscription plan
  SELECT plan_id INTO user_plan
  FROM public.user_subscriptions
  WHERE user_id = NEW.user_id;

  -- Get the max agents limit for the plan
  SELECT (limits->>'max_agents')::INTEGER INTO max_agents
  FROM public.subscription_plans
  WHERE id = user_plan;

  -- Check if creating a new agent would exceed the limit
  IF agent_count >= max_agents THEN
    RAISE EXCEPTION 'Agent limit reached for your subscription plan. Please upgrade to create more agents.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to check the limit before inserting a new agent
DROP TRIGGER IF EXISTS check_agent_limit_trigger ON public.user_agents;
CREATE TRIGGER check_agent_limit_trigger
  BEFORE INSERT ON public.user_agents
  FOR EACH ROW
  EXECUTE FUNCTION public.check_user_agent_limit();
