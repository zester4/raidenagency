
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  BarChart3, 
  Users, 
  Bot, 
  CircleUser, 
  MessagesSquare, 
  Clock, 
  Award,
  TrendingUp,
  ArrowRight,
  Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const Analytics = () => {
  // Sample data for charts
  const conversationData = [
    { month: 'Jan', conversations: 120 },
    { month: 'Feb', conversations: 180 },
    { month: 'Mar', conversations: 250 },
    { month: 'Apr', conversations: 310 },
    { month: 'May', conversations: 480 },
    { month: 'Jun', conversations: 550 },
    { month: 'Jul', conversations: 620 },
  ];

  const usageByAgentData = [
    { name: 'Customer Support', value: 1200, color: '#0ea5e9' },
    { name: 'Technical Support', value: 800, color: '#8b5cf6' },
    { name: 'Sales Assistant', value: 950, color: '#10b981' },
    { name: 'Marketing Bot', value: 500, color: '#f59e0b' },
  ];

  const responseTimeData = [
    { day: 'Mon', avg: 1.2 },
    { day: 'Tue', avg: 1.1 },
    { day: 'Wed', avg: 0.9 },
    { day: 'Thu', avg: 1.5 },
    { day: 'Fri', avg: 1.3 },
    { day: 'Sat', avg: 0.8 },
    { day: 'Sun', avg: 0.7 },
  ];

  const metricCards = [
    {
      title: 'Total Conversations',
      value: '12,432',
      change: '+24%',
      icon: <MessagesSquare className="h-5 w-5 text-electric-blue" />,
      description: 'vs. previous month',
    },
    {
      title: 'Active Agents',
      value: '8',
      change: '+2',
      icon: <Bot className="h-5 w-5 text-cyberpunk-purple" />,
      description: 'agents deployed',
    },
    {
      title: 'Avg. Response Time',
      value: '1.2s',
      change: '-0.3s',
      icon: <Clock className="h-5 w-5 text-holographic-teal" />,
      description: 'vs. previous month',
    },
    {
      title: 'User Satisfaction',
      value: '94%',
      change: '+2%',
      icon: <Award className="h-5 w-5 text-amber-500" />,
      description: 'based on feedback',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div
        className="absolute inset-0 bg-[url(/neural-network.svg)] bg-no-repeat bg-cover opacity-10 pointer-events-none"
        style={{ backgroundPosition: 'center 20%' }}
      />
      
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-24 mt-12 relative z-10">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-black/50 backdrop-blur-sm border border-gray-800 rounded-full mb-4">
            <BarChart3 className="w-5 h-5 text-electric-blue mr-2" />
            <span className="text-gray-300">Analytics</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading mb-4">Agent <span className="text-gradient">Performance</span> Analytics</h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Get detailed insights into how your AI agents are performing and identify opportunities for optimization.
          </p>
        </div>
        
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {metricCards.map((card, index) => (
            <Card key={index} className="border-gray-800 bg-black/30 backdrop-blur-sm hover:border-electric-blue/50 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium text-gray-300">{card.title}</CardTitle>
                  <div className="p-2 rounded-md bg-black/40 border border-gray-800">
                    {card.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold">{card.value}</span>
                  <span className={`text-sm ${card.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {card.change}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Main Analytics Dashboard */}
        <Tabs defaultValue="overview" className="mb-10">
          <TabsList className="bg-black/40 border border-gray-800 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Conversations Over Time */}
              <Card className="border-gray-800 bg-black/30 backdrop-blur-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle>Conversations Over Time</CardTitle>
                  <CardDescription>Total agent conversations per month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={conversationData}>
                        <defs>
                          <linearGradient id="colorConversations" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                            borderColor: '#374151',
                            color: '#f9fafb' 
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="conversations" 
                          stroke="#3b82f6" 
                          fillOpacity={1} 
                          fill="url(#colorConversations)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Usage by Agent */}
              <Card className="border-gray-800 bg-black/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Usage by Agent</CardTitle>
                  <CardDescription>Distribution of conversations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={usageByAgentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                        >
                          {usageByAgentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                            borderColor: '#374151',
                            color: '#f9fafb' 
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Average Response Time */}
              <Card className="border-gray-800 bg-black/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Average Response Time</CardTitle>
                  <CardDescription>Time taken to respond (seconds)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={responseTimeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="day" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                            borderColor: '#374151',
                            color: '#f9fafb' 
                          }} 
                        />
                        <Bar dataKey="avg" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Top Performing Agents */}
              <Card className="border-gray-800 bg-black/30 backdrop-blur-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle>Top Performing Agents</CardTitle>
                  <CardDescription>Based on user satisfaction and resolution rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Sales Assistant', rating: 98, conversations: 982, badge: 'Enterprise' },
                      { name: 'Customer Support', rating: 96, conversations: 1247, badge: 'Pro' },
                      { name: 'Technical Support', rating: 93, conversations: 763, badge: 'Enterprise' },
                      { name: 'Onboarding Guide', rating: 91, conversations: 582, badge: 'Pro' },
                    ].map((agent, index) => (
                      <div key={index} className="flex justify-between items-center p-4 border border-gray-800 bg-black/40 rounded-lg">
                        <div className="flex items-center">
                          <div className="p-2 rounded-md bg-black/60 border border-gray-700 mr-3">
                            <Bot className="h-5 w-5 text-electric-blue" />
                          </div>
                          <div>
                            <h3 className="font-medium">{agent.name}</h3>
                            <div className="flex items-center text-xs text-gray-400">
                              <span>{agent.conversations} conversations</span>
                              <span className="mx-2">•</span>
                              <Badge variant="outline" className="text-xs py-0 h-5 border-gray-700 bg-gray-900/50">
                                {agent.badge}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-lg font-semibold mr-2">{agent.rating}%</span>
                          <div className="p-1 rounded-full bg-green-500/20 text-green-500">
                            <TrendingUp className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="conversations">
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center p-4 rounded-full bg-black/40 border border-gray-800 mb-4">
                <Info className="h-6 w-6 text-electric-blue" />
              </div>
              <h3 className="text-xl font-medium mb-2">Advanced Analytics</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">Detailed conversation analytics are available in the dashboard for authenticated users.</p>
              <Button variant="default" className="bg-electric-blue hover:bg-electric-blue/90">
                View in Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="agents">
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center p-4 rounded-full bg-black/40 border border-gray-800 mb-4">
                <Info className="h-6 w-6 text-electric-blue" />
              </div>
              <h3 className="text-xl font-medium mb-2">Agent Analytics</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">Detailed agent performance metrics are available in the dashboard for authenticated users.</p>
              <Button variant="default" className="bg-electric-blue hover:bg-electric-blue/90">
                View in Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center p-4 rounded-full bg-black/40 border border-gray-800 mb-4">
                <Info className="h-6 w-6 text-electric-blue" />
              </div>
              <h3 className="text-xl font-medium mb-2">User Analytics</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">Detailed user engagement metrics are available in the dashboard for authenticated users.</p>
              <Button variant="default" className="bg-electric-blue hover:bg-electric-blue/90">
                View in Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* CTA Section */}
        <div className="mt-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-black/70 to-black/70 backdrop-blur-sm border border-gray-800 rounded-2xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url(/circuit-board.svg)] bg-cover opacity-20" />
            
            <h2 className="text-3xl md:text-4xl font-heading mb-4 relative z-10">
              Ready for deeper insights?
            </h2>
            <p className="text-xl text-gray-400 mb-8 relative z-10">
              Sign up for a Raiden account to access detailed analytics, custom reports, and real-time monitoring of your AI agents.
            </p>
            
            <Button 
              className="bg-gradient-to-r from-electric-blue to-cyberpunk-purple hover:from-electric-blue/90 hover:to-cyberpunk-purple/90 text-lg px-8 py-6 h-auto relative z-10"
            >
              Get Started
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analytics;
