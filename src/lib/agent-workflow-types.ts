
export type WorkflowNodeType = 'agent' | 'end' | 'start' | 'tool' | 'condition';

export interface WorkflowNode {
  id: string;
  label: string;
  type: WorkflowNodeType;
  position: { x: number; y: number };
  icon?: string;
}

export interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  type: 'solid' | 'dashed';
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  previewPath?: string[];
}
