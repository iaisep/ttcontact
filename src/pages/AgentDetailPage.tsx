
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiContext } from '@/context/ApiContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save, Mic, TestTube, Play } from 'lucide-react';
import AgentHeader from '@/components/dashboard/sections/agents/detail/AgentHeader';
import EditablePrompt from '@/components/dashboard/sections/agents/detail/EditablePrompt';
import AgentFunctionsPanel from '@/components/dashboard/sections/agents/detail/AgentFunctionsPanel';
import KnowledgeBaseEditor from '@/components/dashboard/sections/agents/detail/KnowledgeBaseEditor';
import SpeechSettings from '@/components/dashboard/sections/agents/detail/SpeechSettings';
import WelcomeMessageEditor from '@/components/dashboard/sections/agents/detail/WelcomeMessageEditor';
import TestPanel from '@/components/dashboard/sections/agents/detail/TestPanel';
import { RetellAgent, RetellVoice, RetellLLM } from '@/components/dashboard/sections/agents/types/retell-types';

const AgentDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  
  const [agent, setAgent] = useState<RetellAgent | null>(null);
  const [voices, setVoices] = useState<RetellVoice[]>([]);
  const [llms, setLLMs] = useState<RetellLLM[]>([]);
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
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
    <div className="p-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/agentes')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back_to_agents')}
        </Button>
        <div className="flex items-center gap-2">
          {isSaving && <span className="text-sm text-muted-foreground">{t('saving')}...</span>}
        </div>
      </div>

      <AgentHeader 
        agent={agent} 
        voices={voices} 
        onUpdate={updateAgentField} 
      />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="general">{t('general')}</TabsTrigger>
          <TabsTrigger value="prompt">{t('prompt')}</TabsTrigger>
          <TabsTrigger value="knowledge">{t('knowledge_base')}</TabsTrigger>
          <TabsTrigger value="functions">{t('functions')}</TabsTrigger>
          <TabsTrigger value="speech">{t('speech_settings')}</TabsTrigger>
          <TabsTrigger value="test">{t('test')}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('welcome_message')}</h3>
            <WelcomeMessageEditor 
              welcomeMessage={agent.welcome_message || ''}
              onUpdate={(value) => updateAgentField('welcome_message', value)}
            />
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('language_settings')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t('language')}</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={agent.language || 'en'}
                  onChange={(e) => updateAgentField('language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="it">Italiano</option>
                  <option value="pt">Português</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('llm')}</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={agent.llm_id || ''}
                  onChange={(e) => updateAgentField('llm_id', e.target.value)}
                >
                  {llms.map(llm => (
                    <option key={llm.id} value={llm.id}>{llm.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="prompt" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('agent_prompt')}</h3>
            <EditablePrompt
              prompt={agent.prompt || ''}
              onUpdate={(value) => updateAgentField('prompt', value)}
            />
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('knowledge_base')}</h3>
            <KnowledgeBaseEditor
              knowledgeBase={agent.knowledge_base || ''}
              onUpdate={(value) => updateAgentField('knowledge_base', value)}
            />
          </Card>
        </TabsContent>

        <TabsContent value="functions" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('agent_functions')}</h3>
            <AgentFunctionsPanel
              functions={agent.functions || []}
              onUpdate={(value) => updateAgentField('functions', value)}
            />
          </Card>
        </TabsContent>

        <TabsContent value="speech" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('speech_settings')}</h3>
            <SpeechSettings
              settings={agent.speech_settings || { stability: 0.5, similarity: 0.75, style: 0.5, speed: 1 }}
              onUpdate={(value) => updateAgentField('speech_settings', value)}
            />
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('test_agent')}</h3>
            <TestPanel
              agent={agent}
              voice={voices.find(v => v.id === agent.voice_id)}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentDetailPage;
