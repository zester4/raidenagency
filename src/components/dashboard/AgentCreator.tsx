
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
  Tool, 
  Network, 
  ChevronRight, 
  ChevronLeft,
  Check,
  Upload,
  BrainCircuit
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// This will be the foundation for the agent creator component that we'll expand later

const AgentCreator = () => {
  const [step, setStep] = useState(1);
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Templates for different agent types
  const templates = [
    {
      id: 'customer-support',
      name: 'Customer Support',
      description: 'An agent that handles customer inquiries and routes them to the appropriate department.',
      icon: <Bot className="h-6 w-6 text-electric-blue" />,
    },
    {
      id: 'knowledge-base',
      name: 'Knowledge Base',
      description: 'An agent that answers questions based on your company documents and knowledge base.',
      icon: <Database className="h-6 w-6 text-cyberpunk-purple" />,
    },
    {
      id: 'custom',
      name: 'Custom Agent',
      description: 'Start from scratch and build a custom agent with your chosen tools and workflow.',
      icon: <Tool className="h-6 w-6 text-holographic-teal" />,
    },
  ];

  // Handler for next step
  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  // Handler for previous step
  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
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
              <Label htmlFor="agent-name">Agent Name</Label>
              <Input
                id="agent-name"
                placeholder="e.g., Customer Support Assistant"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="bg-black/40 border-gray-700"
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
          </div>
        )}

        {/* Step 2: Template Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card 
                  key={template.id}
                  className={`border-gray-800 bg-black/30 cursor-pointer transition-all ${
                    selectedTemplate === template.id 
                      ? 'border-electric-blue shadow-neon-blue' 
                      : 'hover:border-gray-700'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
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
          </div>
        )}

        {/* Step 3: Knowledge Base */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="p-6 border border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center">
              <Upload className="h-12 w-12 text-gray-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Company Documents</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Upload PDFs, Word documents, text files, or other content for your agent to learn from.
              </p>
              <Button variant="outline" className="border-gray-700">
                Select Files
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Vector Store Configuration</Label>
              <Card className="border-gray-800 bg-black/40">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    Your documents will be processed and stored in a vector database for semantic search.
                    Advanced configuration options will be available after creation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 4: Tools and Integrations */}
        {step === 4 && (
          <div className="space-y-6">
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
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-black/30">
                <CardContent className="p-4 flex items-center">
                  <div className="p-2 mr-4 bg-black/50 rounded-lg border border-gray-800">
                    <Tool className="h-6 w-6 text-holographic-teal" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Custom Functions</h3>
                    <p className="text-xs text-muted-foreground">
                      Create and use custom function tools
                    </p>
                  </div>
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
                </CardContent>
              </Card>
            </div>

            <p className="text-sm text-muted-foreground">
              More tool configuration options will be available in the agent builder after creation.
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
        <Button
          variant="outline"
          onClick={handlePreviousStep}
          disabled={step === 1}
          className="border-gray-700"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {step < 4 ? (
          <Button onClick={handleNextStep} className="bg-electric-blue hover:bg-electric-blue/90">
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button className="bg-gradient-to-r from-electric-blue to-cyberpunk-purple">
            <Check className="mr-2 h-4 w-4" />
            Create Agent
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AgentCreator;
