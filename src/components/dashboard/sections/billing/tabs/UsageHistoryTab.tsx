
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UsageData, UsageHistoryItem } from '../types';
import { formatCurrency } from '../utils/BillingUtils';

interface UsageHistoryTabProps {
  usageHistory: UsageHistoryItem[];
  usage: UsageData | null;
}

const UsageHistoryTab = ({ usageHistory, usage }: UsageHistoryTabProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Uso a lo largo del tiempo</CardTitle>
          <CardDescription>
            Minutos de voz y costo en los últimos 30 días
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={usageHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="minutes" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.3}
                name="Minutos de voz" 
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="cost" 
                stroke="#82ca9d" 
                fill="#82ca9d" 
                fillOpacity={0.3}
                name="Costo ($)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Resumen de uso mensual</CardTitle>
          <CardDescription>
            Comparar uso entre meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mes</TableHead>
                <TableHead>Minutos de voz</TableHead>
                <TableHead>Llamadas a API</TableHead>
                <TableHead>Números telefónicos</TableHead>
                <TableHead className="text-right">Costo total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Abril 2025</TableCell>
                <TableCell>{usage?.voice_minutes?.toLocaleString()}</TableCell>
                <TableCell>{usage?.api_calls?.toLocaleString()}</TableCell>
                <TableCell>{usage?.phone_numbers}</TableCell>
                <TableCell className="text-right">{formatCurrency(usage?.total_cost ?? 0)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Marzo 2025</TableCell>
                <TableCell>3,840</TableCell>
                <TableCell>15,420</TableCell>
                <TableCell>5</TableCell>
                <TableCell className="text-right">{formatCurrency(289.50)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Febrero 2025</TableCell>
                <TableCell>3,275</TableCell>
                <TableCell>12,840</TableCell>
                <TableCell>4</TableCell>
                <TableCell className="text-right">{formatCurrency(245.75)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageHistoryTab;
