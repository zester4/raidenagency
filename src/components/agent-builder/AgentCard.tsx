import React, { useState } from 'react';
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
  ExternalLink,
  Rocket
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import AgentEditDialog from '@/components/dashboard/AgentEditDialog';
import AgentDeployDialog from '@/components/dashboard/AgentDeployDialog';
import { UserAgent } from '@/lib/agent-service';

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
  onEdit?: (agentId: string, updatedData?: Partial<UserAgent>) => Promise<void>;
  onDelete?: (agentId: string) => Promise<void>;
  onToggleStatus?: (agentId: string, currentStatus: 'online' | 'offline' | 'error') => Promise<void>;
  onDeploy?: (agentId: string, deployment: any) => Promise<void>;
  extraActions?: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }>;
}

export const AgentCard = ({ 
  agent, 
  viewMode, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  onDeploy,
  extraActions = []
}: AgentCardProps) => {
  const { toast } = useToast();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeployDialog, setShowDeployDialog] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const handleEditClick = () => {
    setShowEditDialog(true);
  };

  const handleDeployClick = () => {
    setShowDeployDialog(true);
  };

  const handleEditSave = async (updatedData: Partial<UserAgent>) => {
    if (onEdit) {
      await onEdit(agent.id, updatedData);
    } else {
      toast({
        title: "Edit operation",
        description: "This is a demo. Edit functionality will be implemented in production.",
        variant: "default",
      });
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(agent.id);
    } else {
      toast({
        title: "Delete operation",
        description: "This is a demo. Delete functionality will be implemented in production.",
        variant: "default",
      });
    }
  };

  const handleToggleStatus = async () => {
    if (onToggleStatus) {
      await onToggleStatus(agent.id, agent.status);
    } else {
      const newStatus = agent.status === 'online' ? 'offline' : 'online';
      toast({
        title: `Agent ${newStatus === 'online' ? 'activated' : 'deactivated'}`,
        description: `${agent.name} is now ${newStatus}.`,
        variant: "default",
      });
    }
  };

  const handleDeploy = async (agentId: string, deployment: any) => {
    if (onDeploy) {
      await onDeploy(agentId, deployment);
    } else {
      toast({
        title: "Deploy operation",
        description: `Deployment settings for ${agent.name} have been saved.`,
        variant: "default",
      });
    }
  };

  const handleDuplicate = () => {
    toast({
      title: "Duplicate agent",
      description: "This is a demo. Duplication functionality will be implemented in production.",
      variant: "default",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export agent",
      description: "This is a demo. Export functionality will be implemented in production.",
      variant: "default",
    });
  };

  const renderExtraActions = () => {
    if (extraActions && extraActions.length > 0) {
      return (
        <>
          {extraActions.map((action, index) => (
            <DropdownMenuItem 
              key={`extra-action-${index}`} 
              className="hover:bg-gray-800 cursor-pointer" 
              onClick={action.onClick}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator className="bg-gray-800" />
        </>
      );
    }
    return null;
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
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleToggleStatus}>
                {agent.status === 'online' ? 
                  <PauseCircle className="h-4 w-4 text-gray-400" /> : 
                  <PlayCircle className="h-4 w-4 text-gray-400" />
                }
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleEditClick}>
                <Edit className="h-4 w-4 text-gray-400" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDeployClick}>
                <Rocket className="h-4 w-4 text-gray-400" />
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
                  {renderExtraActions()}
                  <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer" onClick={handleDuplicate}>
                    <Copy className="mr-2 h-4 w-4" /> Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer" onClick={handleExport}>
                    <ExternalLink className="mr-2 h-4 w-4" /> Export
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 cursor-pointer" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Dialogs */}
        <AgentEditDialog 
          isOpen={showEditDialog} 
          onClose={() => setShowEditDialog(false)} 
          agent={agent as unknown as UserAgent}
          onSave={handleEditSave}
        />
        <AgentDeployDialog
          isOpen={showDeployDialog}
          onClose={() => setShowDeployDialog(false)}
          agent={agent as unknown as UserAgent}
          onDeploy={handleDeploy}
        />
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
        <Button variant="outline" className="flex-1 mr-2" onClick={handleEditClick}>
          <Edit className="h-4 w-4 mr-2" /> Edit
        </Button>
        <Button variant="outline" className="flex-1" onClick={handleDeployClick}>
          <Rocket className="h-4 w-4 mr-2" /> Deploy
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10 ml-2">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-900 border-gray-700 text-white">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-800" />
            {renderExtraActions()}
            <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer" onClick={handleToggleStatus}>
              {agent.status === 'online' ? 
                <PauseCircle className="mr-2 h-4 w-4" /> : 
                <PlayCircle className="mr-2 h-4 w-4" />
              }
              {agent.status === 'online' ? 'Deactivate' : 'Activate'}
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer" onClick={handleDuplicate}>
              <Copy className="mr-2 h-4 w-4" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Export
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 cursor-pointer" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
      
      {/* Dialogs */}
      <AgentEditDialog 
        isOpen={showEditDialog} 
        onClose={() => setShowEditDialog(false)} 
        agent={agent as unknown as UserAgent}
        onSave={handleEditSave}
      />
      <AgentDeployDialog
        isOpen={showDeployDialog}
        onClose={() => setShowDeployDialog(false)}
        agent={agent as unknown as UserAgent}
        onDeploy={handleDeploy}
      />
    </Card>
  );
};
