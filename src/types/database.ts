
export interface UserApiKey {
  id: string;
  user_id: string;
  provider_id: string;
  api_key: string;
  created_at: string;
  updated_at?: string;
}

export interface AgentConversation {
  id: string;
  agent_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  thinking?: string;
  agentName?: string;
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

export interface VectorStore {
  enabled: boolean;
  collection_name?: string;
  document_count?: number;
}

export interface DatabaseFunctions {
  get_agent_usage: (args: { from_date: string, to_date: string }) => Promise<{ agent_name: string, usage_count: number }[]>;
  get_daily_active_users: (args: { from_date: string, to_date: string }) => Promise<{ time: string, active_users: number }[]>;
  get_daily_conversations: (args: { from_date: string, to_date: string }) => Promise<{ time: string, conversations: number }[]>;
}
