
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsageData } from '../types';
import UsageProgressBar from './UsageProgressBar';

interface UsageStatsCardProps {
  usage: UsageData | null;
}

const UsageStatsCard = ({ usage }: UsageStatsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Uso del período actual</CardTitle>
        <CardDescription>
          {usage?.current_period}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <UsageProgressBar 
            label="Minutos de voz"
            current={usage?.voice_minutes || 0}
            max={5000}
            unit="minutos"
          />
          
          <UsageProgressBar 
            label="Llamadas a API"
            current={usage?.api_calls || 0}
            max={20000}
            unit="llamadas"
          />
          
          <UsageProgressBar 
            label="Números telefónicos"
            current={usage?.phone_numbers || 0}
            max={10}
            unit="números"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageStatsCard;
