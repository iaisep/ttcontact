
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiContext } from '@/context/ApiContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import AgentEditorHeader from '@/components/dashboard/sections/agents/editor/AgentEditorHeader';
import AgentEditorForm from '@/components/dashboard/sections/agents/editor/AgentEditorForm';
import AgentSelector from '@/components/dashboard/sections/agents/editor/AgentSelector';
import VoiceSettings from '@/components/dashboard/sections/agents/editor/VoiceSettings';
import VoiceSelector from '@/components/dashboard/sections/agents/editor/VoiceSelector';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';

const AgentEditorPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  
  const [agent, setAgent] = useState<RetellAgent | null>(null);
  const [allAgents, setAllAgents] = useState<RetellAgent[]>([]);
  const [voices, setVoices] = useState([]);
  const [folders, setFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Use existing cached data from previous requests
        const [agentsData, voicesData, foldersData] = await Promise.all([
          fetchWithAuth('/list-agents'),
          fetchWithAuth('/list-voices'),
          fetchWithAuth('/get-folders')
        ]);
        
        // Set all agents for the selector
        if (Array.isArray(agentsData)) {
          setAllAgents(agentsData);
          
          // Find the current agent by ID from the URL
          const currentAgent = agentsData.find(a => 
            a.agent_id === slug || 
            a.id === slug
          );
          
          if (currentAgent) {
            setAgent(currentAgent);
          } else {
            toast.error(t('agent_not_found'));
            navigate('/agentes');
          }
        }
        
        // Set voices and folders
        if (voicesData?.voices) {
          setVoices(voicesData.voices);
        }
        
        if (foldersData?.folders) {
          setFolders(foldersData.folders);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(t('error_loading_agent'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, fetchWithAuth, navigate, t]);

  const updateAgent = async (fieldName: string, value: any) => {
    if (!agent) return;
    
    setSaveStatus('saving');
    
    try {
      // Create the payload with just the updated field
      let payload = {};
      
      // Handle nested fields (e.g., speech_settings.stability)
      if (fieldName.includes('.')) {
        const [parent, child] = fieldName.split('.');
        payload = {
          [parent]: {
            ...(agent[parent] || {}),
            [child]: value
          }
        };
      } else {
        payload = { [fieldName]: value };
      }
      
      console.log('Updating agent with payload:', payload);
      
      // Update the agent using PATCH
      await fetchWithAuth(`/update-agent/${agent.agent_id || agent.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      // Update local state
      setAgent(prev => {
        if (!prev) return null;
        
        if (fieldName.includes('.')) {
          const [parent, child] = fieldName.split('.');
          return {
            ...prev,
            [parent]: {
              ...(prev[parent] || {}),
              [child]: value
            }
          };
        }
        
        return { ...prev, [fieldName]: value };
      });
      
      setSaveStatus('saved');
      
      // Reset saved status after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (error) {
      console.error(`Error updating ${fieldName}:`, error);
      toast.error(t('error_updating_field'));
      setSaveStatus('idle');
    }
  };

  const handleAgentSelect = (selectedAgent: RetellAgent) => {
    setShowAgentSelector(false);
    if (selectedAgent.agent_id !== slug && selectedAgent.agent_id) {
      navigate(`/agentes/${selectedAgent.agent_id}/edit`);
    }
  };

  const handleVoiceSelect = (voiceId: string) => {
    updateAgent('voice_id', voiceId);
    setShowVoiceSelector(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold">{t('agent_not_found')}</h2>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => navigate('/agentes')}
        >
          {t('back_to_agents')}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AgentEditorHeader 
        agent={agent}
        saveStatus={saveStatus}
        onOpenAgentSelector={() => setShowAgentSelector(true)}
        onOpenVoiceSettings={() => setShowVoiceSettings(true)}
        onUpdateField={updateAgent}
      />
      
      <AgentEditorForm 
        agent={agent}
        voices={voices}
        folders={folders}
        onUpdateField={updateAgent}
        onOpenVoiceSelector={() => setShowVoiceSelector(true)}
      />
      
      {showAgentSelector && (
        <AgentSelector 
          agents={allAgents}
          currentAgentId={agent.agent_id || agent.id || ''}
          onSelect={handleAgentSelect}
          onClose={() => setShowAgentSelector(false)}
        />
      )}
      
      {showVoiceSettings && (
        <VoiceSettings 
          agent={agent}
          onUpdate={updateAgent}
          onClose={() => setShowVoiceSettings(false)}
        />
      )}

      {showVoiceSelector && (
        <VoiceSelector
          voices={voices}
          currentVoiceId={agent.voice_id || ''}
          onSelectVoice={handleVoiceSelect}
          onClose={() => setShowVoiceSelector(false)}
        />
      )}
    </div>
  );
};

export default AgentEditorPage;
