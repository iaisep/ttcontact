
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { RetellAgent, RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface AgentDetailHeaderProps {
  agent: RetellAgent;
  voice?: RetellVoice | null;
  updateAgentField: (fieldName: string, value: any) => void;
}

const AgentDetailHeader: React.FC<AgentDetailHeaderProps> = ({
  agent,
  voice,
  updateAgentField
}) => {
  const navigate = useNavigate();
  const [isEditingName, setIsEditingName] = useState(false);
  const [agentName, setAgentName] = useState(agent.agent_name || agent.name || '');
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgentName(e.target.value);
  };
  
  const handleNameSubmit = () => {
    if (agentName.trim() !== '') {
      updateAgentField('agent_name', agentName);
      setIsEditingName(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    }
  };
  
  return (
    <div className="border-b sticky top-0 z-10 bg-background">
      <div className="container flex items-center h-16 px-4">
        <Button variant="ghost" onClick={() => navigate('/agentes')} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex-1">
          <div className="flex items-center">
            {isEditingName ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={agentName}
                  onChange={handleNameChange}
                  onBlur={handleNameSubmit}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="text-lg font-semibold bg-transparent border-b border-primary outline-none mr-2"
                />
                <Button variant="ghost" size="sm" onClick={handleNameSubmit}>
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center">
                <h1 className="text-lg font-semibold">{agent.agent_name || agent.name}</h1>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-6 w-6 ml-2"
                  onClick={() => setIsEditingName(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
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
            <span>1200-1450ms latency</span>
            <span>•</span>
            <span>Auto saved at 07:51</span>
          </div>
        </div>
        
        <div className="flex space-x-2 items-center">
          <div className="flex space-x-2">
            <Button variant="outline">Create</Button>
            <Button variant="outline">Simulation</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailHeader;
