
export interface UserAgent {
  id: string;
  user_id?: string;
  name: string;
  description?: string;
  category?: string;
  system_prompt?: string;
  status?: 'online' | 'offline' | 'error';
  created_at?: string;
  updated_at?: string;
  model_config?: {
    model: string;
    temperature: number;
    max_tokens: number;
    frequency_penalty: number;
    presence_penalty: number;
    top_p: number;
  };
  vector_store?: {
    enabled: boolean;
    collection_name: string;
    document_count: number;
  };
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  system_prompt: string;
  popularity?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits?: {
    max_agents: number;
    max_documents: number;
    max_tokens: number;
  };
}

export const userAgentService = {
  getAgentById: async (id: string): Promise<UserAgent | null> => {
    // This would be implemented with a real API/database call
    return {
      id,
      name: 'Sample Agent',
      description: 'A sample agent for demonstration',
      category: 'general',
      system_prompt: 'You are a helpful assistant.',
      status: 'online',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      model_config: {
        model: 'gpt-4o',
        temperature: 0.7,
        max_tokens: 4096,
        frequency_penalty: 0,
        presence_penalty: 0,
        top_p: 1
      },
      vector_store: {
        enabled: false,
        collection_name: '',
        document_count: 0
      }
    };
  },
  
  updateAgent: async (id: string, data: Partial<UserAgent>): Promise<UserAgent> => {
    // This would be implemented with a real API/database call
    return {
      id,
      name: data.name || 'Updated Agent',
      description: data.description,
      category: data.category,
      system_prompt: data.system_prompt,
      status: 'online',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      model_config: data.model_config,
      vector_store: data.vector_store
    };
  },

  // Add missing methods
  getAll: async (): Promise<UserAgent[]> => {
    // This would be implemented with a real API/database call
    return [
      {
        id: '1',
        name: 'Customer Support Agent',
        description: 'Handles customer inquiries',
        category: 'support',
        system_prompt: 'You are a helpful customer support agent.',
        status: 'online',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        model_config: {
          model: 'gpt-4o',
          temperature: 0.7,
          max_tokens: 4096,
          frequency_penalty: 0,
          presence_penalty: 0,
          top_p: 1
        },
        vector_store: {
          enabled: true,
          collection_name: 'support_docs',
          document_count: 12
        }
      },
      {
        id: '2',
        name: 'Knowledge Base Agent',
        description: 'Answers questions based on company knowledge',
        category: 'knowledge',
        system_prompt: 'You are a knowledge base assistant.',
        status: 'offline',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        model_config: {
          model: 'claude-3-opus',
          temperature: 0.5,
          max_tokens: 8192,
          frequency_penalty: 0,
          presence_penalty: 0,
          top_p: 1
        },
        vector_store: {
          enabled: true,
          collection_name: 'kb_docs',
          document_count: 45
        }
      }
    ];
  },

  create: async (agent: Omit<UserAgent, 'id' | 'created_at' | 'updated_at'>): Promise<UserAgent> => {
    // This would be implemented with a real API/database call
    return {
      id: Math.random().toString(36).substring(7),
      name: agent.name,
      description: agent.description,
      category: agent.category,
      system_prompt: agent.system_prompt,
      status: 'offline',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      model_config: agent.model_config,
      vector_store: agent.vector_store
    };
  },

  update: async (id: string, data: Partial<UserAgent>): Promise<UserAgent> => {
    // This delegates to updateAgent for backward compatibility
    return userAgentService.updateAgent(id, data);
  },

  delete: async (id: string): Promise<void> => {
    // This would be implemented with a real API/database call
    console.log(`Deleting agent with ID: ${id}`);
    // No return value needed for delete operation
  },

  updateStatus: async (id: string, status: 'online' | 'offline' | 'error'): Promise<UserAgent> => {
    // This would be implemented with a real API/database call
    return {
      id,
      name: 'Updated Agent',
      description: 'Status updated',
      category: 'general',
      system_prompt: 'You are a helpful assistant.',
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      model_config: {
        model: 'gpt-4o',
        temperature: 0.7,
        max_tokens: 4096,
        frequency_penalty: 0,
        presence_penalty: 0,
        top_p: 1
      },
      vector_store: {
        enabled: false,
        collection_name: '',
        document_count: 0
      }
    };
  }
};

export const agentTemplateService = {
  getAll: async (): Promise<AgentTemplate[]> => {
    // This would be implemented with a real API/database call
    return [
      {
        id: 'customer-support',
        name: 'Customer Support Agent',
        description: 'Handles customer inquiries and routes them to the appropriate department',
        category: 'support',
        system_prompt: 'You are a helpful customer support agent.',
        popularity: 95
      },
      {
        id: 'knowledge-base',
        name: 'Knowledge Base Agent',
        description: 'Answers questions based on company knowledge and documentation',
        category: 'knowledge',
        system_prompt: 'You are a knowledge base assistant.',
        popularity: 87
      },
      {
        id: 'sales-agent',
        name: 'Sales Agent',
        description: 'Helps qualify leads and answer product questions',
        category: 'sales',
        system_prompt: 'You are a helpful sales agent.',
        popularity: 92
      }
    ];
  }
};

export const subscriptionService = {
  getCurrentPlan: async (): Promise<SubscriptionPlan> => {
    // This would be implemented with a real API/database call
    return {
      id: 'pro',
      name: 'Pro',
      description: 'For growing businesses',
      price: 49.99,
      interval: 'monthly',
      features: [
        'Unlimited agents',
        'Priority support',
        'Advanced analytics',
        'Custom integrations'
      ],
      limits: {
        max_agents: 10,
        max_documents: 1000,
        max_tokens: 1000000
      }
    };
  },

  getAllPlans: async (): Promise<SubscriptionPlan[]> => {
    // This would be implemented with a real API/database call
    return [
      {
        id: 'free',
        name: 'Free',
        description: 'For individuals and hobbyists',
        price: 0,
        interval: 'monthly',
        features: [
          'Up to 3 agents',
          'Basic analytics',
          'Community support'
        ],
        limits: {
          max_agents: 3,
          max_documents: 100,
          max_tokens: 100000
        }
      },
      {
        id: 'pro',
        name: 'Pro',
        description: 'For growing businesses',
        price: 49.99,
        interval: 'monthly',
        features: [
          'Unlimited agents',
          'Priority support',
          'Advanced analytics',
          'Custom integrations'
        ],
        limits: {
          max_agents: 10,
          max_documents: 1000,
          max_tokens: 1000000
        }
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'For large organizations',
        price: 199.99,
        interval: 'monthly',
        features: [
          'Unlimited everything',
          'Dedicated support',
          'SLA guarantees',
          'Custom model training'
        ],
        limits: {
          max_agents: 100,
          max_documents: 10000,
          max_tokens: 10000000
        }
      }
    ];
  }
};
