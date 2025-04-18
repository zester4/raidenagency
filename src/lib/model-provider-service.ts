import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserApiKey } from '@/types/database';

export interface ModelProvider {
  id: string;
  name: string;
  description: string;
  pricing?: string;
  website?: string;
  documentation?: string;
  models: Model[];
  apiKeyName: string;
  requiresApiKey: boolean;
}

export interface Model {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  maxTokens: number;
  provider: string;
  pricing?: string;
  tags?: string[];
}

export const modelProviders: ModelProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'OpenAI offers powerful language models like GPT-4 and GPT-3.5 for a wide range of natural language processing tasks.',
    website: 'https://openai.com',
    documentation: 'https://platform.openai.com/docs',
    apiKeyName: 'OPENAI_API_KEY',
    requiresApiKey: true,
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        description: 'The most advanced and capable model from OpenAI, outperforming GPT-4 Turbo while being faster and cheaper.',
        capabilities: ['text generation', 'chat', 'reasoning', 'vision'],
        maxTokens: 128000,
        provider: 'openai',
        pricing: '$5 per million input tokens, $15 per million output tokens',
        tags: ['featured', 'gpt-4', 'multimodal']
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        description: 'A smaller version of GPT-4o offering an excellent balance of intelligence and efficiency.',
        capabilities: ['text generation', 'chat', 'reasoning', 'vision'],
        maxTokens: 128000,
        provider: 'openai',
        pricing: '$0.15 per million input tokens, $0.60 per million output tokens',
        tags: ['featured', 'gpt-4', 'multimodal']
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'A cost-effective model optimized for chat that balances intelligence and speed.',
        capabilities: ['text generation', 'chat'],
        maxTokens: 16385,
        provider: 'openai',
        pricing: '$0.50 per million input tokens, $1.50 per million output tokens',
        tags: ['featured', 'gpt-3']
      },
      {
        id: 'gpt-4.5-preview',
        name: 'GPT-4.5 Preview',
        description: 'The latest frontier model from OpenAI with enhanced capabilities.',
        capabilities: ['text generation', 'chat', 'reasoning', 'code', 'vision'],
        maxTokens: 128000,
        provider: 'openai',
        pricing: '$10 per million input tokens, $30 per million output tokens',
        tags: ['preview', 'gpt-4', 'multimodal']
      },
      {
        id: 'text-embedding-3-large',
        name: 'Embedding Large',
        description: 'Creates embeddings that capture semantic relationships in text.',
        capabilities: ['embeddings'],
        maxTokens: 8191,
        provider: 'openai',
        pricing: '$0.13 per million tokens',
        tags: ['embeddings']
      }
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Anthropic provides safe, steerable AI systems with Claude models designed to be helpful, harmless, and honest.',
    website: 'https://www.anthropic.com',
    documentation: 'https://docs.anthropic.com',
    apiKeyName: 'ANTHROPIC_API_KEY',
    requiresApiKey: true,
    models: [
      {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        description: 'Anthropic\'s most intelligent model, capable of handling complex tasks requiring deep expertise.',
        capabilities: ['text generation', 'chat', 'reasoning', 'vision'],
        maxTokens: 200000,
        provider: 'anthropic',
        pricing: '$15 per million input tokens, $75 per million output tokens',
        tags: ['featured', 'claude', 'multimodal']
      },
      {
        id: 'claude-3-sonnet-20240229',
        name: 'Claude 3 Sonnet',
        description: 'A balance of intelligence and speed, ideal for enterprise and production applications.',
        capabilities: ['text generation', 'chat', 'reasoning', 'vision'],
        maxTokens: 200000,
        provider: 'anthropic',
        pricing: '$3 per million input tokens, $15 per million output tokens',
        tags: ['featured', 'claude', 'multimodal']
      },
      {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku',
        description: 'The fastest and most compact model in the Claude 3 family, ideal for real-time applications.',
        capabilities: ['text generation', 'chat', 'reasoning', 'vision'],
        maxTokens: 200000,
        provider: 'anthropic',
        pricing: '$0.25 per million input tokens, $1.25 per million output tokens',
        tags: ['featured', 'claude', 'multimodal']
      },
      {
        id: 'claude-3-5-sonnet-20240620',
        name: 'Claude 3.5 Sonnet',
        description: 'Anthropic\'s latest model with improved capabilities and efficiency.',
        capabilities: ['text generation', 'chat', 'reasoning', 'code', 'vision'],
        maxTokens: 200000,
        provider: 'anthropic',
        pricing: '$5 per million input tokens, $25 per million output tokens',
        tags: ['preview', 'claude', 'multimodal']
      },
      {
        id: 'claude-3-7-sonnet',
        name: 'Claude 3.7 Sonnet',
        description: 'Anthropic\'s newest model with cutting-edge capabilities.',
        capabilities: ['text generation', 'chat', 'reasoning', 'code', 'vision'],
        maxTokens: 200000,
        provider: 'anthropic',
        pricing: '$8 per million input tokens, $32 per million output tokens', 
        tags: ['preview', 'claude', 'multimodal']
      }
    ]
  },
  {
    id: 'google',
    name: 'Google AI',
    description: 'Google\'s Gemini models offer powerful AI capabilities with seamless integration to Google\'s ecosystem.',
    website: 'https://deepmind.google/technologies/gemini',
    documentation: 'https://ai.google.dev/docs',
    apiKeyName: 'GOOGLE_API_KEY',
    requiresApiKey: true,
    models: [
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        description: 'Google\'s flagship model for text generation and reasoning tasks.',
        capabilities: ['text generation', 'chat', 'reasoning'],
        maxTokens: 32768,
        provider: 'google',
        pricing: '$4 per million input tokens, $12 per million output tokens',
        tags: ['featured', 'gemini']
      },
      {
        id: 'gemini-pro-vision',
        name: 'Gemini Pro Vision',
        description: 'Google\'s model optimized for both text and image understanding.',
        capabilities: ['text generation', 'chat', 'vision'],
        maxTokens: 32768,
        provider: 'google',
        pricing: '$5 per million input tokens, $15 per million output tokens',
        tags: ['featured', 'gemini', 'multimodal']
      },
      {
        id: 'gemini-ultra',
        name: 'Gemini Ultra',
        description: 'Google\'s most advanced model with the highest performance on complex tasks.',
        capabilities: ['text generation', 'chat', 'reasoning', 'code', 'vision'],
        maxTokens: 32768,
        provider: 'google',
        pricing: '$20 per million input tokens, $60 per million output tokens',
        tags: ['premium', 'gemini', 'multimodal']
      },
      {
        id: 'embedding-001',
        name: 'Embedding API',
        description: 'Google\'s text embedding model for vectorizing text.',
        capabilities: ['embeddings'],
        maxTokens: 2048,
        provider: 'google',
        pricing: '$0.25 per million tokens',
        tags: ['embeddings']
      }
    ]
  }
];

// Mock in-memory storage for API keys
const mockApiKeys: Record<string, Record<string, string>> = {};

// Get a model by its ID
export const getModelById = (modelId: string): Model | undefined => {
  for (const provider of modelProviders) {
    const model = provider.models.find(m => m.id === modelId);
    if (model) return model;
  }
  return undefined;
};

// Get a provider by its ID
export const getProviderById = (providerId: string): ModelProvider | undefined => {
  return modelProviders.find(p => p.id === providerId);
};

// Get a user's API key for a specific provider
export const getUserApiKey = async (providerId: string): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    // Return from mock storage for now
    return mockApiKeys[user.id]?.[providerId] || null;
  } catch (error) {
    console.error('Error fetching user API key:', error);
    return null;
  }
};

// Save a user's API key for a specific provider
export const saveUserApiKey = async (providerId: string, apiKey: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // Save to mock storage
    if (!mockApiKeys[user.id]) {
      mockApiKeys[user.id] = {};
    }
    mockApiKeys[user.id][providerId] = apiKey;
    return true;
  } catch (error) {
    console.error('Error saving user API key:', error);
    return false;
  }
};

// Delete a user's API key for a specific provider
export const deleteUserApiKey = async (providerId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // Remove from mock storage
    if (mockApiKeys[user.id]) {
      delete mockApiKeys[user.id][providerId];
    }
    return true;
  } catch (error) {
    console.error('Error deleting user API key:', error);
    return false;
  }
};

// Get all providers a user has API keys for
export const getUserApiKeyProviders = async (): Promise<string[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    // Return from mock storage
    return mockApiKeys[user.id] ? Object.keys(mockApiKeys[user.id]) : [];
  } catch (error) {
    console.error('Error fetching user API key providers:', error);
    return [];
  }
};
