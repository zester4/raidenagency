
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAIEmbeddings } from "https://esm.sh/@langchain/google-genai";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    // Required environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const googleApiKey = Deno.env.get("GOOGLE_API_KEY");

    if (!supabaseUrl || !supabaseServiceKey || !googleApiKey) {
      throw new Error("Missing required environment variables");
    }

    // Parse request
    const { text, collectionName } = await req.json();

    if (!text || !collectionName) {
      throw new Error("Text and collection name are required");
    }

    // Initialize Google Generative AI embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: googleApiKey,
      modelName: "embedding-001", // Use the appropriate model for embeddings
    });

    // Generate embedding vector
    const embeddingResult = await embeddings.embedQuery(text);

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store embedding in the vector collection
    const { data, error } = await supabase
      .from("document_embeddings")
      .insert({
        collection_name: collectionName,
        content: text,
        embedding: embeddingResult,
        metadata: { source: "api", timestamp: new Date().toISOString() },
      });

    if (error) throw error;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Embedding created and stored successfully",
        data,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
