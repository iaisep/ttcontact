
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { TableWithPagination } from '@/components/ui/table-with-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CallHistoryItem {
  id: string;
  callId: string;
  agentName: string;
  phoneNumber: string;
  date: string;
  duration: string;
  status: 'completed' | 'failed' | 'in-progress' | 'missed';
}

const CallHistorySection: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for call history
  const mockCallHistory: CallHistoryItem[] = [
    {
      id: '1',
      callId: 'call-001',
      agentName: 'CO-MOR6-ES',
      phoneNumber: '+1 555-123-4567',
      date: '2024-05-08 10:30:15',
      duration: '5:23',
      status: 'completed'
    },
    {
      id: '2',
      callId: 'call-002',
      agentName: 'AD-1LLAMADA-MX-ES',
      phoneNumber: '+1 555-234-5678',
      date: '2024-05-07 14:22:05',
      duration: '2:45',
      status: 'completed'
    },
    {
      id: '3',
      callId: 'call-003',
      agentName: 'AD-1LLAMADA-COL-ES',
      phoneNumber: '+1 555-345-6789',
      date: '2024-05-07 09:15:30',
      duration: '0:00',
      status: 'missed'
    },
    {
      id: '4',
      callId: 'call-004',
      agentName: 'AD-1LLAMADA-USD-ES',
      phoneNumber: '+1 555-456-7890',
      date: '2024-05-06 16:45:12',
      duration: '4:12',
      status: 'completed'
    }
  ];

  // Filter call history based on search query
  const filteredCalls = mockCallHistory.filter(call => 
    call.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.phoneNumber.includes(searchQuery) ||
    call.date.includes(searchQuery) ||
    call.callId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get status badge color
  const getStatusBadge = (status: CallHistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Completed</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Failed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">In Progress</Badge>;
      case 'missed':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Missed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns = [
    {
      key: 'agentName',
      header: t('agent'),
      cell: (call: CallHistoryItem) => (
        <div className="font-medium">{call.agentName}</div>
      ),
    },
    {
      key: 'phoneNumber',
      header: t('phone_number'),
      cell: (call: CallHistoryItem) => call.phoneNumber,
    },
    {
      key: 'date',
      header: t('date'),
      cell: (call: CallHistoryItem) => call.date,
    },
    {
      key: 'duration',
      header: t('duration'),
      cell: (call: CallHistoryItem) => call.duration,
    },
    {
      key: 'status',
      header: t('status'),
      cell: (call: CallHistoryItem) => getStatusBadge(call.status),
    },
    {
      key: 'actions',
      header: '',
      cell: (call: CallHistoryItem) => (
        <Button variant="ghost" size="sm">
          {t('view_details')}
        </Button>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('call_history')}</h1>
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('search_calls')}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <TableWithPagination
        data={filteredCalls}
        columns={columns}
        emptyState={<div className="py-8 text-center">{t('no_call_history')}</div>}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};

export default CallHistorySection;
