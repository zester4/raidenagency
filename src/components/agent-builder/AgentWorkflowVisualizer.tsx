
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserAgent } from '@/lib/agent-service';
import { WorkflowNode, WorkflowEdge } from '@/lib/agent-workflow-templates';

export interface WorkflowVisualizerProps {
  agent?: UserAgent;
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
  highlightedPath?: string[];
  className?: string;
}

const AgentWorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({ 
  agent,
  nodes = [], 
  edges = [],
  highlightedPath = [],
  className = "" 
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Clear previous visualization
    const container = canvasRef.current;
    container.innerHTML = '';
    
    // If we have an agent but no nodes, show the agent workflow
    if (agent && nodes.length === 0) {
      renderAgentBasedWorkflow(container, agent);
      return;
    }
    
    // If we have nodes, render the node-based workflow
    if (nodes.length > 0) {
      renderNodeBasedWorkflow(container, nodes, edges, highlightedPath);
    }
  }, [agent, nodes, edges, highlightedPath]);
  
  // Renders a simple workflow based on agent configuration
  const renderAgentBasedWorkflow = (container: HTMLDivElement, agent: UserAgent) => {
    const workflowDiv = document.createElement('div');
    workflowDiv.className = 'flex flex-col gap-4 mb-6';
    
    // User Query Box
    const userQueryDiv = document.createElement('div');
    userQueryDiv.className = 'bg-gray-900 border-electric-blue/30 border rounded-lg p-4';
    userQueryDiv.innerHTML = `
      <h3 class="text-lg font-medium mb-2">User Query</h3>
      <p class="text-gray-400">→ Agent receives query from user</p>
    `;
    workflowDiv.appendChild(userQueryDiv);
    
    // Connector
    const connectorDiv = document.createElement('div');
    connectorDiv.className = 'flex items-center justify-center';
    connectorDiv.innerHTML = '<div class="h-10 w-px bg-gray-800"></div>';
    workflowDiv.appendChild(connectorDiv);
    
    // Knowledge Retrieval (if vector store enabled)
    if (agent.vector_store?.enabled) {
      const knowledgeDiv = document.createElement('div');
      knowledgeDiv.className = 'bg-gray-900 border-cyberpunk-purple/30 border rounded-lg p-4';
      knowledgeDiv.innerHTML = `
        <h3 class="text-lg font-medium mb-2">Knowledge Retrieval</h3>
        <p class="text-gray-400">→ Agent searches relevant documents in the vector store</p>
        <p class="text-gray-400">→ ${agent.vector_store.document_count || 0} documents in collection "${agent.vector_store.collection_name}"</p>
      `;
      workflowDiv.appendChild(knowledgeDiv);
      
      // Connector
      const connectorDiv2 = document.createElement('div');
      connectorDiv2.className = 'flex items-center justify-center';
      connectorDiv2.innerHTML = '<div class="h-10 w-px bg-gray-800"></div>';
      workflowDiv.appendChild(connectorDiv2);
    }
    
    // Prompt Generation
    const promptDiv = document.createElement('div');
    promptDiv.className = 'bg-gray-900 border-holographic-teal/30 border rounded-lg p-4';
    promptDiv.innerHTML = `
      <h3 class="text-lg font-medium mb-2">Prompt Generation</h3>
      <p class="text-gray-400">→ System prompt prepares the model's behavior</p>
      ${agent.vector_store?.enabled ? 
        '<p class="text-gray-400">→ Retrieved knowledge is added to the context</p>' : ''}
    `;
    workflowDiv.appendChild(promptDiv);
    
    // Connector
    const connectorDiv3 = document.createElement('div');
    connectorDiv3.className = 'flex items-center justify-center';
    connectorDiv3.innerHTML = '<div class="h-10 w-px bg-gray-800"></div>';
    workflowDiv.appendChild(connectorDiv3);
    
    // Model Processing
    const modelDiv = document.createElement('div');
    modelDiv.className = 'bg-gray-900 border-electric-blue/30 border rounded-lg p-4';
    modelDiv.innerHTML = `
      <h3 class="text-lg font-medium mb-2">Model Processing</h3>
      <p class="text-gray-400">→ ${agent.model_config?.model || "Default model"} processes the input</p>
      <p class="text-gray-400">→ Temperature: ${agent.model_config?.temperature || 0.7}, Max tokens: ${agent.model_config?.max_tokens || "Default"}</p>
    `;
    workflowDiv.appendChild(modelDiv);
    
    // Connector
    const connectorDiv4 = document.createElement('div');
    connectorDiv4.className = 'flex items-center justify-center';
    connectorDiv4.innerHTML = '<div class="h-10 w-px bg-gray-800"></div>';
    workflowDiv.appendChild(connectorDiv4);
    
    // Response Generation
    const responseDiv = document.createElement('div');
    responseDiv.className = 'bg-gray-900 border-cyberpunk-purple/30 border rounded-lg p-4';
    responseDiv.innerHTML = `
      <h3 class="text-lg font-medium mb-2">Response Generation</h3>
      <p class="text-gray-400">→ Agent generates response based on processed data</p>
      <p class="text-gray-400">→ Response is formatted and returned to the user</p>
    `;
    workflowDiv.appendChild(responseDiv);
    
    container.appendChild(workflowDiv);
  };
  
  // Renders a node-based workflow with SVG
  const renderNodeBasedWorkflow = (
    container: HTMLDivElement, 
    nodes: WorkflowNode[], 
    edges: WorkflowEdge[],
    highlightedPath: string[] = []
  ) => {
    // Create an SVG element for the workflow visualization
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '500');
    svg.setAttribute('viewBox', '0 0 800 600');
    svg.classList.add('workflow-graph');
    
    // Define node dimensions and positioning helpers
    const nodeWidth = 150;
    const nodeHeight = 60;
    const horizontalSpacing = 200;
    const verticalSpacing = 120;
    
    // Set up constants for colors and styles
    const COLORS = {
      start: '#FFE4B5', // Pale orange
      end: '#D1FFD1',   // Pale green
      agent: '#FFD1E0',  // Pale pink
      tool: '#D1E0FF',   // Pale blue
      condition: '#E0D1FF' // Pale purple
    };
    
    const BORDER_COLORS = {
      start: '#FFA500',
      end: '#32CD32',
      agent: '#FF69B4',
      tool: '#4169E1',
      condition: '#8A2BE2'
    };
    
    // Calculate node positions - simple approach for now
    const positionedNodes = positionNodes(nodes, horizontalSpacing, verticalSpacing);
    
    // Draw edges first (so nodes appear on top)
    edges.forEach(edge => {
      const sourceNode = positionedNodes.find(n => n.id === edge.from);
      const targetNode = positionedNodes.find(n => n.id === edge.to);
      
      if (!sourceNode || !targetNode) return;
      
      // Edge attributes
      const isHighlighted = highlightedPath.includes(edge.from) && highlightedPath.includes(edge.to);
      const isDashed = edge.type === 'dashed';
      const sourceX = sourceNode.position.x + nodeWidth / 2;
      const sourceY = sourceNode.position.y + nodeHeight;
      const targetX = targetNode.position.x + nodeWidth / 2;
      const targetY = targetNode.position.y;
      
      // Draw the edge
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const dStr = `M ${sourceX} ${sourceY} C ${sourceX} ${sourceY + 40}, ${targetX} ${targetY - 40}, ${targetX} ${targetY}`;
      path.setAttribute('d', dStr);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', isHighlighted ? '#FF6B6B' : '#888');
      path.setAttribute('stroke-width', isHighlighted ? '2' : '1.5');
      
      if (isDashed) {
        path.setAttribute('stroke-dasharray', '6,3');
      }
      
      svg.appendChild(path);
      
      // Add arrowhead
      const arrowhead = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      
      // Calculate arrow direction
      const dx = targetX - sourceX;
      const dy = targetY - sourceY;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      
      // Position just before the target node
      const arrowX = targetX;
      const arrowY = targetY - 10;
      
      arrowhead.setAttribute('points', '0,-5 10,0 0,5');
      arrowhead.setAttribute('fill', isHighlighted ? '#FF6B6B' : '#888');
      arrowhead.setAttribute('transform', `translate(${arrowX}, ${arrowY}) rotate(${angle + 90})`);
      svg.appendChild(arrowhead);
      
      // Add edge label if present
      if (edge.label) {
        const midX = (sourceX + targetX) / 2;
        const midY = (sourceY + targetY) / 2;
        
        // Offset label to avoid overlapping with the path
        const offsetX = (targetX > sourceX) ? 20 : -20;
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', String(midX + offsetX));
        text.setAttribute('y', String(midY - 10));
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#CCC');
        text.setAttribute('font-size', '12px');
        text.textContent = edge.label;
        svg.appendChild(text);
      }
    });
    
    // Draw nodes
    positionedNodes.forEach(node => {
      const isHighlighted = highlightedPath.includes(node.id);
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      // Create node rectangle
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', String(node.position.x));
      rect.setAttribute('y', String(node.position.y));
      rect.setAttribute('width', String(nodeWidth));
      rect.setAttribute('height', String(nodeHeight));
      rect.setAttribute('rx', '15'); // Rounded corners
      rect.setAttribute('ry', '15');
      rect.setAttribute('fill', COLORS[node.type] || '#EEEEEE');
      rect.setAttribute('stroke', isHighlighted ? '#FF6B6B' : (BORDER_COLORS[node.type] || '#888'));
      rect.setAttribute('stroke-width', isHighlighted ? '3' : '1.5');
      group.appendChild(rect);
      
      // Create node label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', String(node.position.x + nodeWidth / 2));
      text.setAttribute('y', String(node.position.y + nodeHeight / 2));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('alignment-baseline', 'middle');
      text.setAttribute('fill', '#333');
      text.setAttribute('font-weight', isHighlighted ? 'bold' : 'normal');
      
      // Display the proper label or hide system nodes
      let displayLabel = node.label;
      if (displayLabel === '__start__') displayLabel = '_start_';
      if (displayLabel === '__end__') displayLabel = '_end_';
      
      text.textContent = displayLabel;
      group.appendChild(text);
      
      svg.appendChild(group);
    });
    
    container.appendChild(svg);
  };
  
  // Helper function to position nodes for visualization
  const positionNodes = (nodes: WorkflowNode[], hSpacing: number, vSpacing: number) => {
    // Make a deep copy to avoid mutating the original nodes
    const nodesCopy = JSON.parse(JSON.stringify(nodes)) as WorkflowNode[];
    
    // Find start and end nodes
    const startNode = nodesCopy.find(node => node.id === 'start' || node.label === '__start__');
    const endNode = nodesCopy.find(node => node.id === 'end' || node.label === '__end__');
    
    // Position start node at the top center
    if (startNode) {
      startNode.position = { x: 325, y: 50 };
    }
    
    // Position end node at the bottom center
    if (endNode) {
      endNode.position = { x: 325, y: 450 };
    }
    
    // Filter out start and end nodes for level positioning
    const workNodes = nodesCopy.filter(node => 
      node.id !== 'start' && 
      node.label !== '__start__' && 
      node.id !== 'end' && 
      node.label !== '__end__'
    );
    
    // Calculate levels for simplicity and set default positions
    const totalLevels = Math.min(3, workNodes.length);
    const nodesPerLevel = Math.ceil(workNodes.length / totalLevels);
    
    for (let i = 0; i < workNodes.length; i++) {
      const level = Math.floor(i / nodesPerLevel) + 1;
      const positionInLevel = i % nodesPerLevel;
      const levelWidth = Math.min(nodesPerLevel, workNodes.length - (level - 1) * nodesPerLevel);
      
      // Calculate x position to center nodes in each level
      const totalLevelWidth = (levelWidth - 1) * hSpacing;
      const startX = 150 + (650 - totalLevelWidth) / 2;
      
      workNodes[i].position = {
        x: startX + positionInLevel * hSpacing,
        y: 120 + level * vSpacing
      };
    }
    
    return nodesCopy;
  };

  return (
    <Card className={`border-gray-800 bg-black/20 backdrop-blur-sm ${className}`}>
      <CardContent className="pt-6">
        <div className="mx-auto" ref={canvasRef} />
        
        {/* Legend for workflow */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {nodes.length > 0 && (
            <>
              <Badge variant="outline" className="bg-black/40 border-gray-600">
                Solid line: Direct flow
              </Badge>
              <Badge variant="outline" className="bg-black/40 border-gray-600">
                Dashed line: Conditional flow
              </Badge>
              {highlightedPath.length > 0 && (
                <Badge variant="outline" className="bg-black/40 border-red-600">
                  Red path: Sample execution
                </Badge>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentWorkflowVisualizer;
