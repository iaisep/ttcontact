
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AgentDetailHeader from '@/components/dashboard/sections/agents/detail/AgentDetailHeader';
import AgentLeftColumn from '@/components/dashboard/sections/agents/detail/AgentLeftColumn';
import AgentRightColumn from '@/components/dashboard/sections/agents/detail/AgentRightColumn';
import AgentSettingsAccordion from '@/components/dashboard/sections/agents/detail/AgentSettingsAccordion';
import { useAgentDetails } from '@/components/dashboard/sections/agents/hooks/useAgentDetails';

const AgentDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Use our optimized hook to fetch all agent details
  const { 
    agent, 
    llm, 
    voice, 
    knowledgeBases, 
    isLoading, 
    error,
    refreshData,
    updateAgentField
  } = useAgentDetails(slug);

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-t-primary rounded-full"></div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="p-6">
        <div className="bg-card rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold">{t('agent_not_found')}</h2>
          <p className="mt-2 text-muted-foreground">{error || t('agent_not_found_description')}</p>
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
        voice={voice}
        updateAgentField={updateAgentField}
      />

      <div className="container py-6 px-4">
        {/* Agent Knowledge Bases summary (if any) */}
        {knowledgeBases.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-sm font-medium mb-2">{t('knowledge_bases')}</h3>
            <div className="flex flex-wrap gap-2">
              {knowledgeBases.map(kb => (
                <div key={kb.id} className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full text-xs">
                  {kb.name || kb.id}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column - Prompt Editor */}
          <div className="md:col-span-10">
            <AgentLeftColumn 
              agent={agent}
              llm={llm}
              voice={voice}
              updateAgentField={updateAgentField}
              refreshData={refreshData}
            />
          </div>

          {/* Middle Column - Accordion Settings */}
          <div className="md:col-span-4">
            <AgentSettingsAccordion 
              agent={agent}
              knowledgeBases={knowledgeBases}
              updateAgentField={updateAgentField}
            />
          </div>

          {/* Right Column - Test Panel */}
          <div className="md:col-span-3">
            <AgentRightColumn 
              agent={agent}
              voice={voice}
              updateAgentField={updateAgentField}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailPage;
