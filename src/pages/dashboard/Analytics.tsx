import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  Label,
  LabelList,
  TooltipProps
} from 'recharts';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Calendar } from 'lucide-react';
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DateRangePicker } from "@/components/date-range-picker";
import { DatabaseFunctions } from '@/types/database';

interface AgentUsageData {
  agent_name: string;
  usage_count: number;
}

interface DailyActiveUsers {
  time: string;
  active_users: number;
}

interface ConversationData {
  time: string;
  conversations: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics: React.FC = () => {
  const [agentUsage, setAgentUsage] = useState<AgentUsageData[]>([]);
  const [dailyActiveUsers, setDailyActiveUsers] = useState<DailyActiveUsers[]>([]);
  const [conversationData, setConversationData] = useState<ConversationData[]>([]);
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

      // Mock data for now until we create the necessary database functions
      setAgentUsage([
        { agent_name: 'Customer Support', usage_count: 45 },
        { agent_name: 'Knowledge Base', usage_count: 30 },
        { agent_name: 'Sales Assistant', usage_count: 25 }
      ]);
      
      setDailyActiveUsers(Array.from({ length: 30 }, (_, i) => ({
        time: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        active_users: Math.floor(Math.random() * 100) + 50
      })));
      
      setConversationData(Array.from({ length: 30 }, (_, i) => ({
        time: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        conversations: Math.floor(Math.random() * 200) + 100
      })));

    } catch (error) {
      console.error("Unexpected error fetching analytics data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Custom tooltip component for Recharts
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
              {/* Agent Usage Chart */}
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
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Daily Active Users Chart */}
              <div className="bg-black/40 border border-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Daily Active Users</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyActiveUsers} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis>
                      <Label angle={-90} value="Users" position="insideLeft" style={{ textAnchor: 'middle' }} />
                    </YAxis>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="active_users" stroke="#8884d8" name="Active Users" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Daily Conversations Chart */}
              <div className="bg-black/40 border border-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Daily Conversations</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={conversationData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis>
                      <Label angle={-90} value="Conversations" position="insideLeft" style={{ textAnchor: 'middle' }} />
                    </YAxis>
                    <RechartsTooltip content={<CustomTooltip />} />
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
