
-- Create a storage bucket for agent documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('agent-documents', 'Agent Documents', false, 104857600, '{application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,text/csv,application/json}');

-- Policy to allow users to select their own files
CREATE POLICY "Users can view their own documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'agent-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy to allow users to insert their own files  
CREATE POLICY "Users can upload their own documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'agent-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy to allow users to update their own files
CREATE POLICY "Users can update their own documents"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'agent-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy to allow users to delete their own files
CREATE POLICY "Users can delete their own documents"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'agent-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
