
import React from 'react';
import { TableWithPagination } from '@/components/ui/table-with-pagination';
import { Button } from '@/components/ui/button';
import { BookText, Pencil, RefreshCcw, RefreshCw, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { KnowledgeBase } from '../types';

interface KnowledgeBaseTableProps {
  knowledgeBases: KnowledgeBase[];
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (kb: KnowledgeBase) => void;
  onDelete: (kb: KnowledgeBase) => void;
  onResync: (kb: KnowledgeBase) => void;
  hasUrlSources: (kb: KnowledgeBase) => boolean;
  onCreateClick: () => void;
}

const KnowledgeBaseTable: React.FC<KnowledgeBaseTableProps> = ({
  knowledgeBases,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  onResync,
  hasUrlSources,
  onCreateClick
}) => {
  const columns = [
    {
      key: 'name',
      header: 'Name',
      cell: (kb: KnowledgeBase) => (
        <div className="flex items-center">
          {kb.name}
          {kb.auto_sync && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="ml-2">
                    <RefreshCcw className="h-3 w-3 text-blue-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Auto-sync enabled</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      ),
      className: 'font-medium'
    },
    {
      key: 'sources',
      header: 'Sources',
      cell: (kb: KnowledgeBase) => `${kb.source_count} sources`
    },
    {
      key: 'created',
      header: 'Created',
      cell: (kb: KnowledgeBase) => new Date(kb.created_at).toLocaleDateString()
    },
    {
      key: 'actions',
      header: <div className="text-right">Actions</div>,
      cell: (kb: KnowledgeBase) => (
        <div className="flex justify-end gap-2">
          {hasUrlSources(kb) && (
            <Button variant="ghost" size="icon" onClick={() => onResync(kb)}>
              <RefreshCw className="h-4 w-4 text-blue-500" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => onEdit(kb)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(kb)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
      className: 'text-right'
    }
  ];

  const emptyState = (
    <div className="flex flex-col items-center gap-2">
      <BookText className="h-8 w-8 text-muted-foreground" />
      <p>No knowledge bases found</p>
      <Button variant="outline" size="sm" onClick={onCreateClick}>
        Add Your First Knowledge Base
      </Button>
    </div>
  );

  return (
    <TableWithPagination
      data={knowledgeBases}
      columns={columns}
      initialPageSize={pageSize}
      pageSizeOptions={[10, 25, 50]}
      onRowClick={() => {}}
      emptyState={emptyState}
      currentPage={currentPage}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
    />
  );
};

export default KnowledgeBaseTable;
