
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  popularity: 'high' | 'medium' | 'low';
  icon: string;
  system_prompt: string;
  config?: any;
}

export interface UserAgent {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  category?: string;
  status: 'online' | 'offline' | 'error';
  icon?: string;
  system_prompt?: string;
  config?: any;
  template_id?: string;
  created_at: string;
  updated_at: string;
  deployment?: AgentDeployment;
}

export interface AgentDeployment {
  id: string;
  agent_id: string;
  type: 'chat-widget' | 'api-endpoint' | 'standalone' | 'messaging';
  status: 'active' | 'inactive';
  config?: any;
  created_at: string;
  updated_at: string;
}

export interface AgentTool {
  id: string;
  agent_id: string;
  name: string;
  description?: string;
  tool_type: string;
  config?: any;
}

export interface AgentKnowledgeBase {
  id: string;
  agent_id: string;
  name: string;
  description?: string;
  vectorstore_type: string;
  config?: any;
}

export interface AgentDocument {
  id: string;
  knowledge_base_id: string;
  filename: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  processed: boolean;
  metadata?: any;
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

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  payment_provider?: string;
  payment_provider_subscription_id?: string;
}

// Agent template service
export const agentTemplateService = {
  async getAll(): Promise<AgentTemplate[]> {
    try {
      // Mock data for development
      const templates: AgentTemplate[] = [
        {
          id: 'customer-support',
          name: 'Customer Support Agent',
          description: 'Handles customer inquiries and routes them to the appropriate department',
          category: 'customer-service',
          popularity: 'high',
          icon: 'bot',
          system_prompt: 'You are a helpful customer support agent.'
        },
        {
          id: 'knowledge-base',
          name: 'Knowledge Base Agent',
          description: 'Answers questions based on your company documents and knowledge base',
          category: 'information',
          popularity: 'medium',
          icon: 'database',
          system_prompt: 'You are a knowledge base assistant.'
        },
        {
          id: 'sales-assistant',
          name: 'Sales Assistant',
          description: 'Helps qualify leads and answer product questions',
          category: 'sales',
          popularity: 'medium',
          icon: 'shopping-cart',
          system_prompt: 'You are a sales assistant.'
        },
        {
          id: 'healthcare-agent',
          name: 'Healthcare Assistant',
          description: 'Provides basic medical information and schedules appointments',
          category: 'healthcare',
          popularity: 'medium',
          icon: 'heart',
          system_prompt: 'You are a healthcare assistant. Provide general health information and help schedule appointments. Always clarify you are not a doctor and cannot provide medical advice.'
        },
        {
          id: 'security-agent',
          name: 'Security Operations Agent',
          description: 'Analyzes security alerts and helps with incident response',
          category: 'security',
          popularity: 'medium',
          icon: 'shield',
          system_prompt: 'You are a security operations assistant. Help analyze security alerts and guide incident response procedures.'
        },
        {
          id: 'financial-advisor',
          name: 'Financial Advisor Agent',
          description: 'Provides financial advice and portfolio management suggestions',
          category: 'finance',
          popularity: 'medium',
          icon: 'dollar-sign',
          system_prompt: 'You are a financial advisor assistant. Provide general financial guidance while making it clear you\'re not a certified financial advisor.'
        },
        {
          id: 'custom',
          name: 'Custom Agent',
          description: 'Start from scratch and build a custom agent',
          category: 'custom',
          popularity: 'low',
          icon: 'settings',
          system_prompt: 'You are a custom AI assistant.'
        }
      ];
      
      return templates;
    } catch (error) {
      console.error('Error fetching agent templates:', error);
      toast.error('Failed to load agent templates');
      return [];
    }
  },

  async getById(id: string): Promise<AgentTemplate | null> {
    try {
      // Mock implementation
      const templates = await this.getAll();
      return templates.find(t => t.id === id) || null;
    } catch (error) {
      console.error('Error fetching agent template:', error);
      toast.error('Failed to load agent template');
      return null;
    }
  }
};

// User agent service
export const userAgentService = {
  async getAll(): Promise<UserAgent[]> {
    try {
      // Mock implementation
      return [
        {
          id: '1',
          user_id: '123',
          name: 'General Support Agent',
          description: 'Handles general customer inquiries',
          category: 'customer-service',
          status: 'online',
          system_prompt: 'You are a helpful customer support agent.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deployment: {
            id: 'd1',
            agent_id: '1',
            type: 'chat-widget',
            status: 'active',
            config: {
              title: 'Customer Support',
              theme: 'dark',
              primaryColor: '#0091FF'
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        },
        {
          id: '2',
          user_id: '123',
          name: 'Technical Support Agent',
          description: 'Specialized in technical troubleshooting',
          category: 'technical',
          status: 'offline',
          system_prompt: 'You are a technical support specialist.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          user_id: '123',
          name: 'Sales Assistant',
          description: 'Helps with product inquiries and sales process',
          category: 'sales',
          status: 'offline',
          system_prompt: 'You are a sales assistant focused on helping customers find the right products.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Error fetching user agents:', error);
      toast.error('Failed to load your agents');
      return [];
    }
  },

  async getById(id: string): Promise<UserAgent | null> {
    try {
      // Mock implementation
      const agents = await this.getAll();
      return agents.find(a => a.id === id) || null;
    } catch (error) {
      console.error('Error fetching user agent:', error);
      toast.error('Failed to load agent details');
      return null;
    }
  },

  async create(agent: Omit<UserAgent, 'id' | 'created_at' | 'updated_at'>): Promise<UserAgent | null> {
    try {
      // Mock implementation
      const newAgent: UserAgent = {
        ...agent,
        id: Math.random().toString(36).substring(2, 11),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      toast.success('Agent created successfully');
      return newAgent;
    } catch (error) {
      console.error('Error creating agent:', error);
      toast.error('Failed to create agent');
      return null;
    }
  },

  async update(id: string, updates: Partial<UserAgent>): Promise<UserAgent | null> {
    try {
      // Mock implementation
      const agent = await this.getById(id);
      if (!agent) return null;
      
      const updatedAgent: UserAgent = {
        ...agent,
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      toast.success('Agent updated successfully');
      return updatedAgent;
    } catch (error) {
      console.error('Error updating agent:', error);
      toast.error('Failed to update agent');
      return null;
    }
  },

  async updateStatus(id: string, status: 'online' | 'offline' | 'error'): Promise<void> {
    try {
      // Mock implementation
      toast.success(`Agent ${status === 'online' ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error updating agent status:', error);
      toast.error('Failed to update agent status');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      // Mock implementation
      toast.success('Agent deleted successfully');
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error('Failed to delete agent');
    }
  },

  async deploy(id: string, deployment: Partial<AgentDeployment>): Promise<AgentDeployment | null> {
    try {
      // Mock implementation
      const deploymentId = Math.random().toString(36).substring(2, 11);
      const newDeployment: AgentDeployment = {
        id: deploymentId,
        agent_id: id,
        type: deployment.type || 'chat-widget',
        status: 'active',
        config: deployment.config || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      toast.success(`Agent deployed as ${deployment.type?.replace('-', ' ')}`);
      return newDeployment;
    } catch (error) {
      console.error('Error deploying agent:', error);
      toast.error('Failed to deploy agent');
      return null;
    }
  },

  async getDeployments(agentId: string): Promise<AgentDeployment[]> {
    try {
      // Mock implementation
      const agent = await this.getById(agentId);
      if (!agent || !agent.deployment) return [];
      
      return [agent.deployment];
    } catch (error) {
      console.error('Error fetching agent deployments:', error);
      toast.error('Failed to load agent deployments');
      return [];
    }
  },

  async updateDeployment(deploymentId: string, updates: Partial<AgentDeployment>): Promise<AgentDeployment | null> {
    try {
      // Mock implementation
      toast.success('Deployment updated successfully');
      return {
        ...updates,
        id: deploymentId,
        agent_id: updates.agent_id || '',
        type: updates.type || 'chat-widget',
        status: updates.status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as AgentDeployment;
    } catch (error) {
      console.error('Error updating deployment:', error);
      toast.error('Failed to update deployment');
      return null;
    }
  }
};

// Agent deployment service
export const agentDeploymentService = {
  async generateWidgetCode(agentId: string, config?: any): Promise<string> {
    // Mock implementation
    return `<script src="https://api.raidenagents.com/v1/widget.js" data-agent-id="${agentId}"></script>`;
  },
  
  async generateApiEndpoint(agentId: string): Promise<string> {
    // Mock implementation
    return `https://api.raidenagents.com/v1/agents/${agentId}/chat`;
  }
};

// Agent knowledge base service
export const knowledgeBaseService = {
  async getAllForAgent(agentId: string): Promise<AgentKnowledgeBase[]> {
    try {
      // Mock implementation
      return [];
    } catch (error) {
      console.error('Error fetching knowledge bases:', error);
      toast.error('Failed to load knowledge bases');
      return [];
    }
  },
  
  async create(knowledgeBase: Omit<AgentKnowledgeBase, 'id'>): Promise<AgentKnowledgeBase | null> {
    try {
      // Mock implementation
      const newKnowledgeBase: AgentKnowledgeBase = {
        ...knowledgeBase,
        id: Math.random().toString(36).substring(2, 11)
      };
      
      toast.success('Knowledge base created successfully');
      return newKnowledgeBase;
    } catch (error) {
      console.error('Error creating knowledge base:', error);
      toast.error('Failed to create knowledge base');
      return null;
    }
  }
};

// Agent documents service
export const documentsService = {
  async uploadDocument(knowledgeBaseId: string, file: File): Promise<AgentDocument | null> {
    try {
      // Mock implementation
      const newDocument: AgentDocument = {
        id: Math.random().toString(36).substring(2, 11),
        knowledge_base_id: knowledgeBaseId,
        filename: file.name,
        file_size: file.size,
        file_type: file.type,
        storage_path: `/documents/${knowledgeBaseId}/${file.name}`,
        processed: false
      };
      
      toast.success('Document uploaded successfully');
      return newDocument;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
      return null;
    }
  }
};

// Subscription service
export const subscriptionService = {
  async getCurrentPlan(): Promise<SubscriptionPlan | null> {
    try {
      // Mock implementation for development
      return {
        id: 'free',
        name: 'Free',
        description: 'Basic plan for trying out the platform',
        monthly_price: 0,
        annual_price: 0,
        features: {
          agents: true,
          templates: true,
          knowledgeBase: false,
          customTools: false
        },
        limits: {
          max_agents: 2,
          max_queries: 100,
          storage_mb: 10
        },
        is_active: true
      };
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  },

  async getAllPlans(): Promise<SubscriptionPlan[]> {
    try {
      // Mock implementation for development
      return [
        {
          id: 'free',
          name: 'Free',
          description: 'Basic plan for trying out the platform',
          monthly_price: 0,
          annual_price: 0,
          features: {
            agents: true,
            templates: true,
            knowledgeBase: false,
            customTools: false
          },
          limits: {
            max_agents: 2,
            max_queries: 100,
            storage_mb: 10
          },
          is_active: true
        },
        {
          id: 'pro',
          name: 'Pro',
          description: 'Professional plan for businesses',
          monthly_price: 49,
          annual_price: 490,
          features: {
            agents: true,
            templates: true,
            knowledgeBase: true,
            customTools: true
          },
          limits: {
            max_agents: 10,
            max_queries: 1000,
            storage_mb: 1000
          },
          is_active: true
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          description: 'Enterprise plan for large organizations',
          monthly_price: 299,
          annual_price: 2990,
          features: {
            agents: true,
            templates: true,
            knowledgeBase: true,
            customTools: true,
            dedicatedSupport: true,
            sla: true
          },
          limits: {
            max_agents: 100,
            max_queries: 10000,
            storage_mb: 10000
          },
          is_active: true
        }
      ];
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      return [];
    }
  },
  
  async upgradePlan(planId: string): Promise<boolean> {
    try {
      // Mock implementation
      toast.success(`Successfully upgraded to ${planId} plan`);
      return true;
    } catch (error) {
      console.error('Error upgrading plan:', error);
      toast.error('Failed to upgrade plan');
      return false;
    }
  }
};
