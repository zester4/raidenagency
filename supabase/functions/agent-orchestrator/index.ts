
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Create supabase client with service role
const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Agent Orchestrator - manages complex agent workflows and team-based agents
 * This function serves as the coordinator for multi-agent systems
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { workflow_id, message, conversation_id, model_params = {} } = await req.json();

    // We need the user's identity for authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Create a client with the user's JWT
    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    // Verify the JWT and get the user's ID
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized", details: userError }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Get the workflow
    const { data: workflow, error: workflowError } = await supabase
      .from("agent_workflows")
      .select("*")
      .eq("id", workflow_id)
      .single();

    if (workflowError || !workflow) {
      return new Response(JSON.stringify({ error: "Workflow not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Verify the workflow belongs to the user
    if (workflow.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Unauthorized to access this workflow" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Handle conversation tracking
    let conversationRecord;
    if (conversation_id) {
      // Verify the conversation exists and belongs to this user
      const { data: existingConversation, error: convError } = await supabase
        .from("agent_conversations")
        .select("*")
        .eq("id", conversation_id)
        .eq("user_id", user.id)
        .eq("workflow_id", workflow_id)
        .single();

      if (convError || !existingConversation) {
        return new Response(JSON.stringify({ error: "Conversation not found or unauthorized" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      
      conversationRecord = existingConversation;
    } else {
      // Create a new conversation
      const { data: newConversation, error: createError } = await supabase
        .from("agent_conversations")
        .insert({
          user_id: user.id,
          workflow_id: workflow_id,
          thread_id: crypto.randomUUID(),
          status: "active",
          agent_id: null // No specific agent for workflow-based conversations
        })
        .select()
        .single();

      if (createError) {
        return new Response(JSON.stringify({ error: "Failed to create conversation" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      
      conversationRecord = newConversation;

      // Initialize state
      await supabase
        .from("agent_state")
        .insert({
          conversation_id: conversationRecord.id,
          state_data: {
            history: [],
            current_agent: "initial_support",
            next_agent: null,
            context: {},
            human_required: false
          }
        });
    }

    // Save the user message
    await supabase
      .from("agent_conversation_messages")
      .insert({
        conversation_id: conversationRecord.id,
        role: "user",
        content: message
      });

    // Get conversation history
    const { data: messageHistory, error: historyError } = await supabase
      .from("agent_conversation_messages")
      .select("*")
      .eq("conversation_id", conversationRecord.id)
      .order("created_at", { ascending: true });

    if (historyError) {
      return new Response(JSON.stringify({ error: "Failed to retrieve conversation history" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Get current state
    const { data: stateData, error: stateError } = await supabase
      .from("agent_state")
      .select("*")
      .eq("conversation_id", conversationRecord.id)
      .single();

    if (stateError) {
      return new Response(JSON.stringify({ error: "Failed to retrieve conversation state" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Extract the workflow structure
    const nodes = workflow.nodes;
    const edges = workflow.edges;
    const workflowType = workflow.workflow_type;

    // Process message through the workflow
    // This is a simplified implementation - in a real system this would leverage LangGraph
    // to properly process the state graph with sophisticated routing
    
    // Determine current agent node
    const currentAgentId = stateData.state_data.current_agent || "initial_support";
    
    // Find the agent node in the workflow
    const currentNode = nodes.find(node => node.id === currentAgentId);
    if (!currentNode) {
      return new Response(JSON.stringify({ error: "Current agent node not found in workflow" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Check for human intervention requirement
    if (stateData.state_data.human_required) {
      // This would typically return a message indicating human intervention is needed
      // and would wait for approval before proceeding
      return new Response(JSON.stringify({ 
        human_required: true,
        conversation_id: conversationRecord.id,
        message: "This operation requires human approval. Please wait for a team member to review your request."
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Simulate agent processing (in a real implementation, this would call the appropriate LLM)
    // For more advanced implementations, we'd use the workflow edges to determine routing
    let agentResponse = "This is a simulated response from the orchestrator. In a production system, this would process through the defined workflow and return a response from the appropriate agent.";
    let nextAgentId = null;
    
    // Simple routing simulation based on keywords in the message
    if (message.toLowerCase().includes("billing") || message.toLowerCase().includes("payment") || message.toLowerCase().includes("refund")) {
      agentResponse = "I'll connect you with our billing department to address your payment or refund concerns.";
      nextAgentId = "billing_support";
    } else if (message.toLowerCase().includes("technical") || message.toLowerCase().includes("broken") || message.toLowerCase().includes("help")) {
      agentResponse = "Let me transfer you to our technical support team to help resolve your issue.";
      nextAgentId = "technical_support";
    }

    // Save the agent's response
    const { data: savedResponse, error: responseError } = await supabase
      .from("agent_conversation_messages")
      .insert({
        conversation_id: conversationRecord.id,
        agent_id: null, // No specific agent in orchestrator
        role: "assistant",
        content: agentResponse
      })
      .select()
      .single();

    if (responseError) {
      return new Response(JSON.stringify({ error: "Failed to save agent response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Update the conversation state
    await supabase
      .from("agent_state")
      .update({
        state_data: {
          ...stateData.state_data,
          current_agent: nextAgentId || currentAgentId,
          next_agent: null
        },
        updated_at: new Date().toISOString()
      })
      .eq("conversation_id", conversationRecord.id);

    // Record analytics
    await supabase
      .from("agent_analytics")
      .insert({
        user_id: user.id,
        workflow_id: workflow_id,
        conversation_id: conversationRecord.id,
        event_type: "message_processed",
        data: {
          token_count: agentResponse.length / 4, // Rough estimate
          current_node: currentAgentId,
          next_node: nextAgentId
        }
      });

    return new Response(JSON.stringify({
      response: agentResponse,
      conversation_id: conversationRecord.id,
      next_agent: nextAgentId,
      workflow_state: {
        current_node: currentAgentId,
        next_node: nextAgentId
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in agent-orchestrator function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
