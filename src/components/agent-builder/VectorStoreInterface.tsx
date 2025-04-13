import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Database, Upload, Loader2, Search, FileText, File, Trash2, Globe, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SUPABASE_URL = supabase.supabaseUrl;

interface VectorStoreInterfaceProps {
  agentId: string;
  collectionName: string;
  documentCount: number;
  onDocumentsUpdated?: (count: number) => void;
}

interface Document {
  id: string;
  filename?: string;
  title?: string;
  content?: string;
  type: string;
  size: string;
  uploadedAt: string;
}

const VectorStoreInterface: React.FC<VectorStoreInterfaceProps> = ({
  agentId,
  collectionName,
  documentCount,
  onDocumentsUpdated
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('documents');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [agentId, collectionName]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to access your documents.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${SUPABASE_URL}/functions/v1/vector-store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: 'list_documents',
          agent_id: agentId,
          collection_name: collectionName,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        const formattedDocs = result.documents.map((doc: any) => ({
          id: doc.id,
          title: doc.metadata.title || 'Untitled Document',
          filename: doc.metadata.filename || 'document.txt',
          content: doc.content.substring(0, 100) + (doc.content.length > 100 ? '...' : ''),
          type: doc.metadata.type || getTypeFromFilename(doc.metadata.filename || 'txt'),
          size: doc.metadata.size || calculateSize(doc.content),
          uploadedAt: doc.created_at,
        }));
        setDocuments(formattedDocs);
        
        if (onDocumentsUpdated) {
          onDocumentsUpdated(formattedDocs.length);
        }
      } else {
        toast({
          title: "Error loading documents",
          description: result.error || "Failed to load documents",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error loading documents",
        description: "There was a problem fetching your documents.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeFromFilename = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase() || 'txt';
    return extension;
  };

  const calculateSize = (content: string): string => {
    const bytes = new Blob([content]).size;
    return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
  };

  const handleFileUpload = async () => {
    if (fileInputRef.current?.files?.length) {
      setIsUploading(true);
      setUploadProgress(0);
      
      const files = fileInputRef.current.files;
      const totalFiles = files.length;
      let processedFiles = 0;
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            title: "Authentication required",
            description: "Please sign in to upload documents.",
            variant: "destructive",
          });
          setIsUploading(false);
          return;
        }

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();
          
          reader.onload = async (e) => {
            const content = e.target?.result as string;
            
            try {
              const response = await fetch(`${SUPABASE_URL}/functions/v1/vector-store`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                  action: 'add_document',
                  agent_id: agentId,
                  collection_name: collectionName,
                  document: {
                    content: content,
                    metadata: {
                      filename: file.name,
                      title: file.name.split('.').slice(0, -1).join('.'),
                      type: file.type || getTypeFromFilename(file.name),
                      size: `${(file.size / 1024).toFixed(1)} KB`,
                    },
                  },
                }),
              });

              const result = await response.json();
              
              if (!response.ok) {
                toast({
                  title: "Error uploading document",
                  description: result.error || `Failed to upload ${file.name}`,
                  variant: "destructive",
                });
              }
            } catch (error) {
              console.error(`Error uploading ${file.name}:`, error);
              toast({
                title: "Upload failed",
                description: `Error uploading ${file.name}`,
                variant: "destructive",
              });
            }
            
            processedFiles++;
            setUploadProgress(Math.round((processedFiles / totalFiles) * 100));
            
            if (processedFiles === totalFiles) {
              setIsUploading(false);
              fetchDocuments();
              toast({
                title: "Files uploaded",
                description: `${totalFiles} files have been processed and added to the vector store.`,
              });
              
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }
          };
          
          reader.onerror = () => {
            processedFiles++;
            setUploadProgress(Math.round((processedFiles / totalFiles) * 100));
            toast({
              title: "Error reading file",
              description: `Could not read ${file.name}`,
              variant: "destructive",
            });
            
            if (processedFiles === totalFiles) {
              setIsUploading(false);
              fetchDocuments();
              
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }
          };
          
          if (file.type.includes('text/') || 
              file.name.endsWith('.txt') || 
              file.name.endsWith('.md')) {
            reader.readAsText(file);
          } else {
            reader.readAsDataURL(file);
          }
        }
      } catch (error) {
        console.error('Error in file upload process:', error);
        setIsUploading(false);
        toast({
          title: "Upload error",
          description: "An error occurred during the upload process.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to delete documents.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${SUPABASE_URL}/functions/v1/vector-store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: 'delete_document',
          agent_id: agentId,
          collection_name: collectionName,
          document: { id },
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
        
        if (onDocumentsUpdated) {
          onDocumentsUpdated(documents.length - 1);
        }
        
        toast({
          title: "Document deleted",
          description: "The document has been removed from your agent's knowledge base.",
        });
      } else {
        toast({
          title: "Error deleting document",
          description: result.error || "Failed to delete document",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Deletion failed",
        description: "There was a problem removing the document.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: "Empty search",
        description: "Please enter a search query.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to search documents.",
          variant: "destructive",
        });
        setIsSearching(false);
        return;
      }

      toast({
        title: "Searching...",
        description: `Finding similar content to "${searchQuery}" in your vector store.`,
      });
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/vector-store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: 'search',
          agent_id: agentId,
          collection_name: collectionName,
          query: searchQuery,
          topK: 5,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setSearchResults(result.results || []);
        toast({
          title: "Search results",
          description: `Found ${result.results?.length || 0} relevant documents for "${searchQuery}".`,
        });
      } else {
        toast({
          title: "Search error",
          description: result.error || "Failed to search documents",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error searching documents:', error);
      toast({
        title: "Search failed",
        description: "There was a problem searching the vector store.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleCrawlWebsite = () => {
    toast({
      title: "Feature in development",
      description: "Web crawling functionality is coming soon. Stay tuned!",
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-400" />;
      case 'txt':
        return <File className="h-4 w-4 text-blue-400" />;
      case 'docx':
        return <File className="h-4 w-4 text-cyan-400" />;
      case 'md':
        return <File className="h-4 w-4 text-purple-400" />;
      default:
        return <File className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Knowledge Base</CardTitle>
            <CardDescription>
              Manage documents for agent ID: {agentId}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-electric-blue border-electric-blue px-2 py-1">
            <Database className="h-3 w-3 mr-1" />
            {collectionName}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="search">Search & Test</TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium">Document Library</h3>
                <p className="text-xs text-muted-foreground">{documents.length} documents in collection</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCrawlWebsite}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Crawl Website
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  multiple 
                  accept=".pdf,.txt,.docx,.md" 
                  className="hidden" 
                  onChange={handleFileUpload}
                />
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" /> Upload Files
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {isUploading && (
              <div className="mb-4">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-right mt-1">{uploadProgress}% complete</p>
              </div>
            )}
            
            <div className="rounded-md border border-gray-800">
              <div className="grid grid-cols-5 gap-4 p-3 text-xs font-medium text-muted-foreground bg-black/30">
                <div className="col-span-2">Filename</div>
                <div>Type</div>
                <div>Size</div>
                <div>Actions</div>
              </div>
              
              {isLoading ? (
                <div className="p-8 text-center">
                  <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-electric-blue" />
                  <p className="text-muted-foreground">Loading documents...</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Database className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <p>No documents added yet. Upload files to populate your agent's knowledge base.</p>
                </div>
              ) : (
                documents.map(doc => (
                  <div key={doc.id} className="grid grid-cols-5 gap-4 p-3 text-sm items-center border-t border-gray-800">
                    <div className="col-span-2 flex items-center">
                      {getFileIcon(doc.type)}
                      <span className="ml-2 truncate">{doc.filename || doc.title || 'Untitled'}</span>
                    </div>
                    <div>{doc.type.toUpperCase()}</div>
                    <div>{doc.size}</div>
                    <div>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="search" className="space-y-4">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label htmlFor="search-query" className="text-sm font-medium mb-1 block">Search Vector Store</Label>
                  <Input
                    id="search-query"
                    placeholder="Enter a query to test your knowledge base..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-black/40 border-gray-700"
                  />
                </div>
                <Button type="submit" disabled={isSearching}>
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Search
                </Button>
                <Button type="button" variant="outline" onClick={() => setSearchQuery('')}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </form>
            
            {searchResults.length > 0 && (
              <div className="space-y-4 mt-4">
                <h4 className="text-sm font-medium">Search Results</h4>
                {searchResults.map((result, index) => (
                  <div key={index} className="p-4 border border-gray-800 rounded-md bg-black/30">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium">{result.metadata?.title || 'Document'}</h5>
                      <Badge variant="outline" className="text-electric-blue">
                        {(result.similarity * 100).toFixed(2)}% match
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{result.content}</p>
                    <div className="text-xs text-gray-500">ID: {result.id}</div>
                  </div>
                ))}
              </div>
            )}
            
            {searchResults.length === 0 && !isSearching && (
              <div className="p-4 border border-gray-800 rounded-md bg-black/30">
                <h4 className="text-sm font-medium mb-2">How Search Works</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  When you search, the query is converted to an embedding vector using Google's Gemini embedding model. 
                  The system then finds documents with similar vectors based on cosine similarity.
                </p>
                <img 
                  src="/lovable-uploads/d5668c8d-1806-4498-9c40-cc0292242d72.png" 
                  alt="Vector Search Diagram" 
                  className="w-full rounded-md border border-gray-800"
                />
                <p className="text-xs text-muted-foreground mt-3">
                  Your agent can use this knowledge base during conversations to retrieve relevant information and provide more accurate responses.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t border-gray-800 pt-4">
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-muted-foreground">
            <span className="text-electric-blue font-medium">{documentCount}</span> total indexed documents
          </div>
          <Button variant="outline" size="sm" onClick={fetchDocuments}>
            <RefreshCw className="h-3 w-3 mr-2" />
            Reindex
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VectorStoreInterface;
