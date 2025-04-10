
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsageData } from '../types';
import { formatCurrency } from '../utils/BillingUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CurrentUsageTabProps {
  usage: UsageData | null;
}

const CurrentUsageTab = ({ usage }: CurrentUsageTabProps) => {
  // Create data for the chart
  const chartData = [
    { name: 'Minutos de voz', value: usage?.voice_minutes || 0, cost: usage?.voice_minutes ? usage.voice_minutes * 0.075 : 0 },
    { name: 'Llamadas a API', value: usage?.api_calls || 0, cost: usage?.api_calls ? usage.api_calls * 0.01 / 1000 : 0 },
    { name: 'Números de teléfono', value: usage?.phone_numbers || 0, cost: usage?.phone_numbers ? usage.phone_numbers * 10 : 0 },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Desglose de uso actual</CardTitle>
          <CardDescription>
            Periodo: {usage?.current_period || 'No disponible'}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'cost' ? formatCurrency(Number(value)) : value.toLocaleString(), 
                  name === 'cost' ? 'Costo' : 'Cantidad'
                ]}
              />
              <Bar dataKey="value" name="Cantidad" fill="#8884d8" />
              <Bar dataKey="cost" name="Costo" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalles del uso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Minutos de voz</div>
                <div className="text-2xl font-bold">{usage?.voice_minutes?.toLocaleString() || 0}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {formatCurrency(usage?.voice_minutes ? usage.voice_minutes * 0.075 : 0)} ({formatCurrency(0.075)}/min)
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Llamadas a API</div>
                <div className="text-2xl font-bold">{usage?.api_calls?.toLocaleString() || 0}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {formatCurrency(usage?.api_calls ? usage.api_calls * 0.01 / 1000 : 0)} ({formatCurrency(0.01)}/1K)
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Números de teléfono</div>
                <div className="text-2xl font-bold">{usage?.phone_numbers || 0}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {formatCurrency(usage?.phone_numbers ? usage.phone_numbers * 10 : 0)} ({formatCurrency(10)}/número)
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-medium">
                <span>Costo total</span>
                <span>{formatCurrency(usage?.total_cost || 0)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrentUsageTab;
