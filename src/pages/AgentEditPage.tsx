
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiContext } from '@/context/ApiContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AgentEditForm from '@/components/dashboard/sections/agents/AgentEditForm';
import { Agent } from '@/components/dashboard/sections/agents/types';
import { Loader2, ArrowLeft } from 'lucide-react';

interface RetellVoice {
  id: string;
  name: string;
  avatar_url?: string;
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

const AgentEditPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [voices, setVoices] = useState<RetellVoice[]>([]);
  const [folders, setFolders] = useState<RetellFolder[]>([]);
  const [llms, setLLMs] = useState<RetellLLM[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAgentData = async () => {
      setIsLoading(true);
      try {
        // Fetch agent details
        const agentsData = await fetchWithAuth('/list-agents');
        
        // Find the specific agent by slug (converted from name)
        const foundAgent = Array.isArray(agentsData) 
          ? agentsData.find(a => 
              a.agent_name.toLowerCase().replace(/\s+/g, '-') === slug || 
              a.agent_id === slug)
          : null;
        
        if (!foundAgent) {
          toast.error(t('agent_not_found'));
          navigate('/dashboard');
          return;
        }

        // Fetch additional resources needed for editing
        const [voicesData, foldersData, llmsData] = await Promise.all([
          fetchWithAuth('/list-voices'),
          fetchWithAuth('/get-folders'),
          fetchWithAuth('/list-retell-llms'),
        ]);

        // Transform agent data
        const transformedAgent: Agent = {
          id: foundAgent.agent_id || foundAgent.id,
          name: foundAgent.agent_name || foundAgent.name,
          description: foundAgent.description || '',
          agent_type: foundAgent.response_engine?.type || foundAgent.agent_type || '',
          voice_id: foundAgent.voice_id,
          folder: foundAgent.folder || '',
        };

        setAgent(transformedAgent);
        
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
        console.error('Error fetching agent data:', error);
        toast.error(t('error_loading_agent'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgentData();
  }, [slug, fetchWithAuth, t, navigate]);

  const handleSubmit = async (updatedAgent: Agent) => {
    setIsLoading(true);
    try {
      await fetchWithAuth(`/update-agent/${updatedAgent.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedAgent)
      });
      
      toast.success(t('agent_updated'));
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating agent:', error);
      toast.error(t('error_updating_agent'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="p-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/dashboard')} 
        className="mb-4"
      >
        <ArrowLeft className="mr-2" size={16} />
        {t('back_to_dashboard')}
      </Button>
      
      <div className="bg-card rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">
          {agent ? t('edit_agent') + ': ' + agent.name : t('loading')}
        </h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : agent ? (
          <AgentEditForm 
            initialAgent={agent}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            voices={voices}
            folders={folders}
            llms={llms}
          />
        ) : (
          <div className="text-center py-8">
            {t('agent_not_found')}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentEditPage;
