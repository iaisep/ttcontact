
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '../utils/BillingUtils';

interface BillingItem {
  id: string;
  name: string;
  amount: number;
  details?: string;
}

interface BillingMonth {
  id: string;
  month: string;
  monthYear: string;
  dateRange: string; 
  total: number;
  status?: string;
  items: BillingItem[];
}

const BillingHistoryTab = () => {
  // In a real app, this data would come from an API
  const billingHistory: BillingMonth[] = [
    {
      id: '2025-04',
      month: '2025-04',
      monthYear: '2025-04',
      dateRange: 'abr 1 - abr 30',
      total: 494.57,
      status: 'ongoing',
      items: [
        { id: 'llm', name: 'LLM', amount: 103.45, details: '2275 minutes' },
        { id: 'voice', name: 'Voice Engine', amount: 136.36, details: '1948 minutes' },
        { id: 'kb', name: 'Knowledge Base', amount: 9.56, details: '114655 × Knowledge base usage' },
        { id: 'kb-hosting', name: 'knowledge_base_hosting', amount: 232.00, details: '29 × Knowledge base hosting (Tier 2 at $8.00 / month)' },
        { id: 'play-tts', name: 'play_tts', amount: 13.20, details: '9892 × Retell Voice Engine + Play TTS (at $0.08 per 60 units / month)' },
      ]
    },
    {
      id: '2025-03',
      month: '2025-03',
      monthYear: '2025-03',
      dateRange: 'mar 1 - mar 31',
      total: 1258.87,
      status: 'paid',
      items: []
    },
    {
      id: '2025-02', 
      month: '2025-02',
      monthYear: '2025-02',
      dateRange: 'feb 1 - feb 29',
      total: 950.43,
      status: 'paid',
      items: []
    },
    {
      id: '2025-01',
      month: '2025-01',
      monthYear: '2025-01',
      dateRange: 'ene 1 - ene 31',
      total: 1285.27,
      status: 'paid',
      items: []
    },
    {
      id: '2024-12',
      month: '2024-12',
      monthYear: '2024-12',
      dateRange: 'dic 1 - dic 31',
      total: 940.53,
      status: 'paid',
      items: []
    },
    {
      id: '2024-11',
      month: '2024-11',
      monthYear: '2024-11',
      dateRange: 'nov 1 - nov 30',
      total: 599.93,
      status: 'paid',
      items: []
    },
    {
      id: '2024-10',
      month: '2024-10',
      monthYear: '2024-10', 
      dateRange: 'oct 1 - oct 31',
      total: 545.32,
      status: 'paid',
      items: []
    },
    {
      id: '2024-09',
      month: '2024-09',
      monthYear: '2024-09',
      dateRange: 'sep 1 - sep 30',
      total: 384.56,
      status: 'paid',
      items: []
    }
  ];

  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({
    '2025-04': true
  });

  const toggleMonth = (monthId: string) => {
    setExpandedMonths(prev => ({
      ...prev,
      [monthId]: !prev[monthId]
    }));
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow>
                <TableHead className="w-[250px]">Title</TableHead>
                <TableHead className="w-[150px]">Amount</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {billingHistory.map((month) => (
                <>
                  <TableRow 
                    key={month.id}
                    className="group cursor-pointer hover:bg-muted/30"
                    onClick={() => toggleMonth(month.id)}
                  >
                    <TableCell className="font-medium flex items-center">
                      {expandedMonths[month.id] ? (
                        <ChevronDown className="h-4 w-4 mr-2" />
                      ) : (
                        <ChevronDown className="h-4 w-4 mr-2" />
                      )}
                      {month.monthYear}
                    </TableCell>
                    <TableCell>{formatCurrency(month.total)}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      {month.status === 'ongoing' && (
                        <div className="flex items-center">
                          <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
                          <span>Ongoing</span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>

                  {expandedMonths[month.id] && (
                    <>
                      <TableRow className="bg-muted/5">
                        <TableCell className="pl-10 text-sm text-gray-600">
                          {month.dateRange}
                        </TableCell>
                        <TableCell className="text-sm">{formatCurrency(month.total)}</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>

                      {month.items.map((item) => (
                        <TableRow key={item.id} className="bg-muted/5">
                          <TableCell className="pl-10 text-sm text-gray-600">
                            {item.name}
                          </TableCell>
                          <TableCell className="text-sm">{formatCurrency(item.amount)}</TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {item.details}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingHistoryTab;
