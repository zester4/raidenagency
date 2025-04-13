
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// API keys for various LLM providers
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY") || Deno.env.get("GEMINI_API_KEY");
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const TOGETHER_API_KEY = Deno.env.get("TOGETHER_API_KEY");
const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Multi-provider LLM service
 * Supports multiple model providers with a unified API
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { provider, model, messages, temperature = 0.7, max_tokens, stream = false } = await req.json();

    // Validate required fields
    if (!provider || !model || !messages) {
      return new Response(JSON.stringify({ error: "Missing required fields: provider, model, or messages" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    let response;
    let apiKey;

    // Handle different LLM providers
    switch (provider.toLowerCase()) {
      case 'openai':
        apiKey = OPENAI_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages,
            temperature,
            max_tokens: max_tokens || undefined,
            stream
          })
        });
        break;
        
      case 'google':
      case 'gemini':
        apiKey = GOOGLE_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "Google/Gemini API key not configured" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        
        const geminiMessages = messages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
        }));
        
        response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
          },
          body: JSON.stringify({
            contents: geminiMessages,
            generationConfig: {
              temperature,
              maxOutputTokens: max_tokens || undefined
            }
          })
        });
        break;
        
      case 'anthropic':
        apiKey = ANTHROPIC_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "Anthropic API key not configured" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        
        // Convert messages to Anthropic format
        const systemMessage = messages.find(m => m.role === 'system')?.content || '';
        const userMessages = messages.filter(m => m.role !== 'system');
        
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model,
            system: systemMessage,
            messages: userMessages,
            temperature,
            max_tokens: max_tokens || 1024
          })
        });
        break;
        
      case 'together':
        apiKey = TOGETHER_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "Together API key not configured" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        
        response = await fetch('https://api.together.xyz/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages,
            temperature,
            max_tokens: max_tokens || undefined
          })
        });
        break;
        
      case 'groq':
        apiKey = GROQ_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "Groq API key not configured" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        
        response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages,
            temperature,
            max_tokens: max_tokens || undefined
          })
        });
        break;
        
      case 'deepseek':
        apiKey = DEEPSEEK_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "DeepSeek API key not configured" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        
        response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages,
            temperature,
            max_tokens: max_tokens || undefined
          })
        });
        break;
        
      default:
        return new Response(JSON.stringify({ error: `Unsupported provider: ${provider}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return new Response(JSON.stringify({ 
        error: "Provider API error", 
        status: response.status,
        details: errorData
      }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Return the provider's response
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error in model-provider function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
