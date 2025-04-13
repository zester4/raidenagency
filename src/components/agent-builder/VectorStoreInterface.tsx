
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Database, File, Trash2, Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface VectorStoreInterfaceProps {
  agentId: string;
  collectionName: string;
  documentCount: number;
  onDocumentsUpdated: (count: number) => void;
}

const VectorStoreInterface: React.FC<VectorStoreInterfaceProps> = ({
  agentId,
  collectionName,
  documentCount,
  onDocumentsUpdated
}) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, [agentId]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      // Mock implementation
      setTimeout(() => {
        const mockDocuments = [
          { id: '1', name: 'Product Manual.pdf', size: '2.4 MB', created_at: new Date().toISOString() },
          { id: '2', name: 'FAQ.docx', size: '1.1 MB', created_at: new Date().toISOString() },
          { id: '3', name: 'Support Guide.txt', size: '0.5 MB', created_at: new Date().toISOString() }
        ];
        setDocuments(mockDocuments);
        onDocumentsUpdated(mockDocuments.length);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleUpload = () => {
    // Mock implementation
    toast({
      title: "Upload functionality",
      description: "This is a placeholder for the document upload feature.",
      variant: "default",
    });
  };

  const handleDelete = (id: string) => {
    // Mock implementation
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    onDocumentsUpdated(documents.length - 1);
    toast({
      title: "Document deleted",
      description: "The document has been removed from the agent's knowledge base.",
      variant: "default",
    });
  };

  return (
    <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Database className="h-5 w-5 text-electric-blue" />
          Knowledge Base
        </CardTitle>
        <CardDescription>
          Documents and data sources the agent can access
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Collection</h3>
              <p className="text-white/90 flex items-center gap-2">
                {collectionName}
                <Badge variant="success" className="ml-2">Active</Badge>
              </p>
            </div>
            <Button onClick={handleUpload} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Document
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : documents.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400 mt-4">Documents ({documents.length})</h3>
              <div className="space-y-2">
                {documents.map(doc => (
                  <div key={doc.id} className="flex justify-between items-center p-3 bg-gray-800/30 rounded-md border border-gray-700">
                    <div className="flex items-center gap-3">
                      <File className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-white/90 font-medium">{doc.name}</p>
                        <p className="text-xs text-gray-400">{doc.size} • {new Date(doc.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)}>
                      <Trash2 className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Database className="h-12 w-12 text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No documents yet</h3>
              <p className="text-gray-400 max-w-md mb-6">
                Upload documents to give this agent a knowledge base to work with. The agent will be able to search and retrieve information from these documents.
              </p>
              <Button onClick={handleUpload} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Documents
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VectorStoreInterface;
