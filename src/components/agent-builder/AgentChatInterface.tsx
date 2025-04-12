
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Bot, User, RefreshCw, X } from 'lucide-react';
import { UserAgent } from '@/lib/agent-service';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
}

interface AgentChatInterfaceProps {
  agent: UserAgent;
  onClose?: () => void;
}

const AgentChatInterface: React.FC<AgentChatInterfaceProps> = ({ agent, onClose }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'system',
      content: `Welcome to the chat with ${agent.name}. How can I assist you today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    try {
      // Simulate API call to agent
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a simulated response based on the agent's configuration
      let response = '';
      
      if (input.toLowerCase().includes('vector') || input.toLowerCase().includes('document')) {
        response = `Based on the documents in my knowledge base${agent.vector_store?.enabled ? ' (' + agent.vector_store.collection_name + ')' : ''}, I can provide you with information on this topic. ${agent.vector_store?.enabled ? 'I have access to ' + agent.vector_store.document_count + ' documents that might be relevant.' : 'However, my vector store is not enabled yet, so I don\'t have access to specific documents.'}`;
      } else if (input.toLowerCase().includes('model') || input.toLowerCase().includes('config')) {
        response = `I'm running on the ${agent.model_config?.model || 'default'} model with a temperature of ${agent.model_config?.temperature || 0.7}. This allows me to ${agent.model_config?.temperature && agent.model_config.temperature > 0.5 ? 'be quite creative in my responses' : 'provide more focused and deterministic answers'}.`;
      } else {
        response = `As ${agent.name}, I'm here to help with your questions about ${agent.category || 'general topics'}. ${agent.description || ''} Is there something specific you'd like to know?`;
      }
      
      // Add agent response
      const agentMessage: Message = {
        id: `agent_${Date.now()}`,
        role: 'agent',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Error processing message",
        description: "There was an issue communicating with the agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleReset = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'system',
        content: `Welcome to the chat with ${agent.name}. How can I assist you today?`,
        timestamp: new Date()
      }
    ]);
    toast({
      title: "Chat reset",
      description: "The conversation has been reset.",
    });
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Card className="border-gray-800 bg-black/60 backdrop-blur-md h-full flex flex-col">
      <CardHeader className="pb-2 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2 bg-electric-blue/20">
              <Bot className="h-4 w-4 text-electric-blue" />
            </Avatar>
            <div>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <CardDescription className="text-xs">
                {agent.category && (
                  <Badge variant="outline" className="mr-2 text-xs">
                    {agent.category}
                  </Badge>
                )}
                {agent.model_config?.model && (
                  <span className="text-gray-400">
                    Model: {agent.model_config.model}
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'system' ? (
                <div className="bg-gray-800/50 rounded-lg p-3 max-w-[80%]">
                  <p className="text-gray-300 text-sm">{message.content}</p>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              ) : message.role === 'user' ? (
                <div className="bg-cyberpunk-purple/20 rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center justify-end mb-1">
                    <span className="text-xs font-medium text-cyberpunk-purple mr-1">You</span>
                    <User className="h-3 w-3 text-cyberpunk-purple" />
                  </div>
                  <p className="text-gray-200 text-sm">{message.content}</p>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              ) : (
                <div className="bg-electric-blue/10 rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center mb-1">
                    <Bot className="h-3 w-3 text-electric-blue mr-1" />
                    <span className="text-xs font-medium text-electric-blue">{agent.name}</span>
                  </div>
                  <p className="text-gray-200 text-sm">{message.content}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-800 p-3">
        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            onClick={handleReset}
            className="h-9 w-9"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-black/40 border-gray-700"
            disabled={isProcessing}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isProcessing || !input.trim()} 
            className="h-9 w-9"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default AgentChatInterface;
