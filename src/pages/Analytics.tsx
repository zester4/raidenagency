
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  TrendingUp,
  Users,
  MessageSquare,
  Bot,
} from 'lucide-react';

const Analytics = () => {
  // Sample data
  const usageData = [
    { name: 'Jan', agents: 420, messages: 5800, users: 145 },
    { name: 'Feb', agents: 480, messages: 6200, users: 168 },
    { name: 'Mar', agents: 550, messages: 7800, users: 192 },
    { name: 'Apr', agents: 590, messages: 8400, users: 213 },
    { name: 'May', agents: 640, messages: 9100, users: 241 },
    { name: 'Jun', agents: 720, messages: 10500, users: 276 },
    { name: 'Jul', agents: 850, messages: 12800, users: 320 },
  ];

  const agentTypeData = [
    { name: 'Customer Support', value: 45 },
    { name: 'Knowledge Base', value: 30 },
    { name: 'Sales', value: 15 },
    { name: 'Healthcare', value: 10 },
  ];

  const modelUsageData = [
    { name: 'GPT-4o', value: 40 },
    { name: 'Claude 3.5', value: 25 },
    { name: 'Meta-Llama-3', value: 20 },
    { name: 'Gemini', value: 15 },
  ];

  const performanceData = [
    { name: 'Mon', satisfaction: 92, resolution: 86, response: 94 },
    { name: 'Tue', satisfaction: 93, resolution: 89, response: 95 },
    { name: 'Wed', satisfaction: 95, resolution: 88, response: 93 },
    { name: 'Thu', satisfaction: 91, resolution: 84, response: 92 },
    { name: 'Fri', satisfaction: 94, resolution: 87, response: 96 },
    { name: 'Sat', satisfaction: 97, resolution: 90, response: 98 },
    { name: 'Sun', satisfaction: 96, resolution: 91, response: 97 },
  ];

  const colors = ['#0091FF', '#7928CA', '#00D0FF', '#FF3D71'];

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div 
        className="absolute inset-0 bg-[url(/neural-network.svg)] bg-no-repeat bg-cover opacity-10 pointer-events-none"
        style={{ backgroundPosition: 'center 20%' }}
      />
      
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-24 mt-12 relative z-10">
        {/* Analytics Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-black/50 backdrop-blur-sm border border-gray-800 rounded-full mb-4">
            <BarChart3 className="w-5 h-5 text-electric-blue mr-2" />
            <span className="text-gray-300">Platform Analytics</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading mb-4">Raiden Agents <span className="text-gradient">Analytics</span></h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Comprehensive insights into our platform's performance, usage patterns, and growth metrics.
          </p>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-gray-800 bg-black/30 backdrop-blur-sm hover:border-electric-blue/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
              <Bot className="h-4 w-4 text-electric-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,250</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="text-emerald-500 mr-1 h-3 w-3" />
                <span className="text-emerald-500">12% increase</span>
                <span className="text-gray-500 ml-1">vs. last month</span>
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-800 bg-black/30 backdrop-blur-sm hover:border-electric-blue/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-cyberpunk-purple" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">320</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="text-emerald-500 mr-1 h-3 w-3" />
                <span className="text-emerald-500">18% increase</span>
                <span className="text-gray-500 ml-1">vs. last month</span>
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-800 bg-black/30 backdrop-blur-sm hover:border-electric-blue/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-holographic-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,800</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="text-emerald-500 mr-1 h-3 w-3" />
                <span className="text-emerald-500">22% increase</span>
                <span className="text-gray-500 ml-1">vs. last month</span>
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-800 bg-black/30 backdrop-blur-sm hover:border-electric-blue/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Resolution Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="text-emerald-500 mr-1 h-3 w-3" />
                <span className="text-emerald-500">4% increase</span>
                <span className="text-gray-500 ml-1">vs. last month</span>
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="mb-16">
          <Card className="border-gray-800 bg-black/30 backdrop-blur-sm hover:border-electric-blue/50 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChartIcon className="h-5 w-5 text-electric-blue mr-2" />
                Platform Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="messages" className="mb-8">
                <TabsList className="grid grid-cols-3 bg-black/30 border border-gray-800">
                  <TabsTrigger value="messages" className="data-[state=active]:bg-electric-blue/10">
                    Messages
                  </TabsTrigger>
                  <TabsTrigger value="agents" className="data-[state=active]:bg-electric-blue/10">
                    Agents
                  </TabsTrigger>
                  <TabsTrigger value="users" className="data-[state=active]:bg-electric-blue/10">
                    Users
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="messages" className="mt-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#111', 
                            borderColor: '#444',
                            color: '#fff'
                          }} 
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="messages" 
                          stroke="#0091FF" 
                          strokeWidth={2} 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="agents" className="mt-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#111', 
                            borderColor: '#444',
                            color: '#fff'
                          }} 
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="agents" 
                          stroke="#7928CA" 
                          strokeWidth={2} 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="users" className="mt-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#111', 
                            borderColor: '#444',
                            color: '#fff'
                          }} 
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="users" 
                          stroke="#00D0FF" 
                          strokeWidth={2} 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Agent Types Distribution */}
          <Card className="border-gray-800 bg-black/30 backdrop-blur-sm hover:border-electric-blue/50 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChartIcon className="h-5 w-5 text-electric-blue mr-2" />
                Agent Types Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={agentTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {agentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} agents`, 'Count']}
                      contentStyle={{ 
                        backgroundColor: '#111', 
                        borderColor: '#444',
                        color: '#fff'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Model Usage Distribution */}
          <Card className="border-gray-800 bg-black/30 backdrop-blur-sm hover:border-electric-blue/50 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 text-electric-blue mr-2" />
                AI Model Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modelUsageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Usage']}
                      contentStyle={{ 
                        backgroundColor: '#111', 
                        borderColor: '#444',
                        color: '#fff'
                      }} 
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {modelUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Performance Metrics */}
        <Card className="border-gray-800 bg-black/30 backdrop-blur-sm hover:border-electric-blue/50 transition-all mb-16">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 text-electric-blue mr-2" />
              Agent Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Rate']}
                    contentStyle={{ 
                      backgroundColor: '#111', 
                      borderColor: '#444',
                      color: '#fff'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="satisfaction" 
                    name="User Satisfaction" 
                    stroke="#0091FF" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="resolution" 
                    name="Issue Resolution" 
                    stroke="#7928CA" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="response" 
                    name="Response Time" 
                    stroke="#00D0FF" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Data Analysis Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-gray-800 bg-black/30 backdrop-blur-sm hover:border-electric-blue/50 transition-all">
            <CardHeader>
              <CardTitle className="text-lg">Usage Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">
                Platform usage has consistently grown month-over-month, with the most significant increase in July. 
                Message volume has increased by 22% in the last month, suggesting growing user engagement.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-800 bg-black/30 backdrop-blur-sm hover:border-electric-blue/50 transition-all">
            <CardHeader>
              <CardTitle className="text-lg">Popular Agent Types</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">
                Customer support agents remain the most popular use case, accounting for 45% of all deployed agents. 
                Healthcare agents are showing the fastest growth rate at 35% month-over-month.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-800 bg-black/30 backdrop-blur-sm hover:border-electric-blue/50 transition-all">
            <CardHeader>
              <CardTitle className="text-lg">Performance Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">
                User satisfaction remains high with an average of 94% across all agent types. 
                Weekend performance consistently outperforms weekday metrics, suggesting different usage patterns.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analytics;
