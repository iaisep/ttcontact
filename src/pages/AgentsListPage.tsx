import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiContext } from '@/context/ApiContext';
import { useLanguage } from '@/context/LanguageContext';
import AgentsTable from '@/components/dashboard/sections/agents/AgentsTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Agent } from '@/components/dashboard/sections/agents/types';
import { toast } from 'sonner';
import { Plus, Import, ArrowLeft } from 'lucide-react';

const AgentsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { fetchWithAuth } = useApiContext();
  const { t } = useLanguage();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const data = await fetchWithAuth('/list-agents');
      if (Array.isArray(data)) {
        // Transform API data to match our Agent type
        const formattedAgents: Agent[] = data.map(agent => ({
          id: agent.agent_id || agent.id,
          name: agent.agent_name || agent.name,
          description: agent.description || '',
          agent_type: agent.response_engine?.type || agent.agent_type || '',
          voice_id: agent.voice_id,
          voice: agent.voice,
          phone: agent.phone || '',
          last_modification_timestamp: agent.last_modification_timestamp,
          folder: agent.folder || ''
        }));
        setAgents(formattedAgents);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error(t('error_loading_agents'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAgent = (agent: Agent) => {
    navigate(`/agentes/${agent.id}/edit`);
  };

  // Updated to accept a string ID instead of an Agent object
  const handleDeleteAgent = async (agentId: string) => {
    if (!window.confirm(t('confirm_delete_agent'))) return;
    
    setIsLoading(true);
    try {
      await fetchWithAuth(`/delete-agent/${agentId}`, {
        method: 'DELETE'
      });
      toast.success(t('agent_deleted'));
      fetchAgents();
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error(t('error_deleting_agent'));
      setIsLoading(false);
    }
  };

  const handleImportAgents = () => {
    toast.info(t('import_feature_coming_soon'));
  };

  const handleCreateAgent = () => {
    navigate('/agentes/new');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container p-6">
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          className="mr-2" 
          onClick={handleBackToDashboard}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back_to_dashboard')}
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">{t('all_agents')}</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder={t('search_agents')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>
      
      <AgentsTable 
        agents={filteredAgents}
        onEditAgent={handleEditAgent}
        onDeleteAgent={handleDeleteAgent}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AgentsListPage;
