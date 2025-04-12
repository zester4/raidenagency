import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAgents } from '@/hooks/useAgents';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { 
  AlertCircle, 
  Database, 
  FileText, 
  Globe, 
  Key, 
  Plus, 
  Search, 
  Server, 
  Trash2, 
  Wrench,
  Code,
  GitBranch,
  Workflow
} from 'lucide-react';

const Tools = () => {
  const { agents, loading, error } = useAgents();
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("available");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddToolDialogOpen, setIsAddToolDialogOpen] = useState(false);
  const [newToolData, setNewToolData] = useState({
    name: "",
    description: "",
    toolType: "api",
    configuration: "{}"
  });

  const toolCategories = [
    { id: "api", name: "API Connection", icon: <Globe className="h-5 w-5" /> },
    { id: "database", name: "Database", icon: <Database className="h-5 w-5" /> },
    { id: "knowledge", name: "Knowledge Base", icon: <FileText className="h-5 w-5" /> },
    { id: "function", name: "Custom Function", icon: <Server className="h-5 w-5" /> },
    { id: "authentication", name: "Authentication", icon: <Key className="h-5 w-5" /> },
    { id: "workflow", name: "Workflow", icon: <Workflow className="h-5 w-5" /> },
  ];

  const availableTools = [
    {
      id: "tool-1",
      name: "OpenAI Knowledge Retrieval",
      description: "Retrieve information from documents using OpenAI embeddings",
      category: "knowledge",
      popularityScore: 98,
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: "tool-2",
      name: "Postgres Database Connection",
      description: "Connect to and query PostgreSQL databases",
      category: "database",
      popularityScore: 95,
      icon: <Database className="h-5 w-5" />
    },
    {
      id: "tool-3",
      name: "REST API Integration",
      description: "Make HTTP requests to external REST APIs",
      category: "api",
      popularityScore: 92,
      icon: <Globe className="h-5 w-5" />
    },
    {
      id: "tool-4",
      name: "OAuth 2.0 Authentication",
      description: "Authenticate users via OAuth 2.0 providers",
      category: "authentication",
      popularityScore: 87,
      icon: <Key className="h-5 w-5" />
    },
    {
      id: "tool-5",
      name: "LangGraph Agent Router",
      description: "Route conversations between different agents based on user requests",
      category: "workflow",
      popularityScore: 94,
      icon: <Workflow className="h-5 w-5" />
    },
    {
      id: "tool-6",
      name: "Human-in-the-loop Approval",
      description: "Pause agent execution and request human approval for sensitive actions",
      category: "workflow",
      popularityScore: 91,
      icon: <GitBranch className="h-5 w-5" />
    },
    {
      id: "tool-7",
      name: "Custom Tool Function",
      description: "Write custom JavaScript functions that your agents can call",
      category: "function",
      popularityScore: 88,
      icon: <Code className="h-5 w-5" />
    }
  ];

  const [installedTools, setInstalledTools] = useState([
    {
      id: "installed-1",
      name: "Google Search",
      description: "Search the web using Google's API",
      category: "api",
      agent_id: "agent-1",
      status: "active",
      icon: <Search className="h-5 w-5" />
    },
    {
      id: "installed-2",
      name: "LangGraph Router",
      description: "Route conversations to specialized agents",
      category: "workflow",
      agent_id: "agent-1",
      status: "active",
      icon: <Workflow className="h-5 w-5" />
    }
  ]);

  const filteredAvailableTools = availableTools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTool = () => {
    try {
      JSON.parse(newToolData.configuration);
      
      const newTool = {
        id: `installed-${Date.now()}`,
        name: newToolData.name,
        description: newToolData.description,
        category: newToolData.toolType,
        agent_id: selectedAgent || "default-agent",
        status: "active",
        icon: <Wrench className="h-5 w-5" />
      };
      
      setInstalledTools([...installedTools, newTool]);
      setIsAddToolDialogOpen(false);
      setNewToolData({
        name: "",
        description: "",
        toolType: "api",
        configuration: "{}"
      });
      
      toast({
        title: "Tool added successfully",
        description: `${newToolData.name} has been added to your agent`,
      });
    } catch (e) {
      toast({
        title: "Invalid configuration",
        description: "Please provide valid JSON for the tool configuration",
        variant: "destructive"
      });
    }
  };

  const handleRemoveTool = (toolId: string) => {
    setInstalledTools(installedTools.filter(tool => tool.id !== toolId));
    toast({
      title: "Tool removed",
      description: "The tool has been removed from your agent",
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-electric-blue">Loading tools...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-xl font-medium">Error loading tools</h3>
          <p className="text-gray-400 mt-2">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Agent Tools</h1>
            <p className="text-gray-400">Manage the tools and capabilities of your agents</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select
              value={selectedAgent || ""}
              onValueChange={(value) => setSelectedAgent(value)}
            >
              <SelectTrigger className="w-[200px]">
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
            
            <Dialog open={isAddToolDialogOpen} onOpenChange={setIsAddToolDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={!selectedAgent}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Custom Tool
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-black/90 border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-electric-blue">Add Custom Tool</DialogTitle>
                  <DialogDescription>
                    Create a custom tool to extend your agent's capabilities
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tool-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="tool-name"
                      className="col-span-3 bg-black/60 border-gray-700"
                      value={newToolData.name}
                      onChange={e => setNewToolData({...newToolData, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tool-description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="tool-description"
                      className="col-span-3 bg-black/60 border-gray-700"
                      value={newToolData.description}
                      onChange={e => setNewToolData({...newToolData, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tool-type" className="text-right">
                      Type
                    </Label>
                    <Select
                      value={newToolData.toolType}
                      onValueChange={(value) => setNewToolData({...newToolData, toolType: value})}
                    >
                      <SelectTrigger className="col-span-3 bg-black/60 border-gray-700">
                        <SelectValue placeholder="Select tool type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="api">API Connection</SelectItem>
                        <SelectItem value="database">Database</SelectItem>
                        <SelectItem value="knowledge">Knowledge Base</SelectItem>
                        <SelectItem value="function">Custom Function</SelectItem>
                        <SelectItem value="authentication">Authentication</SelectItem>
                        <SelectItem value="workflow">Workflow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="tool-config" className="text-right pt-2">
                      Configuration
                    </Label>
                    <Textarea
                      id="tool-config"
                      className="col-span-3 font-mono h-32 bg-black/60 border-gray-700"
                      value={newToolData.configuration}
                      onChange={e => setNewToolData({...newToolData, configuration: e.target.value})}
                      placeholder='{"apiKey": "YOUR_API_KEY", "baseUrl": "https://api.example.com"}'
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddToolDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" onClick={handleAddTool}>
                    Add Tool
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-raiden-black px-4">
              <Input
                className="w-64 bg-black/30 border-gray-700"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="available" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-black/30">
            <TabsTrigger value="available">Available Tools</TabsTrigger>
            <TabsTrigger value="installed">Installed Tools</TabsTrigger>
            <TabsTrigger value="workflow">Workflow Tools</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredAvailableTools
                .filter(tool => tool.category !== 'workflow')
                .map(tool => (
                <Card key={tool.id} className="bg-black/20 border-gray-800 hover:border-electric-blue/50 transition-all duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-full bg-electric-blue/10 text-electric-blue">
                          {tool.icon}
                        </div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                      </div>
                      <Badge variant="outline" className="bg-cyberpunk-purple/20 text-cyberpunk-purple border-cyberpunk-purple/50">
                        {toolCategories.find(cat => cat.id === tool.category)?.name}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400 min-h-[60px]">
                      {tool.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-xs text-gray-500">
                      Popularity: {tool.popularityScore}%
                    </div>
                    <Button size="sm" disabled={!selectedAgent}>
                      Install
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="installed">
            {installedTools.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No tools installed yet</p>
                <Button className="mt-4" variant="outline" onClick={() => setActiveTab("available")}>
                  Browse Available Tools
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {installedTools.map(tool => (
                  <Card key={tool.id} className="bg-black/20 border-gray-800">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 rounded-full bg-electric-blue/10 text-electric-blue">
                            {tool.icon}
                          </div>
                          <CardTitle className="text-lg">{tool.name}</CardTitle>
                        </div>
                        <Badge variant="outline" className={tool.status === 'active' ? 'bg-green-900/20 text-green-500 border-green-500/50' : 'bg-amber-900/20 text-amber-500 border-amber-500/50'}>
                          {tool.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-400">
                        {tool.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="text-xs text-gray-500">
                        {toolCategories.find(cat => cat.id === tool.category)?.name}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Configure</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRemoveTool(tool.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="workflow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredAvailableTools
                .filter(tool => tool.category === 'workflow')
                .map(tool => (
                <Card key={tool.id} className="bg-black/20 border-gray-800 hover:border-electric-blue/50 transition-all duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-full bg-electric-blue/10 text-electric-blue">
                          {tool.icon}
                        </div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                      </div>
                      <Badge variant="outline" className="bg-holographic-teal/20 text-holographic-teal border-holographic-teal/50">
                        Workflow
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400 min-h-[60px]">
                      {tool.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-xs text-gray-500">
                      Popularity: {tool.popularityScore}%
                    </div>
                    <Button size="sm" disabled={!selectedAgent}>
                      Install
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              <Card className="bg-black/20 border-gray-800">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-full bg-electric-blue/10 text-electric-blue">
                        <GitBranch className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">LangGraph Architecture</CardTitle>
                    </div>
                    <Badge variant="outline" className="bg-black/50 text-gray-400 border-gray-600">
                      Reference
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">
                    Learn about the underlying architecture used for building complex agent workflows and orchestration
                  </CardDescription>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div></div>
                  <Button size="sm" variant="outline">
                    View Documentation
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Tools;
