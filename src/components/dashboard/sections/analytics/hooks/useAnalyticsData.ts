
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AnalyticsData, CallCounts } from '../types';
import { Agent } from '../../agents/types';
import { useAnalyticsDataFetcher } from './useAnalyticsDataFetcher';

export const useAnalyticsData = () => {
  const { loading, fetchAnalyticsData } = useAnalyticsDataFetcher();
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [callCounts, setCallCounts] = useState<CallCounts | null>(null);
  const [callCountsLoading, setCallCountsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    const result = await fetchAnalyticsData(timeRange);
    setAnalytics(result.analytics);
    setAgents(result.agents);
    setCallCounts(result.callCounts);
    setCallCountsLoading(false);
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    toast.info(`Fetching data for the last ${range}`);
    fetchData();
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
