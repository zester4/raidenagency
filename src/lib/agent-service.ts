
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

export interface UserAgent {
  id: string;
  user_id?: string;
  name: string;
  description?: string;
  category?: string;
  system_prompt?: string;
  model_config?: ModelConfig;
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
  workflow_template_id?: string;
}

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
          workflow_template_id: 'sales-workflow'
        }
      ];
    } catch (error) {
      console.error('Error fetching agent templates:', error);
      return [];
    }
  }
};
