
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { UsageData } from '../types';
import { formatCurrency } from '../utils/BillingUtils';
import AutoRechargeDialog from '../dialogs/AutoRechargeDialog';
import { useState } from 'react';

interface CurrentUsageTabProps {
  usage: UsageData | null;
}

const CurrentUsageTab = ({ usage }: CurrentUsageTabProps) => {
  const [autoRechargeOpen, setAutoRechargeOpen] = useState(false);
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Uso del período actual</CardTitle>
          <CardDescription>
            {usage?.current_period}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Minutos de voz</span>
                <span className="font-medium">{usage?.voice_minutes?.toLocaleString()} minutos</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${Math.min((usage?.voice_minutes || 0) / 5000 * 100, 100)}%` }} 
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>5,000 minutos</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Llamadas a API</span>
                <span className="font-medium">{usage?.api_calls?.toLocaleString()} llamadas</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${Math.min((usage?.api_calls || 0) / 20000 * 100, 100)}%` }} 
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>20,000 llamadas</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Números telefónicos</span>
                <span className="font-medium">{usage?.phone_numbers} números</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${Math.min((usage?.phone_numbers || 0) / 10 * 100, 100)}%` }} 
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>10 números</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Desglose de costos</CardTitle>
            <CardDescription>
              Costos estimados para el período de facturación actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md divide-y">
              <div className="flex justify-between py-3 px-4">
                <div>
                  <p className="font-medium">Minutos de voz</p>
                  <p className="text-sm text-muted-foreground">{usage?.voice_minutes?.toLocaleString()} minutos a $0.075 por minuto</p>
                </div>
                <p className="font-medium text-right">{formatCurrency(usage?.voice_minutes ? usage.voice_minutes * 0.075 : 0)}</p>
              </div>
              
              <div className="flex justify-between py-3 px-4">
                <div>
                  <p className="font-medium">Números telefónicos</p>
                  <p className="text-sm text-muted-foreground">{usage?.phone_numbers} números a $1.00 por número</p>
                </div>
                <p className="font-medium text-right">{formatCurrency(usage?.phone_numbers ? usage.phone_numbers * 1.0 : 0)}</p>
              </div>
              
              <div className="flex justify-between py-3 px-4">
                <div>
                  <p className="font-medium">Llamadas a API</p>
                  <p className="text-sm text-muted-foreground">{usage?.api_calls?.toLocaleString()} llamadas ($0.01 por 1000 llamadas)</p>
                </div>
                <p className="font-medium text-right">{formatCurrency(usage?.api_calls ? usage.api_calls * 0.00001 : 0)}</p>
              </div>
              
              <div className="flex justify-between py-3 px-4">
                <div>
                  <p className="font-medium">Suscripción Plan Pro</p>
                  <p className="text-sm text-muted-foreground">Cuota de suscripción mensual</p>
                </div>
                <p className="font-medium text-right">{formatCurrency(49.99)}</p>
              </div>
              
              <div className="flex justify-between py-3 px-4 bg-muted/50">
                <p className="font-medium">Total estimado</p>
                <p className="font-bold text-right">{formatCurrency(usage?.total_cost ?? 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tu Plan</CardTitle>
            <CardDescription>Plan Pro</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Minutos de voz ilimitados</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Hasta 20 llamadas paralelas</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Soporte prioritario</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Analíticas avanzadas</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Actualizar Plan</Button>
          </CardFooter>
        </Card>
      </div>
      
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
    </div>
  );
};

export default CurrentUsageTab;
