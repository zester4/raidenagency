
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
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
  Database,
  Wrench,
  Network,
  Layers
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AgentTemplateCard } from '@/components/agent-builder/AgentTemplateCard';
import { AgentCard } from '@/components/agent-builder/AgentCard';

// Mock data for templates
const AGENT_TEMPLATES = [
  {
    id: 'customer-support',
    name: 'Customer Support',
    description: 'Handle customer inquiries and route to specialized support agents.',
    icon: <Bot className="h-6 w-6 text-electric-blue" />,
    category: 'support',
    popularity: 'high'
  },
  {
    id: 'healthcare',
    name: 'Healthcare Assistant',
    description: 'Triage patient questions and provide medical information.',
    icon: <Bot className="h-6 w-6 text-emerald-500" />,
    category: 'healthcare',
    popularity: 'medium'
  },
  {
    id: 'security',
    name: 'Security Monitor',
    description: 'Analyze security alerts and provide incident response.',
    icon: <Bot className="h-6 w-6 text-red-500" />,
    category: 'security',
    popularity: 'medium'
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Process data, generate insights and create visualizations.',
    icon: <Bot className="h-6 w-6 text-cyberpunk-purple" />,
    category: 'analytics',
    popularity: 'high'
  },
  {
    id: 'hr-assistant',
    name: 'HR Assistant',
    description: 'Answer employee questions and manage HR processes.',
    icon: <Bot className="h-6 w-6 text-amber-500" />,
    category: 'hr',
    popularity: 'low'
  },
  {
    id: 'knowledge-base',
    name: 'Knowledge Base',
    description: 'Search and retrieve information from company documents.',
    icon: <Bot className="h-6 w-6 text-blue-400" />,
    category: 'knowledge',
    popularity: 'high'
  }
];

// Mock data for user's agents
const USER_AGENTS = [
  {
    id: 'support-1',
    name: 'Tech Support Bot',
    description: 'Handles technical support inquiries for our SaaS product.',
    icon: <Bot className="h-6 w-6 text-electric-blue" />,
    status: 'online',
    lastUpdated: '2023-04-10T09:30:00Z',
    category: 'support'
  },
  {
    id: 'sales-1',
    name: 'Sales Assistant',
    description: 'Qualifies leads and answers product questions.',
    icon: <Bot className="h-6 w-6 text-emerald-500" />,
    status: 'online',
    lastUpdated: '2023-04-09T14:15:00Z',
    category: 'sales'
  },
  {
    id: 'analytics-1',
    name: 'Data Insights',
    description: 'Analyzes customer data and provides insights.',
    icon: <Bot className="h-6 w-6 text-cyberpunk-purple" />,
    status: 'offline',
    lastUpdated: '2023-03-28T11:45:00Z',
    category: 'analytics'
  }
];

const AgentBuilder = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTemplates, setShowTemplates] = useState(true);
  
  // Filter agents based on search query
  const filteredTemplates = AGENT_TEMPLATES.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredUserAgents = USER_AGENTS.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-8 w-8 text-electric-blue" />
            <h1 className="text-3xl font-heading">Agent Builder</h1>
          </div>
          <p className="text-muted-foreground">Create, manage, and deploy AI agents for your business</p>
        </header>

        {/* Tabs */}
        <Tabs defaultValue="my-agents" className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <TabsList className="bg-black/30 border border-gray-800 mb-4 sm:mb-0">
              <TabsTrigger value="my-agents" className="data-[state=active]:bg-electric-blue/10">
                My Agents
              </TabsTrigger>
              <TabsTrigger value="templates" className="data-[state=active]:bg-electric-blue/10">
                Templates
              </TabsTrigger>
              <TabsTrigger value="marketplace" className="data-[state=active]:bg-electric-blue/10">
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

          {/* My Agents Tab */}
          <TabsContent value="my-agents" className="mt-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading text-white">My Agents</h2>
              <Button className="bg-electric-blue hover:bg-electric-blue/90 shadow-neon-blue">
                <Plus className="mr-2 h-4 w-4" />
                Create New Agent
              </Button>
            </div>

            {filteredUserAgents.length === 0 ? (
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
                    <Button className="bg-electric-blue hover:bg-electric-blue/90 shadow-neon-blue">
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
                    agent={agent}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="mt-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading text-white">Agent Templates</h2>
              <Button variant="outline" className="border-gray-700 text-white">
                <Filter className="mr-2 h-4 w-4" />
                Filter Templates
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => (
                <AgentTemplateCard 
                  key={template.id}
                  template={template}
                />
              ))}
            </div>
          </TabsContent>

          {/* Marketplace Tab */}
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

        {/* Features Section */}
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
      </div>
    </DashboardLayout>
  );
};

export default AgentBuilder;
