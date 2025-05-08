
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BatchCallHistory from '../batch-call/BatchCallHistory';

// Import custom hooks and components
import { useAnalyticsData } from './hooks/useAnalyticsData';
import { useBatchCallData } from './hooks/useBatchCallData';
import SummaryCards from './components/SummaryCards';
import OverviewTab from './components/OverviewTab';
import AgentsTab from './components/AgentsTab';
import HourlyTab from './components/HourlyTab';

const AnalyticsSection = () => {
  const { 
    loading, 
    timeRange, 
    analytics, 
    callCounts, 
    callCountsLoading, 
    handleTimeRangeChange 
  } = useAnalyticsData();

  const { batches, batchAgents } = useBatchCallData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex justify-center items-center h-96 flex-col">
        <h2 className="text-xl font-semibold mb-2">No data available</h2>
        <p className="text-muted-foreground">Unable to load analytics data.</p>
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

      <SummaryCards 
        analytics={analytics} 
        callCounts={callCounts}
        callCountsLoading={callCountsLoading} 
      />
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agent Performance</TabsTrigger>
          <TabsTrigger value="hourly">Hourly Analysis</TabsTrigger>
          <TabsTrigger value="batch-history">Batch Call History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <OverviewTab analytics={analytics} />
        </TabsContent>
        
        <TabsContent value="agents" className="space-y-4">
          <AgentsTab analytics={analytics} />
        </TabsContent>
        
        <TabsContent value="hourly" className="space-y-4">
          <HourlyTab analytics={analytics} />
        </TabsContent>
        
        <TabsContent value="batch-history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Batch Call History</CardTitle>
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
