
import { supabase } from '@/integrations/supabase/client';

export interface ModelProvider {
  id: string;
  name: string;
  models: Model[];
  apiKeyRequired: boolean;
  apiKeyName: string;
  logoUrl?: string;
  description: string;
}

export interface Model {
  id: string;
  name: string;
  maxTokens: number;
  description: string;
  capabilities: string[];
  pricing: string;
  provider: string;
  contextLength: number;
}

export const modelProviderService = {
  getAllProviders: async (): Promise<ModelProvider[]> => {
    // In production, this would fetch from the database
    return [
      {
        id: 'google-ai',
        name: 'Google AI',
        apiKeyRequired: true,
        apiKeyName: 'GOOGLE_API_KEY',
        description: 'Access Google\'s Gemini models for various AI tasks',
        logoUrl: 'https://www.gstatic.com/lamda/images/favicon_v1_150160cddff7f294ce30.svg',
        models: [
          {
            id: 'gemini-1.5-pro',
            name: 'Gemini 1.5 Pro',
            maxTokens: 32768,
            contextLength: 1000000,
            description: 'Google\'s most capable model for complex tasks',
            capabilities: ['text generation', 'chat', 'embeddings', 'reasoning'],
            pricing: '$0.0075 / 1K input tokens, $0.0225 / 1K output tokens',
            provider: 'google-ai'
          },
          {
            id: 'gemini-1.5-flash',
            name: 'Gemini 1.5 Flash',
            maxTokens: 16384,
            contextLength: 1000000,
            description: 'Fast and efficient model for most use cases',
            capabilities: ['text generation', 'chat', 'embeddings'],
            pricing: '$0.00025 / 1K input tokens, $0.0005 / 1K output tokens',
            provider: 'google-ai'
          }
        ]
      },
      {
        id: 'groq',
        name: 'Groq',
        apiKeyRequired: true,
        apiKeyName: 'GROQ_API_KEY',
        description: 'Ultra-fast inference platform for LLMs',
        logoUrl: 'https://groq.com/wp-content/uploads/2023/04/cropped-favicon-32x32.png',
        models: [
          {
            id: 'llama-3.1-70b-versatile',
            name: 'Llama-3.1-70B',
            maxTokens: 8192,
            contextLength: 8192,
            description: 'High-performance large language model with fast inference',
            capabilities: ['text generation', 'chat', 'reasoning'],
            pricing: '$0.0007 / 1K input tokens, $0.0007 / 1K output tokens',
            provider: 'groq'
          },
          {
            id: 'mixtral-8x7b-instruct',
            name: 'Mixtral 8x7B',
            maxTokens: 4096,
            contextLength: 32768,
            description: 'Efficient mixture-of-experts model',
            capabilities: ['text generation', 'chat'],
            pricing: '$0.0002 / 1K input tokens, $0.0002 / 1K output tokens',
            provider: 'groq'
          }
        ]
      },
      {
        id: 'together-ai',
        name: 'Together AI',
        apiKeyRequired: true,
        apiKeyName: 'TOGETHER_API_KEY',
        description: 'Platform hosting a variety of open-source models',
        logoUrl: 'https://together.ai/images/favicon.ico',
        models: [
          {
            id: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
            name: 'Mixtral 8x7B Instruct',
            maxTokens: 4096,
            contextLength: 32768,
            description: 'Powerful open-source mixture-of-experts model',
            capabilities: ['text generation', 'chat'],
            pricing: '$0.0006 / 1K input tokens, $0.0006 / 1K output tokens',
            provider: 'together-ai'
          },
          {
            id: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
            name: 'Llama 3.1 8B Instruct',
            maxTokens: 4096,
            contextLength: 8192,
            description: 'Efficient open-source model for general use',
            capabilities: ['text generation', 'chat'],
            pricing: '$0.0003 / 1K input tokens, $0.0003 / 1K output tokens',
            provider: 'together-ai'
          }
        ]
      },
      {
        id: 'deepseek',
        name: 'DeepSeek',
        apiKeyRequired: true,
        apiKeyName: 'DEEPSEEK_API_KEY',
        description: 'Specialized models for reasoning and coding tasks',
        logoUrl: 'https://www.deepseek.com/favicon.ico',
        models: [
          {
            id: 'deepseek-reasoner',
            name: 'DeepSeek Reasoner',
            maxTokens: 8192,
            contextLength: 131072,
            description: 'Advanced reasoning capabilities for complex problems',
            capabilities: ['text generation', 'chat', 'reasoning', 'math'],
            pricing: 'Free during beta',
            provider: 'deepseek'
          },
          {
            id: 'deepseek-coder',
            name: 'DeepSeek Coder',
            maxTokens: 16384,
            contextLength: 16384,
            description: 'Specialized for code generation and completion',
            capabilities: ['code generation', 'code completion'],
            pricing: 'Free during beta',
            provider: 'deepseek'
          }
        ]
      }
    ];
  },

  getProviderById: async (providerId: string): Promise<ModelProvider | null> => {
    const providers = await modelProviderService.getAllProviders();
    return providers.find(provider => provider.id === providerId) || null;
  },

  getModelById: async (modelId: string): Promise<Model | null> => {
    const providers = await modelProviderService.getAllProviders();
    for (const provider of providers) {
      const model = provider.models.find(model => model.id === modelId);
      if (model) return model;
    }
    return null;
  },

  saveApiKey: async (providerId: string, apiKey: string, userId: string): Promise<boolean> => {
    try {
      // In a real implementation, this would securely store the API key
      // Either in a secure vault or encrypted in the database
      const { error } = await supabase
        .from('user_api_keys')
        .upsert({ 
          user_id: userId, 
          provider_id: providerId, 
          api_key: apiKey, // In production, this should be encrypted
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving API key:', error);
      return false;
    }
  },

  checkApiKeyExists: async (providerId: string, userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('user_api_keys')
        .select('id')
        .eq('user_id', userId)
        .eq('provider_id', providerId)
        .single();
      
      if (error) return false;
      return Boolean(data);
    } catch (error) {
      console.error('Error checking API key:', error);
      return false;
    }
  }
};
