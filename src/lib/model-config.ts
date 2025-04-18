
import { z } from 'zod';

export const ModelProviders = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  GOOGLE: 'google',
  COHERE: 'cohere',
  TOGETHER: 'together',
  GROQ: 'groq',
  DEEPSEEK: 'deepseek',
  CUSTOM: 'custom'
} as const;

export const ModelTypes = {
  CHAT: 'chat',
  COMPLETION: 'completion',
  EMBEDDING: 'embedding'
} as const;

export type ModelProvider = keyof typeof ModelProviders;
export type ModelType = keyof typeof ModelTypes;

export const modelSchema = z.object({
  id: z.string(),
  name: z.string(),
  provider: z.enum([
    ModelProviders.OPENAI, 
    ModelProviders.ANTHROPIC, 
    ModelProviders.GOOGLE, 
    ModelProviders.COHERE, 
    ModelProviders.TOGETHER,
    ModelProviders.GROQ,
    ModelProviders.DEEPSEEK,
    ModelProviders.CUSTOM
  ]),
  type: z.enum([ModelTypes.CHAT, ModelTypes.COMPLETION, ModelTypes.EMBEDDING]),
  contextWindow: z.number(),
  trainingCutoff: z.string().optional(),
  pricing: z.object({
    input: z.number(),
    output: z.number().optional()
  }),
  capabilities: z.array(z.string()),
  hasVision: z.boolean().default(false),
  hasFunctionCalling: z.boolean().default(false),
  isFree: z.boolean().default(false)
});

export type Model = z.infer<typeof modelSchema>;

export const availableModels: Model[] = [
  // OpenAI Models
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: ModelProviders.OPENAI,
    type: ModelTypes.CHAT,
    contextWindow: 128000,
    trainingCutoff: '2023-10',
    pricing: {
      input: 0.005,
      output: 0.015
    },
    capabilities: ['chat', 'reasoning', 'vision', 'code', 'function-calling'],
    hasVision: true,
    hasFunctionCalling: true,
    isFree: false
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: ModelProviders.OPENAI,
    type: ModelTypes.CHAT,
    contextWindow: 128000,
    trainingCutoff: '2023-10',
    pricing: {
      input: 0.0015,
      output: 0.0060
    },
    capabilities: ['chat', 'reasoning', 'vision', 'code', 'function-calling'],
    hasVision: true,
    hasFunctionCalling: true,
    isFree: false
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: ModelProviders.OPENAI,
    type: ModelTypes.CHAT,
    contextWindow: 16385,
    trainingCutoff: '2021-09',
    pricing: {
      input: 0.0005,
      output: 0.0015
    },
    capabilities: ['chat', 'reasoning', 'code', 'function-calling'],
    hasVision: false,
    hasFunctionCalling: true,
    isFree: false
  },
  
  // Anthropic Models
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    provider: ModelProviders.ANTHROPIC,
    type: ModelTypes.CHAT,
    contextWindow: 200000,
    trainingCutoff: '2023-08',
    pricing: {
      input: 0.015,
      output: 0.075
    },
    capabilities: ['chat', 'reasoning', 'vision', 'code'],
    hasVision: true,
    hasFunctionCalling: true,
    isFree: false
  },
  {
    id: 'claude-3.5-sonnet-20240620',
    name: 'Claude 3.5 Sonnet',
    provider: ModelProviders.ANTHROPIC,
    type: ModelTypes.CHAT,
    contextWindow: 200000,
    trainingCutoff: '2023-12',
    pricing: {
      input: 0.003,
      output: 0.015
    },
    capabilities: ['chat', 'reasoning', 'vision', 'code'],
    hasVision: true,
    hasFunctionCalling: true,
    isFree: false
  },
  {
    id: 'claude-3.7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: ModelProviders.ANTHROPIC,
    type: ModelTypes.CHAT,
    contextWindow: 200000,
    trainingCutoff: '2024-02',
    pricing: {
      input: 0.005,
      output: 0.025
    },
    capabilities: ['chat', 'reasoning', 'vision', 'code'],
    hasVision: true,
    hasFunctionCalling: true,
    isFree: false
  },
  
  // Google Models
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: ModelProviders.GOOGLE,
    type: ModelTypes.CHAT,
    contextWindow: 1000000,
    trainingCutoff: '2023-12',
    pricing: {
      input: 0.0025,
      output: 0.0075
    },
    capabilities: ['chat', 'reasoning', 'vision', 'code'],
    hasVision: true,
    hasFunctionCalling: true,
    isFree: false
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: ModelProviders.GOOGLE,
    type: ModelTypes.CHAT,
    contextWindow: 1000000,
    trainingCutoff: '2024-04',
    pricing: {
      input: 0.0025,
      output: 0.0075
    },
    capabilities: ['chat', 'reasoning', 'vision', 'code'],
    hasVision: true,
    hasFunctionCalling: true,
    isFree: false
  },
  
  // Together Models
  {
    id: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
    name: 'Llama 3.1 8B Instruct Turbo',
    provider: ModelProviders.TOGETHER,
    type: ModelTypes.CHAT,
    contextWindow: 128000,
    pricing: {
      input: 0.0002,
      output: 0.0002
    },
    capabilities: ['chat', 'reasoning', 'code'],
    hasVision: false,
    hasFunctionCalling: false,
    isFree: false
  },
  {
    id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    name: 'Llama 3.1 70B Instruct Turbo',
    provider: ModelProviders.TOGETHER,
    type: ModelTypes.CHAT,
    contextWindow: 128000,
    pricing: {
      input: 0.0009,
      output: 0.0009
    },
    capabilities: ['chat', 'reasoning', 'code'],
    hasVision: false,
    hasFunctionCalling: false,
    isFree: false
  },
  {
    id: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    name: 'Mixtral 8x7B Instruct',
    provider: ModelProviders.TOGETHER,
    type: ModelTypes.CHAT,
    contextWindow: 32000,
    pricing: {
      input: 0.0006,
      output: 0.0006
    },
    capabilities: ['chat', 'reasoning', 'code'],
    hasVision: false,
    hasFunctionCalling: false,
    isFree: false
  },
  
  // Groq Models
  {
    id: 'llama-3.3-70b-versatile',
    name: 'Llama 3.3 70B Versatile',
    provider: ModelProviders.GROQ,
    type: ModelTypes.CHAT,
    contextWindow: 128000,
    pricing: {
      input: 0.0007,
      output: 0.0007
    },
    capabilities: ['chat', 'reasoning', 'code'],
    hasVision: false,
    hasFunctionCalling: true,
    isFree: false
  },
  
  // DeepSeek Models
  {
    id: 'deepseek-reasoner',
    name: 'DeepSeek Reasoner',
    provider: ModelProviders.DEEPSEEK,
    type: ModelTypes.CHAT,
    contextWindow: 32000,
    pricing: {
      input: 0.0005,
      output: 0.0005
    },
    capabilities: ['chat', 'reasoning', 'code'],
    hasVision: false,
    hasFunctionCalling: false,
    isFree: true
  }
];

export const getModelByID = (id: string): Model | undefined => {
  return availableModels.find(model => model.id === id);
};

export const getModelsByProvider = (provider: string): Model[] => {
  return availableModels.filter(model => model.provider === provider);
};

export const getModelsByCapability = (capability: string): Model[] => {
  return availableModels.filter(model => model.capabilities.includes(capability));
};

export const getFreeModels = (): Model[] => {
  return availableModels.filter(model => model.isFree === true);
};
