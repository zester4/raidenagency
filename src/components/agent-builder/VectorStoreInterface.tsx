
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Database, Upload, Loader2, Search, FileText, File, Trash2, Globe, RefreshCw } from 'lucide-react';

interface VectorStoreInterfaceProps {
  agentId: string;
  collectionName: string;
  documentCount: number;
  onDocumentsUpdated?: (count: number) => void;
}

interface Document {
  id: string;
  filename: string;
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
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      filename: 'company_faq.pdf',
      type: 'pdf',
      size: '1.2 MB',
      uploadedAt: '2025-04-10T14:30:00Z'
    },
    {
      id: '2',
      filename: 'product_manual.txt',
      type: 'txt',
      size: '256 KB',
      uploadedAt: '2025-04-11T09:15:00Z'
    }
  ]);

  const handleFileUpload = () => {
    if (fileInputRef.current?.files?.length) {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            
            // Add new documents
            const files = fileInputRef.current?.files;
            if (files) {
              const newDocs: Document[] = [];
              
              for (let i = 0; i < files.length; i++) {
                const file = files[i];
                newDocs.push({
                  id: `new_${Date.now()}_${i}`,
                  filename: file.name,
                  type: file.name.split('.').pop() || 'unknown',
                  size: `${(file.size / 1024).toFixed(1)} KB`,
                  uploadedAt: new Date().toISOString()
                });
              }
              
              setDocuments(prev => [...prev, ...newDocs]);
              
              // Update document count
              if (onDocumentsUpdated) {
                onDocumentsUpdated(documents.length + newDocs.length);
              }
            }
            
            toast({
              title: "Files uploaded",
              description: `${files?.length} files have been processed and added to the vector store.`,
            });
            
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            
            return 100;
          }
          return newProgress;
        });
      }, 300);
    }
  };

  const handleDelete = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    
    // Update document count
    if (onDocumentsUpdated) {
      onDocumentsUpdated(documents.length - 1);
    }
    
    toast({
      title: "Document deleted",
      description: "The document has been removed from your agent's knowledge base.",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: "Empty search",
        description: "Please enter a search query.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Searching...",
      description: `Finding similar content to "${searchQuery}" in your vector store.`,
    });
    
    // Simulate search delay
    setTimeout(() => {
      toast({
        title: "Search results",
        description: `Found 3 relevant documents for "${searchQuery}".`,
      });
    }, 1500);
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
              
              {documents.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Database className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <p>No documents added yet. Upload files to populate your agent's knowledge base.</p>
                </div>
              ) : (
                documents.map(doc => (
                  <div key={doc.id} className="grid grid-cols-5 gap-4 p-3 text-sm items-center border-t border-gray-800">
                    <div className="col-span-2 flex items-center">
                      {getFileIcon(doc.type)}
                      <span className="ml-2 truncate">{doc.filename}</span>
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
                <Button type="submit">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button type="button" variant="outline" onClick={() => setSearchQuery('')}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </form>
            
            <div className="p-4 border border-gray-800 rounded-md bg-black/30">
              <h4 className="text-sm font-medium mb-2">How Search Works</h4>
              <p className="text-xs text-muted-foreground mb-3">
                When you search, the query is converted to an embedding vector using the same model used to embed your documents. 
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
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t border-gray-800 pt-4">
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-muted-foreground">
            <span className="text-electric-blue font-medium">{documentCount}</span> total indexed documents
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-3 w-3 mr-2" />
            Reindex
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VectorStoreInterface;
