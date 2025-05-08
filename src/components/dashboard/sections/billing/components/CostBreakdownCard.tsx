
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsageData } from '../types';
import { formatCurrency } from '../utils/BillingUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface CostBreakdownCardProps {
  usage: UsageData | null;
}

const CostBreakdownCard = ({ usage }: CostBreakdownCardProps) => {
  const isMobile = useIsMobile();

  // Calculate the voice cost directly from the minutes
  const voiceCost = usage?.voice_minutes ? usage.voice_minutes * 0.075 : 0;
  
  // Calculate API calls cost
  const apiCallsCost = usage?.api_calls ? usage.api_calls * 0.00001 : 0;
  
  // Calculate phone numbers cost
  const phoneNumbersCost = usage?.phone_numbers ? usage.phone_numbers * 1.0 : 0;
  
  // Fixed subscription cost
  const subscriptionCost = 49.99;
  
  // Calculate total (should match total_cost from API)
  const totalCost = voiceCost + apiCallsCost + phoneNumbersCost + subscriptionCost;

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Desglose de costos</CardTitle>
        <CardDescription>
          Costos estimados para el período de facturación actual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md divide-y">
          <div className={`${isMobile ? 'flex flex-col space-y-2' : 'flex justify-between'} py-3 px-4`}>
            <div>
              <p className="font-medium">Minutos de voz</p>
              <p className="text-sm text-muted-foreground">{usage?.voice_minutes?.toLocaleString()} minutos a $0.075 por minuto</p>
            </div>
            <p className={`font-medium ${isMobile ? '' : 'text-right'}`}>{formatCurrency(voiceCost)}</p>
          </div>
          
          <div className={`${isMobile ? 'flex flex-col space-y-2' : 'flex justify-between'} py-3 px-4`}>
            <div>
              <p className="font-medium">Números telefónicos</p>
              <p className="text-sm text-muted-foreground">{usage?.phone_numbers} números a $1.00 por número</p>
            </div>
            <p className={`font-medium ${isMobile ? '' : 'text-right'}`}>{formatCurrency(phoneNumbersCost)}</p>
          </div>
          
          <div className={`${isMobile ? 'flex flex-col space-y-2' : 'flex justify-between'} py-3 px-4`}>
            <div>
              <p className="font-medium">Llamadas a API</p>
              <p className="text-sm text-muted-foreground">{usage?.api_calls?.toLocaleString()} llamadas ($0.01 por 1000 llamadas)</p>
            </div>
            <p className={`font-medium ${isMobile ? '' : 'text-right'}`}>{formatCurrency(apiCallsCost)}</p>
          </div>
          
          <div className={`${isMobile ? 'flex flex-col space-y-2' : 'flex justify-between'} py-3 px-4`}>
            <div>
              <p className="font-medium">Suscripción Plan Pro</p>
              <p className="text-sm text-muted-foreground">Cuota de suscripción mensual</p>
            </div>
            <p className={`font-medium ${isMobile ? '' : 'text-right'}`}>{formatCurrency(subscriptionCost)}</p>
          </div>
          
          <div className={`${isMobile ? 'flex flex-col space-y-2' : 'flex justify-between'} py-3 px-4 bg-muted/50`}>
            <p className="font-medium">Total estimado</p>
            <p className={`font-bold ${isMobile ? '' : 'text-right'}`}>{formatCurrency(usage?.total_cost ?? 0)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostBreakdownCard;
