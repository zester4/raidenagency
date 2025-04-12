
import React, { useState } from 'react';
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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, 
  Database, 
  Wrench, 
  Network, 
  ChevronRight, 
  ChevronLeft,
  Check,
  Upload,
  BrainCircuit,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { UserAgent } from '@/lib/agent-service';
import { useToast } from "@/hooks/use-toast";

interface AgentCreatorProps {
  onCreateAgent?: (agent: Partial<UserAgent>) => Promise<void>;
}

const AgentCreator: React.FC<AgentCreatorProps> = ({ onCreateAgent }) => {
  const [step, setStep] = useState(1);
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Templates for different agent types
  const templates = [
    {
      id: 'customer-support',
      name: 'Customer Support',
      description: 'An agent that handles customer inquiries and routes them to the appropriate department.',
      icon: <Bot className="h-6 w-6 text-electric-blue" />,
      systemPrompt: 'You are a helpful customer support agent. Your goal is to assist customers with their inquiries and route complex issues to specialized teams when necessary.'
    },
    {
      id: 'knowledge-base',
      name: 'Knowledge Base',
      description: 'An agent that answers questions based on your company documents and knowledge base.',
      icon: <Database className="h-6 w-6 text-cyberpunk-purple" />,
      systemPrompt: 'You are a knowledge base assistant. Your primary role is to search and retrieve accurate information from company documents and provide clear, concise answers.'
    },
    {
      id: 'custom',
      name: 'Custom Agent',
      description: 'Start from scratch and build a custom agent with your chosen tools and workflow.',
      icon: <Wrench className="h-6 w-6 text-holographic-teal" />,
      systemPrompt: 'You are an AI assistant designed to help users with their tasks. Provide clear, concise and helpful responses.'
    },
  ];

  // Handler for next step
  const handleNextStep = () => {
    // Validate current step
    if (step === 1 && !agentName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a name for your agent.",
        variant: "destructive",
      });
      return;
    }

    if (step === 2 && !selectedTemplate) {
      toast({
        title: "Missing information",
        description: "Please select a template for your agent.",
        variant: "destructive",
      });
      return;
    }

    // If validation passes, go to next step
    if (step < 4) {
      setStep(step + 1);
      
      // If moving from step 2 to 3 and a template is selected, set the system prompt
      if (step === 2 && selectedTemplate) {
        const template = templates.find(t => t.id === selectedTemplate);
        if (template && !systemPrompt) {
          setSystemPrompt(template.systemPrompt);
        }
      }
    }
  };

  // Handler for previous step
  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    // Set the system prompt from the template
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSystemPrompt(template.systemPrompt);
    }
  };

  // Handle create agent
  const handleCreateAgent = async () => {
    if (!agentName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a name for your agent.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (onCreateAgent) {
        await onCreateAgent({
          name: agentName,
          description: agentDescription,
          category: selectedTemplate === 'custom' ? 'custom' : selectedTemplate,
          system_prompt: systemPrompt,
          config: {
            template: selectedTemplate,
            created_at_step: 4,
          }
        });
      } else {
        toast({
          title: "Agent created",
          description: "Your agent has been created successfully.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error creating agent:', error);
      toast({
        title: "Error",
        description: "There was an error creating your agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-gray-800 bg-black/20 backdrop-blur-sm w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-electric-blue" />
            <CardTitle>Create New Agent</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-black/40 border-gray-700">
              Step {step} of 4
            </Badge>
          </div>
        </div>
        <CardDescription>
          {step === 1 && "Define your agent's basic information"}
          {step === 2 && "Select a template or start from scratch"}
          {step === 3 && "Configure knowledge base and vector store"}
          {step === 4 && "Set up tools and integrations"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agent-name">Agent Name <span className="text-red-500">*</span></Label>
              <Input
                id="agent-name"
                placeholder="e.g., Customer Support Assistant"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="bg-black/40 border-gray-700"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agent-description">Description</Label>
              <Textarea
                id="agent-description"
                placeholder="Describe what your agent will do..."
                value={agentDescription}
                onChange={(e) => setAgentDescription(e.target.value)}
                className="bg-black/40 border-gray-700 min-h-24"
              />
            </div>
            
            {!agentName.trim() && (
              <div className="flex items-center mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-md">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-amber-300">
                  Please provide a name for your agent before continuing.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Template Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400 mb-4">
              Choose a template to get started quickly, or select "Custom Agent" to build from scratch.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card 
                  key={template.id}
                  className={`border-gray-800 bg-black/30 cursor-pointer transition-all ${
                    selectedTemplate === template.id 
                      ? 'border-electric-blue shadow-neon-blue' 
                      : 'hover:border-gray-700'
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 bg-black/50 rounded-lg border border-gray-800 mb-4">
                        {template.icon}
                      </div>
                      <h3 className="text-lg font-medium mb-2">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {!selectedTemplate && (
              <div className="flex items-center mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-md">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-amber-300">
                  Please select a template before continuing.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Knowledge Base */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="system-prompt">System Prompt</Label>
              <Textarea
                id="system-prompt"
                placeholder="Define how your agent should behave..."
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="bg-black/40 border-gray-700 min-h-32"
              />
              <p className="text-xs text-gray-400">
                This prompt defines your agent's personality and core behavior. It's automatically populated based on your template selection.
              </p>
            </div>
            
            <div className="p-6 border border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center">
              <Upload className="h-12 w-12 text-gray-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Company Documents</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Upload PDFs, Word documents, text files, or other content for your agent to learn from.
              </p>
              <Badge className="mb-4 bg-electric-blue/20 text-electric-blue border-0">
                Pro Feature
              </Badge>
              <Button variant="outline" className="border-gray-700" disabled>
                Select Files
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Tools and Integrations */}
        {step === 4 && (
          <div className="space-y-6">
            <p className="text-sm text-gray-400 mb-4">
              These tools allow your agent to perform specific actions. Select the tools you want to enable for your agent.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-gray-800 bg-black/30">
                <CardContent className="p-4 flex items-center">
                  <div className="p-2 mr-4 bg-black/50 rounded-lg border border-gray-800">
                    <Network className="h-6 w-6 text-cyberpunk-purple" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">API Integration</h3>
                    <p className="text-xs text-muted-foreground">
                      Connect to external APIs and services
                    </p>
                  </div>
                  <Badge className="ml-auto bg-electric-blue/20 text-electric-blue border-0">
                    Pro
                  </Badge>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-black/30">
                <CardContent className="p-4 flex items-center">
                  <div className="p-2 mr-4 bg-black/50 rounded-lg border border-gray-800">
                    <Database className="h-6 w-6 text-electric-blue" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Database Access</h3>
                    <p className="text-xs text-muted-foreground">
                      Query and modify database records
                    </p>
                  </div>
                  <Badge className="ml-auto bg-electric-blue/20 text-electric-blue border-0">
                    Pro
                  </Badge>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-black/30">
                <CardContent className="p-4 flex items-center">
                  <div className="p-2 mr-4 bg-black/50 rounded-lg border border-gray-800">
                    <Wrench className="h-6 w-6 text-holographic-teal" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Custom Functions</h3>
                    <p className="text-xs text-muted-foreground">
                      Create and use custom function tools
                    </p>
                  </div>
                  <Badge className="ml-auto bg-electric-blue/20 text-electric-blue border-0">
                    Pro
                  </Badge>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-black/30">
                <CardContent className="p-4 flex items-center">
                  <div className="p-2 mr-4 bg-black/50 rounded-lg border border-gray-800">
                    <Bot className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Human-in-the-loop</h3>
                    <p className="text-xs text-muted-foreground">
                      Configure human approval flows
                    </p>
                  </div>
                  <Badge className="ml-auto bg-electric-blue/20 text-electric-blue border-0">
                    Pro
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <div className="p-4 bg-black/40 border border-gray-700 rounded-md">
              <p className="text-sm text-muted-foreground">
                Your agent will be created with the basic configuration. You can add more advanced tools and integrations after creation if your subscription plan supports them.
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
        <Button
          variant="outline"
          onClick={handlePreviousStep}
          disabled={step === 1 || isSubmitting}
          className="border-gray-700"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {step < 4 ? (
          <Button 
            onClick={handleNextStep} 
            className="bg-electric-blue hover:bg-electric-blue/90"
            disabled={isSubmitting}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            className="bg-gradient-to-r from-electric-blue to-cyberpunk-purple"
            onClick={handleCreateAgent}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Create Agent
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AgentCreator;
