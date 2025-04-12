
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart3, 
  Users, 
  Zap, 
  Settings as SettingsIcon, 
  PlusCircle, 
  ArrowUpRight, 
  BrainCircuit, 
  MessageSquare, 
  Clock, 
  Database,
  BadgeCheck
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Logo from '@/components/Logo';
import { Badge } from '@/components/ui/badge';
import AgentCard from '@/components/dashboard/AgentCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user?.id) {
          // Fetch user metadata
          const { data: authData } = await supabase.auth.getUser();
          
          setUserData({
            id: user.id,
            email: user.email,
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
            ...authData?.user?.user_metadata
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin w-10 h-10 border-4 border-electric-blue border-opacity-50 rounded-full border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-8 w-8 text-electric-blue" />
            <h1 className="text-3xl font-heading">Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Welcome back, {userData?.first_name || user?.email}</p>
        </header>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="bg-black/30 border border-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-electric-blue/10 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="agents" className="data-[state=active]:bg-electric-blue/10 flex items-center gap-2">
              <Users className="h-4 w-4" /> My Agents
            </TabsTrigger>
            <TabsTrigger value="usage" className="data-[state=active]:bg-electric-blue/10 flex items-center gap-2">
              <Zap className="h-4 w-4" /> Usage
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-electric-blue/10 flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" /> Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Welcome Card */}
            <Card className="border-gray-800 bg-black/20 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/10 to-cyberpunk-purple/10 rounded-lg"></div>
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-2xl">
                  Welcome to <span className="text-electric-blue">Raiden Agents</span>
                </CardTitle>
                <CardDescription>
                  Your AI agent platform for powerful business automation
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="mb-4">
                  <p className="text-sm text-gray-300 mb-2">
                    Create your first AI agent to start automating tasks, extract insights from data, 
                    or provide instant customer support.
                  </p>
                </div>
                <Button className="bg-cyberpunk-purple hover:bg-cyberpunk-purple/90">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Agent
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-electric-blue" />
                    Active Agents
                  </CardTitle>
                  <CardDescription>Total deployed agents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">0</div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Deploy Agent
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-holo-teal" />
                    API Usage
                  </CardTitle>
                  <CardDescription>Current monthly usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">0%</div>
                  <div className="mt-4">
                    <div className="flex justify-between mb-1 text-xs">
                      <span>0/1000 requests</span>
                      <span>Free Tier</span>
                    </div>
                    <Progress value={0} className="h-2 bg-gray-700" indicatorClassName="bg-holo-teal" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-cyber-purple" />
                    Subscription
                  </CardTitle>
                  <CardDescription>Current plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold flex items-center">
                    Free
                    <Badge className="ml-2 bg-cyber-purple hover:bg-cyber-purple">Trial</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Upgrade
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-electric-blue" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your recent interactions with the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  No recent activity to display
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="space-y-4 mt-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading text-white">My AI Agents</h2>
              <Button className="bg-cyberpunk-purple hover:bg-cyberpunk-purple/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Agent
              </Button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AgentCard 
                type="template"
                name="Customer Support Agent"
                description="AI agent that can handle customer inquiries and support tickets."
                icon={<MessageSquare className="h-6 w-6 text-electric-blue" />}
              />
              
              <AgentCard 
                type="template"
                name="Data Analysis Agent"
                description="Process and extract insights from your business data."
                icon={<Database className="h-6 w-6 text-holo-teal" />}
              />
              
              <AgentCard 
                type="template"
                name="Marketing Assistant"
                description="Generate content and analyze marketing campaign performance."
                icon={<ArrowUpRight className="h-6 w-6 text-cyber-purple" />}
              />
            </div>
            
            <Card className="border-gray-800 bg-black/20 backdrop-blur-sm mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-electric-blue" />
                  Agent History
                </CardTitle>
                <CardDescription>
                  Previously created and deployed agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  You haven't deployed any agents yet
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-electric-blue hover:bg-electric-blue/90">Create Your First Agent</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4 mt-4">
            <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-electric-blue" />
                  Usage Stats
                </CardTitle>
                <CardDescription>
                  Detailed metrics of your platform usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">API Requests</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Total Requests</span>
                        <span className="font-medium">0/1000</span>
                      </div>
                      <Progress value={0} className="h-2 bg-gray-700" indicatorClassName="bg-electric-blue" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Agent Deployments</span>
                        <span className="font-medium">0/5</span>
                      </div>
                      <Progress value={0} className="h-2 bg-gray-700" indicatorClassName="bg-cyber-purple" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Storage Used</span>
                        <span className="font-medium">0/1GB</span>
                      </div>
                      <Progress value={0} className="h-2 bg-gray-700" indicatorClassName="bg-holo-teal" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-gray-800 bg-black/30 backdrop-blur-sm">
                    <CardHeader className="py-4 px-5">
                      <CardTitle className="text-sm font-medium">Current Billing Cycle</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 px-5">
                      <div className="text-xl font-bold">
                        Free Trial
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Expires in 30 days
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-gray-800 bg-black/30 backdrop-blur-sm">
                    <CardHeader className="py-4 px-5">
                      <CardTitle className="text-sm font-medium">Plan Limits</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 px-5">
                      <div className="text-xl font-bold">
                        Basic
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Limited features and capacity
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <Button className="w-full">View Detailed Usage Analytics</Button>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
                <Button variant="outline">Export Data</Button>
                <Button className="bg-cyberpunk-purple hover:bg-cyberpunk-purple/90">Upgrade Plan</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-4">
            <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5 text-electric-blue" />
                  Quick Settings
                </CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Profile Information</h3>
                  <div className="grid gap-2">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Email</span>
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Account Created</span>
                      <span>{new Date(user?.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Last Sign In</span>
                      <span>{user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => window.location.href = '/dashboard/settings'}>
                  Go to Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
