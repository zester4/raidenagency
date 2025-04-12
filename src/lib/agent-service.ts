
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
  tools?: AgentTool[];
  knowledge_bases?: AgentKnowledgeBase[];
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
  documents?: AgentDocument[];
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

export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'meta' | 'google' | 'together' | 'custom';
  model_id: string;
  capabilities: string[];
  description: string;
  max_tokens: number;
  default_temperature: number;
  is_available: boolean;
  pricing_per_1k_tokens: {
    input: number;
    output: number;
  };
}

// Agent template service
export const agentTemplateService = {
  async getAll(): Promise<AgentTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('agent_templates')
        .select('*')
        .order('popularity', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching agent templates:', error);
      toast.error('Failed to load agent templates');
      return [];
    }
  },

  async getById(id: string): Promise<AgentTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('agent_templates')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data;
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
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the user's agents
      const { data: agents, error } = await supabase
        .from('user_agents')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      // Get deployments for each agent
      const enhancedAgents = await Promise.all((agents || []).map(async (agent) => {
        // Get deployment info
        const { data: deployments } = await supabase
          .from('agent_deployments')
          .select('*')
          .eq('agent_id', agent.id)
          .limit(1);
        
        // Get tools
        const { data: tools } = await supabase
          .from('agent_tools')
          .select('*')
          .eq('agent_id', agent.id);
        
        // Get knowledge bases
        const { data: knowledgeBases } = await supabase
          .from('agent_knowledge_bases')
          .select('*')
          .eq('agent_id', agent.id);
        
        return {
          ...agent,
          deployment: deployments && deployments.length > 0 ? deployments[0] : undefined,
          tools: tools || [],
          knowledge_bases: knowledgeBases || []
        };
      }));
      
      return enhancedAgents;
    } catch (error) {
      console.error('Error fetching user agents:', error);
      toast.error('Failed to load your agents');
      return [];
    }
  },

  async getById(id: string): Promise<UserAgent | null> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the agent
      const { data: agent, error } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      if (!agent) return null;
      
      // Get deployment info
      const { data: deployments } = await supabase
        .from('agent_deployments')
        .select('*')
        .eq('agent_id', agent.id)
        .limit(1);
      
      // Get tools
      const { data: tools } = await supabase
        .from('agent_tools')
        .select('*')
        .eq('agent_id', agent.id);
      
      // Get knowledge bases
      const { data: knowledgeBases } = await supabase
        .from('agent_knowledge_bases')
        .select('*')
        .eq('agent_id', agent.id);
      
      // Get documents for each knowledge base
      if (knowledgeBases && knowledgeBases.length > 0) {
        const knowledgeBasesWithDocs = await Promise.all(knowledgeBases.map(async (kb) => {
          const { data: documents } = await supabase
            .from('agent_documents')
            .select('*')
            .eq('knowledge_base_id', kb.id);
          
          return {
            ...kb,
            documents: documents || []
          };
        }));
        
        return {
          ...agent,
          deployment: deployments && deployments.length > 0 ? deployments[0] : undefined,
          tools: tools || [],
          knowledge_bases: knowledgeBasesWithDocs
        };
      }
      
      return {
        ...agent,
        deployment: deployments && deployments.length > 0 ? deployments[0] : undefined,
        tools: tools || [],
        knowledge_bases: knowledgeBases || []
      };
    } catch (error) {
      console.error('Error fetching user agent:', error);
      toast.error('Failed to load agent details');
      return null;
    }
  },

  async create(agent: Omit<UserAgent, 'id' | 'created_at' | 'updated_at'>): Promise<UserAgent | null> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create the agent
      const { data: newAgent, error } = await supabase
        .from('user_agents')
        .insert({
          ...agent,
          user_id: user.id,
          status: 'offline'
        })
        .select()
        .single();
      
      if (error) throw error;
      if (!newAgent) throw new Error('Failed to create agent');
      
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
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Update the agent
      const { data: updatedAgent, error } = await supabase
        .from('user_agents')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      if (!updatedAgent) throw new Error('Failed to update agent');
      
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
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Update the agent status
      const { error } = await supabase
        .from('user_agents')
        .update({ status })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast.success(`Agent ${status === 'online' ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error updating agent status:', error);
      toast.error('Failed to update agent status');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Delete the agent
      const { error } = await supabase
        .from('user_agents')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast.success('Agent deleted successfully');
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error('Failed to delete agent');
    }
  },

  async deploy(id: string, deployment: Partial<AgentDeployment>): Promise<AgentDeployment | null> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if deployment already exists
      const { data: existingDeployments } = await supabase
        .from('agent_deployments')
        .select('*')
        .eq('agent_id', id);
      
      let deploymentId: string;
      
      if (existingDeployments && existingDeployments.length > 0) {
        // Update existing deployment
        const { data: updatedDeployment, error } = await supabase
          .from('agent_deployments')
          .update({
            type: deployment.type || existingDeployments[0].type,
            status: 'active',
            config: deployment.config || existingDeployments[0].config
          })
          .eq('id', existingDeployments[0].id)
          .select()
          .single();
        
        if (error) throw error;
        if (!updatedDeployment) throw new Error('Failed to update deployment');
        
        deploymentId = updatedDeployment.id;
        
        // Also update agent status to online
        await this.updateStatus(id, 'online');
        
        toast.success(`Agent deployed as ${deployment.type?.replace('-', ' ')}`);
        return updatedDeployment;
      } else {
        // Create new deployment
        const { data: newDeployment, error } = await supabase
          .from('agent_deployments')
          .insert({
            agent_id: id,
            type: deployment.type || 'chat-widget',
            status: 'active',
            config: deployment.config || {}
          })
          .select()
          .single();
        
        if (error) throw error;
        if (!newDeployment) throw new Error('Failed to create deployment');
        
        deploymentId = newDeployment.id;
        
        // Also update agent status to online
        await this.updateStatus(id, 'online');
        
        toast.success(`Agent deployed as ${deployment.type?.replace('-', ' ')}`);
        return newDeployment;
      }
    } catch (error) {
      console.error('Error deploying agent:', error);
      toast.error('Failed to deploy agent');
      return null;
    }
  },

  async getDeployments(agentId: string): Promise<AgentDeployment[]> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get deployments for the agent
      const { data, error } = await supabase
        .from('agent_deployments')
        .select('*')
        .eq('agent_id', agentId);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching agent deployments:', error);
      toast.error('Failed to load agent deployments');
      return [];
    }
  },

  async updateDeployment(deploymentId: string, updates: Partial<AgentDeployment>): Promise<AgentDeployment | null> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Update the deployment
      const { data: updatedDeployment, error } = await supabase
        .from('agent_deployments')
        .update(updates)
        .eq('id', deploymentId)
        .select()
        .single();
      
      if (error) throw error;
      if (!updatedDeployment) throw new Error('Failed to update deployment');
      
      toast.success('Deployment updated successfully');
      return updatedDeployment;
    } catch (error) {
      console.error('Error updating deployment:', error);
      toast.error('Failed to update deployment');
      return null;
    }
  }
};

// AI Models service
export const aiModelsService = {
  async getAll(): Promise<AIModel[]> {
    try {
      const { data, error } = await supabase
        .from('ai_models')
        .select('*')
        .eq('is_available', true)
        .order('name');
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching AI models:', error);
      toast.error('Failed to load AI models');
      
      // Return default models if API fails
      return [
        {
          id: 'gpt-4o',
          name: 'GPT-4o',
          provider: 'openai',
          model_id: 'gpt-4o',
          capabilities: ['text', 'images', 'code', 'reasoning'],
          description: 'OpenAI\'s most capable multimodal model for text and vision tasks',
          max_tokens: 8192,
          default_temperature: 0.7,
          is_available: true,
          pricing_per_1k_tokens: {
            input: 0.005,
            output: 0.015
          }
        },
        {
          id: 'gpt-4o-mini',
          name: 'GPT-4o Mini',
          provider: 'openai',
          model_id: 'gpt-4o-mini',
          capabilities: ['text', 'images', 'code'],
          description: 'Smaller and more affordable version of GPT-4o',
          max_tokens: 8192,
          default_temperature: 0.7,
          is_available: true,
          pricing_per_1k_tokens: {
            input: 0.0015,
            output: 0.0060
          }
        },
        {
          id: 'claude-3-5-sonnet',
          name: 'Claude 3.5 Sonnet',
          provider: 'anthropic',
          model_id: 'claude-3-5-sonnet',
          capabilities: ['text', 'images', 'code', 'reasoning'],
          description: 'Anthropic\'s most advanced model for complex reasoning and instruction following',
          max_tokens: 180000,
          default_temperature: 0.7,
          is_available: true,
          pricing_per_1k_tokens: {
            input: 0.003,
            output: 0.015
          }
        },
        {
          id: 'claude-3-opus',
          name: 'Claude 3 Opus',
          provider: 'anthropic',
          model_id: 'claude-3-opus',
          capabilities: ['text', 'images', 'code', 'reasoning'],
          description: 'Anthropic\'s most powerful model for complex tasks',
          max_tokens: 180000,
          default_temperature: 0.7,
          is_available: true,
          pricing_per_1k_tokens: {
            input: 0.015,
            output: 0.075
          }
        },
        {
          id: 'claude-3-haiku',
          name: 'Claude 3 Haiku',
          provider: 'anthropic',
          model_id: 'claude-3-haiku',
          capabilities: ['text', 'images', 'code'],
          description: 'Fast and affordable model for simple tasks',
          max_tokens: 180000,
          default_temperature: 0.7,
          is_available: true,
          pricing_per_1k_tokens: {
            input: 0.00025,
            output: 0.00125
          }
        },
        {
          id: 'meta-llama-3-1-8b-instruct',
          name: 'Meta-Llama-3.1-8B-Instruct',
          provider: 'meta',
          model_id: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
          capabilities: ['text', 'code'],
          description: 'Meta\'s compact model good for deployment on standard hardware',
          max_tokens: 8192,
          default_temperature: 0.7,
          is_available: true,
          pricing_per_1k_tokens: {
            input: 0.0002,
            output: 0.0008
          }
        },
        {
          id: 'meta-llama-3-1-70b-instruct',
          name: 'Meta-Llama-3.1-70B-Instruct',
          provider: 'meta',
          model_id: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
          capabilities: ['text', 'code', 'reasoning'],
          description: 'Meta\'s most powerful open model for high-quality reasoning',
          max_tokens: 8192,
          default_temperature: 0.7,
          is_available: true,
          pricing_per_1k_tokens: {
            input: 0.0009,
            output: 0.0036
          }
        },
        {
          id: 'gemini-1.5-pro',
          name: 'Gemini 1.5 Pro',
          provider: 'google',
          model_id: 'gemini-1.5-pro',
          capabilities: ['text', 'images', 'code', 'reasoning'],
          description: 'Google\'s advanced model with strong multimodal capabilities',
          max_tokens: 8192,
          default_temperature: 0.7,
          is_available: true,
          pricing_per_1k_tokens: {
            input: 0.00175,
            output: 0.00875
          }
        }
      ];
    }
  },

  async getById(id: string): Promise<AIModel | null> {
    try {
      const { data, error } = await supabase
        .from('ai_models')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching AI model:', error);
      toast.error('Failed to load AI model');
      return null;
    }
  }
};

// Agent deployment service
export const agentDeploymentService = {
  async generateWidgetCode(agentId: string, config?: any): Promise<string> {
    // First check if agent exists and user has access
    const agent = await userAgentService.getById(agentId);
    if (!agent) {
      throw new Error('Agent not found or you do not have access');
    }
    
    // Generate widget code
    return `<script 
  src="https://api.raidenagents.com/v1/widget.js" 
  data-agent-id="${agentId}"
  ${config?.theme ? `data-theme="${config.theme}"` : ''}
  ${config?.primaryColor ? `data-primary-color="${config.primaryColor}"` : ''}
  ${config?.title ? `data-title="${config.title}"` : ''}
></script>`;
  },
  
  async generateApiEndpoint(agentId: string): Promise<string> {
    // First check if agent exists and user has access
    const agent = await userAgentService.getById(agentId);
    if (!agent) {
      throw new Error('Agent not found or you do not have access');
    }
    
    // Generate API endpoint
    return `https://api.raidenagents.com/v1/agents/${agentId}/chat`;
  }
};

// Agent knowledge base service
export const knowledgeBaseService = {
  async getAllForAgent(agentId: string): Promise<AgentKnowledgeBase[]> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // First check if agent exists and user has access
      const { data: agent, error: agentError } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', agentId)
        .eq('user_id', user.id)
        .single();
      
      if (agentError || !agent) throw new Error('Agent not found or you do not have access');

      // Get knowledge bases for the agent
      const { data, error } = await supabase
        .from('agent_knowledge_bases')
        .select('*')
        .eq('agent_id', agentId);
      
      if (error) throw error;
      
      // Get documents for each knowledge base
      const knowledgeBasesWithDocs = await Promise.all((data || []).map(async (kb) => {
        const { data: documents } = await supabase
          .from('agent_documents')
          .select('*')
          .eq('knowledge_base_id', kb.id);
        
        return {
          ...kb,
          documents: documents || []
        };
      }));
      
      return knowledgeBasesWithDocs;
    } catch (error) {
      console.error('Error fetching knowledge bases:', error);
      toast.error('Failed to load knowledge bases');
      return [];
    }
  },
  
  async getById(id: string): Promise<AgentKnowledgeBase | null> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the knowledge base
      const { data: knowledgeBase, error } = await supabase
        .from('agent_knowledge_bases')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!knowledgeBase) return null;
      
      // Check if user has access to the agent
      const { data: agent, error: agentError } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', knowledgeBase.agent_id)
        .eq('user_id', user.id)
        .single();
      
      if (agentError || !agent) throw new Error('You do not have access to this knowledge base');

      // Get documents for the knowledge base
      const { data: documents } = await supabase
        .from('agent_documents')
        .select('*')
        .eq('knowledge_base_id', id);
      
      return {
        ...knowledgeBase,
        documents: documents || []
      };
    } catch (error) {
      console.error('Error fetching knowledge base:', error);
      toast.error('Failed to load knowledge base');
      return null;
    }
  },
  
  async create(knowledgeBase: Omit<AgentKnowledgeBase, 'id'>): Promise<AgentKnowledgeBase | null> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user has access to the agent
      const { data: agent, error: agentError } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', knowledgeBase.agent_id)
        .eq('user_id', user.id)
        .single();
      
      if (agentError || !agent) throw new Error('Agent not found or you do not have access');

      // Create the knowledge base
      const { data: newKnowledgeBase, error } = await supabase
        .from('agent_knowledge_bases')
        .insert(knowledgeBase)
        .select()
        .single();
      
      if (error) throw error;
      if (!newKnowledgeBase) throw new Error('Failed to create knowledge base');
      
      toast.success('Knowledge base created successfully');
      return {
        ...newKnowledgeBase,
        documents: []
      };
    } catch (error) {
      console.error('Error creating knowledge base:', error);
      toast.error('Failed to create knowledge base');
      return null;
    }
  },
  
  async delete(id: string): Promise<boolean> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the knowledge base
      const { data: knowledgeBase, error: kbError } = await supabase
        .from('agent_knowledge_bases')
        .select('*')
        .eq('id', id)
        .single();
      
      if (kbError || !knowledgeBase) throw new Error('Knowledge base not found');
      
      // Check if user has access to the agent
      const { data: agent, error: agentError } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', knowledgeBase.agent_id)
        .eq('user_id', user.id)
        .single();
      
      if (agentError || !agent) throw new Error('You do not have access to this knowledge base');

      // Delete all documents in the knowledge base
      await supabase
        .from('agent_documents')
        .delete()
        .eq('knowledge_base_id', id);
      
      // Delete the knowledge base
      const { error } = await supabase
        .from('agent_knowledge_bases')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Knowledge base deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting knowledge base:', error);
      toast.error('Failed to delete knowledge base');
      return false;
    }
  }
};

// Agent tools service
export const toolsService = {
  async getAllForAgent(agentId: string): Promise<AgentTool[]> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // First check if agent exists and user has access
      const { data: agent, error: agentError } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', agentId)
        .eq('user_id', user.id)
        .single();
      
      if (agentError || !agent) throw new Error('Agent not found or you do not have access');

      // Get tools for the agent
      const { data, error } = await supabase
        .from('agent_tools')
        .select('*')
        .eq('agent_id', agentId);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching agent tools:', error);
      toast.error('Failed to load agent tools');
      return [];
    }
  },
  
  async getById(id: string): Promise<AgentTool | null> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the tool
      const { data: tool, error } = await supabase
        .from('agent_tools')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!tool) return null;
      
      // Check if user has access to the agent
      const { data: agent, error: agentError } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', tool.agent_id)
        .eq('user_id', user.id)
        .single();
      
      if (agentError || !agent) throw new Error('You do not have access to this tool');

      return tool;
    } catch (error) {
      console.error('Error fetching agent tool:', error);
      toast.error('Failed to load agent tool');
      return null;
    }
  },
  
  async create(tool: Omit<AgentTool, 'id'>): Promise<AgentTool | null> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user has access to the agent
      const { data: agent, error: agentError } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', tool.agent_id)
        .eq('user_id', user.id)
        .single();
      
      if (agentError || !agent) throw new Error('Agent not found or you do not have access');

      // Create the tool
      const { data: newTool, error } = await supabase
        .from('agent_tools')
        .insert(tool)
        .select()
        .single();
      
      if (error) throw error;
      if (!newTool) throw new Error('Failed to create tool');
      
      toast.success('Tool added successfully');
      return newTool;
    } catch (error) {
      console.error('Error creating agent tool:', error);
      toast.error('Failed to create agent tool');
      return null;
    }
  },
  
  async update(id: string, updates: Partial<AgentTool>): Promise<AgentTool | null> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the tool
      const { data: tool, error: toolError } = await supabase
        .from('agent_tools')
        .select('*')
        .eq('id', id)
        .single();
      
      if (toolError || !tool) throw new Error('Tool not found');
      
      // Check if user has access to the agent
      const { data: agent, error: agentError } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', tool.agent_id)
        .eq('user_id', user.id)
        .single();
      
      if (agentError || !agent) throw new Error('You do not have access to this tool');

      // Update the tool
      const { data: updatedTool, error } = await supabase
        .from('agent_tools')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!updatedTool) throw new Error('Failed to update tool');
      
      toast.success('Tool updated successfully');
      return updatedTool;
    } catch (error) {
      console.error('Error updating agent tool:', error);
      toast.error('Failed to update agent tool');
      return null;
    }
  },
  
  async delete(id: string): Promise<boolean> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the tool
      const { data: tool, error: toolError } = await supabase
        .from('agent_tools')
        .select('*')
        .eq('id', id)
        .single();
      
      if (toolError || !tool) throw new Error('Tool not found');
      
      // Check if user has access to the agent
      const { data: agent, error: agentError } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', tool.agent_id)
        .eq('user_id', user.id)
        .single();
      
      if (agentError || !agent) throw new Error('You do not have access to this tool');

      // Delete the tool
      const { error } = await supabase
        .from('agent_tools')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Tool deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting agent tool:', error);
      toast.error('Failed to delete agent tool');
      return false;
    }
  }
};

// Agent documents service
export const documentsService = {
  async uploadDocument(knowledgeBaseId: string, file: File): Promise<AgentDocument | null> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the knowledge base
      const { data: knowledgeBase, error: kbError } = await supabase
        .from('agent_knowledge_bases')
        .select('*')
        .eq('id', knowledgeBaseId)
        .single();
      
      if (kbError || !knowledgeBase) throw new Error('Knowledge base not found');
      
      // Check if user has access to the agent
      const { data: agent, error: agentError } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', knowledgeBase.agent_id)
        .eq('user_id', user.id)
        .single();
      
      if (agentError || !agent) throw new Error('You do not have access to this knowledge base');

      // Upload the file to storage
      const filePath = `${user.id}/${knowledgeBaseId}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('agent-documents')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Create document record
      const { data: document, error } = await supabase
        .from('agent_documents')
        .insert({
          knowledge_base_id: knowledgeBaseId,
          filename: file.name,
          file_size: file.size,
          file_type: file.type,
          storage_path: filePath,
          processed: false
        })
        .select()
        .single();
      
      if (error) throw error;
      if (!document) throw new Error('Failed to create document record');
      
      // Trigger document processing (background job)
      await supabase.functions.invoke('process-document', {
        body: { 
          documentId: document.id,
          knowledgeBaseId: knowledgeBaseId
        }
      });
      
      toast.success('Document uploaded successfully');
      return document;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
      return null;
    }
  },
  
  async deleteDocument(id: string): Promise<boolean> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the document
      const { data: document, error: docError } = await supabase
        .from('agent_documents')
        .select('*, agent_knowledge_bases(*)')
        .eq('id', id)
        .single();
      
      if (docError || !document) throw new Error('Document not found');
      
      // Check if user has access to the agent
      const { data: agent, error: agentError } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', document.agent_knowledge_bases.agent_id)
        .eq('user_id', user.id)
        .single();
      
      if (agentError || !agent) throw new Error('You do not have access to this document');

      // Delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('agent-documents')
        .remove([document.storage_path]);
      
      if (storageError) throw storageError;
      
      // Delete the document record
      const { error } = await supabase
        .from('agent_documents')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Document deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
      return false;
    }
  }
};

// Subscription service
export const subscriptionService = {
  async getCurrentPlan(): Promise<SubscriptionPlan | null> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the user's subscription
      const { data: subscription, error: subError } = await supabase
        .from('user_subscriptions')
        .select('*, subscription_plans(*)')
        .eq('user_id', user.id)
        .single();
      
      if (subError) {
        // If no subscription found, return free plan
        const { data: freePlan, error: planError } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('name', 'Free')
          .single();
        
        if (planError) throw planError;
        return freePlan;
      }
      
      return subscription.subscription_plans;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  },

  async getAllPlans(): Promise<SubscriptionPlan[]> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('monthly_price');
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      return [];
    }
  },
  
  async upgradePlan(planId: string): Promise<boolean> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the plan
      const { data: plan, error: planError } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', planId)
        .single();
      
      if (planError || !plan) throw new Error('Plan not found');

      // Check if user already has a subscription
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (subscription) {
        // Update existing subscription
        const { error } = await supabase
          .from('user_subscriptions')
          .update({
            plan_id: planId,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            cancel_at_period_end: false
          })
          .eq('id', subscription.id);
        
        if (error) throw error;
      } else {
        // Create new subscription
        const { error } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            plan_id: planId,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            cancel_at_period_end: false
          });
        
        if (error) throw error;
      }
      
      toast.success(`Successfully upgraded to ${plan.name} plan`);
      return true;
    } catch (error) {
      console.error('Error upgrading plan:', error);
      toast.error('Failed to upgrade plan');
      return false;
    }
  }
};
