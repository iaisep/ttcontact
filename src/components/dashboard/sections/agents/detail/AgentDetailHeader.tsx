
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy } from 'lucide-react';
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
  
  // Language options with flags - expanded to match the image
  const languageOptions = [
    { value: 'es', label: 'Spanish', flag: '🇪🇸' },
    { value: 'de', label: 'German', flag: '🇩🇪' },
    { value: 'hi', label: 'Hindi', flag: '🇮🇳' },
    { value: 'ja', label: 'Japanese', flag: '🇯🇵' },
    { value: 'pt-PT', label: 'Portuguese', region: 'Portugal', flag: '🇵🇹' },
    { value: 'pt-BR', label: 'Portuguese', region: 'Brazil', flag: '🇧🇷' },
    { value: 'ru', label: 'Russian', flag: '🇷🇺' },
    { value: 'it', label: 'Italian', flag: '🇮🇹' },
    { value: 'ko', label: 'Korean', flag: '🇰🇷' },
    { value: 'nl', label: 'Dutch', flag: '🇳🇱' },
    { value: 'pl', label: 'Polish', flag: '🇵🇱' },
    { value: 'tr', label: 'Turkish', flag: '🇹🇷' },
    { value: 'vi', label: 'Vietnamese', flag: '🇻🇳' },
    { value: 'ro', label: 'Romanian', flag: '🇷🇴' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'fr', label: 'French', flag: '🇫🇷' },
  ];

  // Find the current language display data
  const currentLanguage = languageOptions.find(lang => lang.value === defaultLanguage) || languageOptions[0];
  
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
        
        <div className="flex space-x-2 items-center">
          <TooltipProvider>
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center space-x-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-md p-2 cursor-pointer mr-2">
                      <span className="mr-1">{currentLanguage.flag}</span>
                      <span className="text-sm">{currentLanguage.label}</span>
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
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select language</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-[200px] max-h-[350px] overflow-y-auto">
                {languageOptions.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.value}
                    onClick={() => onLanguageChange(lang.value)}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 py-2"
                  >
                    <span className="text-base">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-sm">{lang.label}</span>
                      {lang.region && (
                        <span className="text-xs text-gray-500">({lang.region})</span>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
          
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
