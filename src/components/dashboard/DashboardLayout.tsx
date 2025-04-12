
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Bot,
  Settings,
  CreditCard,
  Wrench,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Users,
  BarChart3
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSubscription } from '@/hooks/useSubscription';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const { currentPlan } = useSubscription();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);
  const [darkMode, setDarkMode] = useState(true);

  // Navigation Items
  const navItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: 'Dashboard',
      path: '/dashboard',
      active: location.pathname === '/dashboard'
    },
    {
      icon: <Bot className="h-5 w-5" />,
      label: 'Agent Builder',
      path: '/dashboard/agents',
      active: location.pathname === '/dashboard/agents'
    },
    {
      icon: <Wrench className="h-5 w-5" />,
      label: 'Tools',
      path: '/dashboard/tools',
      active: location.pathname === '/dashboard/tools'
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      label: 'Pricing',
      path: '/dashboard/pricing',
      active: location.pathname === '/dashboard/pricing'
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: 'Settings',
      path: '/dashboard/settings',
      active: location.pathname === '/dashboard/settings'
    }
  ];

  // Secondary Nav Items
  const secondaryNavItems = [
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: 'Analytics',
      path: '/analytics',
      active: location.pathname === '/analytics'
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Team',
      path: '/team',
      active: location.pathname === '/team'
    }
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-black to-gray-900">
      <div
        className="absolute inset-0 bg-[url(/hex-pattern.svg)] bg-repeat opacity-5 pointer-events-none"
      />

      {/* Sidebar */}
      <div 
        className={`fixed md:relative h-full z-40 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } border-r border-gray-800 bg-black/30 backdrop-blur-sm`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="px-4 py-5 flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-electric-blue to-cyberpunk-purple p-0.5 rounded-lg mr-2">
                  <div className="bg-black rounded-lg p-1">
                    <Bot className="h-5 w-5 text-electric-blue" />
                  </div>
                </div>
                <span className="text-white font-bold text-lg">Raiden</span>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="text-gray-400 hover:text-white"
            >
              {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
          </div>

          {/* Subscription Badge */}
          {!sidebarCollapsed && currentPlan && (
            <div className="px-4 mb-5">
              <Badge 
                variant="outline" 
                className={`
                  w-full justify-center py-1.5
                  ${currentPlan.name === 'Pro' ? 'border-electric-blue bg-electric-blue/10 text-electric-blue' : 
                    currentPlan.name === 'Enterprise' ? 'border-cyberpunk-purple bg-cyberpunk-purple/10 text-cyberpunk-purple' : 
                    'border-gray-600 bg-gray-900/40 text-gray-400'}
                `}
              >
                {currentPlan.name} Plan
              </Badge>
            </div>
          )}

          {/* Main Navigation */}
          <div className="flex-1 py-6">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center px-3 py-3 rounded-lg transition-colors
                    ${item.active 
                      ? 'bg-electric-blue/10 text-electric-blue' 
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                    }
                    ${sidebarCollapsed ? 'justify-center' : ''}
                  `}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!sidebarCollapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              ))}
            </nav>

            {/* Secondary Navigation */}
            <div className="mt-8">
              {!sidebarCollapsed && (
                <div className="px-4 mb-2">
                  <h3 className="text-xs text-gray-500 uppercase tracking-wider">Company</h3>
                </div>
              )}
              <nav className="px-2 space-y-1">
                {secondaryNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center px-3 py-3 rounded-lg transition-colors
                      ${item.active 
                        ? 'bg-gray-800/50 text-white' 
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                      }
                      ${sidebarCollapsed ? 'justify-center' : ''}
                    `}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!sidebarCollapsed && <span className="ml-3">{item.label}</span>}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-gray-800">
            {!sidebarCollapsed ? (
              <div className="flex items-center">
                <Avatar className="h-8 w-8 border border-gray-700 bg-gray-900">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-electric-blue/20 text-electric-blue">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.email}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleSignOut}
                  className="text-gray-400 hover:text-white"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-8 w-8 border border-gray-700 bg-gray-900">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-electric-blue/20 text-electric-blue">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleSignOut}
                  className="text-gray-400 hover:text-white"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Top Header */}
        {isMobile && (
          <div className="bg-black/30 backdrop-blur-sm border-b border-gray-800 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className="mr-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-electric-blue to-cyberpunk-purple p-0.5 rounded-lg mr-2">
                  <div className="bg-black rounded-lg p-1">
                    <Bot className="h-5 w-5 text-electric-blue" />
                  </div>
                </div>
                <span className="text-white font-bold text-lg">Raiden</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleDarkMode}
                className="text-gray-400 hover:text-white"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Avatar className="h-8 w-8 border border-gray-700">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-electric-blue/20 text-electric-blue">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-transparent relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
