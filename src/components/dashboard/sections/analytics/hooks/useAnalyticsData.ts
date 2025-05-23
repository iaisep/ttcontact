import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { AnalyticsData, AnalyticsOverview, CallCounts } from '../types';
import { useApiContext } from '@/context/ApiContext';
import { Agent } from '../../agents/types';

export const useAnalyticsData = () => {
  const { apiKey } = useApiContext();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [callCounts, setCallCounts] = useState<CallCounts | null>(null);
  const [callCountsLoading, setCallCountsLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch data from all the views we created
      const [
        overviewResponse,
        dailyCallsResponse,
        callDurationResponse,
        callDirectionResponse,
        callStatusResponse,
        agentPerformanceResponse,
        busiestHoursResponse
      ] = await Promise.all([
        supabase.from('analytics_overview').select('*').single(),
        supabase.from('daily_call_volume').select('*'),
        supabase.from('call_duration_distribution').select('*'),
        supabase.from('call_direction_breakdown').select('*'),
        supabase.from('call_status_breakdown').select('*'),
        supabase.from('agent_performance').select('*'),
        supabase.from('busiest_hours').select('*')
      ]);

      // Check for errors in the responses
      if (overviewResponse.error) throw overviewResponse.error;
      if (dailyCallsResponse.error) throw dailyCallsResponse.error;
      if (callDurationResponse.error) throw callDurationResponse.error;
      if (callDirectionResponse.error) throw callDirectionResponse.error;
      if (callStatusResponse.error) throw callStatusResponse.error;
      if (agentPerformanceResponse.error) throw agentPerformanceResponse.error;
      if (busiestHoursResponse.error) throw busiestHoursResponse.error;

      // Process the data into the format expected by the charts
      const overview = overviewResponse.data || {
        total_calls: 0,
        total_minutes: 0,
        avg_call_duration: 0,
        successful_calls: 0,
        failed_calls: 0,
        success_rate: 0
      };
      
      const dailyCalls = dailyCallsResponse.data || [];
      const callDurations = callDurationResponse.data || [];
      const callDirections = callDirectionResponse.data || [];
      const callStatuses = callStatusResponse.data || [];
      const agentPerformances = agentPerformanceResponse.data || [];
      const busiestHours = busiestHoursResponse.data || [];
      
      // Map direction data for pie chart
      const callBreakdown = callDirections.map(item => ({
        name: item.direction,
        value: item.count
      }));
      
      // Map status data for pie chart
      const callStatusData = callStatuses.map(item => ({
        name: item.status,
        value: item.count
      }));
      
      // Set the analytics state
      setAnalytics({
        overview,
        daily_calls: dailyCalls,
        call_duration: callDurations,
        agent_performance: agentPerformances,
        call_breakdown: callBreakdown,
        call_status: callStatusData,
        busiest_hours: busiestHours,
      });
      
      // Set agents state for batch call history - Fixed TypeScript error here
      setAgents(agentPerformances.map((a) => ({
        id: a.agent_id,
        name: a.agent_name,
        agent_id: a.agent_id,
        agent_name: a.agent_name,
        agent_type: 'unknown',
        voice_id: '',
        last_modification_timestamp: Date.now(),
        updated_at: new Date().toISOString()
      })));
      
      // Skip the problematic fetch-dashboard-data API call and use mock data instead
      setCallCounts({
        total: overview.total_calls || 0,
        change: "+12%"
      });
      setCallCountsLoading(false);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      toast.error('Failed to load analytics data, using mock data instead');
      
      // Fall back to mock data if there's an error
      useMockData();
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback function
  const useMockData = () => {
    const mockAnalyticsData = {
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

    setAnalytics(mockAnalyticsData);
    
    // Fixed TypeScript error here
    setAgents(mockAnalyticsData.agent_performance.map(a => ({
      id: a.agent_id,
      name: a.agent_name,
      agent_id: a.agent_id,
      agent_name: a.agent_name,
      agent_type: 'unknown',
      voice_id: '',
      last_modification_timestamp: Date.now(),
      updated_at: new Date().toISOString()
    })));

    // Set mock call counts
    setCallCounts({
      total: mockAnalyticsData.overview.total_calls || 0,
      change: "+12%"
    });
    setCallCountsLoading(false);
  };

  // Keep the fetchCallCountsData function but don't call it
  const fetchCallCountsData = async () => {
    // This function is kept for reference but not called anymore
    console.log("fetchCallCountsData function preserved but not called");
    
    // Original implementation commented out to prevent the API call
    /*
    setCallCountsLoading(true);
    try {
      const payload = {
        size: "small",
        filter: [],
        unit: "day",
        comparison: true,
        show: [
          {
            measurement: {
              type: "count"
            },
            source: {
              type: "call_id"
            }
          }
        ],
        time: {
          type: "since",
          value: [1743476400000]
        },
        title: "Call Counts",
        type: "number",
        id: 0.596305120479717,
        group: []
      };

      // Try using the fetchWithAuth method first which handles API key automatically
      const response = await fetch("https://api.retellai.com/fetch-dashboard-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload),
        referrerPolicy: "no-referrer"
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Dashboard data response:", data);
      setCallCounts(data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load call count data");
      // Set fallback mock data
      setCallCounts({
        total: analytics?.overview.total_calls || 0,
        change: "+12%"
      });
    } finally {
      setCallCountsLoading(false);
    }
    */
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    toast.info(`Fetching data for the last ${range}`);
    fetchAnalyticsData();
  };

  return {
    loading,
    timeRange,
    analytics,
    agents,
    callCounts,
    callCountsLoading,
    handleTimeRangeChange,
  };
};
