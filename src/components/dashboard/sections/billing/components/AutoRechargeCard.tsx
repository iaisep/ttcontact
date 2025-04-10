
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AutoRechargeDialog from '../dialogs/AutoRechargeDialog';

const AutoRechargeCard = () => {
  const [autoRechargeOpen, setAutoRechargeOpen] = useState(false);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recarga automática</CardTitle>
        <CardDescription>
          Configura recargas automáticas de saldo cuando llegues a un umbral mínimo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AutoRechargeDialog open={autoRechargeOpen} onOpenChange={setAutoRechargeOpen} />
        
        <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
          <div className="flex items-start">
            <div className="mr-3 text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-700">Acerca de la recarga automática</h4>
              <p className="text-sm text-blue-600 mt-1">
                La recarga automática te permite mantener tu servicio sin interrupciones. 
                Cuando tu saldo alcance el umbral mínimo establecido, se realizará un cargo automático 
                a tu método de pago por el monto que hayas configurado.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoRechargeCard;
