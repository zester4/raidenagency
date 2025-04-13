
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Database, Upload, Loader2, Search, FileText, File, Trash2, Globe, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface VectorStoreInterfaceProps {
  agentId: string;
  collectionName: string;
  documentCount?: number;
  onDocumentsUpdated?: (count: number) => void;
}

interface Document {
  id: string;
  content: string;
  metadata: {
    title?: string;
    source?: string;
    type?: string;
    [key: string]: any;
  };
  created_at?: string;
  similarity?: number;
}

const VectorStoreInterface: React.FC<VectorStoreInterfaceProps> = ({
  agentId,
  collectionName,
  documentCount,
  onDocumentsUpdated
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFiles, setUploadingFiles] = useState<boolean>(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [documentContent, setDocumentContent] = useState<string>('');
  const [documentTitle, setDocumentTitle] = useState<string>('');
  const [documentSource, setDocumentSource] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Document[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Get the Supabase function URL from environment
  const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ryujklxvochfkuokgduz.supabase.co'}/functions/v1/vector-store`;

  useEffect(() => {
    fetchDocuments();
  }, [agentId, collectionName]);

  // Function to fetch documents
  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Error',
          description: 'You must be logged in to access documents.',
          variant: 'destructive'
        });
        setIsLoading(false);
        return;
      }
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          action: 'list_documents',
          agent_id: agentId,
          collection_name: collectionName
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json();
      
      if (data.documents) {
        const formattedDocs = data.documents.map((doc: any) => ({
          id: doc.id,
          content: doc.content,
          metadata: doc.metadata,
          created_at: doc.created_at
        }));
        setDocuments(formattedDocs);
        
        if (onDocumentsUpdated) {
          onDocumentsUpdated(formattedDocs.length);
        }
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch documents from the vector store.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to add document manually
  const addDocument = async () => {
    if (!documentContent.trim()) {
      toast({
        title: 'Error',
        description: 'Document content cannot be empty.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setUploadingFiles(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Error',
          description: 'You must be logged in to add documents.',
          variant: 'destructive'
        });
        setUploadingFiles(false);
        return;
      }
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          action: 'add_document',
          agent_id: agentId,
          collection_name: collectionName,
          document: {
            content: documentContent,
            metadata: {
              title: documentTitle || 'Untitled Document',
              source: documentSource || 'Manual Entry',
              type: 'text',
              created_at: new Date().toISOString()
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add document');
      }

      toast({
        title: 'Success',
        description: 'Document added to vector store successfully.',
      });

      // Reset form
      setDocumentContent('');
      setDocumentTitle('');
      setDocumentSource('');

      // Refresh documents
      fetchDocuments();
    } catch (error) {
      console.error('Error adding document:', error);
      toast({
        title: 'Error',
        description: 'Failed to add document to vector store.',
        variant: 'destructive'
      });
    } finally {
      setUploadingFiles(false);
    }
  };

  // Function to handle file upload
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Function to process uploaded files
  const processFiles = async (files: FileList) => {
    if (files.length === 0) return;

    setUploadingFiles(true);
    const results = { success: 0, failed: 0 };

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Error',
          description: 'You must be logged in to upload files.',
          variant: 'destructive'
        });
        setUploadingFiles(false);
        return;
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const reader = new FileReader();
          
          reader.onload = async (e) => {
            try {
              let content = e.target?.result as string;
              const metadata = {
                title: file.name,
                source: 'File Upload',
                type: file.type,
                size: file.size,
                uploaded_at: new Date().toISOString()
              };
              
              if (content && typeof content === 'string') {
                const response = await fetch(functionUrl, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                  },
                  body: JSON.stringify({
                    action: 'add_document',
                    agent_id: agentId,
                    collection_name: collectionName,
                    document: {
                      content,
                      metadata
                    }
                  })
                });

                if (response.ok) {
                  results.success++;
                } else {
                  results.failed++;
                }
              }
              
              // If this is the last file, show results and refresh
              if (i === files.length - 1) {
                if (results.success > 0) {
                  toast({
                    title: 'Files Processed',
                    description: `Successfully added ${results.success} document(s)${results.failed > 0 ? `, failed to add ${results.failed}` : ''}`,
                  });
                  fetchDocuments();
                } else {
                  toast({
                    title: 'Error',
                    description: 'Failed to add any documents',
                    variant: 'destructive'
                  });
                }
                setUploadingFiles(false);
              }
            } catch (err) {
              console.error('Error processing file:', err);
              results.failed++;
            }
          };
          
          if (file.type.includes('text/') || 
              file.name.endsWith('.txt') || 
              file.name.endsWith('.md')) {
            reader.readAsText(file);
          } else {
            // For non-text files, we'll just use the file name as content
            // In a real implementation, we'd extract text from PDFs, etc.
            reader.readAsDataURL(file);
          }
        } catch (error) {
          console.error('Error reading file:', error);
          results.failed++;
        }
      }
    } catch (error) {
      console.error('Error processing files:', error);
      toast({
        title: 'Error',
        description: 'Failed to process uploaded files',
        variant: 'destructive'
      });
      setUploadingFiles(false);
    }
  };

  // Function to search documents
  const searchDocuments = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a search query.',
        variant: 'destructive'
      });
      return;
    }

    setIsSearching(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Error',
          description: 'You must be logged in to search documents.',
          variant: 'destructive'
        });
        setIsSearching(false);
        return;
      }
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          action: 'search',
          agent_id: agentId,
          collection_name: collectionName,
          query: searchQuery,
          topK: 5
        })
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error searching documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to search the vector store.',
        variant: 'destructive'
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Function to delete a document
  const deleteDocument = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Error',
          description: 'You must be logged in to delete documents.',
          variant: 'destructive'
        });
        return;
      }
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          action: 'delete_document',
          agent_id: agentId,
          collection_name: collectionName,
          document: {
            id
          }
        })
      });

      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
        
        if (onDocumentsUpdated) {
          onDocumentsUpdated(documents.length - 1);
        }
        
        toast({
          title: 'Success',
          description: 'Document deleted successfully.',
        });
      } else {
        throw new Error('Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete document.',
        variant: 'destructive'
      });
    }
  };

  // Format content preview
  const formatContentPreview = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Card className="border-gray-800 bg-black/60 backdrop-blur-md h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center">
          <Database className="mr-2 h-5 w-5 text-electric-blue" />
          Vector Store
        </CardTitle>
        <CardDescription>
          Store and search documents in a vector database using Gemini embeddings
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Documents</h3>
              <Button variant="outline" size="sm" onClick={fetchDocuments} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center p-8 border border-dashed border-gray-700 rounded-lg">
                <FileText className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">No documents yet</h3>
                <p className="text-gray-500 mb-4">Start by uploading or creating a document</p>
                <Button variant="default" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-3 border border-gray-800 bg-black/40 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white/90">{doc.metadata.title || 'Untitled Document'}</h4>
                      <Button variant="ghost" size="sm" onClick={() => deleteDocument(doc.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{formatContentPreview(doc.content)}</p>
                    <div className="flex flex-wrap gap-2">
                      {doc.metadata.source && (
                        <Badge variant="outline" className="text-xs">
                          <Globe className="h-3 w-3 mr-1" />
                          {doc.metadata.source}
                        </Badge>
                      )}
                      {doc.metadata.type && (
                        <Badge variant="outline" className="text-xs">
                          <File className="h-3 w-3 mr-1" />
                          {doc.metadata.type}
                        </Badge>
                      )}
                      {doc.created_at && (
                        <Badge variant="outline" className="text-xs">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="documentTitle">Document Title</Label>
                <Input 
                  id="documentTitle"
                  placeholder="Enter document title" 
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  className="bg-black/40 border-gray-700 mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="documentContent">Content</Label>
                <Textarea 
                  id="documentContent"
                  placeholder="Enter the document content..."
                  value={documentContent}
                  onChange={(e) => setDocumentContent(e.target.value)}
                  className="bg-black/40 border-gray-700 min-h-[150px] mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="documentSource">Source (optional)</Label>
                <Input 
                  id="documentSource"
                  placeholder="Enter document source" 
                  value={documentSource}
                  onChange={(e) => setDocumentSource(e.target.value)}
                  className="bg-black/40 border-gray-700 mt-1"
                />
              </div>
              
              <Button 
                onClick={addDocument}
                disabled={uploadingFiles || !documentContent.trim()}
                className="w-full"
              >
                {uploadingFiles ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding Document...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Add to Vector Store
                  </>
                )}
              </Button>
              
              <div className="text-center my-4">
                <div className="inline-flex items-center justify-center w-full">
                  <hr className="w-full border-gray-800" />
                  <span className="absolute px-3 text-xs text-gray-500 bg-black">OR</span>
                </div>
              </div>
              
              <div
                className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-electric-blue transition-colors"
                onClick={handleFileUpload}
              >
                <Upload className="h-8 w-8 mx-auto mb-3 text-gray-500" />
                <p className="text-sm text-gray-400 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">Supports TXT, MD and other text files</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  onChange={(e) => e.target.files && processFiles(e.target.files)}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="search" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Search the vector database..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/40 border-gray-700 flex-1"
                onKeyDown={(e) => e.key === 'Enter' && searchDocuments()}
              />
              <Button onClick={searchDocuments} disabled={isSearching}>
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {searchResults.length > 0 && (
              <div className="space-y-3 mt-4">
                <h3 className="text-lg font-medium mb-2">Search Results</h3>
                {searchResults.map((result, index) => (
                  <div key={index} className="p-3 border border-gray-800 bg-black/40 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white/90">
                        {result.metadata.title || 'Untitled Document'}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        Score: {(result.similarity ? result.similarity * 100 : 0).toFixed(1)}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{formatContentPreview(result.content)}</p>
                    {result.metadata && (
                      <div className="flex flex-wrap gap-2">
                        {result.metadata.source && (
                          <Badge variant="outline" className="text-xs">
                            <Globe className="h-3 w-3 mr-1" />
                            {result.metadata.source}
                          </Badge>
                        )}
                        {result.metadata.type && (
                          <Badge variant="outline" className="text-xs">
                            <File className="h-3 w-3 mr-1" />
                            {result.metadata.type}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VectorStoreInterface;
