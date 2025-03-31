
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Settings } from 'lucide-react';
import { toast } from 'sonner';
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

interface AgentDetailHeaderProps {
  agent: RetellAgent;
  defaultLanguage: string;
  selectedLlmModel: string;
  onLanguageChange: (value: string) => void;
  onLlmModelChange: (value: string) => void;
  onOpenAgentSelector?: () => void;
  onOpenVoiceSettings?: () => void;
}

const AgentDetailHeader: React.FC<AgentDetailHeaderProps> = ({
  agent,
  defaultLanguage,
  selectedLlmModel,
  onLanguageChange,
  onLlmModelChange,
  onOpenAgentSelector,
  onOpenVoiceSettings
}) => {
  const navigate = useNavigate();
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };
  
  // Language options with flag icons
  const languageOptions = [
    { value: 'es', label: 'Spanish', icon: '🇪🇸' },
    { value: 'en', label: 'English', icon: '🇺🇸' },
    { value: 'fr', label: 'French', icon: '🇫🇷' },
    { value: 'de', label: 'German', icon: '🇩🇪' },
    { value: 'pt-BR', label: 'Portuguese (Brazil)', icon: '🇧🇷' },
    { value: 'pt-PT', label: 'Portuguese (Portugal)', icon: '🇵🇹' },
    { value: 'it', label: 'Italian', icon: '🇮🇹' },
    { value: 'ru', label: 'Russian', icon: '🇷🇺' },
  ];

  // Find the current language display data
  const currentLanguage = languageOptions.find(lang => lang.value === defaultLanguage) || languageOptions[0];
  
  // Get the agent ID or slug for navigation
  const agentId = agent.agent_id || agent.id;
  
  return (
    <div className="border-b sticky top-0 z-10 bg-background">
      <div className="container flex items-center h-16 px-4">
        <Button variant="ghost" onClick={() => navigate('/agentes')} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex-1">
          <div className="flex items-center">
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 font-semibold">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center overflow-hidden text-white">
                      {agent.agent_name?.substring(0, 1) || agent.name?.substring(0, 1) || 'A'}
                    </div>
                    <span>{agent.agent_name || agent.name}</span>
                    <svg 
                      width="12" 
                      height="12" 
                      viewBox="0 0 12 12" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1"
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
              
              {onOpenVoiceSettings && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={onOpenVoiceSettings} className="ml-1">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Voice settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
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
            <span>1350-1600ms latency</span>
          </div>
        </div>
        
        <div className="flex space-x-2 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-md p-2 cursor-pointer mr-2">
                <span className="text-sm ml-2">{currentLanguage.icon} {currentLanguage.label}</span>
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1"
                >
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] max-h-[350px] overflow-y-auto">
              {languageOptions.map((lang) => (
                <DropdownMenuItem 
                  key={lang.value}
                  onClick={() => onLanguageChange(lang.value)}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 py-2"
                >
                  <span className="text-sm">{lang.icon} {lang.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
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
