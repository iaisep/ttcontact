
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AnalyticsData } from '../types';

interface AgentsTabProps {
  analytics: AnalyticsData;
}

const AgentsTab: React.FC<AgentsTabProps> = ({ analytics }) => {
  return (
    <div className="space-y-4">
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
        {analytics.agent_performance.map((agent) => (
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
                  <dd className="text-sm font-medium">{agent.avg_duration?.toFixed(1) || 0} min</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-muted-foreground">Success Rate:</dt>
                  <dd className="text-sm font-medium">{agent.success_rate?.toFixed(1) || 0}%</dd>
                </div>
              </dl>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Success Rate</span>
                  <span>{agent.success_rate?.toFixed(1) || 0}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${agent.success_rate || 0}%` }} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AgentsTab;
