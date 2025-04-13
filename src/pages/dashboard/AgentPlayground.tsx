import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  Bot, 
  Info, 
  Clipboard, 
  Trash2, 
  Workflow, 
  Loader2, 
  BookOpen, 
  Settings, 
  RefreshCw, 
  Database, 
  Upload 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Avatar } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { modelProviders } from '@/lib/model-provider-service';
import { useAgents } from '@/hooks/useAgents';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AgentWorkflowVisualizer from '@/components/agent-builder/AgentWorkflowVisualizer';
import VectorStoreInterface from '@/components/agent-builder/VectorStoreInterface';
import { WorkflowTemplate } from '@/lib/agent-workflow-templates';
import { UserAgent } from '@/lib/agent-service';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  thinking?: string;
  agentId?: string;
  agentName?: string;
}

interface AgentInfo {
  id: string;
  name: string;
  description: string;
  model: string;
  provider: string;
  system_prompt: string;
  created_at: string;
}

interface WorkflowVisualizerProps {
  workflowTemplate: WorkflowTemplate;
}

const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({
  workflowTemplate
}) => {
  return (
    <div className="p-4 border border-gray-800 rounded-lg bg-black/30">
      <h3 className="text-lg font-medium mb-4">Agent Workflow</h3>
      <AgentWorkflowVisualizer
        nodes={workflowTemplate.nodes}
        edges={workflowTemplate.edges}
        highlightedPath={workflowTemplate.previewPath}
        className="h-[300px]"
      />
    </div>
  );
};

const AgentPlayground: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { agents, loading, error } = useAgents();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentInfo | null>(null);
  const [documentCount, setDocumentCount] = useState<number>(0);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [workflowTemplate, setWorkflowTemplate] = useState<WorkflowTemplate | null>(null);

  useEffect(() => {
    if (!loading && agents.length > 0) {
      if (agentId) {
        const agent = agents.find(a => a.id === agentId);
        if (agent) {
          setSelectedAgent({
            id: agent.id,
            name: agent.name,
            description: agent.description || '',
            model: agent.model_config?.model || 'gpt-4o',
            provider: agent.model_config?.provider || 'openai',
            system_prompt: agent.system_prompt || '',
            created_at: agent.created_at || new Date().toISOString()
          });
          fetchMessages(agent.id);
          fetchAgentWorkflow(agent.id);
        } else if (agents.length > 0) {
          const firstAgent = agents[0];
          setSelectedAgent({
            id: firstAgent.id,
            name: firstAgent.name,
            description: firstAgent.description || '',
            model: firstAgent.model_config?.model || 'gpt-4o',
            provider: firstAgent.model_config?.provider || 'openai',
            system_prompt: firstAgent.system_prompt || '',
            created_at: firstAgent.created_at || new Date().toISOString()
          });
          fetchMessages(firstAgent.id);
          fetchAgentWorkflow(firstAgent.id);
        }
      } else if (agents.length > 0) {
        const firstAgent = agents[0];
        setSelectedAgent({
          id: firstAgent.id,
          name: firstAgent.name,
          description: firstAgent.description || '',
          model: firstAgent.model_config?.model || 'gpt-4o',
          provider: firstAgent.model_config?.provider || 'openai',
          system_prompt: firstAgent.system_prompt || '',
          created_at: firstAgent.created_at || new Date().toISOString()
        });
        fetchMessages(firstAgent.id);
        fetchAgentWorkflow(firstAgent.id);
      }
    }
  }, [agentId, agents, loading]);

  const fetchMessages = async (agentId: string) => {
    try {
      console.log(`Fetching messages for agent ${agentId}`);
      setMessages([]);
    } catch (error) {
      console.error('Error in fetchMessages:', error);
    }
  };

  const fetchAgentWorkflow = async (agentId: string) => {
    try {
      const sampleWorkflow: WorkflowTemplate = {
        id: 'customer-support-flow',
        name: 'Customer Support Flow',
        description: 'Workflow for handling customer support queries',
        category: 'support',
        nodes: [
          { id: 'start', label: '__start__', type: 'start', position: { x: 250, y: 50 } },
          { id: 'router', label: 'Query Router', type: 'agent', position: { x: 250, y: 150 } },
          { id: 'support', label: 'Support Agent', type: 'agent', position: { x: 100, y: 250 } },
          { id: 'technical', label: 'Technical Agent', type: 'agent', position: { x: 250, y: 250 } },
          { id: 'billing', label: 'Billing Agent', type: 'agent', position: { x: 400, y: 250 } },
          { id: 'knowledge', label: 'Knowledge Base', type: 'tool', position: { x: 250, y: 350 } },
          { id: 'end', label: '__end__', type: 'end', position: { x: 250, y: 450 } }
        ],
        edges: [
          { id: 'e1', from: 'start', to: 'router', type: 'solid' },
          { id: 'e2', from: 'router', to: 'support', type: 'solid', label: 'General Support' },
          { id: 'e3', from: 'router', to: 'technical', type: 'solid', label: 'Technical Issue' },
          { id: 'e4', from: 'router', to: 'billing', type: 'solid', label: 'Billing Question' },
          { id: 'e5', from: 'support', to: 'knowledge', type: 'dashed' },
          { id: 'e6', from: 'technical', to: 'knowledge', type: 'dashed' },
          { id: 'e7', from: 'billing', to: 'knowledge', type: 'dashed' },
          { id: 'e8', from: 'knowledge', to: 'end', type: 'solid' }
        ],
        previewPath: ['e1', 'e3', 'e6', 'e8']
      };
      
      setWorkflowTemplate(sampleWorkflow);
    } catch (error) {
      console.error('Error fetching agent workflow:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedAgent) return;
    
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: newMessage,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsProcessing(true);
    setIsThinking(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const assistantMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: `I'm ${selectedAgent.name}, an AI agent. I've processed your message: "${newMessage}" and here's my response. This would typically be generated by calling an API with the agent's model (${selectedAgent.model}) from provider ${selectedAgent.provider}.`,
        timestamp: new Date().toISOString(),
        thinking: "This is internal thinking process that would be used for explaining the agent's reasoning process.",
        agentId: selectedAgent.id,
        agentName: selectedAgent.name
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearConversation = () => {
    setMessages([]);
    toast({
      title: "Conversation cleared",
      description: "Your conversation history has been cleared.",
      variant: "outline",
    });
  };

  const getProviderName = (providerId: string) => {
    const provider = modelProviders.find(p => p.id === providerId);
    return provider ? provider.name : providerId;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleAgentChange = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgent({
        id: agent.id,
        name: agent.name,
        description: agent.description || '',
        model: agent.model_config?.model || 'gpt-4o',
        provider: agent.model_config?.provider || 'openai',
        system_prompt: agent.system_prompt || '',
        created_at: agent.created_at || new Date().toISOString()
      });
      fetchMessages(agent.id);
      fetchAgentWorkflow(agent.id);
    }
  };

  const copyConversation = () => {
    const text = messages.map(msg => 
      `${msg.role === 'user' ? 'You' : msg.agentName || 'Agent'}: ${msg.content}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Conversation has been copied to your clipboard.",
        variant: "outline",
      });
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard/agents')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Agents
        </Button>
        
        <div className="flex items-center gap-2">
          {selectedAgent && (
            <>
              <Badge variant="outline" className="bg-electric-blue/10 text-electric-blue border-electric-blue/30">
                Model: {selectedAgent.model}
              </Badge>
              <Badge variant="secondary">Provider: {getProviderName(selectedAgent.provider)}</Badge>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 bg-electric-blue/20 text-electric-blue">
                    <Bot className="h-5 w-5" />
                  </Avatar>
                  
                  {!loading && agents.length > 0 && (
                    <Select
                      value={selectedAgent?.id}
                      onValueChange={handleAgentChange}
                    >
                      <SelectTrigger className="w-[200px] bg-black/30 border-gray-700">
                        <SelectValue placeholder="Select agent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Available Agents</SelectLabel>
                          {agents.map(agent => (
                            <SelectItem key={agent.id} value={agent.id}>
                              {agent.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={copyConversation}
                    disabled={messages.length === 0}
                  >
                    <Clipboard className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClearConversation}
                    disabled={messages.length === 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] px-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
                    <Bot className="h-12 w-12 mb-4 text-gray-600" />
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Start a conversation</h3>
                    <p className="max-w-md mb-6">
                      Ask anything and the agent will respond based on its configuration and the data available to it.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 py-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-electric-blue text-white ml-auto'
                              : 'bg-gray-800 text-gray-100'
                          }`}
                        >
                          {message.role !== 'user' && message.agentName && (
                            <div className="flex items-center gap-2 mb-1">
                              <Avatar className="h-6 w-6 bg-electric-blue/20 text-electric-blue">
                                <Bot className="h-3 w-3" />
                              </Avatar>
                              <span className="text-xs font-medium">{message.agentName}</span>
                            </div>
                          )}
                          <div className="text-sm">{message.content}</div>
                          <div className="mt-1 text-xs opacity-70 text-right">
                            {formatTimestamp(message.timestamp)}
                          </div>
                          
                          {message.thinking && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 w-full text-xs bg-black/30 border-gray-700"
                              onClick={() => 
                                toast({
                                  title: "Agent Thinking",
                                  description: message.thinking,
                                  variant: "outline",
                                })
                              }
                            >
                              <Info className="h-3 w-3 mr-1" />
                              Show Thinking
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {isThinking && (
                      <div className="flex justify-start">
                        <div className="bg-gray-800 text-gray-100 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
            
            <CardFooter className="border-t border-gray-800 p-4">
              <div className="flex w-full items-end gap-2">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[80px] bg-black/60 border-gray-700 resize-none flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isProcessing || !newMessage.trim()}
                  className="h-10"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Tabs defaultValue="info">
            <TabsList className="w-full bg-black/30 border border-gray-800 mb-4">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="workflow">Workflow</TabsTrigger>
              <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="mt-0">
              <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Info className="h-5 w-5 text-electric-blue" />
                    Agent Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedAgent ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Description</h3>
                        <p className="text-white/90">{selectedAgent.description}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">System Prompt</h3>
                        <div className="bg-black/40 rounded-md p-3 text-sm text-gray-300 border border-gray-800 mt-1">
                          {selectedAgent.system_prompt || "No system prompt defined."}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-400">Model</h3>
                          <p className="text-white/90">{selectedAgent.model}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-400">Provider</h3>
                          <p className="text-white/90">{getProviderName(selectedAgent.provider)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Created</h3>
                        <p className="text-white/90">
                          {new Date(selectedAgent.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      Loading agent information...
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="workflow" className="mt-0">
              <Card className="border-gray-800 bg-black/20 backdrop-blur-sm h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Workflow className="h-5 w-5 text-cyberpunk-purple" />
                    Agent Workflow
                  </CardTitle>
                  <CardDescription>
                    How this agent interacts with other agents and tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {workflowTemplate ? (
                    <WorkflowVisualizer workflowTemplate={workflowTemplate} />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Workflow className="h-12 w-12 mx-auto mb-2 text-gray-600" />
                      <p>No workflow defined for this agent</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="knowledge" className="mt-0">
              {selectedAgent && (
                <VectorStoreInterface
                  agentId={selectedAgent.id}
                  collectionName={`agent_${selectedAgent.id.replace(/-/g, '_')}`}
                  documentCount={documentCount}
                  onDocumentsUpdated={setDocumentCount}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AgentPlayground;
