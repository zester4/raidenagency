
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Activity,
  Cpu,
  Plus,
  ChevronUp,
  ChevronDown,
  CircleOff,
  Zap,
  Clock,
  BarChart3
} from 'lucide-react';

interface DashboardMetrics {
  total_agents: number;
  active_agents: number;
  total_activities: number;
  last_activity_at: string | null;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data, error } = await supabase
          .from('user_dashboard_metrics')
          .select('*')
          .eq('user_id', user?.id)
          .single();

        if (error) {
          console.error('Error fetching dashboard data:', error);
          // If no data is found, initialize with zeros
          setMetrics({
            total_agents: 0,
            active_agents: 0,
            total_activities: 0,
            last_activity_at: null
          });
        } else {
          setMetrics(data);
        }
      } catch (error) {
        console.error('Error in dashboard data fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Format the date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  // Generate some random performance data for visualization
  const getRandomPerformance = () => {
    return {
      value: Math.floor(Math.random() * 100),
      change: Math.floor(Math.random() * 40) - 20,
    };
  };

  const performanceData = {
    efficiency: getRandomPerformance(),
    reliability: getRandomPerformance(),
    speed: getRandomPerformance(),
  };

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Welcome back, {user?.user_metadata?.first_name || 'Agent'}
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your AI agents today.
        </p>
      </div>
      
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Agents Card */}
        <Card className="bg-black/40 border-gray-800 shadow-lg backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400 flex items-center">
              <Cpu className="mr-2 h-4 w-4 text-electric-blue" />
              Total Agents
            </CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-20 bg-gray-800" />
            ) : (
              <CardTitle className="text-2xl text-white">
                {metrics?.total_agents || 0}
              </CardTitle>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-400">
              <Button variant="link" size="sm" className="h-auto p-0 text-holographic-teal">
                <Plus className="h-3 w-3 mr-1" /> Add New Agent
              </Button>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-24 h-24 bg-electric-blue/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        </Card>

        {/* Active Agents Card */}
        <Card className="bg-black/40 border-gray-800 shadow-lg backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400 flex items-center">
              <Zap className="mr-2 h-4 w-4 text-holographic-teal" />
              Active Agents
            </CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-20 bg-gray-800" />
            ) : (
              <CardTitle className="text-2xl text-white">
                {metrics?.active_agents || 0}
              </CardTitle>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-400 flex items-center">
              {loading ? (
                <Skeleton className="h-4 w-full bg-gray-800" />
              ) : (
                <>
                  {metrics?.active_agents === 0 ? (
                    <CircleOff className="h-3 w-3 mr-1 text-red-500" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-holographic-teal mr-2 animate-pulse"></div>
                  )}
                  {metrics?.active_agents === 0 
                    ? "No active agents" 
                    : `${Math.round((metrics?.active_agents || 0) / (metrics?.total_agents || 1) * 100)}% of total agents`}
                </>
              )}
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-24 h-24 bg-holographic-teal/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        </Card>

        {/* Activity Count Card */}
        <Card className="bg-black/40 border-gray-800 shadow-lg backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400 flex items-center">
              <Activity className="mr-2 h-4 w-4 text-cyberpunk-purple" />
              Total Activities
            </CardDescription>
            {loading ? (
              <Skeleton className="h-8 w-20 bg-gray-800" />
            ) : (
              <CardTitle className="text-2xl text-white">
                {metrics?.total_activities || 0}
              </CardTitle>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-400 flex items-center">
              <Clock className="h-3 w-3 mr-1 text-gray-400" />
              {loading ? (
                <Skeleton className="h-4 w-full bg-gray-800" />
              ) : (
                `Last activity: ${formatDate(metrics?.last_activity_at)}`
              )}
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyberpunk-purple/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        </Card>

        {/* Performance Card */}
        <Card className="bg-black/40 border-gray-800 shadow-lg backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400 flex items-center">
              <BarChart3 className="mr-2 h-4 w-4 text-yellow-500" />
              Performance Index
            </CardDescription>
            <CardTitle className="text-2xl text-white">
              {loading ? (
                <Skeleton className="h-8 w-20 bg-gray-800" />
              ) : (
                `${Math.round((performanceData.efficiency.value + performanceData.reliability.value + performanceData.speed.value) / 3)}%`
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-400 flex items-center">
              {performanceData.efficiency.change > 0 ? (
                <ChevronUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <ChevronDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              {Math.abs(performanceData.efficiency.change)}% from last week
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        </Card>
      </div>
      
      {/* Agent Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-black/40 border-gray-800 shadow-lg backdrop-blur-sm col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl text-white">Agent Performance</CardTitle>
            <CardDescription>
              Real-time metrics from your AI agent network
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full bg-gray-800" />
                ))}
              </div>
            ) : metrics?.total_agents === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">You don't have any agents yet</p>
                <Button className="bg-cyberpunk-purple hover:bg-cyberpunk-purple/80">
                  <Plus className="mr-2 h-4 w-4" /> Create Your First Agent
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Efficiency Meter */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Efficiency</span>
                    <span className="text-sm font-medium text-electric-blue">{performanceData.efficiency.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-electric-blue to-cyberpunk-purple" 
                      style={{ width: `${performanceData.efficiency.value}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Reliability Meter */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Reliability</span>
                    <span className="text-sm font-medium text-holographic-teal">{performanceData.reliability.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyberpunk-purple to-holographic-teal" 
                      style={{ width: `${performanceData.reliability.value}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Speed Meter */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Response Speed</span>
                    <span className="text-sm font-medium text-yellow-500">{performanceData.speed.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-holographic-teal to-yellow-500" 
                      style={{ width: `${performanceData.speed.value}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Quick Actions Card */}
        <Card className="bg-black/40 border-gray-800 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-electric-blue hover:bg-electric-blue/80 text-black font-medium flex items-center justify-center">
              <Plus className="mr-2 h-4 w-4" /> New Agent
            </Button>
            
            <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800 flex items-center justify-center">
              <Activity className="mr-2 h-4 w-4 text-holographic-teal" /> View Activity Logs
            </Button>
            
            <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800 flex items-center justify-center">
              <BarChart3 className="mr-2 h-4 w-4 text-cyberpunk-purple" /> Generate Report
            </Button>
            
            <Button variant="ghost" className="w-full hover:bg-gray-800 flex items-center justify-center">
              <Settings className="mr-2 h-4 w-4 text-gray-400" /> Configure Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-black via-gray-900 to-black border-gray-800 shadow-lg overflow-hidden relative mb-4">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                Welcome to Your Raiden Agents Dashboard
              </h3>
              <p className="text-gray-300 mb-4">
                This is where you can monitor and manage your AI agents. Get started by creating your first agent.
              </p>
              <Button className="bg-cyberpunk-purple hover:bg-cyberpunk-purple/80">
                Explore Features
              </Button>
            </div>
            <div className="hidden md:block relative h-40">
              {/* Decorative elements */}
              <div className="absolute top-0 left-1/2 w-40 h-40 bg-electric-blue/20 rounded-full blur-3xl transform -translate-x-1/2"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyberpunk-purple/20 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-4 border-electric-blue rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-cyberpunk-purple rounded-full"></div>
            </div>
          </div>
        </CardContent>
        {/* Decorative circuit pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <img src="/circuit-board.svg" alt="" className="w-full h-full object-cover" />
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default Dashboard;
