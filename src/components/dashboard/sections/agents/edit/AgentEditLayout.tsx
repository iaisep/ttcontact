
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgentSelector } from './AgentSelector';
import { AgentSettingsHeader } from './AgentSettingsHeader';
import { AgentSettingsForm } from './AgentSettingsForm';
import { RetellAgent, RetellVoice, RetellFolder, RetellLLM } from '@/components/dashboard/sections/agents/types/retell-types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface AgentEditLayoutProps {
  agent: RetellAgent;
  allAgents: RetellAgent[];
  voices: RetellVoice[];
  folders: RetellFolder[];
  llms: RetellLLM[];
  onUpdate: (updates: Partial<RetellAgent>) => Promise<boolean>;
  onChangeAgent: (agentId: string) => void;
}

export const AgentEditLayout: React.FC<AgentEditLayoutProps> = ({
  agent,
  allAgents,
  voices,
  folders,
  llms,
  onUpdate,
  onChangeAgent
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/agentes')}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('back_to_agents')}
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <AgentSelector 
              currentAgent={agent}
              allAgents={allAgents}
              isOpen={isSelectorOpen}
              onOpen={() => setIsSelectorOpen(true)}
              onClose={() => setIsSelectorOpen(false)}
              onSelect={(agentId) => {
                onChangeAgent(agentId);
                setIsSelectorOpen(false);
              }}
            />
          </div>
        </div>
      </header>

      {/* Agent settings header */}
      <AgentSettingsHeader 
        agent={agent}
        llms={llms}
        onUpdate={onUpdate}
      />

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <AgentSettingsForm
            agent={agent}
            voices={voices}
            folders={folders}
            llms={llms}
            onUpdate={onUpdate}
          />
        </div>
      </div>
    </div>
  );
};
