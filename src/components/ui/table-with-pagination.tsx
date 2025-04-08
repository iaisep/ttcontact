
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
  // Store previous data length to avoid unnecessary page resets
  const [prevDataLength, setPrevDataLength] = useState<number | null>(null);
  
  // Only reset to page 1 when data length changes significantly and we're not already on page 1
  useEffect(() => {
    // Only run this effect after the first render when prevDataLength is set
    if (prevDataLength !== null) {
      // Calculate max possible page based on current data and page size
      const maxPage = Math.max(1, Math.ceil(data.length / initialPageSize));
      
      // If current page is greater than maxPage, reset to page 1
      if (currentPage > maxPage && maxPage > 0) {
        onPageChange(1);
      }
    }
    
    // Always update the previous data length
    setPrevDataLength(data.length);
  }, [data.length, currentPage, initialPageSize, onPageChange]);

  const getRowClassName = (item: T): string => {
    if (typeof rowClassName === 'function') {
      return rowClassName(item);
    }
    return rowClassName || '';
  };

  // Calculate max page
  const maxPage = Math.max(1, Math.ceil(data.length / initialPageSize));
  
  // Ensure currentPage is within bounds
  const safePage = Math.min(Math.max(1, currentPage), maxPage);
  
  // Calculate start and end indices for current page
  const startIndex = (safePage - 1) * initialPageSize;
  // Make sure we don't go out of bounds
  const endIndex = Math.min(startIndex + initialPageSize, data.length);
  
  // Get current page data with defensive checks
  const currentPageData = data && Array.isArray(data) && data.length > 0 ? 
    data.slice(Math.max(0, startIndex), endIndex) : [];

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
            {!data || data.length === 0 ? (
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
      
      {data && data.length > 0 && (
        <PaginationControls
          totalItems={data.length}
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
