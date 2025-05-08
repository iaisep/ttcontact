
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AnalyticsData } from '../types';

interface HourlyTabProps {
  analytics: AnalyticsData;
}

const HourlyTab: React.FC<HourlyTabProps> = ({ analytics }) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default HourlyTab;
