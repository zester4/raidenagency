
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Sidebar, 
  SidebarProvider, 
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  Home,
  Server,
  BarChart3,
  Users2,
  Settings,
  Bell,
  LogOut,
  Search,
  Menu,
  X,
  BrainCircuit,
  Wrench,
  CreditCard,
  MessageSquare,
  Sparkles,
  Database
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign out failed",
        description: "There was an issue signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getInitials = () => {
    if (!user) return 'RA';
    
    // Try to get from metadata
    const metadata = user.user_metadata;
    if (metadata && metadata.first_name && metadata.last_name) {
      return `${metadata.first_name[0]}${metadata.last_name[0]}`.toUpperCase();
    }
    
    // Fallback to email
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    
    return 'RA';
  };

  const getUserName = () => {
    if (!user) return 'Raiden User';
    
    const metadata = user.user_metadata;
    if (metadata && metadata.first_name && metadata.last_name) {
      return `${metadata.first_name} ${metadata.last_name}`;
    }
    
    return user.email?.split('@')[0] || 'Raiden User';
  };

  const clearNotifications = () => {
    setNotificationCount(0);
    toast({
      title: "Notifications cleared",
      description: "All notifications have been marked as read.",
    });
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-raiden-black text-white flex">
        {/* Sidebar */}
        <Sidebar variant="sidebar" className="bg-black/50 border-r border-gray-800">
          <SidebarHeader>
            <div className="flex items-center space-x-2 px-4 py-2">
              <div 
                className="w-8 h-8 bg-gradient-to-r from-electric-blue to-cyberpunk-purple rounded-full flex items-center justify-center"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
              >
                <span className="text-white font-bold">R</span>
              </div>
              <span 
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-cyberpunk-purple"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
              >
                Raiden
              </span>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-500 text-xs font-bold uppercase tracking-wider px-4">
                Main Navigation
              </SidebarGroupLabel>
              
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location.pathname === '/dashboard'}
                    onClick={() => navigate('/dashboard')}
                    tooltip="Dashboard"
                  >
                    <Home className="mr-2 h-4 w-4 text-electric-blue" /> Dashboard
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location.pathname === '/dashboard/agents' || location.pathname === '/dashboard/playground'}
                    onClick={() => navigate('/dashboard/agents')}
                    tooltip="Agents"
                  >
                    <BrainCircuit className="mr-2 h-4 w-4 text-cyberpunk-purple" /> Agents
                    <Badge className="ml-auto mr-1 bg-cyberpunk-purple/80 text-xs">AI</Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location.pathname === '/dashboard/playground'}
                    onClick={() => navigate('/dashboard/playground')}
                    tooltip="Playground"
                  >
                    <Sparkles className="mr-2 h-4 w-4 text-holographic-teal" /> Playground
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location.pathname === '/dashboard/tools'}
                    onClick={() => navigate('/dashboard/tools')}
                    tooltip="Tools"
                  >
                    <Wrench className="mr-2 h-4 w-4 text-holographic-teal" /> Tools
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location.pathname === '/dashboard/analytics'}
                    onClick={() => navigate('/dashboard/analytics')}
                    tooltip="Analytics"
                  >
                    <BarChart3 className="mr-2 h-4 w-4 text-holographic-teal" /> Analytics
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-500 text-xs font-bold uppercase tracking-wider px-4">
                Business
              </SidebarGroupLabel>
              
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location.pathname === '/dashboard/team'}
                    onClick={() => navigate('/dashboard/team')}
                    tooltip="Team"
                  >
                    <Users2 className="mr-2 h-4 w-4 text-electric-blue" /> Team
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location.pathname === '/dashboard/pricing'}
                    onClick={() => navigate('/dashboard/pricing')}
                    tooltip="Pricing"
                  >
                    <CreditCard className="mr-2 h-4 w-4 text-cyberpunk-purple" /> Billing
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-500 text-xs font-bold uppercase tracking-wider px-4">
                Data & Settings
              </SidebarGroupLabel>
              
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={false}
                    onClick={() => toast({
                      title: "Coming Soon",
                      description: "The knowledge base feature is coming soon.",
                    })}
                    tooltip="Knowledge Base"
                  >
                    <Database className="mr-2 h-4 w-4 text-gray-400" /> Knowledge Base
                    <Badge className="ml-auto mr-1 bg-gray-700 text-xs">Soon</Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location.pathname === '/dashboard/settings'}
                    onClick={() => navigate('/dashboard/settings')}
                    tooltip="Settings"
                  >
                    <Settings className="mr-2 h-4 w-4 text-gray-400" /> Settings
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter>
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-4 p-2 rounded-md hover:bg-gray-800/50 transition-colors">
                <Avatar className="h-8 w-8 border border-gray-700">
                  <AvatarFallback className="bg-gray-800 text-white">
                    {getInitials()}
                  </AvatarFallback>
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{getUserName()}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-white border-gray-700 hover:bg-gray-800"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        {/* Mobile Menu */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-electric-blue to-cyberpunk-purple rounded-full flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-cyberpunk-purple">
                Raiden
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/90 pt-20">
            <div className="flex flex-col p-4 space-y-4">
              <Button
                variant="ghost"
                className="justify-start text-left"
                onClick={() => {
                  navigate('/dashboard');
                  setIsMobileMenuOpen(false);
                }}
              >
                <Home className="mr-2 h-5 w-5 text-electric-blue" /> Dashboard
              </Button>
              
              <Button
                variant="ghost"
                className="justify-start text-left"
                onClick={() => {
                  navigate('/dashboard/agents');
                  setIsMobileMenuOpen(false);
                }}
              >
                <BrainCircuit className="mr-2 h-5 w-5 text-cyberpunk-purple" /> Agents
              </Button>
              
              <Button
                variant="ghost"
                className="justify-start text-left"
                onClick={() => {
                  navigate('/dashboard/playground');
                  setIsMobileMenuOpen(false);
                }}
              >
                <Sparkles className="mr-2 h-5 w-5 text-holographic-teal" /> Playground
              </Button>
              
              <Button
                variant="ghost"
                className="justify-start text-left"
                onClick={() => {
                  navigate('/dashboard/tools');
                  setIsMobileMenuOpen(false);
                }}
              >
                <Wrench className="mr-2 h-5 w-5 text-holographic-teal" /> Tools
              </Button>
              
              <Button
                variant="ghost"
                className="justify-start text-left"
                onClick={() => {
                  navigate('/dashboard/analytics');
                  setIsMobileMenuOpen(false);
                }}
              >
                <BarChart3 className="mr-2 h-5 w-5 text-holographic-teal" /> Analytics
              </Button>
              
              <Button
                variant="ghost"
                className="justify-start text-left"
                onClick={() => {
                  navigate('/dashboard/team');
                  setIsMobileMenuOpen(false);
                }}
              >
                <Users2 className="mr-2 h-5 w-5 text-electric-blue" /> Team
              </Button>
              
              <Button
                variant="ghost"
                className="justify-start text-left"
                onClick={() => {
                  navigate('/dashboard/settings');
                  setIsMobileMenuOpen(false);
                }}
              >
                <Settings className="mr-2 h-5 w-5 text-gray-400" /> Settings
              </Button>
              
              <div className="pt-4 border-t border-gray-800">
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-5 w-5" /> Sign out
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Main Header */}
          <header className="bg-black/30 backdrop-blur-sm shadow-md border-b border-gray-800 p-4 flex justify-between items-center sticky top-0 z-10">
            <div className="hidden md:flex w-full max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search agents, tools, docs..."
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-md bg-black/40 border border-gray-700 text-white focus:outline-none focus:border-electric-blue"
                />
              </div>
            </div>
            
            <div className="md:hidden"></div> {/* Placeholder for mobile */}
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-gray-300 hover:text-white"
                onClick={clearNotifications}
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-cyberpunk-purple"></span>
                )}
              </Button>
              
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 border border-gray-700">
                  <AvatarFallback className="bg-gray-800 text-white">
                    {getInitials()}
                  </AvatarFallback>
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                </Avatar>
                
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">{getUserName()}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
            </div>
          </header>
          
          {/* Content Area */}
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
