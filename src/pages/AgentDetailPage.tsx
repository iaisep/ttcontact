
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiContext } from '@/context/ApiContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save, Mic, TestTube, Play, Plus, Trash, Edit, File, Flag, Phone, Shield, Globe, Webhook } from 'lucide-react';
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
      {/* Header Bar */}
      <div className="border-b sticky top-0 z-10 bg-background">
        <div className="container flex items-center h-16 px-4">
          <Button variant="ghost" onClick={() => navigate('/agentes')} className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{agent.agent_name || agent.name}</h1>
            <div className="flex text-xs text-muted-foreground space-x-2">
              <span>Agent ID: {agent.agent_id?.substring(0, 8) || agent.id?.substring(0, 8)}</span>
              <span>•</span>
              <span>Retell LLM ID: {agent.llm_id?.substring(0, 5) || 'll-49'}</span>
              <span>•</span>
              <span>+50.087/min</span>
              <span>•</span>
              <span>1350-1600ms latency</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline">Create</Button>
            <Button variant="outline">Simulation</Button>
          </div>
        </div>
      </div>

      <div className="container py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Prompt Editor */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center space-x-2 bg-muted rounded-md p-2">
                <Globe className="h-4 w-4" />
                <select 
                  value={selectedLlmModel}
                  onChange={(e) => setSelectedLlmModel(e.target.value)}
                  className="bg-transparent border-none focus:outline-none text-sm"
                >
                  <option value="GPT 4o mini">GPT 4o mini</option>
                  <option value="GPT 4o">GPT 4o</option>
                  <option value="Claude 3 Opus">Claude 3 Opus</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 bg-muted rounded-md p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M12 20v-8"></path><rect x="8" y="2" width="8" height="10" rx="2"></rect>
                </svg>
                <span className="text-sm">Angie vendedora</span>
              </div>

              <div className="flex items-center space-x-2 bg-muted rounded-md p-2">
                <Flag className="h-4 w-4" />
                <select 
                  value={defaultLanguage}
                  onChange={(e) => {
                    setDefaultLanguage(e.target.value);
                    updateAgentField('language', e.target.value);
                  }}
                  className="bg-transparent border-none focus:outline-none text-sm"
                >
                  <option value="es">Spanish</option>
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>

            <EditablePrompt
              prompt={agent.prompt || ''}
              onUpdate={(value) => updateAgentField('prompt', value)}
            />

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Welcome Message</h3>
              <WelcomeMessageEditor
                welcomeMessage={agent.welcome_message || 'Hola {name}, que gusto volver a saludarte.'}
                onUpdate={(value) => updateAgentField('welcome_message', value)}
              />
            </div>
          </div>

          {/* Right Column - Settings & Testing */}
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <Button variant="outline" className="w-[49%]">
                <Mic className="mr-2 h-4 w-4" />
                Test Audio
              </Button>
              <Button variant="outline" className="w-[49%]">
                <TestTube className="mr-2 h-4 w-4" />
                Test LLM
              </Button>
            </div>

            <Accordion type="multiple" defaultValue={["functions", "knowledge"]}>
              <AccordionItem value="functions" className="border rounded-md px-2 mb-2">
                <AccordionTrigger className="py-2">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                      <rect width="8" height="8" x="2" y="2" rx="2"></rect>
                      <rect width="8" height="8" x="14" y="2" rx="2"></rect>
                      <rect width="8" height="8" x="2" y="14" rx="2"></rect>
                      <rect width="8" height="8" x="14" y="14" rx="2"></rect>
                    </svg>
                    Functions
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="py-2 text-sm">
                    <p className="text-muted-foreground mb-4">
                      Enable your agent with capabilities such as calendar bookings, call termination, etc.
                    </p>
                    <AgentFunctionsPanel
                      functions={agent.functions || [
                        { id: "fn_1", name: "correo", description: "Send email" },
                        { id: "fn_2", name: "end_call", description: "End the call" },
                        { id: "fn_3", name: "agendar", description: "Schedule appointment" }
                      ]}
                      onUpdate={(value) => updateAgentField('functions', value)}
                    />
                    <Button variant="outline" size="sm" className="mt-4">
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="knowledge" className="border rounded-md px-2 mb-2">
                <AccordionTrigger className="py-2">
                  <div className="flex items-center">
                    <File className="h-4 w-4 mr-2" />
                    Knowledge Base
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="py-2">
                    <p className="text-sm text-muted-foreground mb-4">
                      Add knowledge base to provide context to the agent.
                    </p>
                    <div className="space-y-2">
                      <div className="border p-2 rounded-md flex justify-between items-center">
                        <div className="flex items-center">
                          <File className="h-4 w-4 mr-2" />
                          <span className="text-sm">AD-opc titulación_opc practicas_modalida</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="border p-2 rounded-md flex justify-between items-center">
                        <div className="flex items-center">
                          <File className="h-4 w-4 mr-2" />
                          <span className="text-sm">AD-Perfiles de ingreso y validez</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="border p-2 rounded-md flex justify-between items-center">
                        <div className="flex items-center">
                          <File className="h-4 w-4 mr-2" />
                          <span className="text-sm">Planes de estudio de la oferta académica</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4">
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="speech" className="border rounded-md px-2 mb-2">
                <AccordionTrigger className="py-2">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                      <path d="M12 2c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4v5c0 .5-.2 1-.6 1.4-.4.4-.9.6-1.4.6s-1-.2-1.4-.6c-.4-.4-.6-.9-.6-1.4V4c0-.5.2-1 .6-1.4C11 2.2 11.5 2 12 2Z"></path>
                      <path d="M6 10v1c0 1.7.7 3.4 1.9 4.6 1.2 1.2 2.9 1.9 4.6 1.9 1.7 0 3.4-.7 4.6-1.9 1.2-1.2 1.9-2.9 1.9-4.6v-1"></path>
                      <path d="M18 19c-.5 1.1-1.3 2-2.2 2.7-.9.7-2 1.1-3.2 1.2-2.5.3-4.9-.6-6.5-2.2"></path>
                    </svg>
                    Speech Settings
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <SpeechSettings
                    settings={agent.speech_settings || { stability: 0.5, similarity: 0.75, style: 0.5, speed: 1 }}
                    onUpdate={(value) => updateAgentField('speech_settings', value)}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="call" className="border rounded-md px-2 mb-2">
                <AccordionTrigger className="py-2">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Settings
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="py-2">
                    <p className="text-sm text-muted-foreground">
                      Configure call settings for this agent.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="analysis" className="border rounded-md px-2 mb-2">
                <AccordionTrigger className="py-2">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                      <path d="M3 3v18h18"></path>
                      <path d="m19 9-5 5-4-4-3 3"></path>
                    </svg>
                    Post-Call Analysis
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="py-2">
                    <p className="text-sm text-muted-foreground">
                      Configure post-call analysis settings.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="security" className="border rounded-md px-2 mb-2">
                <AccordionTrigger className="py-2">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Security & Fallback Settings
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="py-2">
                    <p className="text-sm text-muted-foreground">
                      Configure security and fallback settings.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="webhook" className="border rounded-md px-2 mb-2">
                <AccordionTrigger className="py-2">
                  <div className="flex items-center">
                    <Webhook className="h-4 w-4 mr-2" />
                    Webhook Settings
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="py-2">
                    <p className="text-sm text-muted-foreground">
                      Configure webhook settings.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-4 text-center py-8">
              <div className="rounded-full bg-muted-foreground/10 w-24 h-24 mx-auto flex items-center justify-center mb-2">
                <Mic className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <Button variant="default" className="mt-2">
                Test
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailPage;
