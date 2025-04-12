import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/types/database.types';

export type UserAgent = Tables<'user_agents'> & {
  deployment?: AgentDeployment;
  tools?: AgentTool[];
  knowledge_bases?: AgentKnowledgeBase[];
};

export type AgentTemplate = Tables<'agent_templates'>;

export type AgentDeployment = Tables<'agent_deployments'>;

export type AgentTool = Tables<'agent_tools'>;

export type AgentKnowledgeBase = Tables<'agent_knowledge_bases'> & {
  documents?: AgentDocument[];
};

export type AgentDocument = Tables<'agent_documents'>;

export type SubscriptionPlan = Tables<'subscription_plans'>;

export type UserSubscription = Tables<'user_subscriptions'>;

export type AIModel = Tables<'ai_models'>;

export function useAgents() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<UserAgent[]>([]);
  const [templates, setTemplates] = useState<AgentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAgents() {
      if (!user) {
        setAgents([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [agentsData, templatesData] = await Promise.all([
          userAgentService.getAll(),
          agentTemplateService.getAll()
        ]);
        
        setAgents(agentsData);
        setTemplates(templatesData);
        setError(null);
      } catch (err) {
        console.error('Error loading agents:', err);
        setError('Failed to load agents');
      } finally {
        setLoading(false);
      }
    }

    loadAgents();
  }, [user]);

  const createAgent = async (agent: Omit<UserAgent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newAgent = await userAgentService.create(agent);
      if (newAgent) {
        setAgents(prev => [newAgent, ...prev]);
      }
      return newAgent;
    } catch (err) {
      console.error('Error creating agent:', err);
      setError('Failed to create agent');
      return null;
    }
  };

  const updateAgent = async (id: string, updates: Partial<UserAgent>) => {
    try {
      const updatedAgent = await userAgentService.update(id, updates);
      if (updatedAgent) {
        setAgents(prev => prev.map(agent => 
          agent.id === id ? updatedAgent : agent
        ));
      }
      return updatedAgent;
    } catch (err) {
      console.error('Error updating agent:', err);
      setError('Failed to update agent');
      return null;
    }
  };

  const deleteAgent = async (id: string) => {
    try {
      await userAgentService.delete(id);
      setAgents(prev => prev.filter(agent => agent.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting agent:', err);
      setError('Failed to delete agent');
      return false;
    }
  };

  const toggleAgentStatus = async (id: string, currentStatus: 'online' | 'offline' | 'error') => {
    try {
      const newStatus = currentStatus === 'online' ? 'offline' : 'online';
      await userAgentService.updateStatus(id, newStatus);
      setAgents(prev => prev.map(agent => 
        agent.id === id ? { ...agent, status: newStatus } : agent
      ));
      return true;
    } catch (err) {
      console.error('Error toggling agent status:', err);
      setError('Failed to update agent status');
      return false;
    }
  };

  return {
    agents,
    templates,
    loading,
    error,
    createAgent,
    updateAgent,
    deleteAgent,
    toggleAgentStatus
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
      
      return newAgent;
    } catch (error) {
      console.error('Error creating agent:', error);
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
      
      return updatedAgent;
    } catch (error) {
      console.error('Error updating agent:', error);
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
    } catch (error) {
      console.error('Error updating agent status:', error);
      throw error;
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
    } catch (error) {
      console.error('Error deleting agent:', error);
      throw error;
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
        
        return newDeployment;
      }
    } catch (error) {
      console.error('Error deploying agent:', error);
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
      
      return updatedDeployment;
    } catch (error) {
      console.error('Error updating deployment:', error);
      return null;
    }
  }
};
