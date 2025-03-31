
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Agent } from './types'; // Ensure this import is correct

interface AgentsTableProps {
  agents: Agent[];
  onEditAgent: (agent: Agent) => void;
  onDeleteAgent: (agentId: string) => void;
}

const AgentsTable: React.FC<AgentsTableProps> = ({ agents, onEditAgent, onDeleteAgent }) => {
  const { t } = useLanguage();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('name')}</TableHead>
          <TableHead>{t('description')}</TableHead>
          <TableHead>{t('actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {agents.map((agent) => (
          <TableRow key={agent.id}>
            <TableCell>{agent.name}</TableCell>
            <TableCell>{agent.description}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onEditAgent(agent)}
                >
                  {t('edit')}
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => onDeleteAgent(agent.id)}
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
