
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  LineChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { 
  BarChart2, 
  PieChart as PieChartIcon, 
  Activity, 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  Clock, 
  DollarSign,
  Zap,
  Filter,
  Download,
  Calendar,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

// Mock data for the charts
const usageData = [
  { name: 'Jan', requests: 4000, tokens: 2400, cost: 300 },
  { name: 'Feb', requests: 3000, tokens: 1398, cost: 200 },
  { name: 'Mar', requests: 2000, tokens: 9800, cost: 290 },
  { name: 'Apr', requests: 2780, tokens: 3908, cost: 340 },
  { name: 'May', requests: 1890, tokens: 4800, cost: 400 },
  { name: 'Jun', requests: 2390, tokens: 3800, cost: 310 },
  { name: 'Jul', requests: 3490, tokens: 4300, cost: 380 },
];

const modelUsageData = [
  { name: 'GPT-4o', value: 40 },
  { name: 'Claude 3', value: 30 },
  { name: 'GPT-4o mini', value: 20 },
  { name: 'Gemini Pro', value: 10 },
];

const COLORS = ['#0088FE', '#9c27f5', '#00C49F', '#FFBB28'];

const responseTimeData = [
  { name: 'Week 1', time: 2.5 },
  { name: 'Week 2', time: 2.3 },
  { name: 'Week 3', time: 2.2 },
  { name: 'Week 4', time: 2.0 },
  { name: 'Week 5', time: 1.8 },
  { name: 'Week 6', time: 1.7 },
  { name: 'Week 7', time: 1.6 },
  { name: 'Week 8', time: 1.5 },
];

const agentPerformanceData = [
  { 
    name: 'Customer Support', 
    satisfaction: 92, 
    responseTime: 1.2, 
    queries: 1200, 
    cost: 150 
  },
  { 
    name: 'Sales Assistant', 
    satisfaction: 88, 
    responseTime: 1.5, 
    queries: 800, 
    cost: 120 
  },
  { 
    name: 'Knowledge Base', 
    satisfaction: 95, 
    responseTime: 1.0, 
    queries: 1500, 
    cost: 200 
  },
  { 
    name: 'HR Assistant', 
    satisfaction: 90, 
    responseTime: 1.3, 
    queries: 600, 
    cost: 80 
  },
];

const Analytics = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div 
        className="absolute inset-0 bg-[url(/neural-network.svg)] bg-no-repeat bg-cover opacity-10 pointer-events-none"
        style={{ backgroundPosition: 'center 20%' }}
      />
      
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-24 mt-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-black/50 backdrop-blur-sm border border-gray-800 rounded-full mb-4">
            <BarChart2 className="w-5 h-5 text-electric-blue mr-2" />
            <span className="text-gray-300">Analytics & Insights</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading mb-4">Understand Your <span className="text-gradient">AI Performance</span></h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Comprehensive analytics to monitor, optimize, and scale your AI agents.
          </p>
        </div>

        {/* Analytics Controls */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="border-gray-700 text-white flex items-center"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Last 30 Days
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-700 text-white flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          <Button 
            variant="outline" 
            className="border-gray-700 text-white flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-gray-800 bg-black/20 backdrop-blur-sm hover:border-electric-blue/50 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <MessageSquare className="h-4 w-4 text-electric-blue mr-2" />
                Total Queries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">24,892</div>
              <div className="flex items-center text-sm text-emerald-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from last month
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-800 bg-black/20 backdrop-blur-sm hover:border-electric-blue/50 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Clock className="h-4 w-4 text-cyberpunk-purple mr-2" />
                Avg. Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">1.8s</div>
              <div className="flex items-center text-sm text-emerald-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5.2% faster than last month
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-800 bg-black/20 backdrop-blur-sm hover:border-electric-blue/50 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <AlertTriangle className="h-4 w-4 text-amber-400 mr-2" />
                Error Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">1.2%</div>
              <div className="flex items-center text-sm text-emerald-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                -0.3% from last month
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-800 bg-black/20 backdrop-blur-sm hover:border-electric-blue/50 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <DollarSign className="h-4 w-4 text-holographic-teal mr-2" />
                Total Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">$317.42</div>
              <div className="flex items-center text-sm text-emerald-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                -2.1% from last month
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Analytics Tabs */}
        <Tabs defaultValue="usage" className="mb-8">
          <TabsList className="bg-black/30 border border-gray-800 mb-6">
            <TabsTrigger value="usage" className="data-[state=active]:bg-electric-blue/10">
              Usage Analytics
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-electric-blue/10">
              Agent Performance
            </TabsTrigger>
            <TabsTrigger value="conversations" className="data-[state=active]:bg-electric-blue/10">
              Conversation Analytics
            </TabsTrigger>
            <TabsTrigger value="optimization" className="data-[state=active]:bg-electric-blue/10">
              Optimization
            </TabsTrigger>
          </TabsList>
          
          {/* Usage Analytics Tab */}
          <TabsContent value="usage" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border-gray-800 bg-black/20 backdrop-blur-sm col-span-2">
                <CardHeader>
                  <CardTitle>Usage Overview</CardTitle>
                  <CardDescription>Monthly API requests and token usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={usageData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                        <XAxis dataKey="name" stroke="#999" />
                        <YAxis stroke="#999" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                            border: '1px solid #444',
                            borderRadius: '4px',
                            color: '#fff' 
                          }} 
                        />
                        <Legend />
                        <Bar dataKey="requests" name="API Requests" fill="#0091FF" />
                        <Bar dataKey="tokens" name="Tokens Used (thousands)" fill="#9c27f5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Model Usage Distribution</CardTitle>
                  <CardDescription>API calls by model type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={modelUsageData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {modelUsageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                            border: '1px solid #444',
                            borderRadius: '4px',
                            color: '#fff' 
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Cost Analysis</CardTitle>
                  <CardDescription>Monthly cost by API usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={usageData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                        <XAxis dataKey="name" stroke="#999" />
                        <YAxis stroke="#999" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                            border: '1px solid #444',
                            borderRadius: '4px',
                            color: '#fff' 
                          }} 
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="cost" 
                          name="Cost ($)" 
                          stroke="#00C49F" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Agent Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Agent Performance Comparison</CardTitle>
                  <CardDescription>Satisfaction rates and response times</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={agentPerformanceData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                        <XAxis dataKey="name" stroke="#999" />
                        <YAxis stroke="#999" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                            border: '1px solid #444',
                            borderRadius: '4px',
                            color: '#fff' 
                          }} 
                        />
                        <Legend />
                        <Bar dataKey="satisfaction" name="Satisfaction %" fill="#0091FF" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Response Time Evolution</CardTitle>
                  <CardDescription>Average response time in seconds</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={responseTimeData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                        <XAxis dataKey="name" stroke="#999" />
                        <YAxis stroke="#999" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                            border: '1px solid #444',
                            borderRadius: '4px',
                            color: '#fff' 
                          }} 
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="time" 
                          name="Response Time (s)" 
                          stroke="#9c27f5" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Agent Breakdown</CardTitle>
                <CardDescription>Performance metrics by agent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="pb-3 text-gray-500">Agent Name</th>
                        <th className="pb-3 text-gray-500">Queries</th>
                        <th className="pb-3 text-gray-500">Avg. Response Time</th>
                        <th className="pb-3 text-gray-500">Satisfaction</th>
                        <th className="pb-3 text-gray-500">Cost</th>
                        <th className="pb-3 text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agentPerformanceData.map((agent, i) => (
                        <tr key={i} className="border-b border-gray-800">
                          <td className="py-4">{agent.name}</td>
                          <td className="py-4">{agent.queries}</td>
                          <td className="py-4">{agent.responseTime}s</td>
                          <td className="py-4">{agent.satisfaction}%</td>
                          <td className="py-4">${agent.cost}</td>
                          <td className="py-4">
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                              <span>Online</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Placeholder for other tabs */}
          <TabsContent value="conversations">
            <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Conversation Analysis</CardTitle>
                <CardDescription>Coming soon: In-depth analysis of agent conversations</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-20">
                <MessageSquare className="h-16 w-16 text-gray-600 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Conversation Analytics</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  This feature is currently in development. It will provide detailed insights into your agent conversations, including sentiment analysis, common topics, and user satisfaction metrics.
                </p>
                <Button variant="outline" className="border-gray-700">
                  Join Beta Program
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="optimization">
            <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Performance Optimization</CardTitle>
                <CardDescription>Coming soon: AI-powered recommendations to improve your agents</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-20">
                <Zap className="h-16 w-16 text-amber-500 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Agent Optimization</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Our AI-powered optimization engine will analyze your agents' performance and provide actionable recommendations to improve response accuracy, speed, and user satisfaction.
                </p>
                <Button variant="outline" className="border-gray-700">
                  Join Beta Program
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-black/70 to-black/70 backdrop-blur-sm border border-gray-800 rounded-2xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url(/circuit-board.svg)] bg-cover opacity-20" />
            
            <h2 className="text-3xl md:text-4xl font-heading mb-4 relative z-10">
              Ready to Optimize Your AI Agents?
            </h2>
            <p className="text-xl text-gray-400 mb-8 relative z-10">
              Upgrade to our Pro or Enterprise plan for advanced analytics, optimization tools, and dedicated support.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Button 
                className="bg-gradient-to-r from-electric-blue to-cyberpunk-purple hover:from-electric-blue/90 hover:to-cyberpunk-purple/90 text-lg px-8 py-6 h-auto"
              >
                <BrainCircuit className="mr-2 h-5 w-5" />
                Upgrade Now
              </Button>
              <Button 
                variant="outline"
                className="border-gray-700 hover:bg-black/40 text-lg px-8 py-6 h-auto"
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analytics;
