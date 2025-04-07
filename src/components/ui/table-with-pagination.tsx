
import React, { useEffect, useRef } from 'react';
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
  const prevDataLengthRef = useRef<number>(data.length);
  
  // Effect to reset to first page when total data length changes
  // But only if we're not on the first page already
  useEffect(() => {
    // Only reset to page 1 if data length changed AND we're not on page 1
    if (prevDataLengthRef.current !== data.length && currentPage > 1) {
      onPageChange(1);
    }
    
    // Update the ref with current length
    prevDataLengthRef.current = data.length;
  }, [data.length]); // Only depend on data.length, not the entire data object
  
  const getRowClassName = (item: T): string => {
    if (typeof rowClassName === 'function') {
      return rowClassName(item);
    }
    return rowClassName || '';
  };

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
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  {emptyState || 'No data found'}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow 
                  key={index} 
                  className={getRowClassName(item)}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                  style={onRowClick ? { cursor: 'pointer' } : undefined}
                >
                  {columns.map((column) => (
                    <TableCell key={`${index}-${column.key}`} className={column.className}>
                      {column.cell(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {data.length > 0 && (
        <PaginationControls
          totalItems={data.length}
          pageSize={initialPageSize}
          currentPage={currentPage}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
}
