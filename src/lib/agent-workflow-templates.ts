
export interface WorkflowNode {
  id: string;
  label: string;
  type: 'start' | 'end' | 'agent' | 'tool';
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
  type: 'solid' | 'dashed';
  label?: string;
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

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'customer-support-flow',
    name: 'Customer Support Flow',
    description: 'Workflow for handling customer support queries',
    category: 'support',
    nodes: [
      { id: 'start', label: '__start__', type: 'start', position: { x: 250, y: 50 } },
      { id: 'router', label: 'Query Router', type: 'agent', position: { x: 250, y: 150 } },
      { id: 'support', label: 'Support Agent', type: 'agent', position: { x: 100, y: 250 } },
      { id: 'technical', label: 'Technical Agent', type: 'agent', position: { x: 250, y: 250 } },
      { id: 'billing', label: 'Billing Agent', type: 'agent', position: { x: 400, y: 250 } },
      { id: 'knowledge', label: 'Knowledge Base', type: 'tool', position: { x: 250, y: 350 } },
      { id: 'end', label: '__end__', type: 'end', position: { x: 250, y: 450 } }
    ],
    edges: [
      { id: 'e1', from: 'start', to: 'router', type: 'solid' },
      { id: 'e2', from: 'router', to: 'support', type: 'solid', label: 'General Support' },
      { id: 'e3', from: 'router', to: 'technical', type: 'solid', label: 'Technical Issue' },
      { id: 'e4', from: 'router', to: 'billing', type: 'solid', label: 'Billing Question' },
      { id: 'e5', from: 'support', to: 'knowledge', type: 'dashed' },
      { id: 'e6', from: 'technical', to: 'knowledge', type: 'dashed' },
      { id: 'e7', from: 'billing', to: 'knowledge', type: 'dashed' },
      { id: 'e8', from: 'knowledge', to: 'end', type: 'solid' }
    ],
    previewPath: ['e1', 'e3', 'e6', 'e8']
  },
  {
    id: 'sales-workflow',
    name: 'Sales Pipeline Workflow',
    description: 'Workflow for handling sales inquiries and qualification',
    category: 'sales',
    nodes: [
      { id: 'start', label: '__start__', type: 'start', position: { x: 250, y: 50 } },
      { id: 'qualification', label: 'Lead Qualification', type: 'agent', position: { x: 250, y: 150 } },
      { id: 'product', label: 'Product Expert', type: 'agent', position: { x: 100, y: 250 } },
      { id: 'pricing', label: 'Pricing Specialist', type: 'agent', position: { x: 400, y: 250 } },
      { id: 'crm', label: 'CRM Integration', type: 'tool', position: { x: 250, y: 350 } },
      { id: 'end', label: '__end__', type: 'end', position: { x: 250, y: 450 } }
    ],
    edges: [
      { id: 'e1', from: 'start', to: 'qualification', type: 'solid' },
      { id: 'e2', from: 'qualification', to: 'product', type: 'solid', label: 'Product Questions' },
      { id: 'e3', from: 'qualification', to: 'pricing', type: 'solid', label: 'Pricing Questions' },
      { id: 'e4', from: 'product', to: 'crm', type: 'dashed' },
      { id: 'e5', from: 'pricing', to: 'crm', type: 'dashed' },
      { id: 'e6', from: 'crm', to: 'end', type: 'solid' }
    ],
    previewPath: ['e1', 'e2', 'e4', 'e6']
  }
];

export const getWorkflowTemplateById = (id: string): WorkflowTemplate | undefined => {
  return workflowTemplates.find(template => template.id === id);
};
