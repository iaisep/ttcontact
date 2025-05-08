import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Agent } from './types';
import { Badge } from '@/components/ui/badge';
import { TableWithPagination } from '@/components/ui/table-with-pagination';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AgentsTableProps {
  agents: Agent[];
  onEditAgent: (agent: Agent) => void;
  onDeleteAgent: (agent: Agent) => void;
  isLoading: boolean;
}

const AgentsTable: React.FC<AgentsTableProps> = ({
  agents,
  onEditAgent,
  onDeleteAgent,
  isLoading
}) => {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Format the agent type display for better readability and replace retell with uisep
  const formatAgentType = (type: string | undefined) => {
    if (!type) return 'N/A';
    
    // Replace retell-llm with uisep-llm
    return type.replace('retell-llm', 'uisep-llm');
  };

  const columns = [
    {
      key: 'name',
      header: t('name'),
      cell: (agent: Agent) => (
        <div className="flex items-center gap-4">
          {agent.voice?.avatar_url && (
            <img 
              src={agent.voice.avatar_url} 
              alt={agent.name} 
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <div className="font-medium">{agent.name}</div>
        </div>
      ),
    },
    {
      key: 'agent_type',
      header: t('agent_type'),
      cell: (agent: Agent) => (
        <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
          {formatAgentType(agent.agent_type)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: t('actions'),
      cell: (agent: Agent) => (
        <div className="flex items-center gap-2 justify-end">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();  
              onEditAgent(agent);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              onDeleteAgent(agent);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: "text-right",
    },
  ];

  // Create a loading state for the table
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <TableWithPagination
      data={agents}
      columns={columns}
      emptyState={<div className="py-8 text-center">{t('no_agents_found')}</div>}
      onRowClick={onEditAgent}
      rowClassName="cursor-pointer"
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
    />
  );
};

export default AgentsTable;
