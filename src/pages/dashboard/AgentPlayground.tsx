
import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Bot, MessageSquare, Send, RefreshCw, Code, Settings, Database, BrainCircuit, PlayCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAgents } from '@/hooks/useAgents';
import VectorStoreInterface from '@/components/agent-builder/VectorStoreInterface';
import AgentChatInterface from '@/components/agent-builder/AgentChatInterface';
import { UserAgent } from '@/lib/agent-service';
import { availableModels } from '@/lib/model-config';

interface PlaygroundState {
  messages: {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }[];
  threadId: string;
  isProcessing: boolean;
  nextTask: string | null;
  authorizedRefund: boolean;
}

const AgentPlayground: React.FC = () => {
  const { toast } = useToast();
  const { agents, loading: agentsLoading } = useAgents();
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [selectedAgent, setSelectedAgent] = useState<UserAgent | null>(null);
  const [userInput, setUserInput] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [workflowState, setWorkflowState] = useState<PlaygroundState>({
    messages: [{
      role: 'system',
      content: 'Welcome to the agent workflow playground. How can I assist you today?'
    }],
    threadId: `thread_${Date.now()}`,
    isProcessing: false,
    nextTask: null,
    authorizedRefund: false
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set selected agent when agent ID changes
  useEffect(() => {
    if (selectedAgentId && agents) {
      const agent = agents.find(a => a.id === selectedAgentId);
      setSelectedAgent(agent || null);
    }
  }, [selectedAgentId, agents]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [workflowState.messages]);

  // Reset thread if agent changes
  useEffect(() => {
    setWorkflowState({
      messages: [{
        role: 'system',
        content: `Welcome to the ${selectedAgent?.name || 'agent'} workflow playground. How can I assist you today?`
      }],
      threadId: `thread_${Date.now()}`,
      isProcessing: false,
      nextTask: null,
      authorizedRefund: false
    });
  }, [selectedAgent]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || workflowState.isProcessing || !selectedAgent) return;

    // Add user message
    setWorkflowState(prev => ({
      ...prev,
      messages: [...prev.messages, { role: 'user', content: userInput }],
      isProcessing: true
    }));

    setUserInput('');

    try {
      // Simulating agent workflow processing
      // In a real implementation, this would call the agent workflow
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Determine if this request is about refunds, technical support, or general chat
      let response = '';
      let nextTask = null;
      
      if (userInput.toLowerCase().includes('refund')) {
        response = "I understand you're requesting a refund. Let me transfer you to our billing department.";
        nextTask = 'billing_support';
        
        // Add slight delay to simulate transfer
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Add billing department response
        setWorkflowState(prev => ({
          ...prev,
          messages: [...prev.messages, { role: 'assistant', content: response }],
          nextTask
        }));
        
        // Billing support response
        await new Promise(resolve => setTimeout(resolve, 1500));
        response = "This is the billing department. I'd be happy to help process your refund. Let me transfer you to our refund processing team.";
        nextTask = 'handle_refund';
        
        // Handle refund needs authorization
        setWorkflowState(prev => ({
          ...prev,
          messages: [...prev.messages, { role: 'assistant', content: response }],
          nextTask
        }));
        
      } else if (userInput.toLowerCase().includes('broken') || 
                userInput.toLowerCase().includes('not working') ||
                userInput.toLowerCase().includes('technical') ||
                userInput.toLowerCase().includes('problem')) {
        response = "I see you're having a technical issue. Let me transfer you to our technical support team.";
        nextTask = 'technical_support';
        
        // Add slight delay to simulate transfer
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setWorkflowState(prev => ({
          ...prev,
          messages: [...prev.messages, { role: 'assistant', content: response }],
          nextTask
        }));
        
        // Technical support response
        await new Promise(resolve => setTimeout(resolve, 1500));
        response = "Technical support here. I'd be happy to help troubleshoot your issue. Could you please provide more details about the problem you're experiencing?";
        nextTask = null;
        
      } else {
        response = `As ${selectedAgent.name}, I'm here to assist you. ${selectedAgent.description || ''} Is there anything specific you'd like to know about our products or services?`;
        nextTask = null;
      }

      // Add final agent response
      setWorkflowState(prev => ({
        ...prev,
        messages: [...prev.messages, { role: 'assistant', content: response }],
        isProcessing: false,
        nextTask
      }));
      
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive"
      });
      setWorkflowState(prev => ({
        ...prev,
        isProcessing: false
      }));
    }
  };

  const handleAuthorizeRefund = () => {
    if (workflowState.nextTask === 'handle_refund') {
      setWorkflowState(prev => ({
        ...prev,
        messages: [
          ...prev.messages, 
          { role: 'system', content: 'Human approved the refund request' },
          { role: 'assistant', content: 'Refund approved and processed successfully! The amount will be credited back to your original payment method within 3-5 business days.' }
        ],
        nextTask: null,
        authorizedRefund: true
      }));
      
      toast({
        title: "Refund Authorized",
        description: "You have authorized the refund request and it has been processed.",
      });
    }
  };

  const handleReset = () => {
    setWorkflowState({
      messages: [{
        role: 'system',
        content: `Welcome to the ${selectedAgent?.name || 'agent'} workflow playground. How can I assist you today?`
      }],
      threadId: `thread_${Date.now()}`,
      isProcessing: false,
      nextTask: null,
      authorizedRefund: false
    });
    toast({
      title: "Conversation Reset",
      description: "The conversation has been reset.",
    });
  };

  const formatTime = (index: number) => {
    const date = new Date();
    // Offset time slightly based on message index to simulate conversation flow
    date.setMinutes(date.getMinutes() - (workflowState.messages.length - index - 1));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <DashboardLayout>
      <div className="container p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agent Playground</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Test your agents and workflows in an interactive environment
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-gray-800 bg-black/60 backdrop-blur-md h-[calc(100vh-220px)] flex flex-col">
              <CardHeader className="pb-2 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <PlayCircle className="h-5 w-5 mr-2 text-electric-blue" />
                    <CardTitle>Agent Workflow Playground</CardTitle>
                  </div>
                  {workflowState.nextTask === 'handle_refund' && (
                    <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                      Waiting for refund authorization
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  Test agent workflows with simulated interactions
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto pt-4">
                <div className="space-y-4">
                  {workflowState.messages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'system' ? (
                        <div className="bg-gray-800/50 rounded-lg p-3 max-w-[80%]">
                          <p className="text-gray-300 text-sm">{message.content}</p>
                          <div className="text-xs text-gray-500 mt-1 text-right">
                            {formatTime(index)}
                          </div>
                        </div>
                      ) : message.role === 'user' ? (
                        <div className="bg-cyberpunk-purple/20 rounded-lg p-3 max-w-[80%]">
                          <div className="flex items-center justify-end mb-1">
                            <span className="text-xs font-medium text-cyberpunk-purple mr-1">You</span>
                            <MessageSquare className="h-3 w-3 text-cyberpunk-purple" />
                          </div>
                          <p className="text-gray-200 text-sm">{message.content}</p>
                          <div className="text-xs text-gray-500 mt-1 text-right">
                            {formatTime(index)}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-electric-blue/10 rounded-lg p-3 max-w-[80%]">
                          <div className="flex items-center mb-1">
                            <Bot className="h-3 w-3 text-electric-blue mr-1" />
                            <span className="text-xs font-medium text-electric-blue">
                              {workflowState.nextTask ? 'Agent' : selectedAgent?.name || 'Agent'}
                            </span>
                            {workflowState.nextTask && (
                              <Badge variant="outline" className="ml-2 text-[10px] py-0 h-4">
                                {workflowState.nextTask.replace('_', ' ')}
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-200 text-sm">{message.content}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatTime(index)}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              
              <CardFooter className="border-t border-gray-800 p-3">
                <div className="flex w-full items-center space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={handleReset}
                    className="h-9 w-9"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  
                  {workflowState.nextTask === 'handle_refund' && (
                    <Button 
                      variant="outline" 
                      onClick={handleAuthorizeRefund}
                      className="h-9 bg-yellow-500/20 text-yellow-400 border-yellow-500/50 hover:bg-yellow-500/30"
                    >
                      Authorize Refund
                    </Button>
                  )}
                  
                  <Input
                    placeholder="Type a message..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-black/40 border-gray-700"
                    disabled={workflowState.isProcessing || !selectedAgent}
                  />
                  <Button 
                    type="button" 
                    size="icon" 
                    disabled={workflowState.isProcessing || !userInput.trim() || !selectedAgent} 
                    onClick={handleSendMessage}
                    className="h-9 w-9"
                  >
                    {workflowState.isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div className="flex flex-col gap-6">
            <Card className="border-gray-800 bg-black/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg">Agent Selection</CardTitle>
                <CardDescription>
                  Select an agent to test in the playground
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {agentsLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-electric-blue" />
                  </div>
                ) : (
                  <>
                    <Select
                      value={selectedAgentId}
                      onValueChange={setSelectedAgentId}
                    >
                      <SelectTrigger className="bg-black/40 border-gray-700">
                        <SelectValue placeholder="Select an agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {agents.map(agent => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedAgent && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{selectedAgent.category || 'General'}</Badge>
                          {selectedAgent.model_config?.model && (
                            <Badge variant="secondary">
                              {selectedAgent.model_config.model}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-400">
                          {selectedAgent.description || 'No description provided.'}
                        </p>
                        
                        {selectedAgent.vector_store?.enabled && (
                          <div className="flex items-center gap-2 text-sm text-electric-blue">
                            <Database className="h-4 w-4" />
                            Vector store: {selectedAgent.vector_store.document_count || 0} documents
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="chat">Direct Chat</TabsTrigger>
                <TabsTrigger value="vector-store">Vector Store</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="mt-4">
                {selectedAgent ? (
                  <div className="h-[calc(100vh-500px)]">
                    <AgentChatInterface agent={selectedAgent} />
                  </div>
                ) : (
                  <Card className="border-gray-800 bg-black/20 backdrop-blur-sm p-6 text-center">
                    <Bot className="h-12 w-12 mx-auto text-gray-500 mb-3" />
                    <h3 className="text-lg font-medium mb-1">No Agent Selected</h3>
                    <p className="text-gray-500 text-sm">
                      Please select an agent to chat with
                    </p>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="vector-store" className="mt-4">
                {selectedAgent ? (
                  <div className="h-[calc(100vh-500px)]">
                    <VectorStoreInterface 
                      agentId={selectedAgent.id} 
                      collectionName={selectedAgent.vector_store?.collection_name || `agent_${selectedAgent.id.slice(0, 8)}`}
                      onDocumentsUpdated={(count) => {
                        // Update document count in the UI
                        if (selectedAgent.vector_store) {
                          // Only show count update if needed
                        }
                      }}
                    />
                  </div>
                ) : (
                  <Card className="border-gray-800 bg-black/20 backdrop-blur-sm p-6 text-center">
                    <Database className="h-12 w-12 mx-auto text-gray-500 mb-3" />
                    <h3 className="text-lg font-medium mb-1">No Agent Selected</h3>
                    <p className="text-gray-500 text-sm">
                      Please select an agent to manage its vector store
                    </p>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentPlayground;
