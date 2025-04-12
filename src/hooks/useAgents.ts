
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userAgentService, agentTemplateService, UserAgent, AgentTemplate } from '@/lib/agent-service';

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
