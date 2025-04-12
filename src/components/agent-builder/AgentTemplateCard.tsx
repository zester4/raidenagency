
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight,
  Info
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TemplateProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  popularity: 'high' | 'medium' | 'low';
  onUse?: (templateId: string) => void;
}

interface AgentTemplateCardProps {
  template: TemplateProps;
}

export const AgentTemplateCard = ({ template }: AgentTemplateCardProps) => {
  const handleUseTemplate = () => {
    if (template.onUse) {
      template.onUse(template.id);
    }
  };

  return (
    <Card className="border-gray-800 bg-black/20 backdrop-blur-sm hover:border-electric-blue/50 transition-all">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-lg bg-black/40 border border-gray-800">
            {template.icon}
          </div>
          
          <div>
            {template.popularity === 'high' && (
              <Badge className="bg-cyberpunk-purple hover:bg-cyberpunk-purple">
                Popular
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center mb-2">
          <h3 className="text-xl font-medium mr-2">{template.name}</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="bg-gray-900 border-gray-700 text-white max-w-xs">
                <p>This template provides a starting point for building a {template.name.toLowerCase()} agent.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
        
        <Badge variant="outline" className="bg-black/40 text-muted-foreground border-gray-700">
          {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
        </Badge>
      </div>
      <CardFooter className="border-t border-gray-800 p-6 pt-4">
        <Button 
          className="w-full bg-electric-blue hover:bg-electric-blue/90 shadow-neon-blue"
          onClick={handleUseTemplate}
        >
          Use Template <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
