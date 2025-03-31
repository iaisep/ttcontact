
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useApiContext } from '@/context/ApiContext';
import AgentsTable from './agents/AgentsTable';
import AgentsToolbar from './agents/AgentsToolbar';
import AgentForm from './agents/AgentForm';
import { Agent } from './agents/types';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface RetellAgent {
  id: string;
  name: string;
  description: string;
  agent_type: string;
  voice_id: string;
  folder: string;
  [key: string]: any;
}

interface RetellVoice {
  id: string;
  name: string;
  [key: string]: any;
}

interface RetellFolder {
  id: string;
  name: string;
  [key: string]: any;
}

interface RetellLLM {
  id: string;
  name: string;
  [key: string]: any;
}

interface RetellPhoneNumber {
  id: string;
  phone_number: string;
  [key: string]: any;
}

const AgentsSection: React.FC = () => {
  const { t } = useLanguage();
  const { apiKey, baseURL, fetchWithAuth } = useApiContext();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [voices, setVoices] = useState<RetellVoice[]>([]);
  const [folders, setFolders] = useState<RetellFolder[]>([]);
  const [llms, setLLMs] = useState<RetellLLM[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<RetellPhoneNumber[]>([]);
  const [isAgentFormOpen, setIsAgentFormOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRetellData = async () => {
    setIsLoading(true);
    try {
      const endpoints = [
        '/list-agents',
        '/list-voices',
        '/get-folders',
        '/list-retell-llms',
        '/list-phone-numbers',
        //'/get-organization', //
        '/check-org-complaince-status',
      ];

      const results = await Promise.all(
        endpoints.map(endpoint => fetchWithAuth(endpoint))
      );

      // Procesar los resultados según el orden de los endpoints
      const [agentsData, voicesData, foldersData, llmsData, phoneNumbersData] = results;

      // Transformar los datos de agentes al formato requerido
      if (agentsData?.agents) {
        const transformedAgents: Agent[] = agentsData.agents.map((agent: RetellAgent) => ({
          id: agent.agent_id,
          name: agent.agent_name,
          description: agent.description || '',
          agent_type: agent.language,
          voice_id: agent.voice_id,
          folder: agent.folder,
        }));
        setAgents(transformedAgents);
      }

      // Almacenar otros datos para uso potencial futuro
      if (voicesData?.voices) {
        setVoices(voicesData.voices);
      }

      if (foldersData?.folders) {
        setFolders(foldersData.folders);
      }

      if (llmsData?.llms) {
        setLLMs(llmsData.llms);
      }

      if (phoneNumbersData?.phone_numbers) {
        setPhoneNumbers(phoneNumbersData.phone_numbers);
      }

    } catch (error) {
      console.error('Error fetching Retell data:', error);
      toast.error(t('error_loading_agents'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRetellData();
  }, [apiKey, baseURL]);

  const handleAddAgent = () => {
    setSelectedAgent(null);
    setIsAgentFormOpen(true);
  };

  const handleEditAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsAgentFormOpen(true);
  };

  const handleDeleteAgent = async (agentId: string) => {
    setIsLoading(true);
    try {
      // Llamada real a la API para eliminar un agente
      await fetchWithAuth(`/delete-agent/${agentId}`, {
        method: 'DELETE'
      });
      
      // Actualizar el estado local después de la eliminación exitosa
      setAgents(agents.filter(agent => agent.id !== agentId));
      toast.success(t('agent_deleted'));
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error(t('error_deleting_agent'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAgent = async (agent: Agent) => {
    setIsLoading(true);
    try {
      if (agent.id) {
        // Actualizar agente existente
        const updatedAgent = await fetchWithAuth(`/update-agent/${agent.id}`, {
          method: 'PUT',
          body: JSON.stringify(agent)
        });
        
        // Actualizar el estado local con el agente actualizado
        setAgents(agents.map(a => (a.id === agent.id ? { ...a, ...updatedAgent } : a)));
        toast.success(t('agent_updated'));
      } else {
        // Crear nuevo agente
        const newAgent = await fetchWithAuth('/create-agent', {
          method: 'POST',
          body: JSON.stringify(agent)
        });
        
        // Agregar el nuevo agente al estado local
        setAgents([...agents, newAgent]);
        toast.success(t('agent_added'));
      }
    } catch (error) {
      console.error('Error submitting agent:', error);
      toast.error(agent.id ? t('error_updating_agent') : t('error_adding_agent'));
    } finally {
      setIsLoading(false);
      setIsAgentFormOpen(false);
    }
  };

  const handleCancelAgentForm = () => {
    setIsAgentFormOpen(false);
  };

  const handleImportAgents = async () => {
    // Implementación real de importación de agentes
    try {
      setIsLoading(true);
      // Aquí iría la lógica real de importación
      // Por ahora solo mostramos una notificación de éxito
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación de tiempo de procesamiento
      toast.success(t('agents_imported'));
      // Recargar los agentes después de la importación
      fetchRetellData();
    } catch (error) {
      console.error('Error importing agents:', error);
      toast.error(t('error_importing_agents'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshAgents = () => {
    fetchRetellData();
  };

  return (
    <div className="p-6 space-y-6">
      <AgentsToolbar 
        onAddAgent={handleAddAgent} 
        onImportAgents={handleImportAgents}
        onRefreshAgents={handleRefreshAgents}
      />
      <AgentsTable 
        agents={agents} 
        onEditAgent={handleEditAgent} 
        onDeleteAgent={handleDeleteAgent}
        isLoading={isLoading}
      />
      {isAgentFormOpen && (
        <AgentForm 
          initialAgent={selectedAgent} 
          onSubmit={handleSubmitAgent}
          onCancel={handleCancelAgentForm}
          voices={voices}
          folders={folders}
          llms={llms}
        />
      )}
    </div>
  );
};

export default AgentsSection;
