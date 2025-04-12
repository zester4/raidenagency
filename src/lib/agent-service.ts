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

export const userAgentService = {
  // Placeholder for future implementation
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
  }
};
