import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, Label } from 'recharts';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DateRangePicker } from "@/components/date-range-picker";
import { DateRange } from '@/types/date-range';
import { DatabaseFunctions } from '@/types/database';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8'
];

const Analytics: React.FC = () => {
  const [agentUsage, setAgentUsage] = useState([]);
  const [dailyActiveUsers, setDailyActiveUsers] = useState([]);
  const [conversationData, setConversationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalyticsData();
  }, [date]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const fromDate = date?.from?.toISOString().split('T')[0];
      const toDate = date?.to?.toISOString().split('T')[0];

      const { data: agentUsageData, error: agentUsageError } = await supabase.rpc('get_agent_usage', {
        from_date: fromDate,
        to_date: toDate
      });

      if (agentUsageError) {
        console.error("Error fetching agent usage data:", agentUsageError);
        toast({
          title: "Error",
          description: "Failed to fetch agent usage data",
          variant: "destructive"
        });
      } else {
        setAgentUsage(agentUsageData || []);
      }

      const { data: dailyActiveUsersData, error: dailyActiveUsersError } = await supabase.rpc('get_daily_active_users', {
        from_date: fromDate,
        to_date: toDate
      });

      if (dailyActiveUsersError) {
        console.error("Error fetching daily active users:", dailyActiveUsersError);
        toast({
          title: "Error",
          description: "Failed to fetch daily active users",
          variant: "destructive"
        });
      } else {
        setDailyActiveUsers(dailyActiveUsersData || []);
      }

      const { data: conversationDataData, error: conversationDataError } = await supabase.rpc('get_daily_conversations', {
        from_date: fromDate,
        to_date: toDate
      });

      if (conversationDataError) {
        console.error("Error fetching conversation data:", conversationDataError);
        toast({
          title: "Error",
          description: "Failed to fetch conversation data",
          variant: "destructive"
        });
      } else {
        setConversationData(conversationDataData || []);
      }
    } catch (error) {
      console.error("Unexpected error fetching analytics data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAgentUsageMetrics = async (dateRange: DateRange) => {
    try {
      // Mock data until we have proper database functions
      return [
        { agent_name: 'Customer Support', usage_count: 125 },
        { agent_name: 'Sales Assistant', usage_count: 89 },
        { agent_name: 'Technical Support', usage_count: 45 }
      ];
    } catch (error) {
      console.error('Error fetching agent usage metrics:', error);
      return [];
    }
  };

  const fetchDailyActiveUsers = async (dateRange: DateRange) => {
    try {
      // Mock data until we have proper database functions
      return Array.from({ length: 30 }).map((_, i) => ({
        time: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        active_users: Math.floor(Math.random() * 100) + 50
      }));
    } catch (error) {
      console.error('Error fetching daily active users:', error);
      return [];
    }
  };

  const fetchDailyConversations = async (dateRange: DateRange) => {
    try {
      // Mock data until we have proper database functions
      return Array.from({ length: 30 }).map((_, i) => ({
        time: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        conversations: Math.floor(Math.random() * 200) + 100
      }));
    } catch (error) {
      console.error('Error fetching daily conversations:', error);
      return [];
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="tooltip-content bg-gray-800 p-2 rounded shadow">
          <p className="label">{`${data.name || ''}: ${data.value || ''}`}</p>
          {data.time && (
            <p className="data">{`Date: ${new Date(data.time).toLocaleDateString()}`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Analytics Dashboard</CardTitle>
              <CardDescription>
                Overview of agent usage and performance
              </CardDescription>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <DateRangePicker date={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading analytics data...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/40 border border-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Agent Usage</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      dataKey="usage_count"
                      isAnimationActive={false}
                      data={agentUsage}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {agentUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-black/40 border border-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Daily Active Users</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyActiveUsers} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis>
                      <Label angle={-90} value="Users" position="insideLeft" style={{ textAnchor: 'middle' }} />
                    </YAxis>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="active_users" stroke="#8884d8" name="Active Users" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-black/40 border border-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Daily Conversations</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={conversationData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis>
                      <Label angle={-90} value="Conversations" position="insideLeft" style={{ textAnchor: 'middle' }} />
                    </YAxis>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="conversations" fill="#82ca9d" name="Conversations" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
