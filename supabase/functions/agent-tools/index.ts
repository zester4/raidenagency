
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

// Mock data for available tools
const availableTools = [
  {
    id: "search-web",
    name: "Web Search",
    description: "Search the internet for information",
    icon: "search",
    config_schema: {
      type: "object",
      properties: {
        search_engine: {
          type: "string",
          enum: ["google", "bing", "duckduckgo"],
          default: "google",
          description: "Search engine to use"
        },
        max_results: {
          type: "number",
          default: 5,
          description: "Maximum number of results to return"
        }
      },
      required: ["search_engine"]
    }
  },
  {
    id: "database-connector",
    name: "Database Connector",
    description: "Connect to databases to retrieve or store information",
    icon: "database",
    config_schema: {
      type: "object",
      properties: {
        database_type: {
          type: "string",
          enum: ["mysql", "postgresql", "mongodb"],
          default: "postgresql",
          description: "Type of database to connect to"
        },
        connection_string: {
          type: "string",
          description: "Connection string for the database"
        }
      },
      required: ["database_type", "connection_string"]
    }
  },
  {
    id: "code-executor",
    name: "Code Executor",
    description: "Execute code snippets in various languages",
    icon: "code",
    config_schema: {
      type: "object",
      properties: {
        language: {
          type: "string",
          enum: ["python", "javascript", "bash"],
          default: "python",
          description: "Programming language to execute"
        },
        timeout_seconds: {
          type: "number",
          default: 10,
          description: "Maximum execution time in seconds"
        },
        allow_network: {
          type: "boolean",
          default: false,
          description: "Allow network access during execution"
        }
      },
      required: ["language"]
    }
  },
  {
    id: "email-sender",
    name: "Email Sender",
    description: "Send emails to users or external contacts",
    icon: "mail",
    config_schema: {
      type: "object",
      properties: {
        smtp_server: {
          type: "string",
          description: "SMTP server address"
        },
        smtp_port: {
          type: "number",
          default: 587,
          description: "SMTP server port"
        },
        smtp_username: {
          type: "string",
          description: "SMTP username"
        },
        smtp_password: {
          type: "string",
          description: "SMTP password"
        },
        from_email: {
          type: "string",
          description: "Sender email address"
        }
      },
      required: ["smtp_server", "smtp_username", "smtp_password", "from_email"]
    }
  },
  {
    id: "calendar-api",
    name: "Calendar API",
    description: "Interact with calendar services to schedule events",
    icon: "calendar",
    config_schema: {
      type: "object",
      properties: {
        service: {
          type: "string",
          enum: ["google", "microsoft", "apple"],
          default: "google",
          description: "Calendar service to use"
        },
        api_key: {
          type: "string",
          description: "API key for the calendar service"
        },
        timezone: {
          type: "string",
          default: "UTC",
          description: "Default timezone for events"
        }
      },
      required: ["service", "api_key"]
    }
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY);
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // Serve available tools
    if (pathParts.length === 1 && pathParts[0] === "available") {
      return new Response(
        JSON.stringify(availableTools),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get agent's tools
    if (pathParts.length === 2 && pathParts[0] === "agent") {
      const agentId = pathParts[1];
      
      // For POST requests, add a new tool
      if (req.method === "POST") {
        const { name, description, tool_type, config } = await req.json();
        
        // Add the tool to the database
        const { data: newTool, error } = await supabase
          .from("agent_tools")
          .insert({
            agent_id: agentId,
            name,
            description,
            tool_type,
            config
          })
          .select()
          .single();
        
        if (error) {
          console.error("Error adding tool:", error);
          return new Response(
            JSON.stringify({ error: "Failed to add tool" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        return new Response(
          JSON.stringify(newTool),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // For GET requests, return the agent's tools
      const { data: tools, error } = await supabase
        .from("agent_tools")
        .select("*")
        .eq("agent_id", agentId);
      
      if (error) {
        console.error("Error fetching tools:", error);
        return new Response(
          JSON.stringify({ error: "Failed to fetch tools" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify(tools),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Delete a tool
    if (pathParts.length === 1 && req.method === "DELETE") {
      const toolId = pathParts[0];
      
      const { error } = await supabase
        .from("agent_tools")
        .delete()
        .eq("id", toolId);
      
      if (error) {
        console.error("Error deleting tool:", error);
        return new Response(
          JSON.stringify({ error: "Failed to delete tool" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: true, message: "Tool deleted successfully" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // If no route matches
    return new Response(
      JSON.stringify({ error: "Route not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing tool request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
