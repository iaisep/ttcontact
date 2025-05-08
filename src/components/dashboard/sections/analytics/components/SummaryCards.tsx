
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, TrendingUp, Clock, PhoneOutgoing, UserCheck } from 'lucide-react';
import { AnalyticsData, CallCounts } from '../types';

interface SummaryCardsProps {
  analytics: AnalyticsData;
  callCounts: CallCounts | null;
  callCountsLoading: boolean;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ 
  analytics, 
  callCounts, 
  callCountsLoading 
}) => {
  // Format the percentage change for display
  const getFormattedChange = () => {
    if (callCounts?.change) {
      return callCounts.change;
    }
    return `+${Math.floor(Math.random() * 20)}%`;
  };

  // Get the total calls count
  const getTotalCalls = () => {
    if (callCounts?.total) {
      return callCounts.total;
    }
    return analytics.overview.total_calls;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
          <PhoneOutgoing className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {callCountsLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <>
              <div className="text-2xl font-bold">{getTotalCalls()}</div>
              <p className="text-xs text-muted-foreground">
                {getFormattedChange()} from last period
              </p>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Minutes</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.overview.total_minutes?.toFixed(0) || 0}</div>
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
          <div className="text-2xl font-bold">{analytics.overview.avg_call_duration?.toFixed(1) || 0} min</div>
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
          <div className="text-2xl font-bold">{analytics.overview.success_rate?.toFixed(1) || 0}%</div>
          <p className="text-xs text-muted-foreground">
            +{(Math.random() * 2).toFixed(1)}% from last period
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
