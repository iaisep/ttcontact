
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { AnalyticsData, CallCounts } from '../types';
import { getMockAnalyticsData, getMockAgentsData } from './useAnalyticsMockData';

/**
 * Handles fetching and processing analytics data
 */
export const useAnalyticsDataFetcher = () => {
  const [loading, setLoading] = useState(true);

  const fetchAnalyticsData = async (timeRange: string) => {
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
      
      // Create the analytics data object
      const analytics: AnalyticsData = {
        overview,
        daily_calls: dailyCalls,
        call_duration: callDurations,
        agent_performance: agentPerformances,
        call_breakdown: callBreakdown,
        call_status: callStatusData,
        busiest_hours: busiestHours,
      };

      // Create agents from performance data
      const agents = getMockAgentsData(agentPerformances);
      
      // Create call counts from overview data
      const callCounts: CallCounts = {
        total: overview.total_calls || 0,
        change: "+12%"
      };

      return {
        analytics,
        agents,
        callCounts,
        success: true
      };
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      toast.error('Failed to load analytics data, using mock data instead');
      
      // Return mock data on error
      const mockData = getMockAnalyticsData();
      return {
        analytics: mockData,
        agents: getMockAgentsData(mockData.agent_performance),
        callCounts: {
          total: mockData.overview.total_calls || 0,
          change: "+12%"
        },
        success: false
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchAnalyticsData
  };
};
