import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Loader2, TrendingUp, Clock, PhoneOutgoing, PhoneIncoming, UserCheck } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { toast } from 'sonner';
import BatchCallHistory from './batch-call/BatchCallHistory';
import { Agent, BatchCall } from './batch-call/types';

const AnalyticsSection = () => {
  const { fetchWithAuth } = useApiContext();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [batches, setBatches] = useState<BatchCall[]>([]);
  const [batchAgents, setBatchAgents] = useState<Agent[]>([]);

  const mockAnalytics = {
    overview: {
      total_calls: 456,
      total_minutes: 4328,
      avg_call_duration: 9.5,
      successful_calls: 432,
      failed_calls: 24,
      success_rate: 94.7,
      inbound_calls: 215,
      outbound_calls: 241,
    },
    daily_calls: [
      { date: '05/01', calls: 35, minutes: 315 },
      { date: '05/02', calls: 42, minutes: 378 },
      { date: '05/03', calls: 58, minutes: 551 },
      { date: '05/04', calls: 75, minutes: 712 },
      { date: '05/05', calls: 81, minutes: 769 },
      { date: '05/06', calls: 92, minutes: 874 },
      { date: '05/07', calls: 73, minutes: 729 },
    ],
    call_duration: [
      { range: '0-1 min', count: 24 },
      { range: '1-3 min', count: 86 },
      { range: '3-5 min', count: 124 },
      { range: '5-10 min', count: 156 },
      { range: '10+ min', count: 66 },
    ],
    agent_performance: [
      { agent_id: 'agent_1', agent_name: 'Sales Agent', calls: 175, avg_duration: 8.2, success_rate: 96.0 },
      { agent_id: 'agent_2', agent_name: 'Support Agent', calls: 142, avg_duration: 11.5, success_rate: 92.3 },
      { agent_id: 'agent_3', agent_name: 'Appointment Scheduler', calls: 139, avg_duration: 8.9, success_rate: 95.7 },
    ],
    call_breakdown: [
      { name: 'Inbound', value: 215 },
      { name: 'Outbound', value: 241 },
    ],
    call_status: [
      { name: 'Successful', value: 432 },
      { name: 'Failed', value: 24 },
    ],
    busiest_hours: [
      { hour: '9AM', calls: 45 },
      { hour: '10AM', calls: 52 },
      { hour: '11AM', calls: 49 },
      { hour: '12PM', calls: 38 },
      { hour: '1PM', calls: 41 },
      { hour: '2PM', calls: 54 },
      { hour: '3PM', calls: 62 },
      { hour: '4PM', calls: 57 },
      { hour: '5PM', calls: 43 },
      { hour: '6PM', calls: 15 },
    ],
  };

  useEffect(() => {
    setAnalytics(mockAnalytics);
    setAgents(mockAnalytics.agent_performance.map(a => ({
      id: a.agent_id,
      name: a.agent_name,
    })));
    setBatches([
      {
        id: '1',
        status: 'completed',
        total_calls: 50,
        completed_calls: 48,
        failed_calls: 2,
        agent_id: 'agent_1',
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        status: 'in-progress',
        total_calls: 100,
        completed_calls: 45,
        failed_calls: 3,
        agent_id: 'agent_2',
        created_at: new Date().toISOString(),
      },
    ]);
    
    setBatchAgents([
      { id: 'agent_1', name: 'Sales Agent', agent_id: 'agent_1', voice_id: 'voice_1', agent_type: 'sales', last_modification_timestamp: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 'agent_2', name: 'Support Agent', agent_id: 'agent_2', voice_id: 'voice_2', agent_type: 'support', last_modification_timestamp: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 'agent_3', name: 'Appointment Scheduler', agent_id: 'agent_3', voice_id: 'voice_3', agent_type: 'scheduler', last_modification_timestamp: new Date().toISOString(), updated_at: new Date().toISOString() },
    ]);
    setLoading(false);
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from API
      // const data = await fetchWithAuth(`/analytics?timeRange=${timeRange}`);
      
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    toast.info(`Fetching data for the last ${range}`);
    // In a real app, we'd call fetchAnalytics() again
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Time Range:</span>
          <select
            className="h-9 rounded-md border border-input bg-background px-3"
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <PhoneOutgoing className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.total_calls}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 20)}% from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Minutes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.total_minutes}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 15)}% from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.avg_call_duration} min</div>
            <p className="text-xs text-muted-foreground">
              {Math.random() > 0.5 ? '+' : '-'}{Math.floor(Math.random() * 10)}% from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.success_rate}%</div>
            <p className="text-xs text-muted-foreground">
              +{(Math.random() * 2).toFixed(1)}% from last period
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agent Performance</TabsTrigger>
          <TabsTrigger value="hourly">Hourly Analysis</TabsTrigger>
          <TabsTrigger value="batch-history">Batch Call History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Call Volume</CardTitle>
                <CardDescription>
                  Daily call volume for the past week
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.daily_calls}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="calls" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Call Duration</CardTitle>
                <CardDescription>
                  Distribution of call durations
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.call_duration}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Call Direction</CardTitle>
                <CardDescription>
                  Inbound vs Outbound calls
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.call_breakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.call_breakdown.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Call Status</CardTitle>
                <CardDescription>
                  Successful vs Failed calls
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.call_status}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#4ade80" />
                      <Cell fill="#f87171" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Performance</CardTitle>
              <CardDescription>
                Call volume and success rate by agent
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.agent_performance}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="agent_name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="calls" fill="#8884d8" name="Total Calls" />
                  <Bar yAxisId="right" dataKey="success_rate" fill="#82ca9d" name="Success Rate (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.agent_performance.map((agent: any) => (
              <Card key={agent.agent_id}>
                <CardHeader>
                  <CardTitle>{agent.agent_name}</CardTitle>
                  <CardDescription>
                    Performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-muted-foreground">Total Calls:</dt>
                      <dd className="text-sm font-medium">{agent.calls}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-muted-foreground">Avg Duration:</dt>
                      <dd className="text-sm font-medium">{agent.avg_duration} min</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-muted-foreground">Success Rate:</dt>
                      <dd className="text-sm font-medium">{agent.success_rate}%</dd>
                    </div>
                  </dl>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Success Rate</span>
                      <span>{agent.success_rate}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${agent.success_rate}%` }} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="hourly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Call Volume by Hour</CardTitle>
              <CardDescription>
                Busiest hours of the day
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.busiest_hours}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="calls" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    name="Number of Calls"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Weekly Pattern</CardTitle>
              <CardDescription>
                Call volume by day of week
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { day: 'Monday', calls: 65 },
                    { day: 'Tuesday', calls: 78 },
                    { day: 'Wednesday', calls: 92 },
                    { day: 'Thursday', calls: 85 },
                    { day: 'Friday', calls: 72 },
                    { day: 'Saturday', calls: 43 },
                    { day: 'Sunday', calls: 21 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="calls" fill="#8884d8" name="Number of Calls" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="batch-history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Batch Call History</CardTitle>
              <CardDescription>
                View and manage your batch call campaigns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BatchCallHistory batches={batches} agents={batchAgents} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsSection;
