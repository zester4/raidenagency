
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ToolType {
  id: string;
  name: string;
  description: string;
  icon: string;
  config_schema: {
    type: string;
    properties: Record<string, {
      type: string;
      description?: string;
      default?: string | number | boolean;
      enum?: string[];
    }>;
    required?: string[];
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client
  const url = Deno.env.get('SUPABASE_URL') || "https://ryujklxvochfkuokgduz.supabase.co";
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || "";
  const supabase = createClient(url, key);

  // Get authorization header
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Verify JWT and get user
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Parse URL path to determine endpoint
  const url_parts = new URL(req.url);
  const path = url_parts.pathname.split('/').filter(Boolean);
  
  if (path.length === 1 && path[0] === 'available') {
    // GET /available - List available tool types 
    if (req.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Define available tool types
    const availableTools: ToolType[] = [
      {
        id: 'search-web',
        name: 'Web Search',
        description: 'Search the web for real-time information',
        icon: 'search',
        config_schema: {
          type: 'object',
          properties: {
            search_engine: {
              type: 'string',
              description: 'Search engine to use',
              enum: ['google', 'bing', 'duckduckgo'],
              default: 'google'
            },
            max_results: {
              type: 'number',
              description: 'Maximum number of results to return',
              default: 5
            }
          },
          required: ['search_engine']
        }
      },
      {
        id: 'weather',
        name: 'Weather',
        description: 'Get current weather and forecasts',
        icon: 'cloud',
        config_schema: {
          type: 'object',
          properties: {
            api_key: {
              type: 'string',
              description: 'API key for weather service'
            },
            units: {
              type: 'string',
              enum: ['metric', 'imperial'],
              default: 'metric'
            }
          },
          required: ['api_key']
        }
      },
      {
        id: 'email',
        name: 'Email',
        description: 'Send emails',
        icon: 'mail',
        config_schema: {
          type: 'object',
          properties: {
            smtp_server: {
              type: 'string',
              description: 'SMTP server address'
            },
            smtp_port: {
              type: 'number',
              description: 'SMTP port',
              default: 587
            },
            smtp_username: {
              type: 'string',
              description: 'SMTP username'
            },
            smtp_password: {
              type: 'string',
              description: 'SMTP password'
            },
            from_email: {
              type: 'string',
              description: 'Default sender email address'
            }
          },
          required: ['smtp_server', 'smtp_username', 'smtp_password', 'from_email']
        }
      },
      {
        id: 'calendar',
        name: 'Calendar',
        description: 'Manage calendar events',
        icon: 'calendar',
        config_schema: {
          type: 'object',
          properties: {
            calendar_type: {
              type: 'string',
              enum: ['google', 'outlook', 'ical'],
              default: 'google'
            },
            api_key: {
              type: 'string',
              description: 'API key or OAuth token'
            },
            calendar_id: {
              type: 'string',
              description: 'ID of the calendar to use'
            }
          },
          required: ['calendar_type', 'api_key']
        }
      }
    ];

    return new Response(
      JSON.stringify(availableTools),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } else if (path.length === 2 && path[0] === 'agent') {
    const agentId = path[1];
    
    if (req.method === 'GET') {
      // GET /agent/:id - Get all tools for an agent
      try {
        // Check if user has access to this agent
        const { data: agent, error: agentError } = await supabase
          .from('user_agents')
          .select('*')
          .eq('id', agentId)
          .eq('user_id', user.id)
          .single();
          
        if (agentError || !agent) {
          return new Response(JSON.stringify({ error: 'Agent not found or you do not have access' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // Get all tools for this agent
        const { data: tools, error } = await supabase
          .from('agent_tools')
          .select('*')
          .eq('agent_id', agentId);
          
        if (error) {
          return new Response(JSON.stringify({ error: 'Failed to fetch tools' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        return new Response(
          JSON.stringify(tools || []),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else if (req.method === 'POST') {
      // POST /agent/:id - Add a new tool to an agent
      try {
        // Parse request body
        const requestData = await req.json();
        const { name, description, tool_type, config } = requestData;
        
        if (!name || !tool_type) {
          return new Response(JSON.stringify({ error: 'Name and tool_type are required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // Check if user has access to this agent
        const { data: agent, error: agentError } = await supabase
          .from('user_agents')
          .select('*')
          .eq('id', agentId)
          .eq('user_id', user.id)
          .single();
          
        if (agentError || !agent) {
          return new Response(JSON.stringify({ error: 'Agent not found or you do not have access' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // Create new tool
        const { data: newTool, error } = await supabase
          .from('agent_tools')
          .insert({
            agent_id: agentId,
            name,
            description: description || '',
            tool_type,
            config: config || {}
          })
          .select()
          .single();
          
        if (error) {
          return new Response(JSON.stringify({ error: 'Failed to create tool' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        return new Response(
          JSON.stringify(newTool),
          { 
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } else if (path.length === 1 && path[0] === 'tool') {
    const toolId = url_parts.searchParams.get('id');
    
    if (!toolId) {
      return new Response(JSON.stringify({ error: 'Tool ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (req.method === 'DELETE') {
      // DELETE /tool?id=:id - Delete a tool
      try {
        // Get the tool first to check ownership
        const { data: tool, error: getError } = await supabase
          .from('agent_tools')
          .select('*, user_agents!inner(*)')
          .eq('id', toolId)
          .single();
          
        if (getError || !tool) {
          return new Response(JSON.stringify({ error: 'Tool not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // Check if the user owns the agent this tool belongs to
        if (tool.user_agents.user_id !== user.id) {
          return new Response(JSON.stringify({ error: 'You do not have permission to delete this tool' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // Delete the tool
        const { error: deleteError } = await supabase
          .from('agent_tools')
          .delete()
          .eq('id', toolId);
          
        if (deleteError) {
          return new Response(JSON.stringify({ error: 'Failed to delete tool' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        return new Response(
          JSON.stringify({ success: true, message: 'Tool deleted successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else if (req.method === 'PATCH') {
      // PATCH /tool?id=:id - Update a tool
      try {
        // Parse request body
        const requestData = await req.json();
        const { name, description, config } = requestData;
        
        if (!Object.keys(requestData).length) {
          return new Response(JSON.stringify({ error: 'No updates provided' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // Get the tool first to check ownership
        const { data: tool, error: getError } = await supabase
          .from('agent_tools')
          .select('*, user_agents!inner(*)')
          .eq('id', toolId)
          .single();
          
        if (getError || !tool) {
          return new Response(JSON.stringify({ error: 'Tool not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // Check if the user owns the agent this tool belongs to
        if (tool.user_agents.user_id !== user.id) {
          return new Response(JSON.stringify({ error: 'You do not have permission to update this tool' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // Build update object (only include fields that were provided)
        const updates: Record<string, any> = {};
        if (name !== undefined) updates.name = name;
        if (description !== undefined) updates.description = description;
        if (config !== undefined) updates.config = config;
        
        // Update the tool
        const { data: updatedTool, error: updateError } = await supabase
          .from('agent_tools')
          .update(updates)
          .eq('id', toolId)
          .select()
          .single();
          
        if (updateError) {
          return new Response(JSON.stringify({ error: 'Failed to update tool' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        return new Response(
          JSON.stringify(updatedTool),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } else {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
