
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Create supabase client with service role
const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

/**
 * Chat with Agent - handles direct conversations with individual agents
 * This is a simpler version than the orchestrator, for single-agent interactions
 */
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agent_id, message, conversation_id, model_params = {} } = await req.json();

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

    // Get the agent
    const { data: agent, error: agentError } = await supabase
      .from("user_agents")
      .select("*")
      .eq("id", agent_id)
      .single();

    if (agentError || !agent) {
      return new Response(JSON.stringify({ error: "Agent not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Verify the agent belongs to the user
    if (agent.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Unauthorized to access this agent" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Handle conversation tracking
    let conversationRecord;
    if (conversation_id) {
      // Verify the conversation exists and belongs to this user/agent
      const { data: existingConversation, error: convError } = await supabase
        .from("agent_conversations")
        .select("*")
        .eq("id", conversation_id)
        .eq("user_id", user.id)
        .eq("agent_id", agent_id)
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
          agent_id: agent_id,
          thread_id: crypto.randomUUID(),
          status: "active"
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
            context: {}
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

    // Format history for the model
    const formattedHistory = messageHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Simulate agent processing (in a real implementation, this would call the LLM)
    const mockResponse = "This is a simulated agent response. In a real implementation, this would use the agent's configuration to generate a response from an LLM.";

    // Save the agent's response
    const { data: savedResponse, error: responseError } = await supabase
      .from("agent_conversation_messages")
      .insert({
        conversation_id: conversationRecord.id,
        agent_id: agent_id,
        role: "assistant",
        content: mockResponse
      })
      .select()
      .single();

    if (responseError) {
      return new Response(JSON.stringify({ error: "Failed to save agent response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Record analytics
    await supabase
      .from("agent_analytics")
      .insert({
        user_id: user.id,
        agent_id: agent_id,
        conversation_id: conversationRecord.id,
        event_type: "message_processed",
        data: {
          token_count: mockResponse.length / 4 // Rough estimate
        }
      });

    return new Response(JSON.stringify({
      response: mockResponse,
      conversation_id: conversationRecord.id
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in chat-with-agent function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
