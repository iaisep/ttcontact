
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UsageData, UsageHistoryItem } from '../types';
import { formatCurrency } from '../utils/BillingUtils';
import { PaginationControls } from '@/components/ui/pagination';

interface UsageHistoryTabProps {
  usageHistory: UsageHistoryItem[];
  usage: UsageData | null;
}

const UsageHistoryTab = ({ usageHistory, usage }: UsageHistoryTabProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Generate mock monthly data for the table display
  const monthlyData = [
    { month: 'Abril 2025', voice_minutes: usage?.voice_minutes || 0, api_calls: usage?.api_calls || 0, phone_numbers: usage?.phone_numbers || 0, total_cost: usage?.total_cost || 0 },
    { month: 'Marzo 2025', voice_minutes: 3840, api_calls: 15420, phone_numbers: 5, total_cost: 289.50 },
    { month: 'Febrero 2025', voice_minutes: 3275, api_calls: 12840, phone_numbers: 4, total_cost: 245.75 },
    { month: 'Enero 2025', voice_minutes: 2890, api_calls: 11230, phone_numbers: 4, total_cost: 220.15 },
    { month: 'Diciembre 2024', voice_minutes: 2540, api_calls: 9875, phone_numbers: 3, total_cost: 195.80 },
    { month: 'Noviembre 2024', voice_minutes: 2320, api_calls: 8740, phone_numbers: 3, total_cost: 178.50 },
    { month: 'Octubre 2024', voice_minutes: 2150, api_calls: 7920, phone_numbers: 3, total_cost: 164.25 },
    { month: 'Septiembre 2024', voice_minutes: 1980, api_calls: 7150, phone_numbers: 2, total_cost: 149.75 },
    { month: 'Agosto 2024', voice_minutes: 1820, api_calls: 6540, phone_numbers: 2, total_cost: 137.50 },
    { month: 'Julio 2024', voice_minutes: 1640, api_calls: 5820, phone_numbers: 2, total_cost: 124.80 },
    { month: 'Junio 2024', voice_minutes: 1490, api_calls: 5160, phone_numbers: 2, total_cost: 115.20 },
    { month: 'Mayo 2024', voice_minutes: 1280, api_calls: 4520, phone_numbers: 1, total_cost: 98.60 },
  ];
  
  // Get paginated data
  const paginatedMonthlyData = monthlyData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  // Reset to first page when page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);
  
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
        <CardContent className="space-y-4">
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
              {paginatedMonthlyData.map((month, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{month.month}</TableCell>
                  <TableCell>{month.voice_minutes.toLocaleString()}</TableCell>
                  <TableCell>{month.api_calls.toLocaleString()}</TableCell>
                  <TableCell>{month.phone_numbers}</TableCell>
                  <TableCell className="text-right">{formatCurrency(month.total_cost)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <PaginationControls
            totalItems={monthlyData.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[5, 10, 12]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageHistoryTab;
