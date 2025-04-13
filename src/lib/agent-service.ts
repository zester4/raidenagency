
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

// Mock subscriptions data
const mockSubscriptions: Record<string, SubscriptionPlan> = {
  'free': {
    id: 'free',
    name: 'Free',
    description: 'Basic access to AI agents',
    monthly_price: 0,
    annual_price: 0,
    features: { agents: 2, conversations: 50, modelAccess: ['gpt-3.5-turbo'] },
    limits: { maxAgents: 2, maxConversations: 50 },
    is_active: true
  },
  'pro': {
    id: 'pro',
    name: 'Pro',
    description: 'Advanced access to AI agents with more capabilities',
    monthly_price: 19.99,
    annual_price: 199.99,
    features: { agents: 10, conversations: 500, modelAccess: ['gpt-4o', 'claude-3-sonnet'] },
    limits: { maxAgents: 10, maxConversations: 500 },
    is_active: true
  }
};

export const subscriptionService = {
  getCurrentPlan: async (): Promise<SubscriptionPlan | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Return the free plan for now
      return mockSubscriptions['free'];
    } catch (error) {
      console.error('Error fetching current plan:', error);
      return null;
    }
  },

  getAllPlans: async (): Promise<SubscriptionPlan[]> => {
    try {
      // Return mock plans
      return Object.values(mockSubscriptions);
    } catch (error) {
      console.error('Error fetching all plans:', error);
      return [];
    }
  }
};

// Mock agents data
const mockAgents: UserAgent[] = [
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

// Mock templates data
const mockTemplates: AgentTemplate[] = [
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

export const userAgentService = {
  getAll: async (): Promise<UserAgent[]> => {
    try {
      return mockAgents;
    } catch (error) {
      console.error('Error fetching agents:', error);
      return [];
    }
  },

  create: async (agent: Omit<UserAgent, 'id' | 'created_at' | 'updated_at'>): Promise<UserAgent | null> => {
    try {
      const newAgent: UserAgent = {
        id: `agent-${Date.now()}`,
        ...agent,
        created_at: new Date().toISOString(),
        status: 'online'
      };
      mockAgents.push(newAgent);
      return newAgent;
    } catch (error) {
      console.error('Error creating agent:', error);
      return null;
    }
  },

  update: async (id: string, updates: Partial<UserAgent>): Promise<UserAgent | null> => {
    try {
      const index = mockAgents.findIndex(a => a.id === id);
      if (index === -1) return null;
      
      const updatedAgent = {
        ...mockAgents[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      mockAgents[index] = updatedAgent;
      return updatedAgent;
    } catch (error) {
      console.error('Error updating agent:', error);
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const index = mockAgents.findIndex(a => a.id === id);
      if (index === -1) return false;
      
      mockAgents.splice(index, 1);
      return true;
    } catch (error) {
      console.error('Error deleting agent:', error);
      return false;
    }
  },

  updateStatus: async (id: string, status: 'online' | 'offline' | 'error'): Promise<boolean> => {
    try {
      const index = mockAgents.findIndex(a => a.id === id);
      if (index === -1) return false;
      
      mockAgents[index].status = status;
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
      return mockTemplates;
    } catch (error) {
      console.error('Error fetching agent templates:', error);
      return [];
    }
  }
};
