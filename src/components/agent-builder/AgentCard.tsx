
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  PlayCircle, 
  PauseCircle,
  Edit,
  Copy, 
  Download,
  Trash2,
  ExternalLink
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AgentProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'online' | 'offline' | 'error';
  lastUpdated: string;
  category: string;
}

interface AgentCardProps {
  agent: AgentProps;
  viewMode: 'grid' | 'list';
}

export const AgentCard = ({ agent, viewMode }: AgentCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  if (viewMode === 'list') {
    return (
      <Card className="border-gray-800 bg-black/20 backdrop-blur-sm hover:border-electric-blue/50 transition-all">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-4">
              {agent.icon}
            </div>
            <div>
              <h3 className="text-lg font-medium">{agent.name}</h3>
              <p className="text-sm text-muted-foreground">{agent.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant="outline" 
              className={`
                ${agent.status === 'online' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : ''} 
                ${agent.status === 'offline' ? 'bg-gray-500/10 text-gray-400 border-gray-500/30' : ''}
                ${agent.status === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/30' : ''}
              `}
            >
              {agent.status === 'online' ? 'Online' : agent.status === 'offline' ? 'Offline' : 'Error'}
            </Badge>
            
            <div className="text-xs text-muted-foreground">
              Updated {formatDate(agent.lastUpdated)}
            </div>
            
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                {agent.status === 'online' ? 
                  <PauseCircle className="h-4 w-4 text-gray-400" /> : 
                  <PlayCircle className="h-4 w-4 text-gray-400" />
                }
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit className="h-4 w-4 text-gray-400" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-900 border-gray-700 text-white">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                    <Copy className="mr-2 h-4 w-4" /> Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                    <ExternalLink className="mr-2 h-4 w-4" /> Export
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 cursor-pointer">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-gray-800 bg-black/20 backdrop-blur-sm hover:border-electric-blue/50 transition-all">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-lg bg-black/40 border border-gray-800">
            {agent.icon}
          </div>
          
          <Badge 
            variant="outline" 
            className={`
              ${agent.status === 'online' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : ''} 
              ${agent.status === 'offline' ? 'bg-gray-500/10 text-gray-400 border-gray-500/30' : ''}
              ${agent.status === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/30' : ''}
            `}
          >
            {agent.status === 'online' ? 'Online' : agent.status === 'offline' ? 'Offline' : 'Error'}
          </Badge>
        </div>
        
        <h3 className="text-xl font-medium mb-2">{agent.name}</h3>
        <p className="text-sm text-muted-foreground mb-6">{agent.description}</p>
        
        <div className="text-xs text-muted-foreground mb-4">
          Last updated: {formatDate(agent.lastUpdated)}
        </div>
      </div>
      <CardFooter className="flex justify-between p-6 pt-2 border-t border-gray-800">
        <Button variant="outline" className="flex-1 mr-2">Edit</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-900 border-gray-700 text-white">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
              <Copy className="mr-2 h-4 w-4" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
              <Download className="mr-2 h-4 w-4" /> Export
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 cursor-pointer">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};
