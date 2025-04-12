
import { Bot, Wallet, WrenchIcon, CircuitBoard, Users, ShieldCheck, Database, Search, HelpCircle } from 'lucide-react';

export interface WorkflowNode {
  id: string;
  label: string;
  type: 'start' | 'end' | 'agent' | 'tool' | 'condition';
  position: { x: number, y: number };
  icon?: string;
  color?: string;
}

export interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  type?: 'solid' | 'dashed';
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
    id: 'customer-support',
    name: 'Customer Support Flow',
    description: 'A flow that routes customer inquiries to appropriate departments',
    category: 'customer-service',
    nodes: [
      { id: 'start', label: '__start__', type: 'start', position: { x: 350, y: 50 } },
      { id: 'initial_support', label: 'Frontline Support', type: 'agent', position: { x: 350, y: 150 }, icon: 'support' },
      { id: 'billing_support', label: 'Billing Support', type: 'agent', position: { x: 550, y: 300 }, icon: 'billing', color: '#f59e0b' },
      { id: 'technical_support', label: 'Technical Support', type: 'agent', position: { x: 150, y: 300 }, icon: 'technical', color: '#8b5cf6' },
      { id: 'handle_refund', label: 'Refund Process', type: 'tool', position: { x: 550, y: 450 }, icon: 'refund', color: '#f97316' },
      { id: 'end', label: '__end__', type: 'end', position: { x: 350, y: 550 } }
    ],
    edges: [
      { id: 'e1', from: 'start', to: 'initial_support' },
      { id: 'e2', from: 'initial_support', to: 'billing_support', label: 'Billing Issue', type: 'dashed' },
      { id: 'e3', from: 'initial_support', to: 'technical_support', label: 'Technical Issue', type: 'dashed' },
      { id: 'e4', from: 'initial_support', to: 'end', label: 'General Question', type: 'dashed' },
      { id: 'e5', from: 'billing_support', to: 'handle_refund', label: 'Refund', type: 'dashed' },
      { id: 'e6', from: 'billing_support', to: 'end', label: 'No Refund', type: 'dashed' },
      { id: 'e7', from: 'technical_support', to: 'end' },
      { id: 'e8', from: 'handle_refund', to: 'end' }
    ],
    previewPath: ['start', 'initial_support', 'billing_support', 'handle_refund', 'end']
  },
  {
    id: 'security-operations',
    name: 'Security Operations Center',
    description: 'A workflow for handling security alerts and incidents',
    category: 'security',
    nodes: [
      { id: 'start', label: '__start__', type: 'start', position: { x: 350, y: 50 } },
      { id: 'alert_triage', label: 'Alert Triage', type: 'agent', position: { x: 350, y: 150 }, icon: 'security', color: '#ef4444' },
      { id: 'threat_analyzer', label: 'Threat Analysis', type: 'agent', position: { x: 550, y: 250 }, icon: 'search', color: '#6366f1' },
      { id: 'incident_responder', label: 'Incident Response', type: 'agent', position: { x: 150, y: 250 }, icon: 'security', color: '#ef4444' },
      { id: 'escalation', label: 'Human Escalation', type: 'tool', position: { x: 150, y: 400 }, icon: 'team', color: '#3b82f6' },
      { id: 'end', label: '__end__', type: 'end', position: { x: 350, y: 500 } }
    ],
    edges: [
      { id: 'e1', from: 'start', to: 'alert_triage' },
      { id: 'e2', from: 'alert_triage', to: 'threat_analyzer', label: 'Need Analysis', type: 'dashed' },
      { id: 'e3', from: 'alert_triage', to: 'incident_responder', label: 'Critical Alert', type: 'dashed' },
      { id: 'e4', from: 'alert_triage', to: 'end', label: 'False Positive', type: 'dashed' },
      { id: 'e5', from: 'threat_analyzer', to: 'incident_responder', label: 'Threat Confirmed', type: 'dashed' },
      { id: 'e6', from: 'threat_analyzer', to: 'end', label: 'No Threat', type: 'dashed' },
      { id: 'e7', from: 'incident_responder', to: 'escalation', label: 'Human Required', type: 'dashed' },
      { id: 'e8', from: 'incident_responder', to: 'end', label: 'Resolved', type: 'dashed' },
      { id: 'e9', from: 'escalation', to: 'end' }
    ],
    previewPath: ['start', 'alert_triage', 'incident_responder', 'escalation', 'end']
  },
  {
    id: 'healthcare-assistant',
    name: 'Healthcare Assistant',
    description: 'A medical information and appointment scheduling workflow',
    category: 'healthcare',
    nodes: [
      { id: 'start', label: '__start__', type: 'start', position: { x: 350, y: 50 } },
      { id: 'initial_triage', label: 'Initial Triage', type: 'agent', position: { x: 350, y: 150 }, icon: 'support', color: '#10b981' },
      { id: 'symptom_checker', label: 'Symptom Checker', type: 'agent', position: { x: 150, y: 250 }, icon: 'search', color: '#6366f1' },
      { id: 'appointment_scheduler', label: 'Appointment Scheduling', type: 'agent', position: { x: 550, y: 250 }, icon: 'team', color: '#3b82f6' },
      { id: 'urgent_care', label: 'Urgent Care', type: 'agent', position: { x: 150, y: 400 }, icon: 'support', color: '#ef4444' },
      { id: 'knowledge_base', label: 'Medical Knowledge', type: 'tool', position: { x: 350, y: 350 }, icon: 'knowledge', color: '#06b6d4' },
      { id: 'end', label: '__end__', type: 'end', position: { x: 350, y: 500 } }
    ],
    edges: [
      { id: 'e1', from: 'start', to: 'initial_triage' },
      { id: 'e2', from: 'initial_triage', to: 'symptom_checker', label: 'Medical Question', type: 'dashed' },
      { id: 'e3', from: 'initial_triage', to: 'appointment_scheduler', label: 'Schedule Appointment', type: 'dashed' },
      { id: 'e4', from: 'initial_triage', to: 'end', label: 'General Question', type: 'dashed' },
      { id: 'e5', from: 'symptom_checker', to: 'knowledge_base', type: 'dashed' },
      { id: 'e6', from: 'knowledge_base', to: 'symptom_checker', type: 'dashed' },
      { id: 'e7', from: 'symptom_checker', to: 'urgent_care', label: 'Urgent Symptoms', type: 'dashed' },
      { id: 'e8', from: 'symptom_checker', to: 'appointment_scheduler', label: 'Need Appointment', type: 'dashed' },
      { id: 'e9', from: 'symptom_checker', to: 'end', label: 'Advice Provided', type: 'dashed' },
      { id: 'e10', from: 'appointment_scheduler', to: 'end' },
      { id: 'e11', from: 'urgent_care', to: 'end' }
    ],
    previewPath: ['start', 'initial_triage', 'symptom_checker', 'knowledge_base', 'symptom_checker', 'appointment_scheduler', 'end']
  }
];

export const getWorkflowById = (id: string): WorkflowTemplate | undefined => {
  return workflowTemplates.find(template => template.id === id);
};
