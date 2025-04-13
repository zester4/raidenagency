
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Cell, 
  Legend, 
  Line, 
  LineChart, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  FilterX, 
  PieChart as PieChartIcon, 
  RefreshCw, 
  TrendingUp, 
  Zap, 
  Calendar, 
  MessageSquare,
  BrainCircuit,
  Loader2,
  FileType,
  ArrowUpRight,
  ArrowDownRight,
  CircleDollarSign,
  HelpCircle,
} from 'lucide-react';
import {
  Tooltip as TooltipComponent,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Mock data for charts
const last30DaysUsage = [
  { day: '1', requests: 45, tokens: 3200 },
  { day: '2', requests: 53, tokens: 4100 },
  { day: '3', requests: 41, tokens: 2800 },
  { day: '4', requests: 67, tokens: 5600 },
  { day: '5', requests: 58, tokens: 4900 },
  { day: '6', requests: 62, tokens: 5100 },
  { day: '7', requests: 78, tokens: 6300 },
  { day: '8', requests: 82, tokens: 6800 },
  { day: '9', requests: 69, tokens: 5700 },
  { day: '10', requests: 73, tokens: 6200 },
  { day: '11', requests: 84, tokens: 7100 },
  { day: '12', requests: 91, tokens: 7800 },
  { day: '13', requests: 86, tokens: 7300 },
  { day: '14', requests: 92, tokens: 8100 },
  { day: '15', requests: 102, tokens: 8900 },
  { day: '16', requests: 97, tokens: 8300 },
  { day: '17', requests: 89, tokens: 7600 },
  { day: '18', requests: 95, tokens: 8200 },
  { day: '19', requests: 119, tokens: 9700 },
  { day: '20', requests: 127, tokens: 10400 },
  { day: '21', requests: 115, tokens: 9300 },
  { day: '22', requests: 132, tokens: 11200 },
  { day: '23', requests: 143, tokens: 12100 },
  { day: '24', requests: 128, tokens: 10800 },
  { day: '25', requests: 147, tokens: 12600 },
  { day: '26', requests: 153, tokens: 13200 },
  { day: '27', requests: 164, tokens: 14300 },
  { day: '28', requests: 175, tokens: 15100 },
  { day: '29', requests: 182, tokens: 15800 },
  { day: '30', requests: 195, tokens: 16900 },
];

const agentPerformance = [
  { name: 'Customer Support', messages: 378, responseTime: 1.2, satisfaction: 92 },
  { name: 'Knowledge Base', messages: 245, responseTime: 0.8, satisfaction: 89 },
  { name: 'Sales Assistant', messages: 187, responseTime: 1.5, satisfaction: 85 },
  { name: 'Data Analyst', messages: 134, responseTime: 2.1, satisfaction: 91 },
  { name: 'Coding Helper', messages: 95, responseTime: 1.8, satisfaction: 88 },
];

const usageByModel = [
  { name: 'Gemini 1.5 Pro', value: 42, color: '#3b82f6' },
  { name: 'Llama-3.1-70B', value: 28, color: '#0ea5e9' },
  { name: 'Mixtral 8x7B', value: 15, color: '#06b6d4' },
  { name: 'Claude 3 Opus', value: 10, color: '#14b8a6' },
  { name: 'Other', value: 5, color: '#6b7280' },
];

const Analytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    // Simulate refreshing data
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Data refreshed",
      description: "Analytics data has been updated with the latest information.",
    });
    setIsRefreshing(false);
  };

  const handleExportData = (format: 'csv' | 'xlsx') => {
    toast({
      title: `Exporting as ${format.toUpperCase()}`,
      description: `Your analytics data is being exported as a ${format.toUpperCase()} file.`,
    });
    // In a real app, this would trigger a download
  };

  const getPercentChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-6 w-6 text-electric-blue" />
            <h1 className="text-2xl font-bold">Analytics</h1>
          </div>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-electric-blue mx-auto mb-4" />
              <h3 className="text-lg font-medium">Loading analytics data...</h3>
              <p className="text-gray-400 mt-1">This may take a few moments</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-electric-blue" />
            <h1 className="text-2xl font-bold">Analytics</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] bg-black/30 border-gray-700">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-gray-700">
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="6m">Last 6 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRefreshData}
                disabled={isRefreshing}
                className="border-gray-700"
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleExportData('csv')}
                      className="border-gray-700"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export as CSV</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-400">Total API Requests</p>
                  <div className="text-2xl font-bold mt-1">3,247</div>
                  <div className="flex items-center mt-1">
                    <Badge className="bg-green-600 text-xs px-1 py-0 h-4">+12.8%</Badge>
                    <span className="text-xs text-gray-400 ml-1">vs previous</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-electric-blue/20 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-electric-blue" />
                </div>
              </div>
              <div className="mt-4 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={last30DaysUsage.slice(-14)}>
                    <Line 
                      type="monotone" 
                      dataKey="requests" 
                      stroke="#0ea5e9" 
                      strokeWidth={2} 
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-400">Total Tokens</p>
                  <div className="text-2xl font-bold mt-1">267,412</div>
                  <div className="flex items-center mt-1">
                    <Badge className="bg-green-600 text-xs px-1 py-0 h-4">+9.4%</Badge>
                    <span className="text-xs text-gray-400 ml-1">vs previous</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-cyberpunk-purple/20 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-cyberpunk-purple" />
                </div>
              </div>
              <div className="mt-4 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={last30DaysUsage.slice(-14)}>
                    <Line 
                      type="monotone" 
                      dataKey="tokens" 
                      stroke="#8b5cf6" 
                      strokeWidth={2} 
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-400">Active Agents</p>
                  <div className="text-2xl font-bold mt-1">5</div>
                  <div className="flex items-center mt-1">
                    <Badge className="bg-green-600 text-xs px-1 py-0 h-4">+2</Badge>
                    <span className="text-xs text-gray-400 ml-1">this month</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-holographic-teal/20 flex items-center justify-center">
                  <BrainCircuit className="h-5 w-5 text-holographic-teal" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs text-gray-400 mb-1">Deployment status</div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="flex h-full">
                    <div className="bg-green-500 h-full" style={{ width: '60%' }}></div>
                    <div className="bg-yellow-500 h-full" style={{ width: '20%' }}></div>
                    <div className="bg-gray-600 h-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-green-500">3 Online</span>
                  <span className="text-yellow-500">1 Degraded</span>
                  <span className="text-gray-500">1 Offline</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-400">Estimated Cost</p>
                  <div className="text-2xl font-bold mt-1">$18.42</div>
                  <div className="flex items-center mt-1">
                    <Badge className="bg-red-600 text-xs px-1 py-0 h-4">+15.3%</Badge>
                    <span className="text-xs text-gray-400 ml-1">vs previous</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                  <CircleDollarSign className="h-5 w-5 text-pink-500" />
                </div>
              </div>
              <div className="mt-4 h-10">
                <div className="flex items-center">
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-electric-blue to-cyberpunk-purple h-full rounded-full" 
                      style={{ width: '67%' }}
                    ></div>
                  </div>
                  <span className="text-xs ml-2">67%</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-400">Budget: $27.50</span>
                  <span className="text-gray-400">Pro Plan</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="usage" className="space-y-6">
          <TabsList className="bg-black/30 border border-gray-800">
            <TabsTrigger value="usage" className="data-[state=active]:bg-electric-blue/10 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Usage Metrics
            </TabsTrigger>
            <TabsTrigger value="agents" className="data-[state=active]:bg-electric-blue/10 flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" /> Agent Performance
            </TabsTrigger>
            <TabsTrigger value="models" className="data-[state=active]:bg-electric-blue/10 flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" /> Model Distribution
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="usage" className="space-y-6">
            <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 text-electric-blue mr-2" />
                  API Usage Over Time
                </CardTitle>
                <CardDescription>
                  Track your API requests and token usage over the selected time period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={last30DaysUsage}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="requestsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="tokensGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="day"
                        tick={{ fill: '#9ca3af' }}
                        tickLine={{ stroke: '#4b5563' }}
                      />
                      <YAxis 
                        yAxisId="left"
                        tick={{ fill: '#9ca3af' }}
                        tickLine={{ stroke: '#4b5563' }}
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        tick={{ fill: '#9ca3af' }}
                        tickLine={{ stroke: '#4b5563' }}
                      />
                      <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                          borderColor: '#4b5563',
                          borderRadius: '0.375rem',
                          color: '#f9fafb'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="requests"
                        stroke="#0ea5e9"
                        fillOpacity={1}
                        fill="url(#requestsGradient)"
                        yAxisId="left"
                        name="API Requests"
                      />
                      <Area
                        type="monotone"
                        dataKey="tokens"
                        stroke="#8b5cf6"
                        fillOpacity={1}
                        fill="url(#tokensGradient)"
                        yAxisId="right"
                        name="Tokens Used"
                      />
                      <Legend 
                        verticalAlign="top" 
                        height={36}
                        wrapperStyle={{
                          paddingTop: '10px',
                          color: '#f9fafb'
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-800 pt-4">
                <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-10">
                  <div>
                    <span className="text-xs text-gray-400">Total API Requests</span>
                    <div className="text-xl font-bold">3,247</div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Total Tokens Used</span>
                    <div className="text-xl font-bold">267,412</div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Average Daily Requests</span>
                    <div className="text-xl font-bold">108.2</div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Peak Day</span>
                    <div className="text-xl font-bold">Day 30 (195)</div>
                  </div>
                </div>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Zap className="h-5 w-5 text-electric-blue mr-2" />
                    API Usage Breakdown
                  </CardTitle>
                  <CardDescription>
                    Distribution of API usage by endpoint type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Chat', value: 1942 },
                          { name: 'Embeddings', value: 687 },
                          { name: 'Document', value: 381 },
                          { name: 'Search', value: 237 },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name"
                          tick={{ fill: '#9ca3af' }}
                          tickLine={{ stroke: '#4b5563' }}
                        />
                        <YAxis 
                          tick={{ fill: '#9ca3af' }}
                          tickLine={{ stroke: '#4b5563' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                            borderColor: '#4b5563',
                            borderRadius: '0.375rem',
                            color: '#f9fafb'
                          }}
                          formatter={(value) => [`${value} requests`, 'Usage']}
                        />
                        <Bar 
                          dataKey="value" 
                          name="API Requests"
                          barSize={40}
                        >
                          <Cell fill="#0ea5e9" />
                          <Cell fill="#8b5cf6" />
                          <Cell fill="#14b8a6" />
                          <Cell fill="#6366f1" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FileType className="h-5 w-5 text-electric-blue mr-2" />
                    Monthly Usage Trend
                  </CardTitle>
                  <CardDescription>
                    Month-over-month growth in API usage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: 'Jan', current: 1247, previous: 982 },
                          { month: 'Feb', current: 1842, previous: 1247 },
                          { month: 'Mar', current: 2153, previous: 1842 },
                          { month: 'Apr', current: 2879, previous: 2153 },
                          { month: 'May', current: 3247, previous: 2879 },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="month"
                          tick={{ fill: '#9ca3af' }}
                          tickLine={{ stroke: '#4b5563' }}
                        />
                        <YAxis 
                          tick={{ fill: '#9ca3af' }}
                          tickLine={{ stroke: '#4b5563' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                            borderColor: '#4b5563',
                            borderRadius: '0.375rem',
                            color: '#f9fafb'
                          }}
                        />
                        <Legend 
                          verticalAlign="top" 
                          height={36}
                          wrapperStyle={{
                            paddingTop: '10px',
                            color: '#f9fafb'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="current" 
                          name="Current Year" 
                          stroke="#0ea5e9" 
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="previous" 
                          name="Previous Year" 
                          stroke="#6b7280" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-800 pt-4">
                  <div className="w-full flex justify-between">
                    <div>
                      <div className="text-xs text-gray-400">Month-over-Month</div>
                      <div className="flex items-center mt-1">
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-500 font-medium">+12.8%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Year-over-Year</div>
                      <div className="flex items-center mt-1">
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-500 font-medium">+230.9%</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-400 mr-1">Projected EOY:</span>
                      <Badge variant="outline">+325%</Badge>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="agents" className="space-y-6">
            <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BrainCircuit className="h-5 w-5 text-cyberpunk-purple mr-2" />
                  Agent Performance
                </CardTitle>
                <CardDescription>
                  Compare the performance metrics of your deployed agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-gray-800">
                        <th className="pb-3">Agent</th>
                        <th className="pb-3">Messages</th>
                        <th className="pb-3">Response Time</th>
                        <th className="pb-3">Satisfaction</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agentPerformance.map((agent, index) => (
                        <tr 
                          key={agent.name} 
                          className={index < agentPerformance.length - 1 ? "border-b border-gray-800" : ""}
                        >
                          <td className="py-4">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-black/40 border border-gray-700 flex items-center justify-center mr-3">
                                <BrainCircuit className="h-4 w-4 text-electric-blue" />
                              </div>
                              <div>
                                <div className="font-medium">{agent.name}</div>
                                <div className="text-xs text-gray-400">
                                  {agent.name === 'Customer Support' ? 'Support' : 
                                   agent.name === 'Knowledge Base' ? 'Documentation' : 
                                   agent.name === 'Sales Assistant' ? 'Sales' : 
                                   agent.name === 'Data Analyst' ? 'Analytics' : 'Development'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">{agent.messages.toLocaleString()}</td>
                          <td className="py-4">
                            <div className="flex items-center">
                              <span className={agent.responseTime < 1 ? "text-green-500" : 
                                               agent.responseTime < 2 ? "text-yellow-500" : "text-red-500"}>
                                {agent.responseTime}s
                              </span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-3 w-3 text-gray-500 ml-1" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Average response time</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center space-x-2">
                              <Progress 
                                value={agent.satisfaction} 
                                className="h-2 w-20 bg-gray-700"
                                indicatorClassName={
                                  agent.satisfaction >= 90 ? "bg-green-500" : 
                                  agent.satisfaction >= 80 ? "bg-yellow-500" : "bg-red-500"
                                }
                              />
                              <span className="text-xs">{agent.satisfaction}%</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <Badge 
                              className={index % 3 === 0 ? "bg-green-600" : 
                                         index % 3 === 1 ? "bg-yellow-600" : "bg-gray-600"}
                            >
                              {index % 3 === 0 ? "Online" : 
                               index % 3 === 1 ? "Degraded" : "Offline"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-gray-800 bg-black/20 backdrop-blur-sm md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="h-5 w-5 text-electric-blue mr-2" />
                    Agent Usage Over Time
                  </CardTitle>
                  <CardDescription>
                    Messages processed by each agent over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={[
                          { date: 'Week 1', 'Customer Support': 58, 'Knowledge Base': 35, 'Sales Assistant': 22, 'Data Analyst': 18, 'Coding Helper': 12 },
                          { date: 'Week 2', 'Customer Support': 67, 'Knowledge Base': 42, 'Sales Assistant': 31, 'Data Analyst': 23, 'Coding Helper': 15 },
                          { date: 'Week 3', 'Customer Support': 73, 'Knowledge Base': 49, 'Sales Assistant': 38, 'Data Analyst': 27, 'Coding Helper': 19 },
                          { date: 'Week 4', 'Customer Support': 86, 'Knowledge Base': 54, 'Sales Assistant': 43, 'Data Analyst': 31, 'Coding Helper': 23 },
                          { date: 'Week 5', 'Customer Support': 94, 'Knowledge Base': 65, 'Sales Assistant': 53, 'Data Analyst': 35, 'Coding Helper': 26 },
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorSupport" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="colorKB" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="date"
                          tick={{ fill: '#9ca3af' }}
                          tickLine={{ stroke: '#4b5563' }}
                        />
                        <YAxis 
                          tick={{ fill: '#9ca3af' }}
                          tickLine={{ stroke: '#4b5563' }}
                        />
                        <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                            borderColor: '#4b5563',
                            borderRadius: '0.375rem',
                            color: '#f9fafb'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="Customer Support" 
                          stroke="#0ea5e9" 
                          fillOpacity={1}
                          fill="url(#colorSupport)" 
                          stackId="1"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="Knowledge Base" 
                          stroke="#8b5cf6" 
                          fillOpacity={1}
                          fill="url(#colorKB)" 
                          stackId="1"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="Sales Assistant" 
                          stroke="#14b8a6" 
                          fillOpacity={1}
                          fill="url(#colorSales)" 
                          stackId="1"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="Data Analyst" 
                          stroke="#f97316" 
                          fillOpacity={1}
                          fill="rgba(249, 115, 22, 0.1)" 
                          stackId="1"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="Coding Helper" 
                          stroke="#6b7280" 
                          fillOpacity={1}
                          fill="rgba(107, 114, 128, 0.1)" 
                          stackId="1"
                        />
                        <Legend 
                          verticalAlign="top" 
                          height={36}
                          wrapperStyle={{
                            paddingTop: '10px',
                            color: '#f9fafb'
                          }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MessageSquare className="h-5 w-5 text-cyberpunk-purple mr-2" />
                    Agent Engagement
                  </CardTitle>
                  <CardDescription>
                    Distribution of user engagement with agents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={agentPerformance}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="messages"
                          nameKey="name"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {agentPerformance.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={
                                index === 0 ? '#0ea5e9' : 
                                index === 1 ? '#8b5cf6' : 
                                index === 2 ? '#14b8a6' : 
                                index === 3 ? '#f97316' : '#6b7280'
                              } 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                            borderColor: '#4b5563',
                            borderRadius: '0.375rem',
                            color: '#f9fafb'
                          }}
                          formatter={(value, name) => [`${value} messages`, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="models" className="space-y-6">
            <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <PieChartIcon className="h-5 w-5 text-electric-blue mr-2" />
                  Model Usage Distribution
                </CardTitle>
                <CardDescription>
                  Breakdown of token consumption by model
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/2 h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={usageByModel}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {usageByModel.map((entry) => (
                            <Cell 
                              key={`cell-${entry.name}`} 
                              fill={entry.color} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                            borderColor: '#4b5563',
                            borderRadius: '0.375rem',
                            color: '#f9fafb'
                          }}
                          formatter={(value, name) => [`${value}%`, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="w-full md:w-1/2 p-4">
                    <h3 className="text-lg font-medium mb-4">Model Comparison</h3>
                    <div className="space-y-4">
                      {usageByModel.slice(0, 4).map((model) => (
                        <div key={model.name}>
                          <div className="flex justify-between mb-1">
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: model.color }}
                              ></div>
                              <span>{model.name}</span>
                            </div>
                            <span>{model.value}%</span>
                          </div>
                          <Progress 
                            value={model.value} 
                            className="h-2 bg-gray-700"
                            indicatorClassName={`bg-[${model.color}]`}
                          />
                          <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>
                              {model.name === 'Gemini 1.5 Pro' ? '121,327 tokens' : 
                               model.name === 'Llama-3.1-70B' ? '80,877 tokens' : 
                               model.name === 'Mixtral 8x7B' ? '43,328 tokens' : 
                               model.name === 'Claude 3 Opus' ? '28,885 tokens' : '14,443 tokens'}
                            </span>
                            <span>
                              {model.name === 'Gemini 1.5 Pro' ? '$0.91' : 
                               model.name === 'Llama-3.1-70B' ? '$0.11' : 
                               model.name === 'Mixtral 8x7B' ? '$0.05' : 
                               model.name === 'Claude 3 Opus' ? '$0.28' : '$0.02'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-800">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Total Usage</span>
                        <span>267,412 tokens</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Estimated Cost</span>
                        <span className="font-bold">$1.37</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-800 pt-4">
                <div className="text-sm text-gray-400 italic">
                  Cost estimates are approximate and may vary based on actual usage.
                </div>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="h-5 w-5 text-electric-blue mr-2" />
                    Model Performance
                  </CardTitle>
                  <CardDescription>
                    Comparing response time and accuracy across models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Gemini 1.5 Pro', responseTime: 2.1, accuracy: 93 },
                          { name: 'Llama-3.1-70B', responseTime: 0.9, accuracy: 89 },
                          { name: 'Mixtral 8x7B', responseTime: 0.7, accuracy: 85 },
                          { name: 'Claude 3 Opus', responseTime: 3.2, accuracy: 94 },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name"
                          tick={{ fill: '#9ca3af' }}
                          tickLine={{ stroke: '#4b5563' }}
                        />
                        <YAxis 
                          yAxisId="left"
                          tick={{ fill: '#9ca3af' }}
                          tickLine={{ stroke: '#4b5563' }}
                          label={{ value: 'Response Time (s)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          domain={[0, 100]}
                          tick={{ fill: '#9ca3af' }}
                          tickLine={{ stroke: '#4b5563' }}
                          label={{ value: 'Accuracy (%)', angle: 90, position: 'insideRight', fill: '#9ca3af' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                            borderColor: '#4b5563',
                            borderRadius: '0.375rem',
                            color: '#f9fafb'
                          }}
                        />
                        <Legend 
                          verticalAlign="top" 
                          height={36}
                          wrapperStyle={{
                            paddingTop: '10px',
                            color: '#f9fafb'
                          }}
                        />
                        <Bar 
                          dataKey="responseTime" 
                          name="Response Time (s)"
                          fill="#0ea5e9" 
                          yAxisId="left"
                          barSize={30}
                        />
                        <Bar 
                          dataKey="accuracy" 
                          name="Accuracy (%)"
                          fill="#8b5cf6" 
                          yAxisId="right"
                          barSize={30}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <CircleDollarSign className="h-5 w-5 text-electric-blue mr-2" />
                    Cost Efficiency
                  </CardTitle>
                  <CardDescription>
                    Cost per token and cost per successful response
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Gemini 1.5 Pro</span>
                        <span className="text-sm">$0.0075 / 1K tokens</span>
                      </div>
                      <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-electric-blue h-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Llama-3.1-70B</span>
                        <span className="text-sm">$0.0007 / 1K tokens</span>
                      </div>
                      <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-electric-blue h-full" style={{ width: '7%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Mixtral 8x7B</span>
                        <span className="text-sm">$0.0006 / 1K tokens</span>
                      </div>
                      <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-electric-blue h-full" style={{ width: '6%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Claude 3 Opus</span>
                        <span className="text-sm">$0.01 / 1K tokens</span>
                      </div>
                      <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-electric-blue h-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-800">
                    <h4 className="text-sm font-medium mb-3">Cost per Successful Response</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                        <div className="text-xs text-gray-400">Most Cost-Effective</div>
                        <div className="font-medium mt-1">Mixtral 8x7B</div>
                        <div className="text-xs text-gray-400 mt-1">$0.0024 per response</div>
                      </div>
                      
                      <div className="bg-black/30 p-3 rounded-md border border-gray-800">
                        <div className="text-xs text-gray-400">Highest Quality/Cost</div>
                        <div className="font-medium mt-1">Llama-3.1-70B</div>
                        <div className="text-xs text-gray-400 mt-1">$0.0045 per response</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-800 pt-4">
                  <Button variant="outline" className="border-gray-700 w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Export Cost Analysis
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
