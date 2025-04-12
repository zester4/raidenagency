
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
    const { documentId } = await req.json();
    
    if (!documentId) {
      return new Response(
        JSON.stringify({ error: "Missing document ID" }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the document record
    const { data: document, error: docError } = await supabaseClient
      .from('agent_documents')
      .select('*, agent_knowledge_bases(agent_id)')
      .eq('id', documentId)
      .single();
    
    if (docError || !document) {
      return new Response(
        JSON.stringify({ error: "Document not found", details: docError }), 
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Verify user has access to this document by checking agent ownership
    const { data: agent, error: agentError } = await supabaseClient
      .from('user_agents')
      .select('user_id')
      .eq('id', document.agent_knowledge_bases.agent_id)
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
        JSON.stringify({ error: "Unauthorized: You don't have access to this document" }), 
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Simulating document processing (in a real implementation this would process the document and create embeddings)
    // In production, this would involve fetching the document from storage, parsing it based on file type,
    // splitting into chunks, creating embeddings, and storing them in a vector database
    
    // Wait for 2 seconds to simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update the document as processed
    const { data: updatedDoc, error: updateError } = await supabaseClient
      .from('agent_documents')
      .update({
        processed: true,
        updated_at: new Date().toISOString(),
        metadata: {
          ...document.metadata,
          chunks: 10, // Simulated number of text chunks
          token_count: 5000, // Simulated token count
          processed_at: new Date().toISOString()
        }
      })
      .eq('id', documentId)
      .select()
      .single();
    
    if (updateError) {
      return new Response(
        JSON.stringify({ error: "Failed to update document status", details: updateError }), 
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Document processed successfully",
        document: updatedDoc
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
