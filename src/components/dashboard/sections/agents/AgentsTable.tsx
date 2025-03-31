
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Agent } from './types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

interface AgentsTableProps {
  agents: Agent[];
  onEditAgent: (agent: Agent) => void;
  onDeleteAgent: (agentId: string) => void;
  isLoading?: boolean;
}

const AgentsTable: React.FC<AgentsTableProps> = ({ 
  agents, 
  onEditAgent, 
  onDeleteAgent, 
  isLoading = false 
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleEditClick = (agent: Agent) => {
    // Create a slug from the agent name or use the id if name is not available
    const slug = agent.name 
      ? agent.name.toLowerCase().replace(/\s+/g, '-') 
      : agent.id;
    
    // Navigate to the edit page with the slug
    navigate(`/agentes/${slug}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('name')}</TableHead>
          <TableHead>{t('agent_type')}</TableHead>
          <TableHead>{t('voice')}</TableHead>
          <TableHead>{t('phone')}</TableHead>
          <TableHead>{t('edited')}</TableHead>
          <TableHead>{t('actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {agents.map((agent) => (
          <TableRow key={agent.id}>
            <TableCell>{agent.name}</TableCell>
            <TableCell>{agent.agent_type}</TableCell>
            <TableCell>
              {agent.voice ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    {agent.voice.avatar_url ? (
                      <AvatarImage src={agent.voice.avatar_url} alt={agent.voice.name} />
                    ) : null}
                    <AvatarFallback>
                      {agent.voice.name?.substring(0, 2).toUpperCase() || '--'}
                    </AvatarFallback>
                  </Avatar>
                  <span>{agent.voice.name}</span>
                </div>
              ) : (
                "--"
              )}
            </TableCell>
            <TableCell>{agent.phone || "--"}</TableCell>
            <TableCell>
              {agent.last_modification_timestamp 
                ? new Date(agent.last_modification_timestamp).toLocaleString() 
                : "--"}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEditClick(agent)}
                  disabled={isLoading}
                >
                  {t('edit')}
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => onDeleteAgent(agent.id)}
                  disabled={isLoading}
                >
                  {t('delete')}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AgentsTable;
