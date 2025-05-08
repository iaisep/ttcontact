
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Agent } from './types';
import { Badge } from '@/components/ui/badge';
import { TableWithPagination } from '@/components/ui/table-with-pagination';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

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
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Format agent type display
  const formatAgentType = (type: string | undefined) => {
    if (!type) return 'N/A';
    
    if (type.includes('retell-llm')) {
      return t('single_prompt');
    } else if (type.includes('uisep-llm')) {
      return t('multi_prompt');
    }
    
    return type;
  };

  const handleEditClick = (agent: Agent, e: React.MouseEvent) => {
    e.stopPropagation();
    onEditAgent(agent);
  };

  // Format date to display like "05/08/2025, 05:07"
  const formatTimestamp = (timestamp: number | undefined) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('default', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  };

  // Format phone numbers 
  const formatPhone = (phone: string | undefined) => {
    if (!phone) return '-';
    return phone;
  };

  const columns = [
    {
      key: 'name',
      header: t('agent_name'),
      cell: (agent: Agent) => (
        <div className="flex items-center gap-4">
          <div className="bg-gray-200 p-2 rounded-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"></path>
            </svg>
          </div>
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
      key: 'voice',
      header: t('voice'),
      cell: (agent: Agent) => (
        <div className="flex items-center gap-2">
          {agent.voice?.avatar_url && (
            <img src={agent.voice.avatar_url} alt={agent.voice.name} className="w-6 h-6 rounded-full" />
          )}
          <span>{agent.voice?.name || '-'}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      header: t('phone'),
      cell: (agent: Agent) => (
        <div className="text-blue-600">
          {formatPhone(agent.phone)}
        </div>
      ),
    },
    {
      key: 'edited',
      header: t('edited_by'),
      cell: (agent: Agent) => (
        <div>{formatTimestamp(agent.last_modification_timestamp)}</div>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (agent: Agent) => (
        <div className="flex items-center gap-2 justify-end">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => handleEditClick(agent, e)}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: "text-right w-10",
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
      onRowClick={(agent) => handleEditClick(agent, {} as React.MouseEvent)}
      rowClassName="cursor-pointer"
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
    />
  );
};

export default AgentsTable;
