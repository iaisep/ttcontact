
import { useMemo, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { PaginationControls } from '@/components/ui/pagination';
import { BatchCall, Agent } from './types';

interface BatchCallHistoryProps {
  batches: BatchCall[];
  agents: Agent[];
}

const BatchCallHistory = ({ batches, agents }: BatchCallHistoryProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Reset to first page when batch data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [batches.length]);

  // Get paginated data
  const paginatedBatches = useMemo(() => {
    return batches.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [batches, currentPage, pageSize]);

  const getAgentName = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    return agent ? agent.name : 'Unknown Agent';
  };

  return (
    <div className="space-y-4">
      {batches.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No batch calls found. Upload a file to create your first batch.</p>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBatches.map((batch) => {
                const progress = batch.total_calls > 0 
                  ? Math.round((batch.completed_calls / batch.total_calls) * 100) 
                  : 0;
                
                return (
                  <TableRow key={batch.id}>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        batch.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : batch.status === 'in-progress' 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{getAgentName(batch.agent_id)}</TableCell>
                    <TableCell>
                      <div className="w-full space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{progress}% complete</span>
                          <span>{batch.completed_calls}/{batch.total_calls} calls</span>
                        </div>
                        <Progress value={progress} />
                        {batch.failed_calls > 0 && (
                          <div className="text-xs text-destructive">
                            {batch.failed_calls} failed calls
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(batch.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          <PaginationControls
            totalItems={batches.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[5, 10, 25]}
          />
        </>
      )}
    </div>
  );
};

export default BatchCallHistory;
