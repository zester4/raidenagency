
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Bot, Plus, Save, Trash2, ArrowRight, Edit, PlusCircle, Share, Copy, Workflow } from 'lucide-react';
import AgentWorkflowVisualizer from './AgentWorkflowVisualizer';
import { WorkflowTemplate, WorkflowNode, WorkflowEdge } from '@/lib/agent-workflow-templates';
import { useAgents } from '@/hooks/useAgents';

interface WorkflowComposerProps {
  initialTemplate?: WorkflowTemplate;
  onSave?: (workflow: { nodes: WorkflowNode[], edges: WorkflowEdge[], name: string, description: string }) => void;
}

export const WorkflowComposer: React.FC<WorkflowComposerProps> = ({
  initialTemplate,
  onSave
}) => {
  const { agents } = useAgents();
  const { toast } = useToast();
  
  const [workflowName, setWorkflowName] = useState(initialTemplate?.name || 'New Workflow');
  const [workflowDescription, setWorkflowDescription] = useState(initialTemplate?.description || 'A custom agent workflow');
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialTemplate?.nodes || [
    { id: 'start', label: '__start__', type: 'start', position: { x: 350, y: 50 } },
    { id: 'end', label: '__end__', type: 'end', position: { x: 350, y: 400 } }
  ]);
  const [edges, setEdges] = useState<WorkflowEdge[]>(initialTemplate?.edges || []);
  
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isNodeDialogOpen, setIsNodeDialogOpen] = useState(false);
  const [isEdgeDialogOpen, setIsEdgeDialogOpen] = useState(false);
  const [nodeFormData, setNodeFormData] = useState({
    id: '',
    label: '',
    type: 'agent' as const,
    icon: 'bot',
    agentId: ''
  });
  const [edgeFormData, setEdgeFormData] = useState({
    from: '',
    to: '',
    label: '',
    type: 'solid' as const
  });
  
  // Update nodes/edges when initialTemplate changes
  useEffect(() => {
    if (initialTemplate) {
      setWorkflowName(initialTemplate.name);
      setWorkflowDescription(initialTemplate.description);
      setNodes(initialTemplate.nodes);
      setEdges(initialTemplate.edges);
    }
  }, [initialTemplate]);
  
  const handleAddNode = () => {
    // Find available position (simple placement for now)
    const y = nodes.length > 2 ? 200 : 200;
    const x = 350;
    
    // Generate unique ID
    const id = `node_${Date.now()}`;
    
    setNodeFormData({
      id,
      label: 'New Node',
      type: 'agent',
      icon: 'bot',
      agentId: agents.length > 0 ? agents[0].id : ''
    });
    
    setIsNodeDialogOpen(true);
  };
  
  const handleSaveNode = () => {
    const { id, label, type, icon, agentId } = nodeFormData;
    
    // Create new node with calculated position
    const newNode: WorkflowNode = {
      id,
      label,
      type,
      position: { x: 350, y: 200 },
      icon
    };
    
    // Add new node
    setNodes([...nodes, newNode]);
    setIsNodeDialogOpen(false);
    
    toast({
      title: "Node added",
      description: `${label} node has been added to the workflow`,
    });
  };
  
  const handleAddEdge = () => {
    // Reset edge form data
    setEdgeFormData({
      from: nodes.find(n => n.type === 'start')?.id || '',
      to: '',
      label: '',
      type: 'solid'
    });
    
    setIsEdgeDialogOpen(true);
  };
  
  const handleSaveEdge = () => {
    const { from, to, label, type } = edgeFormData;
    
    // Validate edge
    if (!from || !to) {
      toast({
        title: "Invalid edge",
        description: "Please select both source and target nodes",
        variant: "destructive"
      });
      return;
    }
    
    // Check if edge already exists
    const edgeExists = edges.some(e => e.from === from && e.to === to);
    if (edgeExists) {
      toast({
        title: "Edge already exists",
        description: "An edge between these nodes already exists",
        variant: "destructive"
      });
      return;
    }
    
    // Create new edge
    const newEdge: WorkflowEdge = {
      id: `edge_${Date.now()}`,
      from,
      to,
      label,
      type
    };
    
    // Add new edge
    setEdges([...edges, newEdge]);
    setIsEdgeDialogOpen(false);
    
    toast({
      title: "Edge added",
      description: "New connection has been added to the workflow",
    });
  };
  
  const handleDeleteNode = (nodeId: string) => {
    // Don't allow deleting start/end nodes
    if (nodeId === 'start' || nodeId === 'end') {
      toast({
        title: "Cannot delete node",
        description: "Start and end nodes cannot be deleted",
        variant: "destructive"
      });
      return;
    }
    
    // Remove node
    setNodes(nodes.filter(node => node.id !== nodeId));
    
    // Remove all edges connected to this node
    setEdges(edges.filter(edge => edge.from !== nodeId && edge.to !== nodeId));
    
    toast({
      title: "Node deleted",
      description: "Node and its connections have been removed",
    });
  };
  
  const handleDeleteEdge = (edgeId: string) => {
    setEdges(edges.filter(edge => edge.id !== edgeId));
    
    toast({
      title: "Edge deleted",
      description: "Connection has been removed",
    });
  };
  
  const handleSaveWorkflow = () => {
    if (onSave) {
      onSave({
        nodes,
        edges,
        name: workflowName,
        description: workflowDescription
      });
    }
    
    toast({
      title: "Workflow saved",
      description: "Your agent workflow has been saved successfully",
    });
  };
  
  return (
    <div className="space-y-6">
      <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Workflow Composer</CardTitle>
              <CardDescription>
                Design your agent workflow by adding nodes and connections
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleAddNode}>
                <Plus className="mr-2 h-4 w-4" />
                Add Node
              </Button>
              <Button variant="outline" size="sm" onClick={handleAddEdge}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Add Connection
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workflow-name">Workflow Name</Label>
              <Input
                id="workflow-name"
                className="bg-black/60 border-gray-700 mt-1"
                value={workflowName}
                onChange={e => setWorkflowName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="workflow-type">Workflow Type</Label>
              <Select defaultValue="sequential">
                <SelectTrigger className="bg-black/60 border-gray-700 mt-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sequential">Sequential</SelectItem>
                  <SelectItem value="conditional">Conditional</SelectItem>
                  <SelectItem value="team">Team-based</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="workflow-description">Description</Label>
              <Input
                id="workflow-description"
                className="bg-black/60 border-gray-700 mt-1"
                value={workflowDescription}
                onChange={e => setWorkflowDescription(e.target.value)}
              />
            </div>
          </div>
          
          <div className="border border-gray-800 rounded-lg bg-black/40 p-4 overflow-hidden">
            <AgentWorkflowVisualizer 
              nodes={nodes}
              edges={edges}
              className="min-h-[400px]"
            />
          </div>
          
          <div className="mt-6 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Nodes</h4>
              <div className="space-y-2">
                {nodes.map(node => (
                  <div 
                    key={node.id} 
                    className="flex items-center justify-between bg-black/40 p-3 rounded-md border border-gray-800"
                  >
                    <div className="flex items-center">
                      <Badge 
                        variant={node.type === 'start' || node.type === 'end' ? "outline" : "default"}
                        className={`mr-3 ${node.type === 'start' || node.type === 'end' ? "bg-gray-800" : "bg-electric-blue"}`}
                      >
                        {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                      </Badge>
                      <span>{node.label}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteNode(node.id)}
                        disabled={node.type === 'start' || node.type === 'end'}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Connections</h4>
              <div className="space-y-2">
                {edges.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No connections yet. Add a connection to define how agents interact.
                  </div>
                ) : (
                  edges.map(edge => (
                    <div 
                      key={edge.id} 
                      className="flex items-center justify-between bg-black/40 p-3 rounded-md border border-gray-800"
                    >
                      <div className="flex items-center">
                        <span className="text-gray-400">
                          {nodes.find(n => n.id === edge.from)?.label || edge.from}
                        </span>
                        <ArrowRight className="mx-3 h-4 w-4 text-gray-500" />
                        <span className="text-gray-400">
                          {nodes.find(n => n.id === edge.to)?.label || edge.to}
                        </span>
                        {edge.label && (
                          <Badge variant="outline" className="ml-3 bg-black/40">
                            {edge.label}
                          </Badge>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteEdge(edge.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          <Copy className="mr-2 h-4 w-4" />
          Clone
        </Button>
        <Button variant="outline">
          <Share className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button onClick={handleSaveWorkflow}>
          <Save className="mr-2 h-4 w-4" />
          Save Workflow
        </Button>
      </div>
      
      {/* Node Dialog */}
      <Dialog open={isNodeDialogOpen} onOpenChange={setIsNodeDialogOpen}>
        <DialogContent className="bg-black/90 border-gray-800">
          <DialogHeader>
            <DialogTitle>Add Workflow Node</DialogTitle>
            <DialogDescription>
              Add a new node to your workflow
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="node-label" className="text-right">
                Name
              </Label>
              <Input
                id="node-label"
                value={nodeFormData.label}
                onChange={(e) => setNodeFormData({ ...nodeFormData, label: e.target.value })}
                className="col-span-3 bg-black/60 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="node-type" className="text-right">
                Type
              </Label>
              <Select
                value={nodeFormData.type}
                onValueChange={(value: 'agent' | 'tool' | 'condition') => 
                  setNodeFormData({ ...nodeFormData, type: value })
                }
              >
                <SelectTrigger className="col-span-3 bg-black/60 border-gray-700">
                  <SelectValue placeholder="Select node type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="tool">Tool</SelectItem>
                  <SelectItem value="condition">Condition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="node-icon" className="text-right">
                Icon
              </Label>
              <Select
                value={nodeFormData.icon}
                onValueChange={(value) => setNodeFormData({ ...nodeFormData, icon: value })}
              >
                <SelectTrigger className="col-span-3 bg-black/60 border-gray-700">
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bot">Bot</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="knowledge">Knowledge Base</SelectItem>
                  <SelectItem value="search">Search</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {nodeFormData.type === 'agent' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="agent-id" className="text-right">
                  Agent
                </Label>
                <Select
                  value={nodeFormData.agentId}
                  onValueChange={(value) => setNodeFormData({ ...nodeFormData, agentId: value })}
                >
                  <SelectTrigger className="col-span-3 bg-black/60 border-gray-700">
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map(agent => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNodeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNode}>
              Add Node
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edge Dialog */}
      <Dialog open={isEdgeDialogOpen} onOpenChange={setIsEdgeDialogOpen}>
        <DialogContent className="bg-black/90 border-gray-800">
          <DialogHeader>
            <DialogTitle>Add Connection</DialogTitle>
            <DialogDescription>
              Create a connection between two nodes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edge-from" className="text-right">
                From
              </Label>
              <Select
                value={edgeFormData.from}
                onValueChange={(value) => setEdgeFormData({ ...edgeFormData, from: value })}
              >
                <SelectTrigger className="col-span-3 bg-black/60 border-gray-700">
                  <SelectValue placeholder="Select source node" />
                </SelectTrigger>
                <SelectContent>
                  {nodes.map(node => (
                    <SelectItem key={node.id} value={node.id}>
                      {node.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edge-to" className="text-right">
                To
              </Label>
              <Select
                value={edgeFormData.to}
                onValueChange={(value) => setEdgeFormData({ ...edgeFormData, to: value })}
              >
                <SelectTrigger className="col-span-3 bg-black/60 border-gray-700">
                  <SelectValue placeholder="Select target node" />
                </SelectTrigger>
                <SelectContent>
                  {nodes.map(node => (
                    <SelectItem key={node.id} value={node.id}>
                      {node.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edge-label" className="text-right">
                Label
              </Label>
              <Input
                id="edge-label"
                value={edgeFormData.label}
                onChange={(e) => setEdgeFormData({ ...edgeFormData, label: e.target.value })}
                className="col-span-3 bg-black/60 border-gray-700"
                placeholder="Optional"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edge-type" className="text-right">
                Line Style
              </Label>
              <Select
                value={edgeFormData.type}
                onValueChange={(value: 'solid' | 'dashed') => 
                  setEdgeFormData({ ...edgeFormData, type: value })
                }
              >
                <SelectTrigger className="col-span-3 bg-black/60 border-gray-700">
                  <SelectValue placeholder="Select line style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEdgeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdge}>
              Add Connection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkflowComposer;
