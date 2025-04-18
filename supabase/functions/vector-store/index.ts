
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";
const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY") || GEMINI_API_KEY; // Fallback to GEMINI_API_KEY

// Create supabase client with service role
const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Vector Store Service
 * Handles document embedding and similarity search functionality
 * using Google's Gemini embeddings
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

    // Check if embedding API key is available
    const apiKey = GOOGLE_API_KEY || GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Google/Gemini API key is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Function to generate embeddings using Google's Gemini or Google API
    const generateEmbedding = async (text: string) => {
      try {
        // First try Gemini embedding API
        const response = await fetch('https://generativelanguage.googleapis.com/v1/models/embedding-001:embedContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
          },
          body: JSON.stringify({
            model: "embedding-001",
            content: {
              parts: [
                { text }
              ]
            },
            taskType: "RETRIEVAL_DOCUMENT"
          })
        });
        
        if (!response.ok) {
          throw new Error(`Embedding API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.embedding.values;
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
      .eq("agent_id", agent_id)
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

        // Update document count in agent settings if this is a new document
        try {
          const { data: agentData, error: agentError } = await supabase
            .from("user_agents")
            .select("vector_store")
            .eq("id", agent_id)
            .single();
          
          if (!agentError && agentData) {
            const currentVectorStore = agentData.vector_store || {};
            const documentCount = currentVectorStore.document_count || 0;
            
            await supabase
              .from("user_agents")
              .update({
                vector_store: {
                  ...currentVectorStore,
                  enabled: true,
                  collection_name,
                  document_count: documentCount + 1
                }
              })
              .eq("id", agent_id);
          }
        } catch (countError) {
          console.error("Error updating document count:", countError);
          // Non-critical error, continue
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

      try {
        // Delete the document
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

        // Update document count in agent settings
        try {
          const { data: agentData, error: agentError } = await supabase
            .from("user_agents")
            .select("vector_store")
            .eq("id", agent_id)
            .single();
          
          if (!agentError && agentData) {
            const currentVectorStore = agentData.vector_store || {};
            const documentCount = currentVectorStore.document_count || 0;
            
            if (documentCount > 0) {
              await supabase
                .from("user_agents")
                .update({
                  vector_store: {
                    ...currentVectorStore,
                    document_count: documentCount - 1
                  }
                })
                .eq("id", agent_id);
            }
          }
        } catch (countError) {
          console.error("Error updating document count:", countError);
          // Non-critical error, continue
        }

        return new Response(JSON.stringify({
          success: true,
          message: "Document deleted successfully"
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (error) {
        console.error("Error deleting document:", error);
        return new Response(JSON.stringify({ error: "Failed to delete document", details: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    else if (action === "list_documents") {
      try {
        const { data: documents, error: listError } = await supabase
          .from("agent_vector_documents")
          .select("id, content, metadata, created_at")
          .eq("collection_name", collection_name)
          .eq("agent_id", agent_id)
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
      } catch (error) {
        console.error("Error listing documents:", error);
        return new Response(JSON.stringify({ error: "Failed to list documents", details: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    else if (action === "get_document_count") {
      try {
        const { count, error: countError } = await supabase
          .from("agent_vector_documents")
          .select("id", { count: 'exact', head: true })
          .eq("collection_name", collection_name)
          .eq("agent_id", agent_id)
          .eq("user_id", user.id);

        if (countError) {
          return new Response(JSON.stringify({ error: "Failed to get document count", details: countError }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        return new Response(JSON.stringify({
          count
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (error) {
        console.error("Error getting document count:", error);
        return new Response(JSON.stringify({ error: "Failed to get document count", details: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
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
