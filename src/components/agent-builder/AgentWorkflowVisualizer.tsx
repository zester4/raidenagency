
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { WorkflowNode, WorkflowEdge } from '@/lib/agent-workflow-types';

interface AgentWorkflowVisualizerProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  highlightedPath?: string[];
  className?: string;
}

const AgentWorkflowVisualizer: React.FC<AgentWorkflowVisualizerProps> = ({
  nodes,
  edges,
  highlightedPath = [],
  className = ''
}) => {
  // This is a simplified placeholder that renders a visualization
  // In a real implementation, you would use a library like ReactFlow or d3.js
  
  return (
    <div className={`bg-black/30 border border-gray-800 rounded-lg p-4 relative flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="text-sm text-gray-400 mb-4">Workflow Visualization</div>
        
        <div className="relative w-full h-[200px] border border-gray-700 rounded-lg p-4">
          {/* Simplified visualization */}
          <div className="flex flex-col items-center justify-center h-full">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-2 rounded-lg bg-electric-blue/20 border border-electric-blue/30">
                Start
              </div>
              <ArrowRight className="text-electric-blue" />
              <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                Router Agent
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              <div className="flex flex-col items-center">
                <ArrowRight className="text-gray-500 rotate-90 mb-2" />
                <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30">
                  Support Agent
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <ArrowRight className={`${highlightedPath.includes('e3') ? 'text-electric-blue' : 'text-gray-500'} rotate-90 mb-2`} />
                <div className={`p-2 rounded-lg ${highlightedPath.includes('e3') ? 'bg-electric-blue/20 border border-electric-blue/50' : 'bg-amber-500/20 border border-amber-500/30'}`}>
                  Technical Agent
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <ArrowRight className="text-gray-500 rotate-90 mb-2" />
                <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/30">
                  Billing Agent
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-4">
              <ArrowRight className={`${highlightedPath.includes('e6') ? 'text-electric-blue' : 'text-gray-500'} rotate-90`} />
              <div className={`p-2 rounded-lg ${highlightedPath.includes('e6') ? 'bg-electric-blue/20 border border-electric-blue/50' : 'bg-cyan-500/20 border border-cyan-500/30'}`}>
                Knowledge Base
              </div>
              <ArrowRight className={`${highlightedPath.includes('e8') ? 'text-electric-blue' : 'text-gray-500'}`} />
              <div className="p-2 rounded-lg bg-gray-500/20 border border-gray-500/30">
                End
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          Interactive workflow visualization (simplified view)
        </div>
      </div>
    </div>
  );
};

export default AgentWorkflowVisualizer;
