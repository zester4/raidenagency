
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserAgent } from '@/lib/agent-service';

export interface WorkflowVisualizerProps {
  agent: UserAgent;
}

const AgentWorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({ agent }) => {
  return (
    <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-4 mb-6">
            <div className="bg-gray-900 border-electric-blue/30 border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">User Query</h3>
              <p className="text-gray-400">→ Agent receives query from user</p>
            </div>
            
            {agent.vector_store?.enabled && (
              <div className="flex items-center justify-center">
                <div className="h-10 w-px bg-gray-800"></div>
              </div>
            )}
            
            {agent.vector_store?.enabled && (
              <div className="bg-gray-900 border-cyberpunk-purple/30 border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Knowledge Retrieval</h3>
                <p className="text-gray-400">→ Agent searches relevant documents in the vector store</p>
                <p className="text-gray-400">→ {agent.vector_store.document_count || 0} documents in collection "{agent.vector_store.collection_name}"</p>
              </div>
            )}
            
            <div className="flex items-center justify-center">
              <div className="h-10 w-px bg-gray-800"></div>
            </div>
            
            <div className="bg-gray-900 border-holographic-teal/30 border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Prompt Generation</h3>
              <p className="text-gray-400">→ System prompt prepares the model's behavior</p>
              {agent.vector_store?.enabled && (
                <p className="text-gray-400">→ Retrieved knowledge is added to the context</p>
              )}
            </div>
            
            <div className="flex items-center justify-center">
              <div className="h-10 w-px bg-gray-800"></div>
            </div>
            
            <div className="bg-gray-900 border-electric-blue/30 border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Model Processing</h3>
              <p className="text-gray-400">→ {agent.model_config?.model || "Default model"} processes the input</p>
              <p className="text-gray-400">→ Temperature: {agent.model_config?.temperature || 0.7}, Max tokens: {agent.model_config?.max_tokens || "Default"}</p>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="h-10 w-px bg-gray-800"></div>
            </div>
            
            <div className="bg-gray-900 border-cyberpunk-purple/30 border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Response Generation</h3>
              <p className="text-gray-400">→ Agent generates response based on processed data</p>
              <p className="text-gray-400">→ Response is formatted and returned to the user</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentWorkflowVisualizer;
