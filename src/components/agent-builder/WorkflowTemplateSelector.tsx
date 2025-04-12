
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Copy, Info } from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { workflowTemplates, WorkflowTemplate } from '@/lib/agent-workflow-templates';
import AgentWorkflowVisualizer from './AgentWorkflowVisualizer';

interface WorkflowTemplateSelectorProps {
  onSelect: (template: WorkflowTemplate) => void;
  selectedTemplateId?: string;
}

export const WorkflowTemplateSelector: React.FC<WorkflowTemplateSelectorProps> = ({
  onSelect,
  selectedTemplateId
}) => {
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  
  const handleSelectTemplate = (template: WorkflowTemplate) => {
    onSelect(template);
  };
  
  // Toggle template expansion to show workflow diagram
  const toggleExpand = (templateId: string) => {
    setExpandedTemplate(expandedTemplate === templateId ? null : templateId);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium">Workflow Templates</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Info className="h-4 w-4" />
                About Workflows
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-4">
              <p>
                Workflows define how multiple agents work together to handle complex tasks. 
                Each template provides a starting point with pre-configured agent roles and routing logic.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <RadioGroup 
        value={selectedTemplateId} 
        className="space-y-4"
        onValueChange={(value) => {
          const template = workflowTemplates.find(t => t.id === value);
          if (template) {
            handleSelectTemplate(template);
          }
        }}
      >
        {workflowTemplates.map((template) => (
          <div key={template.id}>
            <Card 
              className={`border-gray-800 bg-black/20 backdrop-blur-sm hover:border-electric-blue/50 transition-all cursor-pointer ${
                selectedTemplateId === template.id ? 'border-electric-blue shadow-neon-blue' : ''
              }`}
              onClick={() => handleSelectTemplate(template)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={template.id} id={template.id} className="data-[state=checked]:border-electric-blue data-[state=checked]:text-electric-blue" />
                    <Label 
                      htmlFor={template.id} 
                      className="font-medium text-lg cursor-pointer flex items-center gap-2"
                    >
                      {template.name}
                      <Badge variant="outline" className="ml-2 bg-black/40 text-gray-400 border-gray-700">
                        {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                      </Badge>
                    </Label>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(template.id);
                    }}
                  >
                    <ChevronRight className={`h-5 w-5 transition-transform ${expandedTemplate === template.id ? 'rotate-90' : ''}`} />
                  </Button>
                </div>
                
                <CardDescription>
                  {template.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2 pl-7">
                  {template.nodes
                    .filter(node => node.type === 'agent' || node.type === 'tool')
                    .slice(0, 4)
                    .map(node => (
                      <Badge key={node.id} variant="outline" className="bg-electric-blue/5 border-electric-blue/30">
                        {node.label}
                      </Badge>
                    ))}
                  {template.nodes.filter(node => node.type === 'agent' || node.type === 'tool').length > 4 && (
                    <Badge variant="outline" className="bg-black/40 text-gray-400 border-gray-700">
                      +{template.nodes.filter(node => node.type === 'agent' || node.type === 'tool').length - 4} more
                    </Badge>
                  )}
                </div>
              </CardContent>
              
              {expandedTemplate === template.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 pb-6">
                    <AgentWorkflowVisualizer 
                      nodes={template.nodes}
                      edges={template.edges}
                      highlightedPath={template.previewPath}
                      className="border border-gray-800 rounded-lg p-4 mt-4 max-h-[400px] overflow-auto"
                    />
                  </div>
                </motion.div>
              )}
              
              <CardFooter className="border-t border-gray-800 pt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="ml-7 mr-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTemplate(template);
                  }}
                >
                  {selectedTemplateId === template.id ? (
                    <>
                      <Check className="mr-2 h-4 w-4 text-electric-blue" />
                      Selected
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Use Template
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default WorkflowTemplateSelector;
