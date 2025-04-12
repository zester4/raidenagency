
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UserAgent } from '@/lib/agent-service';
import { useToast } from '@/hooks/use-toast';
import { Check, Copy, Globe, Blocks, MessageSquare, Code, X, Rocket, Loader2 } from 'lucide-react';

interface AgentDeployDialogProps {
  isOpen: boolean;
  onClose: () => void;
  agent: UserAgent | null;
  onDeploy: (agentId: string, deployment: any) => Promise<void>;
}

const AgentDeployDialog: React.FC<AgentDeployDialogProps> = ({
  isOpen,
  onClose,
  agent,
  onDeploy
}) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [activeTab, setActiveTab] = useState('chat-widget');
  const [deploymentType, setDeploymentType] = useState('public');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  if (!agent) return null;

  const handleDeploy = async () => {
    if (!agent) return;
    
    setIsDeploying(true);
    try {
      await onDeploy(agent.id, { type: activeTab, access: deploymentType });
      toast({
        title: "Agent deployed",
        description: `${agent.name} has been successfully deployed as a ${activeTab.replace('-', ' ')}.`,
      });
      setIsDeploying(false);
    } catch (error) {
      console.error('Error deploying agent:', error);
      toast({
        title: "Deployment failed",
        description: "Failed to deploy the agent. Please try again later.",
        variant: "destructive",
      });
      setIsDeploying(false);
    }
  };

  const handleCopyCode = () => {
    const code = document.getElementById('embed-code');
    if (code) {
      navigator.clipboard.writeText(code.textContent || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getEmbedCode = () => {
    const agentId = agent?.id;
    
    if (activeTab === 'chat-widget') {
      return `<script src="https://api.raidenagents.com/v1/widget.js" data-agent-id="${agentId}"></script>`;
    } else if (activeTab === 'api-endpoint') {
      return `// Using fetch
fetch('https://api.raidenagents.com/v1/agents/${agentId}/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    message: 'Hello, agent!',
    session_id: 'unique-session-id'
  })
})
.then(response => response.json())
.then(data => console.log(data));`;
    }
    
    return '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/80 backdrop-blur-sm border-gray-800 text-white sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Rocket className="h-5 w-5 text-electric-blue" />
            Deploy Agent: {agent.name}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2 bg-black/30 border border-gray-800">
            <TabsTrigger value="chat-widget" className="data-[state=active]:bg-electric-blue/10">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat Widget
            </TabsTrigger>
            <TabsTrigger value="api-endpoint" className="data-[state=active]:bg-electric-blue/10">
              <Blocks className="h-4 w-4 mr-2" />
              API Endpoint
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat-widget" className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Web Chat Widget</h3>
              <p className="text-sm text-gray-400 mb-4">
                Embed a chat widget on your website to let your visitors interact with your agent.
              </p>
              
              <div className="bg-black/20 border border-gray-800 rounded-md p-4 mb-4">
                <div className="flex items-center mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <p className="text-sm text-green-400">Ready to deploy</p>
                </div>
                
                <div className="relative">
                  <pre className="bg-black/40 p-4 rounded-md overflow-x-auto text-sm" id="embed-code">
                    {getEmbedCode()}
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleCopyCode}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4 pt-4">
                <h4 className="font-medium">Widget Customization</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="widget-title">Widget Title</Label>
                    <Input
                      id="widget-title"
                      placeholder="Chat with Agent"
                      className="bg-black/40 border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="widget-color">Primary Color</Label>
                    <div className="flex">
                      <Input
                        id="widget-color"
                        placeholder="#0091FF"
                        className="bg-black/40 border-gray-700 rounded-r-none"
                      />
                      <div className="w-10 bg-electric-blue rounded-r-md"></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="widget-welcome">Welcome Message</Label>
                  <Textarea
                    id="widget-welcome"
                    placeholder="Hello! How can I help you today?"
                    className="bg-black/40 border-gray-700"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="api-endpoint" className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">API Endpoint</h3>
              <p className="text-sm text-gray-400 mb-4">
                Access your agent through a REST API endpoint. You can integrate it with your applications or services.
              </p>
              
              <div className="bg-black/20 border border-gray-800 rounded-md p-4 mb-4">
                <div className="flex items-center mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <p className="text-sm text-green-400">API Endpoint Available</p>
                </div>
                
                <div className="relative">
                  <pre className="bg-black/40 p-4 rounded-md overflow-x-auto text-sm" id="embed-code">
                    {getEmbedCode()}
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleCopyCode}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4 pt-4">
                <h4 className="font-medium">API Access Controls</h4>
                <RadioGroup 
                  defaultValue="public" 
                  value={deploymentType}
                  onValueChange={setDeploymentType}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public" className="font-normal">Public API (no authentication required)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="api-key" id="api-key" />
                    <Label htmlFor="api-key" className="font-normal">API Key authentication</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="jwt" id="jwt" />
                    <Label htmlFor="jwt" className="font-normal">JWT authentication</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label htmlFor="rate-limit">Rate Limit (requests per minute)</Label>
                <Input
                  id="rate-limit"
                  type="number"
                  placeholder="60"
                  className="bg-black/40 border-gray-700"
                />
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
            onClick={handleDeploy}
            disabled={isDeploying}
            className="bg-electric-blue hover:bg-electric-blue/90"
          >
            {isDeploying ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deploying...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4 mr-2" /> Deploy Agent
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgentDeployDialog;
