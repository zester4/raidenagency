
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";

// Create supabase client with service role
const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Vector Store Service
 * Handles document embedding and similarity search functionality
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, agent_id, document, collection_name, query, filters = {}, topK = 3 } = await req.json();

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

    // Check if OPENAI_API_KEY is available
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "OpenAI API key is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Function to generate embeddings using OpenAI
    const generateEmbedding = async (text: string) => {
      try {
        const response = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "text-embedding-3-small",
            input: text
          })
        });
        
        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.data[0].embedding;
      } catch (error) {
        console.error('Error generating embedding:', error);
        throw error;
      }
    };

    // Check if the collection exists, create if not
    const { data: collections, error: collectionsError } = await supabase
      .from("agent_vector_collections")
      .select("*")
      .eq("name", collection_name)
      .single();

    if (collectionsError && collectionsError.code !== 'PGRST116') {
      return new Response(JSON.stringify({ error: "Error checking vector collection", details: collectionsError }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (!collections) {
      // Create new collection
      const { error: createCollectionError } = await supabase
        .from("agent_vector_collections")
        .insert({
          user_id: user.id,
          agent_id,
          name: collection_name,
          description: `Vector collection for agent ${agent_id}`,
        });

      if (createCollectionError) {
        return new Response(JSON.stringify({ error: "Failed to create vector collection", details: createCollectionError }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // Process based on action
    if (action === "add_document") {
      // Validate document
      if (!document || !document.content || !document.metadata) {
        return new Response(JSON.stringify({ error: "Invalid document format" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      try {
        // Generate embedding for document
        const embedding = await generateEmbedding(document.content);

        // Store document and embedding
        const { data: newDocument, error: documentError } = await supabase
          .from("agent_vector_documents")
          .insert({
            user_id: user.id,
            agent_id,
            collection_name,
            content: document.content,
            metadata: document.metadata,
            embedding
          })
          .select()
          .single();

        if (documentError) {
          return new Response(JSON.stringify({ error: "Failed to store document", details: documentError }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        return new Response(JSON.stringify({
          success: true,
          document_id: newDocument.id,
          message: "Document added successfully"
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (error) {
        console.error("Error adding document:", error);
        return new Response(JSON.stringify({ error: "Failed to add document", details: error.message }), {
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    else if (action === "search") {
      if (!query) {
        return new Response(JSON.stringify({ error: "Query is required for search" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      try {
        // Generate embedding for query
        const queryEmbedding = await generateEmbedding(query);

        // Perform similarity search
        // This is a simple implementation - in production, you'd use pgvector or a dedicated vector DB
        const { data: documents, error: searchError } = await supabase
          .rpc("match_documents", {
            query_embedding: queryEmbedding,
            collection_name: collection_name,
            match_threshold: 0.5,
            match_count: topK
          });

        if (searchError) {
          return new Response(JSON.stringify({ error: "Failed to search documents", details: searchError }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        return new Response(JSON.stringify({
          results: documents
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (error) {
        console.error("Error searching documents:", error);
        return new Response(JSON.stringify({ error: "Failed to search documents", details: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    else if (action === "delete_document") {
      if (!document || !document.id) {
        return new Response(JSON.stringify({ error: "Document ID is required for deletion" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const { error: deleteError } = await supabase
        .from("agent_vector_documents")
        .delete()
        .eq("id", document.id)
        .eq("user_id", user.id);

      if (deleteError) {
        return new Response(JSON.stringify({ error: "Failed to delete document", details: deleteError }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({
        success: true,
        message: "Document deleted successfully"
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    else if (action === "list_documents") {
      const { data: documents, error: listError } = await supabase
        .from("agent_vector_documents")
        .select("id, content, metadata, created_at")
        .eq("collection_name", collection_name)
        .eq("user_id", user.id);

      if (listError) {
        return new Response(JSON.stringify({ error: "Failed to list documents", details: listError }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({
        documents
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    else {
      return new Response(JSON.stringify({ error: `Unsupported action: ${action}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

  } catch (error) {
    console.error("Error in vector-store function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
