
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Wrench, 
  Plus, 
  Search, 
  Database, 
  Code, 
  Mail, 
  Calendar, 
  FileText, 
  UserCheck, 
  Globe, 
  Bot,
  Link,
  Trash2
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Tool {
  id: string;
  name: string;
  description: string;
  type: string;
  icon: string;
  config_schema: any;
}

interface AgentTool {
  id: string;
  agent_id: string;
  name: string;
  description: string;
  tool_type: string;
  config: any;
}

const Tools = () => {
  const [availableTools, setAvailableTools] = useState<Tool[]>([]);
  const [agentTools, setAgentTools] = useState<AgentTool[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    config: {} as Record<string, any>
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('user_agents')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (error) throw error;
        setAgents(data || []);
        
        if (data && data.length > 0) {
          setSelectedAgent(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your agents',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [toast]);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        // Fetch available tools from our edge function
        const { data, error } = await supabase.functions.invoke('agent-tools/available');
        
        if (error) throw error;
        setAvailableTools(data);
      } catch (error) {
        console.error('Error fetching available tools:', error);
        toast({
          title: 'Error',
          description: 'Failed to load available tools',
          variant: 'destructive'
        });
      }
    };

    fetchTools();
  }, [toast]);

  useEffect(() => {
    const fetchAgentTools = async () => {
      if (!selectedAgent) return;
      
      try {
        const { data, error } = await supabase.functions.invoke(`agent-tools/agent/${selectedAgent}`);
        
        if (error) throw error;
        setAgentTools(data || []);
      } catch (error) {
        console.error('Error fetching agent tools:', error);
        toast({
          title: 'Error',
          description: 'Failed to load agent tools',
          variant: 'destructive'
        });
      }
    };

    if (selectedAgent) {
      fetchAgentTools();
    }
  }, [selectedAgent, toast]);

  const handleAgentChange = (agentId: string) => {
    setSelectedAgent(agentId);
  };

  const handleOpenToolDialog = (tool: Tool) => {
    setSelectedTool(tool);
    setFormData({
      name: tool.name,
      description: tool.description || '',
      config: {}
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTool(null);
    setFormData({
      name: '',
      description: '',
      config: {}
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfigChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value
      }
    }));
  };

  const handleAddTool = async () => {
    if (!selectedTool || !selectedAgent) return;
    
    try {
      // Call our edge function to add the tool to the agent
      const { data, error } = await supabase.functions.invoke(`agent-tools/agent/${selectedAgent}`, {
        method: 'POST',
        body: {
          name: formData.name,
          description: formData.description,
          tool_type: selectedTool.id,
          config: formData.config
        }
      });
      
      if (error) throw error;
      
      // Update local state
      setAgentTools(prev => [...prev, data]);
      
      toast({
        title: 'Success',
        description: 'Tool added successfully',
      });
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error adding tool:', error);
      toast({
        title: 'Error',
        description: 'Failed to add tool',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteTool = async (toolId: string) => {
    try {
      const { error } = await supabase.functions.invoke(`agent-tools/${toolId}`, {
        method: 'DELETE'
      });
      
      if (error) throw error;
      
      // Update local state
      setAgentTools(prev => prev.filter(tool => tool.id !== toolId));
      
      toast({
        title: 'Success',
        description: 'Tool removed successfully',
      });
    } catch (error) {
      console.error('Error removing tool:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove tool',
        variant: 'destructive'
      });
    }
  };

  // Function to get icon component based on icon string
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'search':
        return <Search className="h-5 w-5" />;
      case 'database':
        return <Database className="h-5 w-5" />;
      case 'code':
        return <Code className="h-5 w-5" />;
      case 'mail':
        return <Mail className="h-5 w-5" />;
      case 'calendar':
        return <Calendar className="h-5 w-5" />;
      case 'file':
        return <FileText className="h-5 w-5" />;
      case 'user-check':
        return <UserCheck className="h-5 w-5" />;
      default:
        return <Wrench className="h-5 w-5" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Agent Tools</h1>
            <p className="text-gray-400 mt-1">Connect your agents to powerful external tools and services</p>
          </div>
          <div className="flex items-center">
            <Label htmlFor="agent-select" className="mr-2">Agent:</Label>
            <Select value={selectedAgent} onValueChange={handleAgentChange}>
              <SelectTrigger className="w-[200px] bg-black/40 border-gray-800">
                <SelectValue placeholder="Select an agent" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800">
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-gray-800 bg-black/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="h-5 w-5 text-electric-blue mr-2" />
                  Connected Tools
                </CardTitle>
                <CardDescription>
                  Tools currently connected to your selected agent
                </CardDescription>
              </CardHeader>
              <CardContent>
                {agentTools.length === 0 ? (
                  <div className="text-center py-8">
                    <Wrench className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-lg font-medium text-gray-300">No tools connected</p>
                    <p className="text-gray-400 mt-2 mb-4">Add tools from the available tools section to enhance your agent's capabilities.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {agentTools.map((tool) => (
                      <div key={tool.id} className="p-4 border border-gray-800 rounded-lg bg-black/30 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="p-2 rounded-md bg-black/40 border border-gray-800 mr-3">
                            {getIconComponent(tool.tool_type.split('-')[0])}
                          </div>
                          <div>
                            <h3 className="font-medium">{tool.name}</h3>
                            <p className="text-sm text-gray-400">{tool.description}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteTool(tool.id)}
                            className="hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="border-gray-800 bg-black/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 text-electric-blue mr-2" />
                  Available Tools
                </CardTitle>
                <CardDescription>
                  Add these tools to your agent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableTools.map((tool) => (
                    <div 
                      key={tool.id} 
                      className="p-4 border border-gray-800 rounded-lg bg-black/30 hover:border-electric-blue/50 transition-colors cursor-pointer"
                      onClick={() => handleOpenToolDialog(tool)}
                    >
                      <div className="flex items-center mb-2">
                        <div className="p-2 rounded-md bg-black/40 border border-gray-800 mr-3">
                          {getIconComponent(tool.icon)}
                        </div>
                        <h3 className="font-medium">{tool.name}</h3>
                      </div>
                      <p className="text-sm text-gray-400">{tool.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/80 backdrop-blur-sm border-gray-800 text-white sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {selectedTool && getIconComponent(selectedTool.icon)}
              <span className="ml-2">Add {selectedTool?.name}</span>
            </DialogTitle>
            <DialogDescription>
              Configure this tool before adding it to your agent
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tool Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-black/40 border-gray-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="bg-black/40 border-gray-700 min-h-[80px]"
              />
            </div>
            
            {selectedTool && selectedTool.config_schema && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">Configuration</h3>
                
                {Object.entries(selectedTool.config_schema.properties || {}).map(([key, schema]: [string, any]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</Label>
                    
                    {schema.type === 'string' && schema.enum ? (
                      <Select 
                        value={formData.config[key] || schema.default || schema.enum[0]} 
                        onValueChange={(value) => handleConfigChange(key, value)}
                      >
                        <SelectTrigger className="bg-black/40 border-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          {schema.enum.map((option: string) => (
                            <SelectItem key={option} value={option}>
                              {option.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : schema.type === 'boolean' ? (
                      <Select 
                        value={formData.config[key]?.toString() || schema.default?.toString() || 'false'} 
                        onValueChange={(value) => handleConfigChange(key, value === 'true')}
                      >
                        <SelectTrigger className="bg-black/40 border-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="true">True</SelectItem>
                          <SelectItem value="false">False</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : schema.type === 'number' ? (
                      <Input
                        id={key}
                        type="number"
                        value={formData.config[key] || schema.default || ''}
                        onChange={(e) => handleConfigChange(key, Number(e.target.value))}
                        className="bg-black/40 border-gray-700"
                      />
                    ) : (
                      <Input
                        id={key}
                        value={formData.config[key] || schema.default || ''}
                        onChange={(e) => handleConfigChange(key, e.target.value)}
                        className="bg-black/40 border-gray-700"
                        placeholder={schema.type === 'object' ? 'Enter JSON object' : ''}
                      />
                    )}
                    
                    {schema.description && (
                      <p className="text-xs text-gray-400 mt-1">{schema.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} className="border-gray-700">
              Cancel
            </Button>
            <Button onClick={handleAddTool} className="bg-electric-blue hover:bg-electric-blue/90">
              Add Tool
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Tools;
