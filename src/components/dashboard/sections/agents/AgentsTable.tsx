
import React from 'react';
import TableWithPagination from '@/components/ui/table-with-pagination';
import { Agent } from './types';
import AgentActions from './AgentActions';

interface AgentsTableProps {
  agents: Agent[];
  onEditAgent: (agent: Agent) => void;
  onDeleteAgent: (id: string) => void;
  isLoading: boolean;
}

const AgentsTable: React.FC<AgentsTableProps> = ({ agents, onEditAgent, onDeleteAgent, isLoading }) => {
  const columns = [
    {
      key: 'name',
      header: 'Name',
      cell: (agent: Agent) => <span className="font-medium">{agent.agent_name}</span>,
    },
    {
      key: 'description',
      header: 'Description',
      cell: (agent: Agent) => (
        <span>{agent.agent_name}</span>
      ),
    },
    {
      key: 'folder',
      header: 'Folder',
      cell: (agent: Agent) => <span>{agent.folder || '-'}</span>,
    },
    {
      key: 'voice_id',
      header: 'Voice ID',
      cell: (agent: Agent) => <span>{agent.voice_id}</span>,
    },
    {
      key: 'created',
      header: 'Created',
      cell: (agent: Agent) => (
        <span>{new Date(agent.last_modification_timestamp).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      cell: (agent: Agent) => (
        <AgentActions
          agent={agent}
          onEdit={onEditAgent}
          onDelete={onDeleteAgent}
        />
      ),
    },
  ];

  return (
    <TableWithPagination
      data={agents}
      columns={columns}
      initialPageSize={10}
      pageSizeOptions={[10, 25, 50]}
      emptyState="No agents found. Create one to get started."
      className="w-full"
    />
  );
};

export default AgentsTable;
