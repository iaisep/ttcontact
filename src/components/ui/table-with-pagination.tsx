
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
  
  // Efecto para reiniciar a la primera página cuando cambia la longitud total de datos
  // Pero solo si no estamos ya en la primera página
  useEffect(() => {
    const dataLengthChanged = prevDataLengthRef.current !== data.length;
    
    // Solo resetear a página 1 si la cantidad de datos cambió Y no estamos en la página 1
    if (dataLengthChanged && currentPage > 1) {
      onPageChange(1);
    }
    
    // Actualizar la referencia con la longitud actual
    prevDataLengthRef.current = data.length;
  }, [data.length, currentPage, onPageChange]); // Asegurémonos de incluir las dependencias correctas
  
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
