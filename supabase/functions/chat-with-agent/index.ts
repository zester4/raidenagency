
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ryujklxvochfkuokgduz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5dWprbHh2b2NoZmt1b2tnZHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1MTg5ODYsImV4cCI6MjA1ODA5NDk4Nn0.yDhGifYsg7TONq0wKYcabBF6_FaWbPfBdxL4v2nYfNo";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY);
    const { agentId, message, conversationId } = await req.json();

    if (!agentId || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing chat request for agent ${agentId} with message: ${message}`);

    // Check if agent exists and get details
    const { data: agent, error: agentError } = await supabase
      .from("user_agents")
      .select("*")
      .eq("id", agentId)
      .single();

    if (agentError || !agent) {
      console.error("Error fetching agent:", agentError);
      return new Response(
        JSON.stringify({ error: "Agent not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Simulated agent response for now
    // In production, this would connect to an actual LLM API
    const botResponse = `This is a simulated response from the ${agent.name} agent to your message: "${message}"`;
    
    // Log the conversation
    const timestamp = new Date().toISOString();
    const { error: logError } = await supabase
      .from("agent_conversations")
      .insert({
        agent_id: agentId,
        conversation_id: conversationId || crypto.randomUUID(),
        user_message: message,
        agent_response: botResponse,
        timestamp: timestamp
      });

    if (logError) {
      console.error("Error logging conversation:", logError);
    }

    return new Response(
      JSON.stringify({ 
        agentId,
        response: botResponse,
        timestamp,
        conversationId: conversationId || crypto.randomUUID()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing chat request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
