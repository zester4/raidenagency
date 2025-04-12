
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY);
    const { documentId, knowledgeBaseId } = await req.json();

    if (!documentId || !knowledgeBaseId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing document ${documentId} for knowledge base ${knowledgeBaseId}`);

    // Get document details
    const { data: document, error: documentError } = await supabase
      .from("agent_documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (documentError || !document) {
      console.error("Error fetching document:", documentError);
      return new Response(
        JSON.stringify({ error: "Document not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Download the file from storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from("agent-documents")
      .download(document.storage_path);

    if (fileError || !fileData) {
      console.error("Error downloading file:", fileError);
      return new Response(
        JSON.stringify({ error: "Failed to download file" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract text from file
    let text = "";
    
    if (document.file_type === "application/pdf") {
      // Process PDF file - simulated for now
      text = "This is extracted text from the PDF document. In a real implementation, we would use a PDF parsing library.";
    } 
    else if (document.file_type === "text/plain") {
      text = await fileData.text();
    }
    else if (document.file_type.includes("word")) {
      // Process Word document - simulated for now
      text = "This is extracted text from the Word document. In a real implementation, we would use a Word document parsing library.";
    }
    else if (document.file_type === "text/csv") {
      text = await fileData.text();
    }
    else {
      console.warn(`Unsupported file type: ${document.file_type}`);
      text = "Unsupported file format";
    }

    // Create embeddings - this would use an embedding model in production
    const chunks = text.match(/[\s\S]{1,1000}/g) || [text];
    const metadata = {
      document_id: documentId,
      file_name: document.filename,
      file_type: document.file_type,
      chunk_count: chunks.length,
      knowledge_base_id: knowledgeBaseId
    };

    // Store metadata of the processed document
    const { error: updateError } = await supabase
      .from("agent_documents")
      .update({ 
        processed: true, 
        metadata: {
          ...metadata,
          text_length: text.length,
          processed_at: new Date().toISOString()
        }
      })
      .eq("id", documentId);

    if (updateError) {
      console.error("Error updating document status:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update document status" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Successfully processed document ${documentId}`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Document processed successfully",
        metadata
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing document:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
