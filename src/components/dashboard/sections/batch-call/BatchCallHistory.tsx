
import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Phone } from 'lucide-react';
import { BatchCall } from './types';
import { Agent } from './types';
import { PaginationControls } from '@/components/ui/pagination';

interface BatchCallHistoryProps {
  batches: BatchCall[];
  agents: Agent[];
}

const BatchCallHistory = ({ batches, agents }: BatchCallHistoryProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return (completed / total) * 100;
  };

  // Get paginated data
  const paginatedBatches = batches.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset to first page when page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Phone className="h-8 w-8 text-muted-foreground" />
                    <p>No batch calls found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedBatches.map((batch) => {
                const progressPercentage = getProgressPercentage(batch.completed_calls, batch.total_calls);
                
                return (
                  <TableRow key={batch.id}>
                    <TableCell>
                      {new Date(batch.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {agents.find(a => a.id === batch.agent_id)?.name || batch.agent_id}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(batch.status)}`}>
                        {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs justify-between">
                          <span>
                            {batch.completed_calls} of {batch.total_calls} calls completed
                          </span>
                          <span>{progressPercentage.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${batch.status === 'failed' ? 'bg-destructive' : 'bg-primary'}`} 
                            style={{ width: `${progressPercentage}%` }} 
                          />
                        </div>
                        {batch.failed_calls > 0 && (
                          <div className="flex items-center text-xs text-destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {batch.failed_calls} failed calls
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {batches.length > 0 && (
        <PaginationControls
          totalItems={batches.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 25, 50]}
        />
      )}
    </div>
  );
};

export default BatchCallHistory;
