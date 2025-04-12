
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ryujklxvochfkuokgduz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5dWprbHh2b2NoZmt1b2tnZHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1MTg5ODYsImV4cCI6MjA1ODA5NDk4Nn0.yDhGifYsg7TONq0wKYcabBF6_FaWbPfBdxL4v2nYfNo";
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  agentId: string;
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  stream?: boolean;
  tools?: any[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request
    const { agentId, messages, model, temperature = 0.7, stream = false, tools = [] } = await req.json() as ChatRequest;

    if (!agentId || !messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid request parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get agent details
    const { data: agent, error: agentError } = await supabase
      .from("user_agents")
      .select("*")
      .eq("id", agentId)
      .single();

    if (agentError || !agent) {
      return new Response(
        JSON.stringify({ error: "Agent not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if agent is accessible to the user (either owner or public)
    if (agent.user_id !== user.id && agent.status !== "online") {
      return new Response(
        JSON.stringify({ error: "You don't have access to this agent" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get agent tools
    const { data: agentTools } = await supabase
      .from("agent_tools")
      .select("*")
      .eq("agent_id", agentId);

    // Get agent knowledge bases
    const { data: knowledgeBases } = await supabase
      .from("agent_knowledge_bases")
      .select("*")
      .eq("agent_id", agentId);

    // Prepare system message
    let systemMessage = agent.system_prompt || "You are a helpful AI assistant.";
    
    // Add tools info to system message if any
    if (agentTools && agentTools.length > 0) {
      systemMessage += "\n\nYou have access to the following tools:";
      agentTools.forEach(tool => {
        systemMessage += `\n- ${tool.name}: ${tool.description || "No description"}`;
      });
    }
    
    // Add knowledge bases info to system message if any
    if (knowledgeBases && knowledgeBases.length > 0) {
      systemMessage += "\n\nYou have access to the following knowledge bases:";
      knowledgeBases.forEach(kb => {
        systemMessage += `\n- ${kb.name}: ${kb.description || "No description"}`;
      });
    }

    // Prepend system message if not already included
    const hasSystemMessage = messages.some(m => m.role === "system");
    const fullMessages = hasSystemMessage ? messages : [
      { role: "system", content: systemMessage },
      ...messages
    ];

    // Determine which AI provider to use based on agent config or model parameter
    const modelToUse = model || agent.config?.model || "gpt-4o";
    let response;

    if (modelToUse.startsWith("gpt-")) {
      // Use OpenAI
      if (!OPENAI_API_KEY) {
        return new Response(
          JSON.stringify({ error: "OpenAI API key not configured" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: modelToUse,
          messages: fullMessages,
          temperature,
          stream,
          tools: tools.length > 0 ? tools : undefined,
        }),
      });
    } 
    else if (modelToUse.startsWith("claude-")) {
      // Use Anthropic
      if (!ANTHROPIC_API_KEY) {
        return new Response(
          JSON.stringify({ error: "Anthropic API key not configured" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Format messages for Anthropic API
      const formattedMessages = fullMessages.map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.role === "system" ? `<system>${m.content}</system>` : m.content,
      }));

      response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: modelToUse,
          messages: formattedMessages,
          temperature,
          stream,
        }),
      });
    }
    else {
      // Fallback to OpenAI
      if (!OPENAI_API_KEY) {
        return new Response(
          JSON.stringify({ error: "OpenAI API key not configured" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",  // Fallback model
          messages: fullMessages,
          temperature,
          stream,
          tools: tools.length > 0 ? tools : undefined,
        }),
      });
    }

    // Store conversation history
    const userMessage = messages[messages.length - 1];
    await supabase.from("agent_conversations").insert({
      agent_id: agentId,
      user_id: user.id,
      messages: fullMessages,
      model: modelToUse,
      timestamp: new Date().toISOString()
    });

    // Pass through the AI provider response
    const responseHeaders = new Headers(corsHeaders);
    
    // Copy the Content-Type header from the AI provider response
    const contentType = response.headers.get("Content-Type");
    if (contentType) {
      responseHeaders.set("Content-Type", contentType);
    }

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Error in chat-with-agent:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
