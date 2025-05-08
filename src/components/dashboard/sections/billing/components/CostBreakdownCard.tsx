
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

  // Get values directly from API response
  const voiceTotal = usage?.voice_total || 0;
  const telephonyTotal = usage?.telephony_total || 0;
  const llmTotal = usage?.llm_total || 0;
  const kbExtraTotal = usage?.kb_extra_total || 0;
  
  // Calculate total (should match total_cost from API)
  const totalCost = usage?.total_cost || 0;

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
              <p className="font-medium">voice_total</p>
              <p className="text-sm text-muted-foreground">Minutos de voz</p>
            </div>
            <p className={`font-medium ${isMobile ? '' : 'text-right'}`}>{formatCurrency(voiceTotal)}</p>
          </div>
          
          <div className={`${isMobile ? 'flex flex-col space-y-2' : 'flex justify-between'} py-3 px-4`}>
            <div>
              <p className="font-medium">telephony_total</p>
              <p className="text-sm text-muted-foreground">Números telefónicos</p>
            </div>
            <p className={`font-medium ${isMobile ? '' : 'text-right'}`}>{formatCurrency(telephonyTotal)}</p>
          </div>
          
          <div className={`${isMobile ? 'flex flex-col space-y-2' : 'flex justify-between'} py-3 px-4`}>
            <div>
              <p className="font-medium">llm_total</p>
              <p className="text-sm text-muted-foreground">Llamadas a API</p>
            </div>
            <p className={`font-medium ${isMobile ? '' : 'text-right'}`}>{formatCurrency(llmTotal)}</p>
          </div>
          
          <div className={`${isMobile ? 'flex flex-col space-y-2' : 'flex justify-between'} py-3 px-4`}>
            <div>
              <p className="font-medium">kb_extra_total</p>
              <p className="text-sm text-muted-foreground">Base de conocimiento</p>
            </div>
            <p className={`font-medium ${isMobile ? '' : 'text-right'}`}>{formatCurrency(kbExtraTotal)}</p>
          </div>
          
          <div className={`${isMobile ? 'flex flex-col space-y-2' : 'flex justify-between'} py-3 px-4 bg-muted/50`}>
            <p className="font-medium">Total estimado</p>
            <p className={`font-bold ${isMobile ? '' : 'text-right'}`}>{formatCurrency(totalCost)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostBreakdownCard;
