
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
      const { data, error } = await supabase
        .from('agent_templates')
        .select('*')
        .order('name');

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
      const { data, error } = await supabase
        .from('user_agents')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user agents:', error);
      toast.error('Failed to load your agents');
      return [];
    }
  },

  async getById(id: string): Promise<UserAgent | null> {
    try {
      const { data, error } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user agent:', error);
      toast.error('Failed to load agent details');
      return null;
    }
  },

  async create(agent: Omit<UserAgent, 'id' | 'created_at' | 'updated_at'>): Promise<UserAgent | null> {
    try {
      const { data, error } = await supabase
        .from('user_agents')
        .insert(agent)
        .select()
        .single();

      if (error) throw error;
      toast.success('Agent created successfully');
      return data;
    } catch (error) {
      console.error('Error creating agent:', error);
      toast.error('Failed to create agent');
      return null;
    }
  },

  async update(id: string, updates: Partial<UserAgent>): Promise<UserAgent | null> {
    try {
      const { data, error } = await supabase
        .from('user_agents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      toast.success('Agent updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating agent:', error);
      toast.error('Failed to update agent');
      return null;
    }
  },

  async updateStatus(id: string, status: 'online' | 'offline' | 'error'): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_agents')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Agent ${status === 'online' ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error updating agent status:', error);
      toast.error('Failed to update agent status');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_agents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Agent deleted successfully');
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error('Failed to delete agent');
    }
  }
};

// Subscription service
export const subscriptionService = {
  async getCurrentPlan(): Promise<SubscriptionPlan | null> {
    try {
      const { data: subscription, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .select('*, subscription_plans(*)')
        .eq('status', 'active')
        .maybeSingle();

      if (subscriptionError) throw subscriptionError;
      
      if (!subscription) return null;
      
      return subscription.subscription_plans as unknown as SubscriptionPlan;
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
  }
};
