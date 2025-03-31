
import React from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
          
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 font-semibold">
                  <Avatar className="h-8 w-8 bg-gradient-to-br from-amber-500 to-amber-700">
                    <AvatarFallback className="text-white">
                      {agent.agent_name?.substring(0, 1) || agent.name?.substring(0, 1) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <span>{agent.agent_name || agent.name || 'Unnamed Agent'}</span>
                  <svg 
                    width="12" 
                    height="12" 
                    viewBox="0 0 12 12" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[250px]">
                <DropdownMenuItem onClick={onOpenAgentSelector}>
                  Select different agent
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onOpenVoiceSettings}
                    className="ml-1"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Voice settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
