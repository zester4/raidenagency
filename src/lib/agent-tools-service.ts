
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/types/database.types";
import { toast } from "sonner";
import { AgentTool, AgentKnowledgeBase, AgentDocument } from "@/hooks/useAgents";

// Agent tools service
export const toolsService = {
  async getAllForAgent(agentId: string): Promise<AgentTool[]> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // First check if agent exists and user has access
      const { data: agent, error: agentError } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', agentId)
        .eq('user_id', user.id)
        .single();
      
      if (agentError || !agent) throw new Error('Agent not found or you do not have access');

      // Get tools for the agent
      const { data, error } = await supabase
        .from('agent_tools')
        .select('*')
        .eq('agent_id', agentId);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching agent tools:', error);
      toast.error('Failed to load agent tools');
      return [];
    }
  },
  
  async getById(id: string): Promise<AgentTool | null> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the tool
      const { data: tool, error } = await supabase
        .from('agent_tools')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!tool) return null;
      
      // Check if user has access to the agent
      const { data: agent, error: agentError } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', tool.agent_id)
        .eq('user_id', user.id)
        .single();
      
      if (agentError || !agent) throw new Error('You do not have access to this tool');

      return tool;
    } catch (error) {
      console.error('Error fetching agent tool:', error);
      toast.error('Failed to load agent tool');
      return null;
    }
  },
  
  async create(tool: Omit<AgentTool, 'id'>): Promise<AgentTool | null> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user has access to the agent
      const { data: agent, error: agentError } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', tool.agent_id)
        .eq('user_id', user.id)
        .single();
      
      if (agentError || !agent) throw new Error('Agent not found or you do not have access');

      // Create the tool
      const { data: newTool, error } = await supabase
        .from('agent_tools')
        .insert(tool)
        .select()
        .single();
      
      if (error) throw error;
      if (!newTool) throw new Error('Failed to create tool');
      
      toast.success('Tool added successfully');
      return newTool;
    } catch (error) {
      console.error('Error creating agent tool:', error);
      toast.error('Failed to create agent tool');
      return null;
    }
  },
  
  async update(id: string, updates: Partial<AgentTool>): Promise<AgentTool | null> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the tool
      const { data: tool, error: toolError } = await supabase
        .from('agent_tools')
        .select('*')
        .eq('id', id)
        .single();
      
      if (toolError || !tool) throw new Error('Tool not found');
      
      // Check if user has access to the agent
      const { data: agent, error: agentError } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', tool.agent_id)
        .eq('user_id', user.id)
        .single();
      
      if (agentError || !agent) throw new Error('You do not have access to this tool');

      // Update the tool
      const { data: updatedTool, error } = await supabase
        .from('agent_tools')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!updatedTool) throw new Error('Failed to update tool');
      
      toast.success('Tool updated successfully');
      return updatedTool;
    } catch (error) {
      console.error('Error updating agent tool:', error);
      toast.error('Failed to update agent tool');
      return null;
    }
  },
  
  async delete(id: string): Promise<boolean> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the tool
      const { data: tool, error: toolError } = await supabase
        .from('agent_tools')
        .select('*')
        .eq('id', id)
        .single();
      
      if (toolError || !tool) throw new Error('Tool not found');
      
      // Check if user has access to the agent
      const { data: agent, error: agentError } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', tool.agent_id)
        .eq('user_id', user.id)
        .single();
      
      if (agentError || !agent) throw new Error('You do not have access to this tool');

      // Delete the tool
      const { error } = await supabase
        .from('agent_tools')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Tool deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting agent tool:', error);
      toast.error('Failed to delete agent tool');
      return false;
    }
  }
};

// Agent knowledge base service
export const knowledgeBaseService = {
  async getAllForAgent(agentId: string): Promise<AgentKnowledgeBase[]> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // First check if agent exists and user has access
      const { data: agent, error: agentError } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', agentId)
        .eq('user_id', user.id)
        .single();
      
      if (agentError || !agent) throw new Error('Agent not found or you do not have access');

      // Get knowledge bases for the agent
      const { data, error } = await supabase
        .from('agent_knowledge_bases')
        .select('*')
        .eq('agent_id', agentId);
      
      if (error) throw error;
      
      // Get documents for each knowledge base
      const knowledgeBasesWithDocs = await Promise.all((data || []).map(async (kb) => {
        const { data: documents } = await supabase
          .from('agent_documents')
          .select('*')
          .eq('knowledge_base_id', kb.id);
        
        return {
          ...kb,
          documents: documents || []
        };
      }));
      
      return knowledgeBasesWithDocs;
    } catch (error) {
      console.error('Error fetching knowledge bases:', error);
      toast.error('Failed to load knowledge bases');
      return [];
    }
  },
  
  async getById(id: string): Promise<AgentKnowledgeBase | null> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the knowledge base
      const { data: knowledgeBase, error } = await supabase
        .from('agent_knowledge_bases')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!knowledgeBase) return null;
      
      // Check if user has access to the agent
      const { data: agent, error: agentError } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', knowledgeBase.agent_id)
        .eq('user_id', user.id)
        .single();
      
      if (agentError || !agent) throw new Error('You do not have access to this knowledge base');

      // Get documents for the knowledge base
      const { data: documents } = await supabase
        .from('agent_documents')
        .select('*')
        .eq('knowledge_base_id', id);
      
      return {
        ...knowledgeBase,
        documents: documents || []
      };
    } catch (error) {
      console.error('Error fetching knowledge base:', error);
      toast.error('Failed to load knowledge base');
      return null;
    }
  },
  
  async create(knowledgeBase: Omit<AgentKnowledgeBase, 'id'>): Promise<AgentKnowledgeBase | null> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user has access to the agent
      const { data: agent, error: agentError } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', knowledgeBase.agent_id)
        .eq('user_id', user.id)
        .single();
      
      if (agentError || !agent) throw new Error('Agent not found or you do not have access');

      // Create the knowledge base
      const { data: newKnowledgeBase, error } = await supabase
        .from('agent_knowledge_bases')
        .insert(knowledgeBase)
        .select()
        .single();
      
      if (error) throw error;
      if (!newKnowledgeBase) throw new Error('Failed to create knowledge base');
      
      toast.success('Knowledge base created successfully');
      return {
        ...newKnowledgeBase,
        documents: []
      };
    } catch (error) {
      console.error('Error creating knowledge base:', error);
      toast.error('Failed to create knowledge base');
      return null;
    }
  },
  
  async delete(id: string): Promise<boolean> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the knowledge base
      const { data: knowledgeBase, error: kbError } = await supabase
        .from('agent_knowledge_bases')
        .select('*')
        .eq('id', id)
        .single();
      
      if (kbError || !knowledgeBase) throw new Error('Knowledge base not found');
      
      // Check if user has access to the agent
      const { data: agent, error: agentError } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', knowledgeBase.agent_id)
        .eq('user_id', user.id)
        .single();
      
      if (agentError || !agent) throw new Error('You do not have access to this knowledge base');

      // Delete all documents in the knowledge base
      await supabase
        .from('agent_documents')
        .delete()
        .eq('knowledge_base_id', id);
      
      // Delete the knowledge base
      const { error } = await supabase
        .from('agent_knowledge_bases')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Knowledge base deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting knowledge base:', error);
      toast.error('Failed to delete knowledge base');
      return false;
    }
  }
};

// Agent documents service
export const documentsService = {
  async uploadDocument(knowledgeBaseId: string, file: File): Promise<AgentDocument | null> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the knowledge base
      const { data: knowledgeBase, error: kbError } = await supabase
        .from('agent_knowledge_bases')
        .select('*')
        .eq('id', knowledgeBaseId)
        .single();
      
      if (kbError || !knowledgeBase) throw new Error('Knowledge base not found');
      
      // Check if user has access to the agent
      const { data: agent, error: agentError } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', knowledgeBase.agent_id)
        .eq('user_id', user.id)
        .single();
      
      if (agentError || !agent) throw new Error('You do not have access to this knowledge base');

      // Upload the file to storage
      const filePath = `${user.id}/${knowledgeBaseId}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('agent-documents')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Create document record
      const { data: document, error } = await supabase
        .from('agent_documents')
        .insert({
          knowledge_base_id: knowledgeBaseId,
          filename: file.name,
          file_size: file.size,
          file_type: file.type,
          storage_path: filePath,
          processed: false
        })
        .select()
        .single();
      
      if (error) throw error;
      if (!document) throw new Error('Failed to create document record');
      
      // Trigger document processing (background job)
      await supabase.functions.invoke('process-document', {
        body: { 
          documentId: document.id,
          knowledgeBaseId: knowledgeBaseId
        }
      });
      
      toast.success('Document uploaded successfully');
      return document;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
      return null;
    }
  },
  
  async deleteDocument(id: string): Promise<boolean> {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the document
      const { data: document, error: docError } = await supabase
        .from('agent_documents')
        .select('*, agent_knowledge_bases(*)')
        .eq('id', id)
        .single();
      
      if (docError || !document) throw new Error('Document not found');
      
      // Check if user has access to the agent
      const { data: agent, error: agentError } = await supabase
        .from('user_agents')
        .select('*')
        .eq('id', document.agent_knowledge_bases.agent_id)
        .eq('user_id', user.id)
        .single();
      
      if (agentError || !agent) throw new Error('You do not have access to this document');

      // Delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('agent-documents')
        .remove([document.storage_path]);
      
      if (storageError) throw storageError;
      
      // Delete the document record
      const { error } = await supabase
        .from('agent_documents')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Document deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
      return false;
    }
  }
};
