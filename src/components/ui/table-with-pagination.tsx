
import React, { useState, useEffect } from 'react';
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
}

function TableWithPagination<T>({
  data,
  columns,
  initialPageSize = 10,
  pageSizeOptions = [10, 25, 50],
  onRowClick,
  emptyState,
  className,
  rowClassName
}: TableWithPaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  // Calculate paginated data
  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
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
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  {emptyState || 'No data found'}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
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
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
}

export default TableWithPagination;
