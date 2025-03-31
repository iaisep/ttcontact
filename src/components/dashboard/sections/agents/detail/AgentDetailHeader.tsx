
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy } from 'lucide-react';
import { toast } from 'sonner';
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
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };
  
  return (
    <div className="border-b sticky top-0 z-10 bg-background">
      <div className="container flex items-center h-16 px-4">
        <Button variant="ghost" onClick={() => navigate('/agentes')} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex-1">
          <h1 className="text-lg font-semibold">{agent.agent_name || agent.name}</h1>
          <div className="flex text-xs text-muted-foreground space-x-2 items-center">
            <div className="flex items-center gap-1">
              <span>Agent ID: {agent.agent_id?.substring(0, 8) || agent.id?.substring(0, 8)}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => handleCopy(agent.agent_id || agent.id || '')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span>Retell LLM ID: {agent.llm_id?.substring(0, 5) || 'll-49'}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => handleCopy(agent.llm_id || 'll-49')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
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
