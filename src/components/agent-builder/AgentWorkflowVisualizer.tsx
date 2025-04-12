
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Wallet, 
  WrenchIcon, 
  CircuitBoard, 
  Users, 
  RefreshCcw,
  ChevronRight, 
  ShieldCheck,
  Phone,
  HelpCircle,
  Database,
  Search
} from 'lucide-react';

interface Node {
  id: string;
  label: string;
  type: 'start' | 'end' | 'agent' | 'tool' | 'condition';
  position: { x: number, y: number };
  icon?: React.ReactNode;
  color?: string;
}

interface Edge {
  id: string;
  from: string;
  to: string;
  label?: string;
  type?: 'solid' | 'dashed';
}

interface WorkflowVisualizerProps {
  nodes: Node[];
  edges: Edge[];
  highlightedPath?: string[];
  className?: string;
}

const nodeIcons: Record<string, React.ReactNode> = {
  'start': <CircuitBoard className="h-5 w-5 text-gray-400" />,
  'end': <RefreshCcw className="h-5 w-5 text-gray-400" />,
  'agent': <Bot className="h-5 w-5 text-electric-blue" />,
  'support': <HelpCircle className="h-5 w-5 text-green-500" />,
  'billing': <Wallet className="h-5 w-5 text-amber-500" />,
  'technical': <WrenchIcon className="h-5 w-5 text-purple-500" />,
  'security': <ShieldCheck className="h-5 w-5 text-red-500" />,
  'team': <Users className="h-5 w-5 text-blue-500" />,
  'knowledge': <Database className="h-5 w-5 text-cyan-500" />,
  'search': <Search className="h-5 w-5 text-indigo-500" />,
  'refund': <Wallet className="h-5 w-5 text-orange-500" />
};

export const AgentWorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({ 
  nodes, 
  edges, 
  highlightedPath = [],
  className = ""
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Calculate SVG dimensions based on node positions
  const calculateDimensions = () => {
    const padding = 50;
    const maxX = Math.max(...nodes.map(node => node.position.x)) + 120 + padding;
    const maxY = Math.max(...nodes.map(node => node.position.y)) + 60 + padding;
    return { width: maxX, height: maxY };
  };
  
  const dimensions = calculateDimensions();
  
  // Draw curved path between nodes
  const drawPath = (from: Node, to: Node, type: 'solid' | 'dashed' = 'solid') => {
    const fromX = from.position.x + 60; // Half of node width
    const fromY = from.position.y + 30; // Half of node height
    const toX = to.position.x + 60;
    const toY = to.position.y + 30;
    
    // Calculate control points for curve
    const dx = Math.abs(toX - fromX);
    const dy = Math.abs(toY - fromY);
    const curve = Math.min(dx * 0.5, 100); // Curve amount
    
    // Start point
    let path = `M ${fromX},${fromY}`;
    
    // If nodes are roughly on the same level, use a curved path
    if (dy < 80) {
      path += ` C ${fromX + curve},${fromY} ${toX - curve},${toY} ${toX},${toY}`;
    } 
    // If the target is below, draw a path that goes down and then across
    else if (toY > fromY) {
      path += ` Q ${fromX + curve},${fromY + curve} ${(fromX + toX) / 2},${(fromY + toY) / 2}`;
      path += ` Q ${toX - curve},${toY - curve} ${toX},${toY}`;
    } 
    // If the target is above, draw a path that goes up and then across
    else {
      path += ` Q ${fromX + curve},${fromY - curve} ${(fromX + toX) / 2},${(fromY + toY) / 2}`;
      path += ` Q ${toX - curve},${toY + curve} ${toX},${toY}`;
    }
    
    return path;
  };
  
  // Determine if an edge is part of the highlighted path
  const isHighlighted = (from: string, to: string) => {
    if (highlightedPath.length === 0) return false;
    
    for (let i = 0; i < highlightedPath.length - 1; i++) {
      if (highlightedPath[i] === from && highlightedPath[i + 1] === to) {
        return true;
      }
    }
    
    return false;
  };
  
  // Get node by ID
  const getNodeById = (id: string): Node | undefined => {
    return nodes.find(node => node.id === id);
  };
  
  const renderEdgeArrow = (path: string, isHighlighted: boolean) => {
    return (
      <marker
        id={`arrowhead-${isHighlighted ? 'highlighted' : 'normal'}`}
        markerWidth="10"
        markerHeight="7"
        refX="10"
        refY="3.5"
        orient="auto"
      >
        <polygon 
          points="0 0, 10 3.5, 0 7" 
          fill={isHighlighted ? '#0091FF' : '#4B5563'} 
        />
      </marker>
    );
  };
  
  return (
    <Card className={`bg-black/20 border-gray-800 p-4 ${className}`}>
      <CardContent className="p-0">
        <div className="overflow-auto">
          <svg 
            ref={svgRef}
            width={dimensions.width} 
            height={dimensions.height} 
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            className="workflow-visualizer"
          >
            <defs>
              {renderEdgeArrow("", false)}
              {renderEdgeArrow("", true)}
            </defs>
            
            {/* Draw edges */}
            {edges.map(edge => {
              const fromNode = getNodeById(edge.from);
              const toNode = getNodeById(edge.to);
              
              if (!fromNode || !toNode) return null;
              
              const path = drawPath(fromNode, toNode, edge.type);
              const edgeIsHighlighted = isHighlighted(edge.from, edge.to);
              
              return (
                <g key={edge.id}>
                  <path
                    d={path}
                    fill="none"
                    stroke={edgeIsHighlighted ? '#0091FF' : '#4B5563'}
                    strokeWidth={edgeIsHighlighted ? 2 : 1.5}
                    strokeDasharray={edge.type === 'dashed' ? '5,5' : '0'}
                    markerEnd={`url(#arrowhead-${edgeIsHighlighted ? 'highlighted' : 'normal'})`}
                  />
                  
                  {edge.label && (
                    <text
                      x={(fromNode.position.x + toNode.position.x) / 2 + 10}
                      y={(fromNode.position.y + toNode.position.y) / 2 - 10}
                      fill={edgeIsHighlighted ? '#0091FF' : '#9CA3AF'}
                      fontSize="12"
                      textAnchor="middle"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
            
            {/* Draw nodes */}
            {nodes.map(node => {
              const isHighlightedNode = highlightedPath.includes(node.id);
              const nodeType = node.type === 'agent' ? node.id.split('_')[0] : node.type;
              const icon = node.icon || nodeIcons[nodeType] || nodeIcons[node.type];
              
              // Special styling for start and end nodes
              if (node.type === 'start' || node.type === 'end') {
                return (
                  <g key={node.id} transform={`translate(${node.position.x}, ${node.position.y})`}>
                    <rect
                      width="120"
                      height="40"
                      rx="20"
                      ry="20"
                      fill={isHighlightedNode ? 'rgba(0, 145, 255, 0.2)' : 'rgba(42, 42, 42, 0.6)'}
                      stroke={isHighlightedNode ? '#0091FF' : '#4B5563'}
                      strokeWidth="1.5"
                    />
                    <text
                      x="60"
                      y="25"
                      fill="#E5E7EB"
                      fontSize="14"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              }
              
              return (
                <g key={node.id} transform={`translate(${node.position.x}, ${node.position.y})`}>
                  <rect
                    width="120"
                    height="60"
                    rx="8"
                    ry="8"
                    fill={isHighlightedNode ? 'rgba(0, 145, 255, 0.15)' : 'rgba(0, 0, 0, 0.4)'}
                    stroke={isHighlightedNode ? '#0091FF' : (node.color || '#4B5563')}
                    strokeWidth="1.5"
                  />
                  <foreignObject width="120" height="60">
                    <div
                      className="w-full h-full flex flex-col items-center justify-center px-2"
                    >
                      <div className="flex items-center justify-center mb-1">
                        {icon}
                      </div>
                      <div className="text-center text-xs text-gray-200 font-medium truncate w-full">
                        {node.label}
                      </div>
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentWorkflowVisualizer;
