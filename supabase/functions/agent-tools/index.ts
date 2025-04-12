
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

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
  const url = Deno.env.get('SUPABASE_URL') || '';
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
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
              default: 'google',
              enum: ['google', 'bing', 'duckduckgo']
            },
            max_results: {
              type: 'number',
              description: 'Maximum number of search results to return',
              default: 5
            }
          }
        }
      },
      {
        id: 'database-query',
        name: 'Database Query',
        description: 'Query SQL databases to retrieve or manipulate data',
        icon: 'database',
        config_schema: {
          type: 'object',
          properties: {
            connection_string: {
              type: 'string',
              description: 'Database connection string (will be stored securely)'
            },
            database_type: {
              type: 'string',
              description: 'Type of database',
              enum: ['postgres', 'mysql', 'mongodb', 'sqlite']
            }
          },
          required: ['connection_string', 'database_type']
        }
      },
      {
        id: 'code-interpreter',
        name: 'Code Interpreter',
        description: 'Run code snippets in a sandbox environment',
        icon: 'code',
        config_schema: {
          type: 'object',
          properties: {
            languages: {
              type: 'string',
              description: 'Allowed programming languages',
              enum: ['python', 'javascript', 'r', 'all']
            },
            timeout_seconds: {
              type: 'number',
              description: 'Maximum execution time in seconds',
              default: 30
            }
          }
        }
      },
      {
        id: 'email-sender',
        name: 'Email Sender',
        description: 'Send emails on behalf of the user (with approval)',
        icon: 'mail',
        config_schema: {
          type: 'object',
          properties: {
            smtp_server: {
              type: 'string',
              description: 'SMTP server to use'
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
              description: 'SMTP password (will be stored securely)'
            },
            from_email: {
              type: 'string',
              description: 'From email address'
            },
            require_approval: {
              type: 'boolean',
              description: 'Require user approval before sending emails',
              default: true
            }
          },
          required: ['smtp_server', 'smtp_username', 'smtp_password', 'from_email']
        }
      },
      {
        id: 'calendar-assistant',
        name: 'Calendar Assistant',
        description: 'Access and manage calendar events',
        icon: 'calendar',
        config_schema: {
          type: 'object',
          properties: {
            calendar_provider: {
              type: 'string',
              description: 'Calendar provider',
              enum: ['google', 'outlook', 'apple']
            },
            api_key: {
              type: 'string',
              description: 'API key or OAuth token (will be stored securely)'
            },
            calendar_id: {
              type: 'string',
              description: 'ID of the calendar to access',
              default: 'primary'
            }
          },
          required: ['calendar_provider', 'api_key']
        }
      },
      {
        id: 'file-processor',
        name: 'File Processor',
        description: 'Process and analyze files (PDFs, Excel, images, etc.)',
        icon: 'file',
        config_schema: {
          type: 'object',
          properties: {
            allowed_file_types: {
              type: 'string',
              description: 'Allowed file types (comma-separated)',
              default: 'pdf,xlsx,docx,csv,jpg,png'
            },
            max_file_size_mb: {
              type: 'number',
              description: 'Maximum file size in MB',
              default: 10
            }
          }
        }
      },
      {
        id: 'identity-verification',
        name: 'Identity Verification',
        description: 'Verify user identities through various providers',
        icon: 'user-check',
        config_schema: {
          type: 'object',
          properties: {
            provider: {
              type: 'string',
              description: 'Identity verification provider',
              enum: ['auth0', 'okta', 'jumpcloud', 'custom']
            },
            api_key: {
              type: 'string',
              description: 'API key (will be stored securely)'
            },
            verification_level: {
              type: 'string',
              description: 'Level of verification required',
              enum: ['basic', 'medium', 'high'],
              default: 'medium'
            }
          },
          required: ['provider', 'api_key']
        }
      },
      {
        id: 'weather-service',
        name: 'Weather Service',
        description: 'Get current weather and forecasts for any location',
        icon: 'globe',
        config_schema: {
          type: 'object',
          properties: {
            provider: {
              type: 'string',
              description: 'Weather data provider',
              enum: ['openweathermap', 'weatherapi', 'accuweather'],
              default: 'openweathermap'
            },
            api_key: {
              type: 'string',
              description: 'API key (will be stored securely)'
            },
            units: {
              type: 'string',
              description: 'Units of measurement',
              enum: ['metric', 'imperial'],
              default: 'metric'
            }
          },
          required: ['api_key']
        }
      }
    ];

    return new Response(JSON.stringify(availableTools), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } else if (path.length === 2 && path[0] === 'agent') {
    // GET /agent/:agentId - List tools for agent
    // POST /agent/:agentId - Add tool to agent
    const agentId = path[1];

    // Check if agent exists and belongs to user
    const { data: agent, error: agentError } = await supabase
      .from('user_agents')
      .select('*')
      .eq('id', agentId)
      .eq('user_id', user.id)
      .single();

    if (agentError || !agent) {
      return new Response(JSON.stringify({ error: 'Agent not found or not authorized' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'GET') {
      // Get tools for the agent
      const { data: tools, error: toolsError } = await supabase
        .from('agent_tools')
        .select('*')
        .eq('agent_id', agentId);

      if (toolsError) {
        return new Response(JSON.stringify({ error: 'Failed to fetch tools' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(tools || []), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (req.method === 'POST') {
      // Add tool to agent
      const body = await req.json();
      
      // Validate request body
      if (!body.name || !body.tool_type) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Insert tool
      const { data: newTool, error: insertError } = await supabase
        .from('agent_tools')
        .insert({
          agent_id: agentId,
          name: body.name,
          description: body.description || null,
          tool_type: body.tool_type,
          config: body.config || null
        })
        .select()
        .single();

      if (insertError) {
        return new Response(JSON.stringify({ error: 'Failed to add tool' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(newTool), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } else if (path.length === 1 && path[0].includes('-')) {
    // Single tool operations - GET, PATCH, DELETE /agent-tools/:toolId
    const toolId = path[0];

    // Get the tool
    const { data: tool, error: toolError } = await supabase
      .from('agent_tools')
      .select('*, user_agents!inner(*)')
      .eq('id', toolId)
      .single();

    if (toolError || !tool) {
      return new Response(JSON.stringify({ error: 'Tool not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user has access to the tool (via agent)
    if (tool.user_agents.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Not authorized to access this tool' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'GET') {
      // Return the tool (without the user_agents join)
      const { user_agents, ...toolData } = tool;
      return new Response(JSON.stringify(toolData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (req.method === 'PATCH') {
      // Update the tool
      const body = await req.json();
      
      const { data: updatedTool, error: updateError } = await supabase
        .from('agent_tools')
        .update({
          name: body.name !== undefined ? body.name : tool.name,
          description: body.description !== undefined ? body.description : tool.description,
          config: body.config !== undefined ? body.config : tool.config
        })
        .eq('id', toolId)
        .select()
        .single();

      if (updateError) {
        return new Response(JSON.stringify({ error: 'Failed to update tool' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(updatedTool), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (req.method === 'DELETE') {
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

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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
