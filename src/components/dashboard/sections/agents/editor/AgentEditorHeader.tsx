
import React from 'react';
import { ArrowLeft, Settings, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';

interface AgentEditorHeaderProps {
  agent: RetellAgent;
  saveStatus: 'idle' | 'saving' | 'saved';
  onOpenAgentSelector: () => void;
  onOpenVoiceSettings: () => void;
}

const AgentEditorHeader: React.FC<AgentEditorHeaderProps> = ({
  agent,
  saveStatus,
  onOpenAgentSelector,
  onOpenVoiceSettings
}) => {
  const navigate = useNavigate();
  
  // Get the agent ID or slug
  const agentId = agent.agent_id || agent.id;
  
  return (
    <div className="border-b sticky top-0 z-10 bg-background">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/agentes/${agentId}`)}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            className="flex items-center gap-2 font-medium"
            onClick={onOpenAgentSelector}
          >
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {agent.voice_id && (
                <span className="text-xs font-semibold">
                  {agent.voice_id.substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <span className="truncate max-w-[200px]">
              {agent.agent_name || agent.name || 'Unnamed Agent'}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenVoiceSettings}
            className="ml-2"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center">
          {saveStatus === 'saving' && (
            <span className="text-sm text-muted-foreground mr-4">
              Guardando...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-sm text-green-500 mr-4">
              Guardado
            </span>
          )}
          
          <Button
            onClick={() => navigate(`/agentes/${agentId}`)}
            variant="outline"
            className="mr-2"
          >
            Cancelar
          </Button>
          
          <Button onClick={() => navigate(`/agentes/${agentId}`)}>
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgentEditorHeader;
