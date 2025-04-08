
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { PaginationControls } from '@/components/ui/pagination';

interface TableWithPaginationProps<T> {
  data: T[];
  columns: {
    key: string;
    header: React.ReactNode;
    cell: (item: T) => React.ReactNode;
    className?: string;
  }[];
  initialPageSize?: number;
  pageSizeOptions?: number[];
  onRowClick?: (item: T) => void;
  emptyState?: React.ReactNode;
  className?: string;
  rowClassName?: string | ((item: T) => string);
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function TableWithPagination<T>({
  data,
  columns,
  initialPageSize = 10,
  pageSizeOptions = [10, 25, 50],
  onRowClick,
  emptyState,
  className,
  rowClassName,
  currentPage,
  onPageChange,
  onPageSizeChange
}: TableWithPaginationProps<T>) {
  // Store previous data length for pagination management
  const [prevDataLength, setPrevDataLength] = useState<number | null>(null);
  
  // Check validity of data
  const safeData = Array.isArray(data) ? data : [];
  
  // Effect to handle pagination when data changes
  useEffect(() => {
    // Only run after initial render
    if (prevDataLength !== null) {
      const maxPage = Math.max(1, Math.ceil(safeData.length / initialPageSize));
      
      // If current page is out of bounds after data change, reset to page 1
      if (currentPage > maxPage && maxPage > 0) {
        console.log('Resetting to page 1 due to data change', { 
          currentPage, maxPage, dataLength: safeData.length 
        });
        onPageChange(1);
      }
    }
    
    // Update previous data length
    setPrevDataLength(safeData.length);
  }, [safeData.length, currentPage, initialPageSize, onPageChange]);

  // Get row class name with safety checks
  const getRowClassName = (item: T): string => {
    if (typeof rowClassName === 'function') {
      return rowClassName(item);
    }
    return rowClassName || '';
  };

  // Calculate pagination values with defensive coding
  const maxPage = Math.max(1, Math.ceil(safeData.length / initialPageSize));
  const safePage = Math.min(Math.max(1, currentPage), maxPage);
  const startIndex = Math.max(0, (safePage - 1) * initialPageSize);
  const endIndex = Math.min(startIndex + initialPageSize, safeData.length);
  
  // Get safely calculated page data
  const currentPageData = safeData.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table className={className}>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {!safeData.length ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  {emptyState || 'No data found'}
                </TableCell>
              </TableRow>
            ) : (
              currentPageData.map((item, index) => (
                <TableRow 
                  key={`row-${startIndex + index}`}
                  className={getRowClassName(item)}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                  style={onRowClick ? { cursor: 'pointer' } : undefined}
                >
                  {columns.map((column) => (
                    <TableCell key={`cell-${startIndex + index}-${column.key}`} className={column.className}>
                      {column.cell(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {safeData.length > 0 && (
        <PaginationControls
          totalItems={safeData.length}
          pageSize={initialPageSize}
          currentPage={safePage}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
}
