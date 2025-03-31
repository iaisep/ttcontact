
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Flag } from 'lucide-react';
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
  
  // Language options with flag icons
  const languageOptions = [
    { value: 'es', label: 'Spanish', icon: <Flag color="#AA151B" fill="#AA151B" className="h-4 w-4" /> },
    { value: 'en', label: 'English', icon: <Flag color="#B22234" fill="#B22234" className="h-4 w-4" /> },
    { value: 'fr', label: 'French', icon: <Flag color="#0055A4" fill="#0055A4" className="h-4 w-4" /> },
    { value: 'de', label: 'German', icon: <Flag color="#000000" fill="#000000" className="h-4 w-4" /> },
    { value: 'pt-BR', label: 'Portuguese (Brazil)', icon: <Flag color="#009C3B" fill="#009C3B" className="h-4 w-4" /> },
    { value: 'pt-PT', label: 'Portuguese (Portugal)', icon: <Flag color="#FF0000" fill="#FF0000" className="h-4 w-4" /> },
    { value: 'it', label: 'Italian', icon: <Flag color="#009246" fill="#009246" className="h-4 w-4" /> },
    { value: 'ru', label: 'Russian', icon: <Flag color="#FFFFFF" fill="#FFFFFF" className="h-4 w-4" strokeWidth={1} stroke="#0039A6" /> },
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
                      {currentLanguage.icon}
                      <span className="text-sm ml-2">{currentLanguage.label}</span>
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
                    {lang.icon}
                    <span className="text-sm">{lang.label}</span>
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
