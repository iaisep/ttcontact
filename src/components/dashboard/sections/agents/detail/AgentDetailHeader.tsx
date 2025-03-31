
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe, Flag } from 'lucide-react';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';

interface AgentDetailHeaderProps {
  agent: RetellAgent;
  defaultLanguage: string;
  selectedLlmModel: string;
  onLanguageChange: (value: string) => void;
  onLlmModelChange: (value: string) => void;
}

const AgentDetailHeader: React.FC<AgentDetailHeaderProps> = ({
  agent,
  defaultLanguage,
  selectedLlmModel,
  onLanguageChange,
  onLlmModelChange
}) => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default AgentDetailHeader;
