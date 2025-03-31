
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiContext } from '@/context/ApiContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import AgentDetailHeader from '@/components/dashboard/sections/agents/detail/AgentDetailHeader';
import AgentLeftColumn from '@/components/dashboard/sections/agents/detail/AgentLeftColumn';
import AgentRightColumn from '@/components/dashboard/sections/agents/detail/AgentRightColumn';
import { RetellAgent, RetellVoice, RetellLLM } from '@/components/dashboard/sections/agents/types/retell-types';

const AgentDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  
  const [agent, setAgent] = useState<RetellAgent | null>(null);
  const [voices, setVoices] = useState<RetellVoice[]>([]);
  const [llms, setLLMs] = useState<RetellLLM[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [defaultLanguage, setDefaultLanguage] = useState('es');
  const [selectedLlmModel, setSelectedLlmModel] = useState('GPT 4o mini');

  useEffect(() => {
    const fetchAgentData = async () => {
      setIsLoading(true);
      try {
        // Fetch agent details
        const agentsData = await fetchWithAuth('/list-agents');
        
        // Find the specific agent by slug
        const foundAgent = Array.isArray(agentsData) 
          ? agentsData.find(a => 
              (a.agent_name?.toLowerCase().replace(/\s+/g, '-') === slug || 
              a.agent_id === slug))
          : null;
        
        if (!foundAgent) {
          toast.error(t('agent_not_found'));
          navigate('/agentes');
          return;
        }

        // Fetch additional resources needed for editing
        const [voicesData, llmsData] = await Promise.all([
          fetchWithAuth('/list-voices'),
          fetchWithAuth('/list-retell-llms'),
        ]);

        if (voicesData?.voices) {
          setVoices(voicesData.voices);
        }
        
        if (llmsData?.llms) {
          setLLMs(llmsData.llms);
        }

        setAgent(foundAgent);
      } catch (error) {
        console.error('Error fetching agent data:', error);
        toast.error(t('error_loading_agent'));
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchAgentData();
    }
  }, [slug, fetchWithAuth, navigate, t]);

  const updateAgentField = async (fieldName: string, value: any) => {
    if (!agent) return;
    
    setIsSaving(true);
    
    try {
      // Create a copy of the agent with the updated field
      const updatedAgent = {
        ...agent,
        [fieldName]: value
      };
      
      // Update the agent in the API
      await fetchWithAuth(`/update-agent/${agent.agent_id || agent.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedAgent)
      });
      
      // Update local state
      setAgent(updatedAgent);
      toast.success(t('field_updated'));
    } catch (error) {
      console.error(`Error updating ${fieldName}:`, error);
      toast.error(t('error_updating_field'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-t-primary rounded-full"></div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="p-6">
        <div className="bg-card rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold">{t('agent_not_found')}</h2>
          <p className="mt-2 text-muted-foreground">{t('agent_not_found_description')}</p>
          <Button onClick={() => navigate('/agentes')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back_to_agents')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AgentDetailHeader 
        agent={agent}
        defaultLanguage={defaultLanguage}
        selectedLlmModel={selectedLlmModel}
        onLanguageChange={(value) => {
          setDefaultLanguage(value);
          updateAgentField('language', value);
        }}
        onLlmModelChange={(value) => setSelectedLlmModel(value)}
      />

      <div className="container py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Prompt Editor */}
          <AgentLeftColumn 
            agent={agent}
            defaultLanguage={defaultLanguage}
            selectedLlmModel={selectedLlmModel}
            onLanguageChange={(value) => {
              setDefaultLanguage(value);
              updateAgentField('language', value);
            }}
            onLlmModelChange={(value) => setSelectedLlmModel(value)}
            updateAgentField={updateAgentField}
          />

          {/* Right Column - Settings & Testing */}
          <AgentRightColumn 
            agent={agent}
            updateAgentField={updateAgentField}
          />
        </div>
      </div>
    </div>
  );
};

export default AgentDetailPage;
