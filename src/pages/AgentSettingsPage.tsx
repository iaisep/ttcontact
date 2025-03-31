
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiContext } from '@/context/ApiContext';
import { useLanguage } from '@/context/LanguageContext';
import { AgentEditLayout } from '@/components/dashboard/sections/agents/edit/AgentEditLayout';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const AgentSettingsPage: React.FC = () => {
  const { agent_id } = useParams<{ agent_id: string }>();
  const navigate = useNavigate();
  const { fetchWithAuth } = useApiContext();
  const { t } = useLanguage();
  
  const [agent, setAgent] = useState<RetellAgent | null>(null);
  const [allAgents, setAllAgents] = useState<RetellAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [voices, setVoices] = useState([]);
  const [folders, setFolders] = useState([]);
  const [llms, setLLMs] = useState([]);

  // Fetch all required data at once
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [agentsData, voicesData, foldersData, llmsData] = await Promise.all([
          fetchWithAuth('/list-agents'),
          fetchWithAuth('/list-voices'),
          fetchWithAuth('/get-folders'),
          fetchWithAuth('/list-retell-llms'),
        ]);

        // Store all agents for the agent selector
        if (Array.isArray(agentsData)) {
          setAllAgents(agentsData);
          
          // Find the current agent
          const currentAgent = agentsData.find(a => a.agent_id === agent_id || a.id === agent_id);
          if (currentAgent) {
            setAgent(currentAgent);
          } else {
            toast.error(t('agent_not_found'));
            navigate('/agentes');
          }
        }
        
        if (voicesData?.voices) {
          setVoices(voicesData.voices);
        }
        
        if (foldersData?.folders) {
          setFolders(foldersData.folders);
        }
        
        if (llmsData?.llms) {
          setLLMs(llmsData.llms);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error(t('error_loading_data'));
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [agent_id, fetchWithAuth, navigate, t]);

  // Function to update agent
  const updateAgent = async (updates: Partial<RetellAgent>) => {
    if (!agent) return;
    
    try {
      const agentId = agent.agent_id || agent.id;
      const updatedAgent = await fetchWithAuth(`/update-agent/${agentId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
      
      // Update local state with updated agent
      setAgent(prevAgent => ({
        ...prevAgent!,
        ...updatedAgent
      }));
      
      return true;
    } catch (error) {
      console.error('Error updating agent:', error);
      toast.error(t('error_updating_agent'));
      return false;
    }
  };

  // Function to change selected agent
  const changeAgent = (newAgentId: string) => {
    navigate(`/agents/${newAgentId}/edit`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">{t('agent_not_found')}</h2>
          <p className="text-muted-foreground mb-4">{t('agent_not_found_description')}</p>
          <button 
            className="bg-primary text-white px-4 py-2 rounded-md"
            onClick={() => navigate('/agentes')}
          >
            {t('back_to_agents')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <AgentEditLayout
      agent={agent}
      allAgents={allAgents}
      voices={voices}
      folders={folders}
      llms={llms}
      onUpdate={updateAgent}
      onChangeAgent={changeAgent}
    />
  );
};

export default AgentSettingsPage;
