import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BrainCircuit, 
  Key, 
  Save, 
  AlertTriangle,
  Zap,
  Shield,
  Database,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/context/AuthContext';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  performance: 'basic' | 'standard' | 'premium';
  apiKeyName: string;
  apiKeyUrl: string;
  isFreeTier: boolean;
}

const availableModels: AIModel[] = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    description: 'Fast and cost-effective model for most everyday tasks',
    performance: 'basic',
    apiKeyName: 'OPENAI_API_KEY',
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    isFreeTier: true
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Powerful model with excellent reasoning and knowledge',
    performance: 'premium',
    apiKeyName: 'OPENAI_API_KEY',
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    isFreeTier: false
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'State-of-the-art model with exceptional reasoning capabilities',
    performance: 'premium',
    apiKeyName: 'ANTHROPIC_API_KEY',
    apiKeyUrl: 'https://console.anthropic.com/settings/keys',
    isFreeTier: false
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    description: 'Balanced performance and cost for most applications',
    performance: 'standard',
    apiKeyName: 'ANTHROPIC_API_KEY',
    apiKeyUrl: 'https://console.anthropic.com/settings/keys',
    isFreeTier: true
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Versatile model with strong multilingual capabilities',
    performance: 'standard',
    apiKeyName: 'GOOGLE_API_KEY',
    apiKeyUrl: 'https://ai.google.dev/',
    isFreeTier: true
  }
];

export default function ModelSelector() {
  const { user } = useAuth();
  const { selectedModelId, setSelectedModelId, apiKeys, setApiKeys, currentPlan } = useSubscription();
  const [activeTab, setActiveTab] = useState<'model' | 'apikeys'>('model');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempApiKeys, setTempApiKeys] = useState<Record<string, string>>(apiKeys);
  const { toast } = useToast();
  
  const isModelAvailable = (model: AIModel) => {
    if (model.isFreeTier) return true;
    return currentPlan?.name !== 'Free';
  };

  const handleModelSelect = async (modelId: string) => {
    try {
      if (!user) return;
      
      setSelectedModelId(modelId);
      
      toast({
        title: "Model Selected",
        description: `Your AI model preference has been updated.`,
      });
    } catch (error) {
      console.error('Error selecting model:', error);
      toast({
        title: "Error",
        description: "Failed to update model preference.",
        variant: "destructive",
      });
    }
  };

  const handleSaveApiKeys = async () => {
    try {
      setIsSubmitting(true);
      
      setApiKeys(tempApiKeys);
      
      toast({
        title: "API Keys Saved",
        description: "Your API keys have been securely saved.",
      });
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast({
        title: "Error",
        description: "Failed to save API keys.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApiKeyChange = (provider: string, value: string) => {
    setTempApiKeys(prev => ({
      ...prev,
      [provider]: value
    }));
  };

  const getUniqueProviders = (): string[] => {
    return [...new Set(availableModels.map(model => model.apiKeyName))];
  };

  return (
    <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-electric-blue" />
            <CardTitle>AI Model Configuration</CardTitle>
          </div>
        </div>
        <CardDescription>
          Choose your preferred AI model and manage API keys
        </CardDescription>
      </CardHeader>

      <div className="px-6 border-b border-gray-800">
        <Tabs defaultValue="model" value={activeTab} onValueChange={(value) => setActiveTab(value as 'model' | 'apikeys')}>
          <TabsList className="bg-black/30 border border-gray-800">
            <TabsTrigger value="model" className="data-[state=active]:bg-electric-blue/10">
              Model Selection
            </TabsTrigger>
            <TabsTrigger value="apikeys" className="data-[state=active]:bg-electric-blue/10">
              API Keys
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <CardContent className="p-6">
        {activeTab === 'model' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Select AI Model</h3>
              <p className="text-sm text-muted-foreground">
                Choose the AI model that will power your agents. Different models offer varying levels of capabilities and pricing.
              </p>
            </div>

            <RadioGroup 
              value={selectedModelId || ''}
              onValueChange={handleModelSelect}
              className="space-y-4"
            >
              {availableModels.map(model => {
                const isAvailable = isModelAvailable(model);
                return (
                  <div 
                    key={model.id}
                    className={`relative flex items-center rounded-lg border p-4 ${
                      selectedModelId === model.id 
                        ? 'border-electric-blue bg-electric-blue/5' 
                        : 'border-gray-800 bg-black/30'
                    } ${!isAvailable ? 'opacity-60' : ''}`}
                  >
                    <RadioGroupItem 
                      value={model.id} 
                      id={model.id}
                      disabled={!isAvailable}
                      className="absolute left-4"
                    />
                    <div className="ml-10 space-y-1">
                      <div className="flex items-center">
                        <label
                          htmlFor={model.id}
                          className="text-base font-medium leading-none cursor-pointer mr-2"
                        >
                          {model.name}
                        </label>
                        <Badge
                          className={`
                            ${model.performance === 'basic' ? 'bg-green-500/20 text-green-400' : ''}
                            ${model.performance === 'standard' ? 'bg-blue-500/20 text-blue-400' : ''}
                            ${model.performance === 'premium' ? 'bg-purple-500/20 text-purple-400' : ''}
                          `}
                        >
                          {model.performance}
                        </Badge>
                        {model.isFreeTier ? (
                          <Badge variant="outline" className="ml-2 bg-gray-800/50">
                            Free Tier
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="ml-2 bg-electric-blue/20 text-electric-blue">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{model.description}</p>
                      <div className="text-xs flex items-center">
                        <span className="text-gray-400">Provider:</span>
                        <span className="ml-1 text-white">{model.provider}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>

            {!currentPlan?.name || currentPlan.name === 'Free' ? (
              <div className="flex items-center mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-md">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-amber-300">
                  Some premium models are only available with paid subscription plans. 
                  <Button variant="link" className="text-electric-blue p-0 h-auto ml-1 inline-flex">
                    Upgrade your plan
                  </Button>
                </p>
              </div>
            ) : null}
          </div>
        )}

        {activeTab === 'apikeys' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">API Keys</h3>
              <p className="text-sm text-muted-foreground">
                Provide API keys for the AI providers you want to use. These keys will be securely stored and used to make calls to the respective AI services.
              </p>
            </div>

            <div className="flex items-center p-4 mb-4 bg-cyberpunk-purple/10 border border-cyberpunk-purple/30 rounded-md">
              <Shield className="h-5 w-5 text-cyberpunk-purple mr-2 flex-shrink-0" />
              <p className="text-sm">
                Your API keys are encrypted and stored securely. We never share these keys with third parties.
              </p>
            </div>

            <div className="space-y-4">
              {getUniqueProviders().map(provider => (
                <div key={provider} className="space-y-2">
                  <Label htmlFor={provider} className="flex items-center text-base">
                    <Key className="h-4 w-4 mr-2" />
                    {provider.split('_')[0]} API Key
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id={provider}
                      type="password"
                      placeholder={`Enter your ${provider.split('_')[0]} API key`}
                      value={tempApiKeys[provider] || ''}
                      onChange={(e) => handleApiKeyChange(provider, e.target.value)}
                      className="bg-black/40 border-gray-700"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(availableModels.find(m => m.apiKeyName === provider)?.apiKeyUrl, '_blank')}
                      className="flex-shrink-0"
                    >
                      <Zap className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Required for {availableModels.filter(m => m.apiKeyName === provider).map(m => m.name).join(', ')}
                  </p>
                </div>
              ))}
            </div>

            <Button 
              onClick={handleSaveApiKeys}
              disabled={isSubmitting}
              className="bg-electric-blue hover:bg-electric-blue/90 w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save API Keys
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
