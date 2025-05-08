
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { PaginationControls } from '@/components/ui/pagination';
import { CallHistoryItem } from '../types';
import { formatDate, formatDuration } from '@/lib/utils';

interface CallHistoryTableProps {
  isLoading: boolean;
  callHistory: CallHistoryItem[];
  columnVisibility: Record<string, boolean>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  onRowClick: (callId: string) => void;
}

const CallHistoryTable: React.FC<CallHistoryTableProps> = ({
  isLoading,
  callHistory,
  columnVisibility,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  onRowClick
}) => {
  const { t } = useLanguage();

  // Define table columns with visibility control
  const columns = [
    { id: 'timestamp', label: t('timestamp'), visible: true }, // Always visible
    { id: 'agentName', label: t('agent'), visible: columnVisibility.agentName ?? true },
    { id: 'type', label: t('type'), visible: columnVisibility.type ?? true },
    { id: 'duration', label: t('duration'), visible: columnVisibility.duration ?? true },
    { id: 'from', label: t('from'), visible: columnVisibility.from ?? true },
    { id: 'to', label: t('to'), visible: columnVisibility.to ?? true },
    { id: 'status', label: t('status'), visible: columnVisibility.status ?? true }
  ];

  // Filter visible columns
  const visibleColumns = columns.filter(column => column.visible);

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map(column => (
                <TableHead key={column.id}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeletons
              Array(5).fill(0).map((_, idx) => (
                <TableRow key={idx}>
                  {visibleColumns.map(column => (
                    <TableCell key={column.id}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : callHistory.length === 0 ? (
              // No data state
              <TableRow>
                <TableCell colSpan={visibleColumns.length} className="text-center py-8">
                  {t('no_calls_found')}
                </TableCell>
              </TableRow>
            ) : (
              // Call history data
              callHistory.map(call => (
                <TableRow 
                  key={call.callId}
                  onClick={() => onRowClick(call.callId)}
                  className="cursor-pointer hover:bg-muted"
                >
                  {columns.find(col => col.id === 'timestamp')?.visible && (
                    <TableCell>{formatDate(new Date(call.date + ' ' + call.time))}</TableCell>
                  )}
                  {columns.find(col => col.id === 'agentName')?.visible && (
                    <TableCell>{call.agentName}</TableCell>
                  )}
                  {columns.find(col => col.id === 'type')?.visible && (
                    <TableCell>{call.type}</TableCell>
                  )}
                  {columns.find(col => col.id === 'duration')?.visible && (
                    <TableCell>{formatDuration(call.duration)}</TableCell>
                  )}
                  {columns.find(col => col.id === 'from')?.visible && (
                    <TableCell>{call.from}</TableCell>
                  )}
                  {columns.find(col => col.id === 'to')?.visible && (
                    <TableCell>{call.to}</TableCell>
                  )}
                  {columns.find(col => col.id === 'status')?.visible && (
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        call.status === 'ended' 
                          ? 'bg-green-100 text-green-800' 
                          : call.status === 'error'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {call.status}
                      </span>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      {!isLoading && callHistory.length > 0 && (
        <PaginationControls
          totalItems={100} // This would come from an API in a real application
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 25, 50]}
        />
      )}
    </div>
  );
};

export default CallHistoryTable;
