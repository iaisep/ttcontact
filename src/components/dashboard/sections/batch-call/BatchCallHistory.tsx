
import { useState } from 'react';
import { 
  TableWithPagination
} from '@/components/ui/table-with-pagination';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Download, Eye, MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { BatchCall, Agent } from './types';

interface BatchCallHistoryProps {
  batches: BatchCall[];
  agents: Agent[];
}

const BatchCallHistory: React.FC<BatchCallHistoryProps> = ({ batches, agents }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [detailDialog, setDetailDialog] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<BatchCall | null>(null);

  const getAgentName = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    return agent ? agent.name : agentId;
  };

  const viewDetails = (batch: BatchCall) => {
    setSelectedBatch(batch);
    setDetailDialog(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Completed</span>;
      case 'in-progress':
        return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">In Progress</span>;
      case 'failed':
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">Failed</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">{status}</span>;
    }
  };

  const columns = [
    {
      key: 'id',
      header: 'Batch ID',
      cell: (batch: BatchCall) => <span className="font-mono text-xs">{batch.id}</span>,
    },
    {
      key: 'agent',
      header: 'Agent',
      cell: (batch: BatchCall) => getAgentName(batch.agent_id),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (batch: BatchCall) => getStatusBadge(batch.status),
    },
    {
      key: 'progress',
      header: 'Progress',
      cell: (batch: BatchCall) => (
        <div className="space-y-1">
          <div className="text-xs">{batch.completed_calls} / {batch.total_calls} calls</div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-primary h-1.5 rounded-full" 
              style={{ width: `${(batch.completed_calls / batch.total_calls) * 100}%` }}
            ></div>
          </div>
        </div>
      ),
    },
    {
      key: 'created',
      header: 'Started',
      cell: (batch: BatchCall) => formatDate(batch.created_at),
    },
    {
      key: 'actions',
      header: '',
      cell: (batch: BatchCall) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => viewDetails(batch)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("Download initiated")}>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const emptyState = (
    <div className="flex flex-col items-center py-8">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Download className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">No batch calls found</h3>
      <p className="text-muted-foreground text-sm">
        When you start batch calls, they will appear here.
      </p>
    </div>
  );

  return (
    <>
      <TableWithPagination
        data={batches}
        columns={columns}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        emptyState={emptyState}
      />

      {selectedBatch && (
        <Dialog open={detailDialog} onOpenChange={setDetailDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Batch Call Details</DialogTitle>
              <DialogDescription>
                Details for batch call initiated on {formatDate(selectedBatch.created_at)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <div className="text-sm font-medium">Status</div>
                <div>{getStatusBadge(selectedBatch.status)}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium">Agent</div>
                <div>{getAgentName(selectedBatch.agent_id)}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium">Total Calls</div>
                <div>{selectedBatch.total_calls}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium">Completed</div>
                <div>{selectedBatch.completed_calls}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium">Failed</div>
                <div>{selectedBatch.failed_calls}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium">Success Rate</div>
                <div>
                  {selectedBatch.total_calls > 0 
                    ? `${Math.round((selectedBatch.completed_calls / selectedBatch.total_calls) * 100)}%` 
                    : 'N/A'}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => toast.info("Download initiated")}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default BatchCallHistory;
