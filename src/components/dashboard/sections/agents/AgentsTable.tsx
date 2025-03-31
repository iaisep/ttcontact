
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash } from 'lucide-react';
import { Agent } from './types';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';

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

  if (agents.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="p-8 text-center">
          <h3 className="text-lg font-medium">{t('no_agents_found')}</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {t('no_agents_description')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('name')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('agent_type')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {agents.map((agent) => (
              <tr 
                key={agent.id} 
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => handleRowClick(agent)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
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
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100">
                    {agent.agent_type || t('standard')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleEditClick(agent, e)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteClick(agent.id, e)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentsTable;
