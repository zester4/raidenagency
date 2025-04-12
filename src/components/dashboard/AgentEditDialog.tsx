
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { UserAgent } from '@/lib/agent-service';
import { Loader2, X, Save, BrainCircuit, Blocks, Database, Wrench, Globe, Upload, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface AgentEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  agent: UserAgent | null;
  onSave: (updatedAgent: Partial<UserAgent>) => Promise<void>;
}

const AgentEditDialog: React.FC<AgentEditDialogProps> = ({
  isOpen,
  onClose,
  agent,
  onSave
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<UserAgent>>({
    name: '',
    description: '',
    category: '',
    system_prompt: '',
    model_config: {
      model: 'gpt-4o',
      temperature: 0.7,
      max_tokens: 4096,
      frequency_penalty: 0,
      presence_penalty: 0,
      top_p: 1
    },
    vector_store: {
      enabled: false,
      collection_name: '',
      document_count: 0
    }
  });
  const [activeTab, setActiveTab] = useState('general');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name || '',
        description: agent.description || '',
        category: agent.category || 'general',
        system_prompt: agent.system_prompt || 'You are a helpful AI assistant.',
        model_config: agent.model_config || {
          model: 'gpt-4o',
          temperature: 0.7,
          max_tokens: 4096,
          frequency_penalty: 0,
          presence_penalty: 0,
          top_p: 1
        },
        vector_store: agent.vector_store || {
          enabled: false,
          collection_name: '',
          document_count: 0
        }
      });
    }
  }, [agent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModelConfigChange = (name: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      model_config: {
        ...prev.model_config,
        [name]: value
      }
    }));
  };

  const handleVectorStoreToggle = (enabled: boolean) => {
    setFormData((prev) => ({
      ...prev,
      vector_store: {
        ...prev.vector_store,
        enabled,
        collection_name: enabled ? 
          (prev.vector_store?.collection_name || `${prev.name?.toLowerCase().replace(/\s+/g, '_')}_docs`) : 
          prev.vector_store?.collection_name || ''
      }
    }));
  };

  const simulateFileUpload = () => {
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
            
            // Update document count in vector store
            const fileCount = fileInputRef.current?.files?.length || 0;
            setFormData(prev => ({
              ...prev,
              vector_store: {
                ...prev.vector_store,
                document_count: (prev.vector_store?.document_count || 0) + fileCount
              }
            }));
            
            toast({
              title: "Files uploaded",
              description: `${fileCount} files have been processed and added to the vector store.`,
            });
            
            return 100;
          }
          return newProgress;
        });
      }, 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      toast({
        title: "Agent updated",
        description: "Agent settings have been successfully updated.",
      });
      onClose();
    } catch (error) {
      console.error('Error saving agent:', error);
      toast({
        title: "Error updating agent",
        description: "An error occurred while updating the agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!agent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/80 backdrop-blur-sm border-gray-800 text-white sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BrainCircuit className="h-5 w-5 text-electric-blue" />
            Edit Agent: {agent.name}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-4 bg-black/30 border border-gray-800">
              <TabsTrigger value="general" className="data-[state=active]:bg-electric-blue/10">
                General
              </TabsTrigger>
              <TabsTrigger value="configuration" className="data-[state=active]:bg-electric-blue/10">
                Model
              </TabsTrigger>
              <TabsTrigger value="knowledge" className="data-[state=active]:bg-electric-blue/10">
                Knowledge
              </TabsTrigger>
              <TabsTrigger value="deployment" className="data-[state=active]:bg-electric-blue/10">
                Deployment
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Agent Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter agent name"
                  className="bg-black/40 border-gray-700"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what this agent does"
                  className="bg-black/40 border-gray-700 min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category || 'general'}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger className="bg-black/40 border-gray-700">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="customer-service">Customer Service</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="configuration" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="system_prompt">System Prompt</Label>
                <Textarea
                  id="system_prompt"
                  name="system_prompt"
                  value={formData.system_prompt}
                  onChange={handleChange}
                  placeholder="Enter the system prompt for your agent"
                  className="bg-black/40 border-gray-700 min-h-[150px]"
                />
                <p className="text-sm text-muted-foreground">
                  This prompt defines the behavior, personality, and capabilities of your agent.
                </p>
              </div>
              
              <div className="space-y-4 bg-black/20 border border-gray-800 rounded-md p-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-medium">Model Configuration</h4>
                    <p className="text-xs text-muted-foreground">Adjust model parameters for optimal performance</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Select
                        value={formData.model_config?.model || 'gpt-4o'}
                        onValueChange={(value) => handleModelConfigChange('model', value)}
                      >
                        <SelectTrigger className="bg-black/40 border-gray-700">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="gpt-4o">OpenAI: GPT-4o</SelectItem>
                          <SelectItem value="gpt-4-turbo">OpenAI: GPT-4-Turbo (2024)</SelectItem>
                          <SelectItem value="o3-mini">OpenAI: o3-mini</SelectItem>
                          <SelectItem value="claude-3-5-sonnet">Claude: Claude 3.5 Sonnet</SelectItem>
                          <SelectItem value="claude-3-opus">Claude: Claude 3 Opus</SelectItem>
                          <SelectItem value="claude-3-haiku">Claude: Claude 3.0 Haiku</SelectItem>
                          <SelectItem value="gemini-2-pro">Gemini: Gemini 2.0 Pro</SelectItem>
                          <SelectItem value="gemini-2-flash">Gemini: Gemini 2.0 Flash</SelectItem>
                          <SelectItem value="gemini-1-5-flash">Gemini: Gemini 1.5 Flash</SelectItem>
                          <SelectItem value="deepseek-v3">DeepSeek: DeepSeek-V3</SelectItem>
                          <SelectItem value="deepseek-r1">DeepSeek: DeepSeek-R1</SelectItem>
                          <SelectItem value="janus-pro-7b">DeepSeek: Janus-Pro-7B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="max_tokens">Max Tokens</Label>
                      <Input
                        id="max_tokens"
                        type="number"
                        value={formData.model_config?.max_tokens || 4096}
                        onChange={(e) => handleModelConfigChange('max_tokens', parseInt(e.target.value))}
                        className="bg-black/40 border-gray-700"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="temperature">Temperature: {formData.model_config?.temperature || 0.7}</Label>
                      <span className="text-xs text-muted-foreground">Creativity vs. Determinism</span>
                    </div>
                    <Input
                      id="temperature"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.model_config?.temperature || 0.7}
                      onChange={(e) => handleModelConfigChange('temperature', parseFloat(e.target.value))}
                      className="bg-black/40 border-gray-700"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>More focused (0)</span>
                      <span>More creative (1)</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="top_p">Top P: {formData.model_config?.top_p || 1}</Label>
                      <span className="text-xs text-muted-foreground">Diversity Control</span>
                    </div>
                    <Input
                      id="top_p"
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={formData.model_config?.top_p || 1}
                      onChange={(e) => handleModelConfigChange('top_p', parseFloat(e.target.value))}
                      className="bg-black/40 border-gray-700"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="frequency_penalty">Frequency Penalty</Label>
                      <Input
                        id="frequency_penalty"
                        type="number"
                        min="-2"
                        max="2"
                        step="0.1"
                        value={formData.model_config?.frequency_penalty || 0}
                        onChange={(e) => handleModelConfigChange('frequency_penalty', parseFloat(e.target.value))}
                        className="bg-black/40 border-gray-700"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="presence_penalty">Presence Penalty</Label>
                      <Input
                        id="presence_penalty"
                        type="number"
                        min="-2"
                        max="2"
                        step="0.1"
                        value={formData.model_config?.presence_penalty || 0}
                        onChange={(e) => handleModelConfigChange('presence_penalty', parseFloat(e.target.value))}
                        className="bg-black/40 border-gray-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="knowledge" className="space-y-4 py-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Knowledge Base</h3>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="vector-store-enabled" className="mr-2">Enable Vector Store</Label>
                  <Switch 
                    id="vector-store-enabled" 
                    checked={formData.vector_store?.enabled || false}
                    onCheckedChange={handleVectorStoreToggle}
                  />
                </div>
              </div>
              
              {formData.vector_store?.enabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="collection-name">Collection Name</Label>
                    <Input
                      id="collection-name"
                      value={formData.vector_store?.collection_name || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        vector_store: {
                          ...prev.vector_store,
                          collection_name: e.target.value
                        }
                      }))}
                      className="bg-black/40 border-gray-700"
                      placeholder="e.g., my_agent_docs"
                    />
                    <p className="text-xs text-muted-foreground">
                      A unique identifier for this agent's document collection
                    </p>
                  </div>
                  
                  <div className="p-4 border border-gray-800 rounded-md bg-black/30">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="text-sm font-medium">Upload Documents</h4>
                        <p className="text-xs text-muted-foreground">
                          Add PDFs, text files, or web pages to your agent's knowledge base
                        </p>
                      </div>
                      <div>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          multiple 
                          accept=".pdf,.txt,.docx,.md" 
                          className="hidden" 
                          onChange={simulateFileUpload}
                        />
                        <Button
                          type="button"
                          variant="outline"
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
                      <div className="my-2">
                        <Progress value={uploadProgress} className="h-2" />
                        <p className="text-xs text-right mt-1">{uploadProgress}%</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-md mt-2">
                      <div className="flex items-center">
                        <Database className="h-4 w-4 text-electric-blue mr-2" />
                        <span className="text-sm">{formData.vector_store?.document_count || 0} documents indexed</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={!formData.vector_store?.document_count}
                        onClick={() => {
                          toast({
                            title: "Not implemented",
                            description: "This feature is coming soon.",
                          });
                        }}
                      >
                        <Search className="h-3 w-3 mr-1" /> Browse
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {!formData.vector_store?.enabled && (
                <div className="bg-black/20 border border-gray-800 rounded-md p-6 text-center">
                  <Database className="h-10 w-10 text-gray-600 mx-auto mb-4" />
                  <h4 className="text-lg font-medium mb-2">No Knowledge Sources</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect documents, websites, or databases to enhance your agent's capabilities.
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="border-gray-700"
                    onClick={() => handleVectorStoreToggle(true)}
                  >
                    Enable Vector Store
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="deployment" className="space-y-4 py-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Deployment Options</h3>
                <Button variant="outline" className="border-gray-700">
                  <Globe className="h-4 w-4 mr-2" />
                  View Live
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/20 border border-gray-800 rounded-md">
                  <div className="flex items-center">
                    <div className="p-2 rounded-md bg-electric-blue/10 mr-3">
                      <Globe className="h-5 w-5 text-electric-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium">Web Widget</h4>
                      <p className="text-sm text-muted-foreground">Embed a chat widget on your website</p>
                    </div>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-black/20 border border-gray-800 rounded-md">
                  <div className="flex items-center">
                    <div className="p-2 rounded-md bg-cyberpunk-purple/10 mr-3">
                      <Blocks className="h-5 w-5 text-cyberpunk-purple" />
                    </div>
                    <div>
                      <h4 className="font-medium">API Endpoint</h4>
                      <p className="text-sm text-muted-foreground">Access via REST API</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-700"
            >
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-electric-blue hover:bg-electric-blue/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AgentEditDialog;
