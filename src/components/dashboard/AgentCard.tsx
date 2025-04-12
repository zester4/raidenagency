
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';

interface AgentCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  type: 'agent' | 'template';
  status?: 'online' | 'offline' | 'error';
  usagePercent?: number;
}

const AgentCard = ({ 
  name, 
  description, 
  icon, 
  type = 'agent',
  status = 'offline',
  usagePercent = 0
}: AgentCardProps) => {
  const isTemplate = type === 'template';
  
  return (
    <Card className="border-gray-800 bg-black/20 backdrop-blur-sm hover:border-electric-blue/50 transition-all">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-lg bg-black/40 border border-gray-800">
            {icon}
          </div>
          
          {isTemplate ? (
            <Badge variant="outline" className="bg-cyber-purple/10 text-cyber-purple border-cyber-purple/30">
              Template
            </Badge>
          ) : (
            <Badge 
              variant="outline" 
              className={`
                ${status === 'online' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : ''} 
                ${status === 'offline' ? 'bg-gray-500/10 text-gray-400 border-gray-500/30' : ''}
                ${status === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/30' : ''}
              `}
            >
              {status === 'online' ? 'Online' : status === 'offline' ? 'Offline' : 'Error'}
            </Badge>
          )}
        </div>
        
        <h3 className="text-xl font-medium mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground mb-6">{description}</p>
        
        {!isTemplate && usagePercent > 0 && (
          <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden mb-1">
            <div 
              className="h-full bg-electric-blue" 
              style={{ width: `${usagePercent}%` }}
            ></div>
          </div>
        )}
      </div>
      <CardFooter className="flex justify-between p-6 pt-2">
        {isTemplate ? (
          <Button className="w-full bg-electric-blue hover:bg-electric-blue/90 shadow-neon-blue">
            <PlusCircle className="mr-2 h-4 w-4" /> Use Template
          </Button>
        ) : (
          <>
            <Button variant="outline" className="flex-1 mr-2">Configure</Button>
            <Button className="flex-1 bg-electric-blue hover:bg-electric-blue/90">Manage</Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default AgentCard;
