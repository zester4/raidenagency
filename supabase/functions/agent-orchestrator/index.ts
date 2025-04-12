
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Create supabase client with service role
const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

/**
 * Agent Orchestrator function - responsible for managing agent workflows, states and conversations
 * This is the core engine that powers the multi-agent systems, inspired by LangGraph
 */
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { method } = await req.json();

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

    // Process the request based on the method
    let result = {};
    switch (method) {
      case "initializeConversation":
        result = await initializeConversation(req, supabase, user.id);
        break;
      case "processAgentMessage":
        result = await processAgentMessage(req, supabase, user.id);
        break;
      case "getConversationState":
        result = await getConversationState(req, supabase, user.id);
        break;
      case "updateConversationState":
        result = await updateConversationState(req, supabase, user.id);
        break;
      case "routeToNextAgent":
        result = await routeToNextAgent(req, supabase, user.id);
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid method" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in agent-orchestrator:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

/**
 * Initialize a new conversation with an agent or agent workflow
 */
async function initializeConversation(req, supabase, userId) {
  const { agentId, workflowId, initialMessage } = await req.json();

  // Create a new conversation
  const { data: conversation, error } = await supabase
    .from("agent_conversations")
    .insert({
      user_id: userId,
      agent_id: agentId,
      workflow_id: workflowId || null,
      thread_id: crypto.randomUUID(),
      status: "active"
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create conversation: ${error.message}`);
  }

  // Initialize conversation state
  await supabase
    .from("agent_state")
    .insert({
      conversation_id: conversation.id,
      state_data: {
        current_node: workflowId ? "start" : null,
        history: [],
        context: {}
      }
    });

  // Add the initial message if provided
  if (initialMessage) {
    await supabase
      .from("agent_conversation_messages")
      .insert({
        conversation_id: conversation.id,
        role: "user",
        content: initialMessage
      });
  }

  // Record analytics
  await supabase
    .from("agent_analytics")
    .insert({
      user_id: userId,
      agent_id: agentId,
      conversation_id: conversation.id,
      event_type: "conversation_started",
      data: { workflow_id: workflowId }
    });

  return { conversation };
}

/**
 * Process a message using the appropriate agent
 */
async function processAgentMessage(req, supabase, userId) {
  const { conversationId, message, agentId = null } = await req.json();

  // Verify the conversation belongs to this user
  const { data: conversation, error: conversationError } = await supabase
    .from("agent_conversations")
    .select("*, user_agents(*)")
    .eq("id", conversationId)
    .eq("user_id", userId)
    .single();

  if (conversationError || !conversation) {
    throw new Error("Conversation not found or unauthorized");
  }

  // Add the user message to the conversation
  await supabase
    .from("agent_conversation_messages")
    .insert({
      conversation_id: conversationId,
      role: "user",
      content: message
    });

  // Determine which agent should process the message
  const targetAgentId = agentId || conversation.agent_id;

  // Get the agent's configuration
  const { data: agent, error: agentError } = await supabase
    .from("user_agents")
    .select("*")
    .eq("id", targetAgentId)
    .single();

  if (agentError || !agent) {
    throw new Error("Agent not found");
  }

  // Get conversation history
  const { data: messageHistory, error: historyError } = await supabase
    .from("agent_conversation_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (historyError) {
    throw new Error("Failed to retrieve conversation history");
  }

  // Format history for the model
  const formattedHistory = messageHistory.map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  // Get conversation state
  const { data: stateData, error: stateError } = await supabase
    .from("agent_state")
    .select("*")
    .eq("conversation_id", conversationId)
    .single();

  if (stateError) {
    throw new Error("Failed to retrieve conversation state");
  }

  const state = stateData.state_data;

  // Simulate agent processing (in a real implementation, this would call the LLM)
  const response = "This is a simulated agent response. In a real implementation, this would use the agent's configuration to generate a response from an LLM.";

  // Save the agent's response
  const { data: savedResponse, error: responseError } = await supabase
    .from("agent_conversation_messages")
    .insert({
      conversation_id: conversationId,
      agent_id: targetAgentId,
      role: "assistant",
      content: response
    })
    .select()
    .single();

  if (responseError) {
    throw new Error("Failed to save agent response");
  }

  // Record analytics
  await supabase
    .from("agent_analytics")
    .insert({
      user_id: userId,
      agent_id: targetAgentId,
      conversation_id: conversationId,
      event_type: "message_processed",
      data: {
        message_id: savedResponse.id,
        token_count: response.length / 4 // Rough estimate
      }
    });

  return {
    response: savedResponse,
    state
  };
}

/**
 * Get the current state of a conversation
 */
async function getConversationState(req, supabase, userId) {
  const { conversationId } = await req.json();

  // Verify the conversation belongs to this user
  const { data: conversation, error: conversationError } = await supabase
    .from("agent_conversations")
    .select("*")
    .eq("id", conversationId)
    .eq("user_id", userId)
    .single();

  if (conversationError || !conversation) {
    throw new Error("Conversation not found or unauthorized");
  }

  // Get the conversation state
  const { data: state, error: stateError } = await supabase
    .from("agent_state")
    .select("*")
    .eq("conversation_id", conversationId)
    .single();

  if (stateError) {
    throw new Error("Failed to retrieve conversation state");
  }

  return { state: state.state_data };
}

/**
 * Update the state of a conversation
 */
async function updateConversationState(req, supabase, userId) {
  const { conversationId, stateData } = await req.json();

  // Verify the conversation belongs to this user
  const { data: conversation, error: conversationError } = await supabase
    .from("agent_conversations")
    .select("*")
    .eq("id", conversationId)
    .eq("user_id", userId)
    .single();

  if (conversationError || !conversation) {
    throw new Error("Conversation not found or unauthorized");
  }

  // Update the conversation state
  const { data: updatedState, error: updateError } = await supabase
    .from("agent_state")
    .update({
      state_data: stateData
    })
    .eq("conversation_id", conversationId)
    .select()
    .single();

  if (updateError) {
    throw new Error("Failed to update conversation state");
  }

  return { state: updatedState.state_data };
}

/**
 * Route a conversation to the next agent in a workflow
 */
async function routeToNextAgent(req, supabase, userId) {
  const { conversationId, currentNode, nextNode, reason } = await req.json();

  // Verify the conversation belongs to this user
  const { data: conversation, error: conversationError } = await supabase
    .from("agent_conversations")
    .select("*, agent_workflows(*)")
    .eq("id", conversationId)
    .eq("user_id", userId)
    .single();

  if (conversationError || !conversation) {
    throw new Error("Conversation not found or unauthorized");
  }

  if (!conversation.workflow_id) {
    throw new Error("Conversation is not associated with a workflow");
  }

  // Get the workflow
  const { data: workflow, error: workflowError } = await supabase
    .from("agent_workflows")
    .select("*")
    .eq("id", conversation.workflow_id)
    .single();

  if (workflowError || !workflow) {
    throw new Error("Workflow not found");
  }

  // Get the current state
  const { data: state, error: stateError } = await supabase
    .from("agent_state")
    .select("*")
    .eq("conversation_id", conversationId)
    .single();

  if (stateError) {
    throw new Error("Failed to retrieve conversation state");
  }

  // Update the state with the new node
  const updatedState = {
    ...state.state_data,
    current_node: nextNode,
    path: [...(state.state_data.path || []), {
      from: currentNode,
      to: nextNode,
      reason
    }]
  };

  // Save the updated state
  await supabase
    .from("agent_state")
    .update({
      state_data: updatedState
    })
    .eq("conversation_id", conversationId);

  // Add a system message indicating the routing
  await supabase
    .from("agent_conversation_messages")
    .insert({
      conversation_id: conversationId,
      role: "system",
      content: `Routing from ${currentNode} to ${nextNode}: ${reason}`
    });

  // Record analytics
  await supabase
    .from("agent_analytics")
    .insert({
      user_id: userId,
      conversation_id: conversationId,
      event_type: "agent_routing",
      data: {
        from_node: currentNode,
        to_node: nextNode,
        reason
      }
    });

  return {
    state: updatedState,
    nextNode
  };
}
