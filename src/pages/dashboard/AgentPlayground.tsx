import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AgentChatInterface from '@/components/agent-builder/AgentChatInterface';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import VectorStoreInterface from '@/components/agent-builder/VectorStoreInterface';
import { userAgentService, UserAgent } from '@/lib/agent-service';
import { useToast } from '@/hooks/use-toast';
import { modelProviderService } from '@/lib/model-provider-service';
import { useAgents } from '@/hooks/useAgents';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Bot, BrainCircuit, Check, Code, Database, FileText, MessageSquare, RotateCcw, Save, Settings, Sparkles, Zap } from 'lucide-react';
import AgentWorkflowVisualizer from '@/components/agent-builder/AgentWorkflowVisualizer';

const AgentPlayground = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { agents, loading } = useAgents();
  
  const [agent, setAgent] = useState<UserAgent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [modelSettings, setModelSettings] = useState({
    temperature: 0.7,
    maxTokens: 500,
    topP: 1.0,
    frequencyPenalty: 0,
    presencePenalty: 0
  });
  const [showWorkflowVisualizer, setShowWorkflowVisualizer] = useState(false);

  useEffect(() => {
    const agentId = searchParams.get('id');
    
    const loadAgentAndModels = async () => {
      try {
        const providers = await modelProviderService.getAllProviders();
        let allModels: any[] = [];
        providers.forEach(provider => {
          provider.models.forEach(model => {
            allModels.push({
              id: model.id,
              name: model.name,
              provider: provider.name,
              providerIcon: provider.logoUrl
            });
          });
        });
        setAvailableModels(allModels);
        
        if (agentId) {
          const agentData = await userAgentService.getAgentById(agentId);
          if (agentData) {
            setAgent(agentData);
            if (agentData.model_config) {
              setModelSettings({
                temperature: agentData.model_config.temperature,
                maxTokens: agentData.model_config.max_tokens,
                topP: agentData.model_config.top_p,
                frequencyPenalty: agentData.model_config.frequency_penalty,
                presencePenalty: agentData.model_config.presence_penalty
              });
            }
          } else {
            toast({
              title: "Agent not found",
              description: "The requested agent could not be found.",
              variant: "destructive"
            });
          }
        } else if (agents && agents.length > 0) {
          setAgent(agents[0]);
          if (agents[0].model_config) {
            setModelSettings({
              temperature: agents[0].model_config.temperature,
              maxTokens: agents[0].model_config.max_tokens,
              topP: agents[0].model_config.top_p,
              frequencyPenalty: agents[0].model_config.frequency_penalty,
              presencePenalty: agents[0].model_config.presence_penalty
            });
          }
        }
      } catch (error) {
        console.error("Error loading agent:", error);
        toast({
          title: "Error",
          description: "Failed to load agent data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAgentAndModels();
  }, [searchParams, agents, toast]);

  const handleAgentChange = (agentId: string) => {
    const selectedAgent = agents.find(a => a.id === agentId);
    if (selectedAgent) {
      setAgent(selectedAgent);
      navigate(`/dashboard/playground?id=${agentId}`);
      
      if (selectedAgent.model_config) {
        setModelSettings({
          temperature: selectedAgent.model_config.temperature,
          maxTokens: selectedAgent.model_config.max_tokens,
          topP: selectedAgent.model_config.top_p,
          frequencyPenalty: selectedAgent.model_config.frequency_penalty,
          presencePenalty: selectedAgent.model_config.presence_penalty
        });
      }
    }
  };

  const handleModelSettingChange = (setting: string, value: number) => {
    setModelSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = async () => {
    if (!agent) return;
    
    try {
      const updatedAgent = await userAgentService.updateAgent(agent.id, {
        model_config: {
          model: agent.model_config?.model || "gpt-4o",
          temperature: modelSettings.temperature,
          max_tokens: modelSettings.maxTokens,
          top_p: modelSettings.topP,
          frequency_penalty: modelSettings.frequencyPenalty,
          presence_penalty: modelSettings.presencePenalty
        }
      });
      
      if (updatedAgent) {
        setAgent(updatedAgent);
        toast({
          title: "Settings saved",
          description: "Agent configuration has been updated successfully."
        });
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save agent settings",
        variant: "destructive"
      });
    }
  };

  const handleVectorStoreUpdate = (count: number) => {
    if (!agent) return;
    
    setAgent(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        vector_store: {
          ...prev.vector_store!,
          document_count: count
        }
      };
    });
  };

  if (isLoading || loading) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <div className="flex items-center gap-2 mb-6">
            <BrainCircuit className="h-6 w-6 text-electric-blue" />
            <h1 className="text-2xl font-bold">Agent Playground</h1>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-4 md:col-span-1">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-[400px] w-full" />
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-[600px] w-full" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-electric-blue" />
            <h1 className="text-2xl font-bold">Agent Playground</h1>
          </div>
          
          {agents && agents.length > 0 && (
            <div className="w-full md:w-72">
              <Select 
                value={agent?.id} 
                onValueChange={handleAgentChange}
              >
                <SelectTrigger className="border-gray-700 bg-black/30">
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-gray-700">
                  {agents.map(a => (
                    <SelectItem key={a.id} value={a.id}>
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-electric-blue" />
                        <span>{a.name}</span>
                        <Badge 
                          variant={a.status === 'online' ? 'default' : a.status === 'error' ? 'destructive' : 'outline'}
                          className="ml-2"
                        >
                          {a.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {!agent && (
          <Card className="border-gray-800 bg-black/20 backdrop-blur-sm p-8 text-center">
            <CardContent className="pt-6">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Agent Selected</h3>
              <p className="text-gray-400 mb-4">
                Please create an agent or select an existing one to start using the playground.
              </p>
              <Button
                className="bg-electric-blue hover:bg-electric-blue/90"
                onClick={() => navigate('/dashboard/agents')}
              >
                <Bot className="mr-2 h-4 w-4" /> Create or Select an Agent
              </Button>
            </CardContent>
          </Card>
        )}

        {agent && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-4 md:col-span-1">
              <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Bot className="h-5 w-5 text-electric-blue mr-2" />
                    {agent.name}
                  </CardTitle>
                  {agent.description && (
                    <CardDescription>{agent.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                        <p className="text-xs text-gray-400">Status</p>
                        <div className="flex items-center mt-1">
                          <div className={`w-2 h-2 rounded-full ${
                            agent.status === 'online' ? 'bg-green-500' : 
                            agent.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                          } mr-2`}></div>
                          <p className="text-sm font-medium">{agent.status || 'offline'}</p>
                        </div>
                      </div>
                      <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                        <p className="text-xs text-gray-400">Category</p>
                        <p className="text-sm font-medium mt-1">{agent.category || 'General'}</p>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-md border border-gray-800 bg-black/30">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-gray-400">System Prompt</p>
                        <Badge variant="outline" className="text-xs">Editable</Badge>
                      </div>
                      <p className="text-sm">
                        {agent.system_prompt || 'No system prompt defined.'}
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-md border border-gray-800 bg-black/30">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-gray-400">Knowledge Base</p>
                        <Badge 
                          variant={agent.vector_store?.enabled ? 'default' : 'outline'}
                          className={agent.vector_store?.enabled ? 'bg-cyberpunk-purple' : ''}
                        >
                          {agent.vector_store?.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      {agent.vector_store?.enabled ? (
                        <div className="text-sm">
                          <p>Collection: <span className="font-mono text-xs">{agent.vector_store.collection_name}</span></p>
                          <p>Documents: {agent.vector_store.document_count || 0}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">
                          No vector store enabled for this agent.
                        </p>
                      )}
                    </div>
                    
                    <div className="p-3 rounded-md border border-gray-800 bg-black/30">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-gray-400">Model</p>
                        <Badge className="bg-cyberpunk-purple">
                          {agent.model_config?.model || 'Default'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-400">Temperature</p>
                          <p className="font-medium">{agent.model_config?.temperature || 0.7}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Max Tokens</p>
                          <p className="font-medium">{agent.model_config?.max_tokens || 'Default'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 bg-black/30 border border-gray-800">
                  <TabsTrigger value="chat" className="data-[state=active]:bg-electric-blue/10">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="knowledge" className="data-[state=active]:bg-electric-blue/10">
                    <Database className="h-4 w-4 mr-2" />
                    Knowledge
                  </TabsTrigger>
                  <TabsTrigger value="workflow" className="data-[state=active]:bg-electric-blue/10">
                    <Code className="h-4 w-4 mr-2" />
                    Workflow
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="data-[state=active]:bg-electric-blue/10">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="chat" className="mt-4">
                  <AgentChatInterface agent={agent} />
                </TabsContent>
                
                <TabsContent value="knowledge" className="mt-4">
                  {agent.vector_store?.enabled ? (
                    <VectorStoreInterface 
                      agentId={agent.id} 
                      collectionName={agent.vector_store.collection_name}
                      documentCount={agent.vector_store.document_count}
                      onDocumentsUpdated={handleVectorStoreUpdate}
                    />
                  ) : (
                    <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
                      <CardContent className="pt-6 pb-6 text-center">
                        <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">Knowledge Base Not Enabled</h3>
                        <p className="text-gray-400 mb-4">
                          This agent doesn't have a vector store enabled. Enable it in the agent settings to upload documents.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/dashboard/agents?edit=${agent.id}`)}
                        >
                          <Settings className="mr-2 h-4 w-4" /> Configure Agent
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="workflow" className="mt-4">
                  {showWorkflowVisualizer && selectedAgent && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">Agent Workflow</h3>
                      <AgentWorkflowVisualizer agent={selectedAgent} />
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="settings" className="mt-4">
                  <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Settings className="h-5 w-5 text-holographic-teal mr-2" />
                        Model Settings
                      </CardTitle>
                      <CardDescription>
                        Adjust parameters to control the agent's response behavior
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <Label>Model</Label>
                          <Select 
                            defaultValue={agent.model_config?.model || "gpt-4o"}
                            onValueChange={(value) => {
                              if (agent && agent.model_config) {
                                setAgent({
                                  ...agent, 
                                  model_config: {
                                    ...agent.model_config,
                                    model: value
                                  }
                                });
                              }
                            }}
                          >
                            <SelectTrigger className="border-gray-700 bg-black/30">
                              <SelectValue placeholder="Select a model" />
                            </SelectTrigger>
                            <SelectContent className="bg-black/90 border-gray-700">
                              {availableModels.map(model => (
                                <SelectItem key={model.id} value={model.id}>
                                  <div className="flex items-center">
                                    {model.providerIcon && (
                                      <img 
                                        src={model.providerIcon} 
                                        alt={model.provider}
                                        className="w-4 h-4 mr-2"
                                      />
                                    )}
                                    <span>{model.name}</span>
                                    <span className="text-xs text-gray-500 ml-2">({model.provider})</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Separator className="bg-gray-800" />
                        
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <Label>Temperature: {modelSettings.temperature}</Label>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {modelSettings.temperature === 0 ? 'Deterministic' : 
                                   modelSettings.temperature < 0.4 ? 'Focused' : 
                                   modelSettings.temperature < 0.8 ? 'Balanced' : 'Creative'}
                                </Badge>
                              </div>
                            </div>
                            <Slider
                              min={0}
                              max={1}
                              step={0.1}
                              value={[modelSettings.temperature]}
                              onValueChange={(values) => handleModelSettingChange('temperature', values[0])}
                              className="py-2"
                            />
                            <p className="text-xs text-gray-400">
                              Controls randomness: Lower values are more deterministic, higher values are more creative.
                            </p>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <Label>Max Tokens: {modelSettings.maxTokens}</Label>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-6 text-xs px-2 py-0 border-gray-700"
                                  onClick={() => handleModelSettingChange('maxTokens', 500)}
                                >
                                  <RotateCcw className="h-3 w-3 mr-1" /> Reset
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Input 
                                type="number" 
                                value={modelSettings.maxTokens}
                                onChange={(e) => handleModelSettingChange('maxTokens', parseInt(e.target.value))}
                                className="bg-black/30 border-gray-700"
                              />
                            </div>
                            <p className="text-xs text-gray-400">
                              Maximum number of tokens to generate in the response.
                            </p>
                          </div>
                          
                          <div className="space-y-3">
                            <Label>Top P: {modelSettings.topP}</Label>
                            <Slider
                              min={0.1}
                              max={1}
                              step={0.1}
                              value={[modelSettings.topP]}
                              onValueChange={(values) => handleModelSettingChange('topP', values[0])}
                              className="py-2"
                            />
                            <p className="text-xs text-gray-400">
                              Controls diversity via nucleus sampling: 0.1 means only top 10% most probable tokens are considered.
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <Label>Frequency Penalty: {modelSettings.frequencyPenalty}</Label>
                              <Slider
                                min={0}
                                max={2}
                                step={0.1}
                                value={[modelSettings.frequencyPenalty]}
                                onValueChange={(values) => handleModelSettingChange('frequencyPenalty', values[0])}
                                className="py-2"
                              />
                              <p className="text-xs text-gray-400">
                                Reduces repetition by penalizing tokens that have appeared in the text.
                              </p>
                            </div>
                            
                            <div className="space-y-3">
                              <Label>Presence Penalty: {modelSettings.presencePenalty}</Label>
                              <Slider
                                min={0}
                                max={2}
                                step={0.1}
                                value={[modelSettings.presencePenalty]}
                                onValueChange={(values) => handleModelSettingChange('presencePenalty', values[0])}
                                className="py-2"
                              />
                              <p className="text-xs text-gray-400">
                                Penalizes tokens that have appeared at all, encouraging the model to use new topics.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <Separator className="bg-gray-800" />
                        
                        <div className="flex justify-end">
                          <Button
                            className="bg-electric-blue hover:bg-electric-blue/90"
                            onClick={handleSaveSettings}
                          >
                            <Save className="mr-2 h-4 w-4" /> Save Settings
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AgentPlayground;
