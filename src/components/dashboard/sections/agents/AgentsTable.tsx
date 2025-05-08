
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash } from 'lucide-react';
import { Agent } from './types';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { PaginationControls } from '@/components/ui/pagination';

interface AgentsTableProps {
  agents: Agent[];
  onEditAgent: (agent: Agent) => void;
  onDeleteAgent: (agentId: string) => void;
  isLoading: boolean;
}

const AgentsTable: React.FC<AgentsTableProps> = ({
  agents,
  onEditAgent,
  onDeleteAgent,
  isLoading,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const pageSizeOptions = [5, 10, 25, 50];

  const getAgentSlug = (agent: Agent) => {
    return agent.id || (agent.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown');
  };

  const handleEditClick = (agent: Agent, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to the detailed agent page
    try {
      const slug = getAgentSlug(agent);
      navigate(`/agentes/${slug}`);
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error(t('error_navigating_to_agent'));
    }
  };

  const handleDeleteClick = (agentId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteAgent(agentId);
  };

  const handleRowClick = (agent: Agent) => {
    try {
      const slug = getAgentSlug(agent);
      navigate(`/agentes/${slug}`);
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error(t('error_navigating_to_agent'));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="p-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  // Calculate paginated data
  const paginatedData = agents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {agents.length === 0 ? (
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium">{t('no_agents_found')}</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {t('no_agents_description')}
            </p>
          </div>
        ) : (
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead>{t('agent_type')}</TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      {t('no_agents_found')}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((agent) => (
                    <TableRow 
                      key={agent.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleRowClick(agent)}
                    >
                      <TableCell>
                        <div className="flex items-center">
                          {agent.voice?.avatar_url && (
                            <div className="flex-shrink-0 h-10 w-10 mr-3">
                              <img 
                                className="h-10 w-10 rounded-full" 
                                src={agent.voice.avatar_url} 
                                alt={agent.name} 
                              />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {agent.name}
                            </div>
                            {agent.description && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                {agent.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100">
                          {agent.agent_type || t('standard')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e: React.MouseEvent) => handleEditClick(agent, e)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e: React.MouseEvent) => handleDeleteClick(agent.id, e)}
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      {/* Separate pagination controls */}
      {agents.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mt-4">
          <PaginationControls
            totalItems={agents.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={pageSizeOptions}
          />
        </div>
      )}
    </div>
  );
};

export default AgentsTable;
