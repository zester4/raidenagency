import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BrainCircuit,
  Plus,
  LayoutGrid,
  List,
  Search,
  Filter,
  Bot,
  Network,
  Loader2,
  Database,
  Wrench,
  Layers
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AgentTemplateCard } from '@/components/agent-builder/AgentTemplateCard';
import { AgentCard } from '@/components/agent-builder/AgentCard';
import { useToast } from "@/hooks/use-toast";
import AgentCreator from '@/components/dashboard/AgentCreator';
import ModelSelector from '@/components/dashboard/ModelSelector';
import { useAgents } from '@/hooks/useAgents';
import { useSubscription } from '@/hooks/useSubscription';
import { UserAgent, userAgentService } from '@/lib/agent-service';

const AgentBuilder = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreator, setShowCreator] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [selectedTab, setSelectedTab] = useState('my-agents');
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    agents, 
    templates, 
    loading, 
    error, 
    createAgent, 
    deleteAgent, 
    toggleAgentStatus,
    updateAgent
  } = useAgents();
  const { currentPlan, isFreePlan } = useSubscription();

  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredUserAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (agent.description && agent.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateNewAgent = () => {
    if (currentPlan && agents.length >= (currentPlan.limits?.max_agents || 0)) {
      toast({
        title: "Subscription limit reached",
        description: `Your ${currentPlan.name} plan allows a maximum of ${currentPlan.limits?.max_agents} agents. Please upgrade to create more.`,
        variant: "destructive",
      });
      return;
    }
    
    setShowCreator(true);
    setShowModelSelector(false);
  };

  const handleConfigureModel = () => {
    setShowModelSelector(true);
    setShowCreator(false);
  };

  const handleUseTemplate = (templateId: string) => {
    if (currentPlan && agents.length >= (currentPlan.limits?.max_agents || 0)) {
      toast({
        title: "Subscription limit reached",
        description: `Your ${currentPlan.name} plan allows a maximum of ${currentPlan.limits?.max_agents} agents. Please upgrade to create more.`,
        variant: "destructive",
      });
      return;
    }
    
    const template = templates.find(t => t.id === templateId);
    if (template) {
      toast({
        title: "Template selected",
        description: `You've selected the ${template.name} template. Creating new agent...`,
        variant: "default",
      });
      
      setShowCreator(true);
      setShowModelSelector(false);
    }
  };

  const handleCreateAgent = async (agentData) => {
    const status = (agentData.status as 'online' | 'offline' | 'error') || 'offline';
    
    const newAgent = await createAgent({
      ...agentData,
      status,
      description: agentData.description || '',
      user_id: user?.id || '',
    });
    
    if (newAgent) {
      setShowCreator(false);
      setSelectedTab('my-agents');
    }
  };

  const handleUpdateAgent = async (id, agentData) => {
    if (agentData.status) {
      agentData.status = agentData.status as 'online' | 'offline' | 'error';
    }
    
    await updateAgent(id, agentData);
  };

  const handleDeleteAgent = async (agentId: string) => {
    await deleteAgent(agentId);
  };

  const handleToggleAgentStatus = async (agentId: string, currentStatus: 'online' | 'offline' | 'error') => {
    await toggleAgentStatus(agentId, currentStatus);
  };

  const handleDeployAgent = async (agentId: string, deployment: any) => {
    try {
      const result = await userAgentService.deploy(agentId, deployment);
      if (result) {
        toast({
          title: "Agent deployed",
          description: `Your agent has been successfully deployed as a ${deployment.type.replace('-', ' ')}.`,
        });
      }
    } catch (error) {
      console.error('Error deploying agent:', error);
      toast({
        title: "Deployment failed",
        description: "There was an error deploying your agent. Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-8">
          <div className="text-red-500 bg-red-500/10 p-4 rounded-md border border-red-500/30">
            Error loading agents: {error}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-8 w-8 text-electric-blue" />
            <h1 className="text-3xl font-heading">Agent Builder</h1>
          </div>
          <p className="text-muted-foreground">Create, manage, and deploy AI agents for your business</p>
          
          {currentPlan && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant={isFreePlan ? "outline" : "default"} className={isFreePlan ? "bg-gray-800/50" : "bg-electric-blue"}>
                {currentPlan.name} Plan
              </Badge>
              <span className="text-sm text-muted-foreground">
                {agents.length} / {currentPlan.limits?.max_agents || 'Unlimited'} agents
              </span>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto"
                onClick={handleConfigureModel}
              >
                <BrainCircuit className="mr-2 h-4 w-4" />
                Configure AI Model
              </Button>
            </div>
          )}
        </header>

        {showModelSelector ? (
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowModelSelector(false)} 
              className="mb-4"
            >
              Back to Agents
            </Button>
            <ModelSelector />
          </div>
        ) : showCreator ? (
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowCreator(false)} 
              className="mb-4"
            >
              Back to Agents
            </Button>
            <AgentCreator onCreateAgent={handleCreateAgent} />
          </div>
        ) : (
          <>
            <Tabs 
              defaultValue="my-agents" 
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="mb-8"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <TabsList className="bg-black/30 border border-gray-800 mb-4 sm:mb-0">
                  <TabsTrigger 
                    value="my-agents" 
                    className="data-[state=active]:bg-electric-blue/10"
                  >
                    My Agents
                  </TabsTrigger>
                  <TabsTrigger 
                    value="templates" 
                    className="data-[state=active]:bg-electric-blue/10"
                  >
                    Templates
                  </TabsTrigger>
                  <TabsTrigger 
                    value="marketplace" 
                    className="data-[state=active]:bg-electric-blue/10"
                  >
                    Marketplace
                  </TabsTrigger>
                </TabsList>

                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search agents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-black/40 border-gray-700 text-white"
                    />
                  </div>
                  <div className="flex border border-gray-700 rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`${viewMode === 'grid' ? 'bg-electric-blue/10 text-electric-blue' : 'text-gray-500'}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <LayoutGrid size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`${viewMode === 'list' ? 'bg-electric-blue/10 text-electric-blue' : 'text-gray-500'}`}
                      onClick={() => setViewMode('list')}
                    >
                      <List size={18} />
                    </Button>
                  </div>
                </div>
              </div>

              <TabsContent value="my-agents" className="mt-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-heading text-white">My Agents</h2>
                  <Button 
                    className="bg-electric-blue hover:bg-electric-blue/90 shadow-neon-blue"
                    onClick={handleCreateNewAgent}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Agent
                  </Button>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 text-electric-blue animate-spin" />
                    <span className="ml-3 text-lg text-gray-300">Loading your agents...</span>
                  </div>
                ) : filteredUserAgents.length === 0 ? (
                  <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <BrainCircuit className="h-16 w-16 text-gray-600 mb-4" />
                      <h3 className="text-xl font-medium text-white mb-2">No agents found</h3>
                      <p className="text-muted-foreground text-center max-w-md mb-6">
                        {searchQuery ? 
                          "No agents match your search query. Try a different search term." :
                          "You haven't created any agents yet. Create your first agent to get started."
                        }
                      </p>
                      {!searchQuery && (
                        <Button 
                          className="bg-electric-blue hover:bg-electric-blue/90 shadow-neon-blue"
                          onClick={handleCreateNewAgent}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create New Agent
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                    {filteredUserAgents.map(agent => (
                      <AgentCard 
                        key={agent.id}
                        agent={{
                          id: agent.id,
                          name: agent.name,
                          description: agent.description || '',
                          icon: <Bot className="h-6 w-6 text-electric-blue" />,
                          status: agent.status,
                          lastUpdated: agent.updated_at,
                          category: agent.category || 'general'
                        }}
                        viewMode={viewMode}
                        onEdit={handleUpdateAgent}
                        onDelete={handleDeleteAgent}
                        onToggleStatus={handleToggleAgentStatus}
                        onDeploy={handleDeployAgent}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="templates" className="mt-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-heading text-white">Agent Templates</h2>
                  <Button variant="outline" className="border-gray-700 text-white">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter Templates
                  </Button>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 text-electric-blue animate-spin" />
                    <span className="ml-3 text-lg text-gray-300">Loading templates...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map(template => (
                      <AgentTemplateCard 
                        key={template.id}
                        template={{
                          id: template.id,
                          name: template.name,
                          description: template.description,
                          icon: <Bot className="h-6 w-6 text-electric-blue" />,
                          category: template.category,
                          popularity: template.popularity,
                          onUse: handleUseTemplate
                        }}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="marketplace" className="mt-4">
                <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Network className="h-16 w-16 text-gray-600 mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">Agent Marketplace</h3>
                    <p className="text-muted-foreground text-center max-w-md mb-6">
                      The Agent Marketplace is coming soon. Here you'll be able to discover, purchase, and install pre-built agents from our partner ecosystem.
                    </p>
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">
                      Coming Soon
                    </Badge>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-12">
              <h2 className="text-2xl font-heading text-white mb-6">Agent Building Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-gray-800 bg-black/20 backdrop-blur-sm hover:border-electric-blue/50 transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-electric-blue" />
                      Vector Store
                    </CardTitle>
                    <CardDescription>Connect your company knowledge</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300">
                      Upload documents, FAQs, and other company data to enable your agent to search and retrieve relevant information.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Explore Vector Stores</Button>
                  </CardFooter>
                </Card>

                <Card className="border-gray-800 bg-black/20 backdrop-blur-sm hover:border-electric-blue/50 transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-cyberpunk-purple" />
                      Tool Integration
                    </CardTitle>
                    <CardDescription>Extend your agent capabilities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300">
                      Connect your agent to APIs, databases, and external services to perform actions on behalf of your users.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Explore Tools</Button>
                  </CardFooter>
                </Card>

                <Card className="border-gray-800 bg-black/20 backdrop-blur-sm hover:border-electric-blue/50 transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="h-5 w-5 text-holographic-teal" />
                      Graph Builder
                    </CardTitle>
                    <CardDescription>Design complex agent workflows</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300">
                      Create sophisticated agent behaviors with our visual graph builder, allowing for conditional routing and specialized handling.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Open Graph Builder</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AgentBuilder;
