
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }), 
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get the request body
    const { agentId, message, conversationId } = await req.json();
    
    if (!agentId || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the agent details
    const { data: agent, error: agentError } = await supabaseClient
      .from('user_agents')
      .select('*')
      .eq('id', agentId)
      .single();
    
    if (agentError || !agent) {
      return new Response(
        JSON.stringify({ error: "Agent not found", details: agentError }), 
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: userError }), 
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Check if user is the owner of the agent
    if (user.id !== agent.user_id) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: You don't have access to this agent" }), 
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Check if agent is online
    if (agent.status !== 'online') {
      return new Response(
        JSON.stringify({ error: "Agent is currently offline. Please activate it before chatting." }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // In a production implementation, this would:
    // 1. Retrieve conversation history if conversationId is provided
    // 2. Call the LLM with the agent's system prompt and the conversation history
    // 3. Save the new message and response to the conversation history
    // 4. Return the agent's response
    
    // For now, we'll simulate a response based on the agent type
    const simulatedResponses = {
      'customer-support': "Thank you for your inquiry. I'm here to help with any customer support issues. How can I assist you today?",
      'healthcare': "I'm your healthcare assistant. Please note that I can provide general medical information, but I'm not a substitute for professional medical advice. How can I help you?",
      'security': "I'm monitoring for security concerns. Could you provide more details about the security issue you're experiencing?",
      'analytics': "I can help analyze your data. What specific insights are you looking for?",
      'hr': "I'm your HR assistant. How can I help you with HR-related questions or processes?",
      'knowledge': "I'll search our knowledge base for relevant information. What are you looking to learn about?",
      'custom': "I'm your custom AI assistant. How can I help you today?",
    };
    
    // Get a default category if the agent's category doesn't match
    const category = agent.category || 'custom';
    const defaultResponse = "I'm your AI assistant. How can I help you today?";
    
    // Simulate a slight delay (1-2 seconds) to make it feel more natural
    const delay = Math.floor(Math.random() * 1000) + 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Return the simulated response
    return new Response(
      JSON.stringify({
        message: simulatedResponses[category] || defaultResponse,
        conversationId: conversationId || `conv-${Date.now()}`,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
