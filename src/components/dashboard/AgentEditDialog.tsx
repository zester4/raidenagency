
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { UserAgent } from '@/lib/agent-service';
import { Loader2, X, Save, BrainCircuit, Blocks, Database, Wrench, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AgentEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  agent: UserAgent | null;
  onSave: (updatedAgent: Partial<UserAgent>) => Promise<void>;
}

const AgentEditDialog: React.FC<AgentEditDialogProps> = ({
  isOpen,
  onClose,
  agent,
  onSave
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<UserAgent>>({
    name: '',
    description: '',
    category: '',
    system_prompt: '',
  });
  const [activeTab, setActiveTab] = useState('general');

  React.useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name || '',
        description: agent.description || '',
        category: agent.category || 'general',
        system_prompt: agent.system_prompt || 'You are a helpful AI assistant.',
      });
    }
  }, [agent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      toast({
        title: "Agent updated",
        description: "Agent settings have been successfully updated.",
      });
      onClose();
    } catch (error) {
      console.error('Error saving agent:', error);
      toast({
        title: "Error updating agent",
        description: "An error occurred while updating the agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!agent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/80 backdrop-blur-sm border-gray-800 text-white sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BrainCircuit className="h-5 w-5 text-electric-blue" />
            Edit Agent: {agent.name}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-4 bg-black/30 border border-gray-800">
              <TabsTrigger value="general" className="data-[state=active]:bg-electric-blue/10">
                General
              </TabsTrigger>
              <TabsTrigger value="configuration" className="data-[state=active]:bg-electric-blue/10">
                Model
              </TabsTrigger>
              <TabsTrigger value="knowledge" className="data-[state=active]:bg-electric-blue/10">
                Knowledge
              </TabsTrigger>
              <TabsTrigger value="deployment" className="data-[state=active]:bg-electric-blue/10">
                Deployment
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Agent Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter agent name"
                  className="bg-black/40 border-gray-700"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what this agent does"
                  className="bg-black/40 border-gray-700 min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category || 'general'}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger className="bg-black/40 border-gray-700">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="customer-service">Customer Service</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="configuration" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="system_prompt">System Prompt</Label>
                <Textarea
                  id="system_prompt"
                  name="system_prompt"
                  value={formData.system_prompt}
                  onChange={handleChange}
                  placeholder="Enter the system prompt for your agent"
                  className="bg-black/40 border-gray-700 min-h-[150px]"
                />
                <p className="text-sm text-muted-foreground">
                  This prompt defines the behavior, personality, and capabilities of your agent.
                </p>
              </div>
              
              <div className="space-y-4 bg-black/20 border border-gray-800 rounded-md p-4 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Advanced Configuration</h4>
                    <p className="text-xs text-muted-foreground">Adjust model parameters for optimal performance</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-700">
                    <Wrench className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="knowledge" className="space-y-4 py-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Knowledge Base</h3>
                <Button variant="outline" className="border-gray-700">
                  <Database className="h-4 w-4 mr-2" />
                  Connect Data
                </Button>
              </div>
              
              <div className="bg-black/20 border border-gray-800 rounded-md p-6 text-center">
                <Database className="h-10 w-10 text-gray-600 mx-auto mb-4" />
                <h4 className="text-lg font-medium mb-2">No Knowledge Sources</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect documents, websites, or databases to enhance your agent's capabilities.
                </p>
                <Button variant="outline" className="border-gray-700">Add Knowledge Source</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="deployment" className="space-y-4 py-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Deployment Options</h3>
                <Button variant="outline" className="border-gray-700">
                  <Globe className="h-4 w-4 mr-2" />
                  View Live
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/20 border border-gray-800 rounded-md">
                  <div className="flex items-center">
                    <div className="p-2 rounded-md bg-electric-blue/10 mr-3">
                      <Globe className="h-5 w-5 text-electric-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium">Web Widget</h4>
                      <p className="text-sm text-muted-foreground">Embed a chat widget on your website</p>
                    </div>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-black/20 border border-gray-800 rounded-md">
                  <div className="flex items-center">
                    <div className="p-2 rounded-md bg-cyberpunk-purple/10 mr-3">
                      <Blocks className="h-5 w-5 text-cyberpunk-purple" />
                    </div>
                    <div>
                      <h4 className="font-medium">API Endpoint</h4>
                      <p className="text-sm text-muted-foreground">Access via REST API</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-700"
            >
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-electric-blue hover:bg-electric-blue/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AgentEditDialog;
