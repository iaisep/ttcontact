
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { TableWithPagination } from '@/components/ui/table-with-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download } from 'lucide-react';
import DateRangePicker from './components/DateRangePicker';
import FilterPopover from './components/FilterPopover';
import CustomizeFieldsPopover from './components/CustomizeFieldsPopover';
import CallDetailDrawer from './components/CallDetailDrawer';
import { useCallHistory } from './hooks';

const CallHistorySection: React.FC = () => {
  const { t } = useLanguage();
  const {
    isLoading,
    callHistory,
    searchQuery,
    setSearchQuery,
    filters,
    addFilter,
    removeFilter,
    clearFilters,
    dateRange,
    updateDateRange,
    columnVisibility,
    toggleColumnVisibility,
    updateColumnVisibility,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalItems,
    selectedCall,
    fetchCallDetails,
    closeCallDetails
  } = useCallHistory();

  // Function to handle exports
  const handleExport = () => {
    // In a real application, this would trigger a download of the filtered call history data
    console.log('Exporting data:', { callHistory, filters, dateRange });
    // For now, just show a success message
    alert(t('export_started'));
  };

  // Get status badge for call status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ended':
        return <Badge className="bg-green-100 text-green-800 border-green-300">{t('ended')}</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 border-red-300">{t('error')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get sentiment badge for user sentiment
  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive':
        return <Badge className="bg-green-100 text-green-800 border-green-300">{t('positive')}</Badge>;
      case 'Neutral':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">{t('neutral')}</Badge>;
      case 'Negative':
        return <Badge className="bg-red-100 text-red-800 border-red-300">{t('negative')}</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">{t('unknown')}</Badge>;
    }
  };

  // Build table columns based on visibility settings
  const buildColumns = () => {
    const allColumns = [
      {
        key: 'time',
        header: t('time'),
        cell: (call: any) => call.time,
        visible: columnVisibility.time
      },
      {
        key: 'callDuration',
        header: t('call_duration'),
        cell: (call: any) => call.duration,
        visible: columnVisibility.callDuration
      },
      {
        key: 'type',
        header: t('type'),
        cell: (call: any) => call.type,
        visible: columnVisibility.type
      },
      {
        key: 'cost',
        header: t('cost'),
        cell: (call: any) => call.cost,
        visible: columnVisibility.cost
      },
      {
        key: 'callId',
        header: t('call_id'),
        cell: (call: any) => (
          <div className="font-mono text-xs truncate max-w-[200px]">
            {call.callId}
          </div>
        ),
        visible: columnVisibility.callId
      },
      {
        key: 'disconnectionReason',
        header: t('disconnection_reason'),
        cell: (call: any) => call.disconnectionReason,
        visible: columnVisibility.disconnectionReason
      },
      {
        key: 'callStatus',
        header: t('call_status'),
        cell: (call: any) => getStatusBadge(call.status),
        visible: columnVisibility.callStatus
      },
      {
        key: 'userSentiment',
        header: t('user_sentiment'),
        cell: (call: any) => getSentimentBadge(call.userSentiment),
        visible: columnVisibility.userSentiment
      },
      {
        key: 'from',
        header: t('from'),
        cell: (call: any) => call.from,
        visible: columnVisibility.from
      },
      {
        key: 'to',
        header: t('to'),
        cell: (call: any) => call.to,
        visible: columnVisibility.to
      },
      {
        key: 'callSuccessful',
        header: t('call_successful'),
        cell: (call: any) => (
          <div className="flex justify-center">
            <Badge className={call.callSuccessful ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {call.callSuccessfulStatus || (call.callSuccessful ? t('successful') : t('unsuccessful'))}
            </Badge>
          </div>
        ),
        visible: columnVisibility.callSuccessful
      },
      {
        key: 'endToEndLatency',
        header: t('end_to_end_latency'),
        cell: (call: any) => call.endToEndLatency || '-',
        visible: columnVisibility.endToEndLatency
      },
      {
        key: 'oportunidad',
        header: t('oportunidad'),
        cell: (call: any) => (
          call.oportunidad !== undefined ? (
            <Badge className={call.oportunidad ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {call.oportunidad ? t('true') : t('false')}
            </Badge>
          ) : '-'
        ),
        visible: columnVisibility.oportunidad
      },
      {
        key: 'opportunidad',
        header: t('opportunidad'),
        cell: (call: any) => call.opportunidad || '-',
        visible: columnVisibility.opportunidad
      },
      {
        key: 'resumen_2da_llamada',
        header: t('resumen_2da_llamada'),
        cell: (call: any) => call.resumen_2da_llamada || '-',
        className: "max-w-[300px] truncate",
        visible: columnVisibility.resumen_2da_llamada
      }
    ];

    // Only return visible columns
    return allColumns.filter(column => column.visible).map(({ visible, ...column }) => column);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h1 className="text-2xl font-bold">{t('call_history')}</h1>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            {t('export')}
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-2">
        <div className="w-full md:w-60">
          <DateRangePicker
            startDate={dateRange.start}
            endDate={dateRange.end}
            onRangeChange={updateDateRange}
          />
        </div>
        
        <div className="flex gap-2">
          <FilterPopover
            onAddFilter={addFilter}
            filters={filters}
            onRemoveFilter={removeFilter}
            onClearFilters={clearFilters}
          />
          
          <CustomizeFieldsPopover
            columnVisibility={columnVisibility}
            onToggleColumn={toggleColumnVisibility}
            onSaveSettings={() => console.log('Saved column settings')}
          />
        </div>
        
        <div className="flex-grow">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('search_calls')}
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <TableWithPagination
          data={callHistory}
          columns={buildColumns()}
          emptyState={<div className="py-8 text-center">{t('no_call_history')}</div>}
          onRowClick={(call) => fetchCallDetails(call.callId)}
          rowClassName="cursor-pointer hover:bg-muted/80"
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      )}

      {/* Call Details Drawer */}
      {selectedCall && (
        <CallDetailDrawer call={selectedCall} onClose={closeCallDetails} />
      )}
    </div>
  );
};

export default CallHistorySection;
