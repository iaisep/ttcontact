
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '../utils/BillingUtils';
import { useApiContext } from '@/context/ApiContext';
import { BillingHistoryMonth, BillingHistoryItem } from '../types';

const BillingHistoryTab = () => {
  const { fetchWithAuth } = useApiContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistoryMonth[]>([]);
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchBillingHistory = async () => {
      setLoading(true);
      try {
        const response = await fetchWithAuth('/list-invoices');
        
        if (response && Array.isArray(response)) {
          setBillingHistory(response);
          
          // Set latest month as expanded by default if any exists
          if (response.length > 0) {
            setExpandedMonths({ [response[0].id]: true });
          }
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching billing history:', err);
        setError('Failed to load billing history');
        // Use mock data as fallback
        const mockData = getMockBillingHistory();
        setBillingHistory(mockData);
        if (mockData.length > 0) {
          setExpandedMonths({ [mockData[0].id]: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBillingHistory();
  }, [fetchWithAuth]);

  const toggleMonth = (monthId: string) => {
    setExpandedMonths(prev => ({
      ...prev,
      [monthId]: !prev[monthId]
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

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
              {billingHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No billing history found
                  </TableCell>
                </TableRow>
              ) : (
                billingHistory.map((month) => (
                  <React.Fragment key={month.id}>
                    <TableRow 
                      className="group cursor-pointer hover:bg-muted/30"
                      onClick={() => toggleMonth(month.id)}
                    >
                      <TableCell className="font-medium flex items-center">
                        {expandedMonths[month.id] ? (
                          <ChevronUp className="h-4 w-4 mr-2" />
                        ) : (
                          <ChevronDown className="h-4 w-4 mr-2" />
                        )}
                        {month.month}
                      </TableCell>
                      <TableCell>{formatCurrency(month.amount)}</TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        {month.status && (
                          <div className="flex items-center">
                            <span className={`h-2 w-2 rounded-full mr-2 ${
                              month.status === 'ongoing' ? 'bg-blue-500' : 
                              month.status === 'paid' ? 'bg-green-500' : 
                              month.status === 'overdue' ? 'bg-red-500' : 
                              'bg-yellow-500'
                            }`}></span>
                            <span>{month.status.charAt(0).toUpperCase() + month.status.slice(1)}</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>

                    {expandedMonths[month.id] && (
                      <>
                        {month.items && month.items.length > 0 ? (
                          month.items.map((item) => (
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
                          ))
                        ) : (
                          <TableRow className="bg-muted/5">
                            <TableCell colSpan={4} className="text-center text-sm text-gray-600">
                              No detailed items available
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

// Mock data function for fallback
const getMockBillingHistory = (): BillingHistoryMonth[] => [
  {
    id: '2025-04',
    month: 'April 2025',
    amount: 494.57,
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
    month: 'March 2025',
    amount: 1258.87,
    status: 'paid',
    items: []
  },
  {
    id: '2025-02', 
    month: 'February 2025',
    amount: 950.43,
    status: 'paid',
    items: []
  }
];

export default BillingHistoryTab;
