
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ryujklxvochfkuokgduz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5dWprbHh2b2NoZmt1b2tnZHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1MTg5ODYsImV4cCI6MjA1ODA5NDk4Nn0.yDhGifYsg7TONq0wKYcabBF6_FaWbPfBdxL4v2nYfNo";

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

    const url = new URL(req.url);
    const path = url.pathname.split('/').filter(Boolean);
    
    // Handle GET /agent-tools/available
    if (req.method === "GET" && path[1] === "available") {
      const availableTools = [
        {
          id: "web-search",
          name: "Web Search",
          description: "Search the web for current information",
          type: "search",
          icon: "search",
          config_schema: {
            type: "object",
            properties: {
              search_engine: {
                type: "string",
                enum: ["google", "bing", "duckduckgo"],
                default: "google"
              },
              max_results: {
                type: "number",
                default: 5
              }
            }
          }
        },
        {
          id: "database-query",
          name: "Database Query",
          description: "Query databases using SQL",
          type: "database",
          icon: "database",
          config_schema: {
            type: "object",
            properties: {
              connection_string: {
                type: "string"
              },
              database_type: {
                type: "string",
                enum: ["postgres", "mysql", "sqlserver"]
              }
            },
            required: ["connection_string", "database_type"]
          }
        },
        {
          id: "api-call",
          name: "API Call",
          description: "Make calls to external APIs",
          type: "api",
          icon: "code",
          config_schema: {
            type: "object",
            properties: {
              base_url: {
                type: "string"
              },
              auth_type: {
                type: "string",
                enum: ["none", "basic", "bearer", "api_key"],
                default: "none"
              },
              headers: {
                type: "object"
              }
            },
            required: ["base_url"]
          }
        },
        {
          id: "email-sender",
          name: "Email Sender",
          description: "Send emails to users",
          type: "communication",
          icon: "mail",
          config_schema: {
            type: "object",
            properties: {
              smtp_server: {
                type: "string"
              },
              sender_email: {
                type: "string"
              }
            },
            required: ["smtp_server", "sender_email"]
          }
        },
        {
          id: "calendar",
          name: "Calendar Integration",
          description: "Check availability and schedule appointments",
          type: "productivity",
          icon: "calendar",
          config_schema: {
            type: "object",
            properties: {
              calendar_type: {
                type: "string",
                enum: ["google", "outlook", "apple"]
              },
              timezone: {
                type: "string",
                default: "UTC"
              }
            },
            required: ["calendar_type"]
          }
        },
        {
          id: "file-processor",
          name: "File Processor",
          description: "Process and extract data from files",
          type: "file",
          icon: "file",
          config_schema: {
            type: "object",
            properties: {
              supported_formats: {
                type: "array",
                items: {
                  type: "string"
                },
                default: ["pdf", "docx", "txt"]
              },
              extract_images: {
                type: "boolean",
                default: false
              }
            }
          }
        },
        {
          id: "human-approval",
          name: "Human-in-the-Loop",
          description: "Request human approval before taking actions",
          type: "workflow",
          icon: "user-check",
          config_schema: {
            type: "object",
            properties: {
              approval_method: {
                type: "string",
                enum: ["email", "slack", "app"],
                default: "app"
              },
              timeout_minutes: {
                type: "number",
                default: 60
              }
            }
          }
        }
      ];
      
      return new Response(
        JSON.stringify(availableTools),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Handle GET /agent-tools/agent/{agentId}
    if (req.method === "GET" && path[1] === "agent" && path[2]) {
      const agentId = path[2];
      
      // Check if agent belongs to user
      const { data: agent, error: agentError } = await supabase
        .from("user_agents")
        .select("*")
        .eq("id", agentId)
        .eq("user_id", user.id)
        .single();
      
      if (agentError || !agent) {
        return new Response(
          JSON.stringify({ error: "Agent not found or access denied" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Get tools for this agent
      const { data: tools, error: toolsError } = await supabase
        .from("agent_tools")
        .select("*")
        .eq("agent_id", agentId);
      
      if (toolsError) {
        return new Response(
          JSON.stringify({ error: "Failed to fetch agent tools" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify(tools || []),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Handle POST /agent-tools/agent/{agentId}
    if (req.method === "POST" && path[1] === "agent" && path[2]) {
      const agentId = path[2];
      
      // Check if agent belongs to user
      const { data: agent, error: agentError } = await supabase
        .from("user_agents")
        .select("*")
        .eq("id", agentId)
        .eq("user_id", user.id)
        .single();
      
      if (agentError || !agent) {
        return new Response(
          JSON.stringify({ error: "Agent not found or access denied" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Parse request body
      const { name, description, tool_type, config } = await req.json();
      
      if (!name || !tool_type) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Insert new tool
      const { data: newTool, error: insertError } = await supabase
        .from("agent_tools")
        .insert({
          agent_id: agentId,
          name,
          description,
          tool_type,
          config: config || {}
        })
        .select()
        .single();
      
      if (insertError) {
        return new Response(
          JSON.stringify({ error: "Failed to create tool" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify(newTool),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Handle PUT /agent-tools/{toolId}
    if (req.method === "PUT" && path[1] && !path[2]) {
      const toolId = path[1];
      
      // Get the tool first to check ownership
      const { data: tool, error: toolError } = await supabase
        .from("agent_tools")
        .select("*, user_agents!inner(*)")
        .eq("id", toolId)
        .single();
      
      if (toolError || !tool) {
        return new Response(
          JSON.stringify({ error: "Tool not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Check if user owns the agent that owns this tool
      if (tool.user_agents.user_id !== user.id) {
        return new Response(
          JSON.stringify({ error: "Access denied" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Parse request body
      const { name, description, config } = await req.json();
      const updates: Record<string, any> = {};
      
      if (name !== undefined) updates.name = name;
      if (description !== undefined) updates.description = description;
      if (config !== undefined) updates.config = config;
      
      // Update tool
      const { data: updatedTool, error: updateError } = await supabase
        .from("agent_tools")
        .update(updates)
        .eq("id", toolId)
        .select()
        .single();
      
      if (updateError) {
        return new Response(
          JSON.stringify({ error: "Failed to update tool" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify(updatedTool),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Handle DELETE /agent-tools/{toolId}
    if (req.method === "DELETE" && path[1] && !path[2]) {
      const toolId = path[1];
      
      // Get the tool first to check ownership
      const { data: tool, error: toolError } = await supabase
        .from("agent_tools")
        .select("*, user_agents!inner(*)")
        .eq("id", toolId)
        .single();
      
      if (toolError || !tool) {
        return new Response(
          JSON.stringify({ error: "Tool not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Check if user owns the agent that owns this tool
      if (tool.user_agents.user_id !== user.id) {
        return new Response(
          JSON.stringify({ error: "Access denied" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Delete tool
      const { error: deleteError } = await supabase
        .from("agent_tools")
        .delete()
        .eq("id", toolId);
      
      if (deleteError) {
        return new Response(
          JSON.stringify({ error: "Failed to delete tool" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in agent-tools function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
