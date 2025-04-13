import { supabase } from '@/integrations/supabase/client';

export interface ModelConfig {
  model: string;
  provider?: string;
  temperature?: number;
  max_tokens?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  top_p?: number;
}

export interface VectorStore {
  enabled: boolean;
  collection_name?: string;
  document_count?: number;
}

export interface UserAgent {
  id: string;
  user_id?: string;
  name: string;
  description?: string;
  category?: string;
  system_prompt?: string;
  model_config?: ModelConfig;
  vector_store?: VectorStore;
  created_at?: string;
  updated_at?: string;
  status?: 'online' | 'offline' | 'error';
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  system_prompt: string;
  model_config: ModelConfig;
  popularity?: 'high' | 'medium' | 'low';
  workflow_template_id?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  monthly_price: number; 
  annual_price: number;
  features: any;
  limits: any;
  is_active: boolean;
}

export const subscriptionService = {
  getCurrentPlan: async (): Promise<SubscriptionPlan | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .select('plan_id')
        .eq('user_id', user.id)
        .single();

      if (subscriptionError || !subscriptionData) {
        console.error('Error fetching subscription:', subscriptionError);
        return null;
      }

      const { data: planData, error: planError } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', subscriptionData.plan_id)
        .single();

      if (planError || !planData) {
        console.error('Error fetching plan:', planError);
        return null;
      }

      return planData as SubscriptionPlan;
    } catch (error) {
      console.error('Error fetching current plan:', error);
      return null;
    }
  },

  getAllPlans: async (): Promise<SubscriptionPlan[]> => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('monthly_price', { ascending: true });

      if (error || !data) {
        console.error('Error fetching subscription plans:', error);
        return [];
      }

      return data as SubscriptionPlan[];
    } catch (error) {
      console.error('Error fetching all plans:', error);
      return [];
    }
  }
};

export const userAgentService = {
  getAll: async (): Promise<UserAgent[]> => {
    try {
      // Mock implementation
      return [
        {
          id: 'agent-1',
          name: 'Customer Support Agent',
          description: 'Handles customer inquiries and support requests',
          category: 'support',
          system_prompt: 'You are a helpful customer support agent...',
          model_config: {
            model: 'gpt-4o',
            provider: 'openai',
            temperature: 0.7
          },
          vector_store: {
            enabled: true,
            collection_name: 'customer_support',
            document_count: 1000
          },
          created_at: new Date().toISOString(),
          status: 'online'
        },
        {
          id: 'agent-2',
          name: 'Sales Assistant',
          description: 'Helps with product information and sales inquiries',
          category: 'sales',
          system_prompt: 'You are a knowledgeable sales assistant...',
          model_config: {
            model: 'claude-3-sonnet-20240229',
            provider: 'anthropic',
            temperature: 0.8
          },
          vector_store: {
            enabled: true,
            collection_name: 'sales',
            document_count: 500
          },
          created_at: new Date().toISOString(),
          status: 'online'
        }
      ];
    } catch (error) {
      console.error('Error fetching agents:', error);
      return [];
    }
  },

  create: async (agent: Omit<UserAgent, 'id' | 'created_at' | 'updated_at'>): Promise<UserAgent | null> => {
    try {
      // Mock implementation
      const newAgent: UserAgent = {
        id: `agent-${Date.now()}`,
        ...agent,
        created_at: new Date().toISOString(),
        status: 'online'
      };
      return newAgent;
    } catch (error) {
      console.error('Error creating agent:', error);
      return null;
    }
  },

  update: async (id: string, updates: Partial<UserAgent>): Promise<UserAgent | null> => {
    try {
      // Mock implementation
      return {
        id,
        name: updates.name || 'Updated Agent',
        description: updates.description || 'Updated description',
        system_prompt: updates.system_prompt || '',
        model_config: updates.model_config || { model: 'gpt-4o', provider: 'openai' },
        vector_store: updates.vector_store || {
          enabled: true,
          collection_name: 'default',
          document_count: 0
        },
        updated_at: new Date().toISOString(),
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        status: updates.status || 'online'
      };
    } catch (error) {
      console.error('Error updating agent:', error);
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      // Mock implementation
      return true;
    } catch (error) {
      console.error('Error deleting agent:', error);
      return false;
    }
  },

  updateStatus: async (id: string, status: 'online' | 'offline' | 'error'): Promise<boolean> => {
    try {
      // Mock implementation
      return true;
    } catch (error) {
      console.error('Error updating agent status:', error);
      return false;
    }
  }
};

export const agentTemplateService = {
  getAll: async (): Promise<AgentTemplate[]> => {
    try {
      // Mock implementation
      return [
        {
          id: 'template-1',
          name: 'Customer Support',
          description: 'Template for creating customer support agents',
          category: 'support',
          system_prompt: 'You are a helpful customer support agent...',
          model_config: {
            model: 'gpt-4o',
            provider: 'openai',
            temperature: 0.7
          },
          popularity: 'high',
          workflow_template_id: 'customer-support-flow'
        },
        {
          id: 'template-2',
          name: 'Sales Assistant',
          description: 'Template for creating sales assistant agents',
          category: 'sales',
          system_prompt: 'You are a knowledgeable sales assistant...',
          model_config: {
            model: 'claude-3-sonnet-20240229',
            provider: 'anthropic',
            temperature: 0.8
          },
          popularity: 'medium',
          workflow_template_id: 'sales-workflow'
        }
      ];
    } catch (error) {
      console.error('Error fetching agent templates:', error);
      return [];
    }
  }
};
