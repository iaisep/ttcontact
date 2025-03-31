
import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, Settings, Edit, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AgentEditorHeaderProps {
  agent: RetellAgent;
  saveStatus: 'idle' | 'saving' | 'saved';
  onOpenAgentSelector: () => void;
  onOpenVoiceSettings: () => void;
  onUpdateField: (fieldName: string, value: any) => void;
}

const AgentEditorHeader: React.FC<AgentEditorHeaderProps> = ({
  agent,
  saveStatus,
  onOpenAgentSelector,
  onOpenVoiceSettings,
  onUpdateField
}) => {
  const navigate = useNavigate();
  const [isEditingName, setIsEditingName] = useState(false);
  const [agentName, setAgentName] = useState(agent.agent_name || agent.name || 'Unnamed Agent');
  
  // Get the agent ID or slug
  const agentId = agent.agent_id || agent.id;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgentName(e.target.value);
  };

  const handleNameSave = () => {
    if (agentName.trim() !== '') {
      onUpdateField('agent_name', agentName);
      setIsEditingName(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setAgentName(agent.agent_name || agent.name || 'Unnamed Agent');
      setIsEditingName(false);
    }
  };

  // Current language and language options
  const currentLanguage = agent.language || 'en-US';
  const languageOptions = [
    { value: 'es-ES', label: 'Spanish', flag: '🇪🇸' },
    { value: 'en-US', label: 'English (US)', flag: '🇺🇸' },
    { value: 'en-GB', label: 'English (UK)', flag: '🇬🇧' },
    { value: 'fr-FR', label: 'French', flag: '🇫🇷' },
    { value: 'de-DE', label: 'German', flag: '🇩🇪' },
    { value: 'it-IT', label: 'Italian', flag: '🇮🇹' },
    { value: 'pt-BR', label: 'Portuguese (Brazil)', flag: '🇧🇷' },
  ];
  
  const selectedLanguage = languageOptions.find(lang => lang.value === currentLanguage) || languageOptions[0];
  
  return (
    <div className="border-b sticky top-0 z-10 bg-background">
      <div className="container py-4 px-4">
        <div className="flex items-center mb-2">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/agentes/${agentId}`)}
            className="mr-2 p-0 h-9 w-9"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          {isEditingName ? (
            <div className="flex items-center">
              <input
                type="text"
                value={agentName}
                onChange={handleNameChange}
                onBlur={handleNameSave}
                onKeyDown={handleKeyDown}
                autoFocus
                className="bg-transparent border-b border-primary focus:outline-none px-1 py-1 text-xl font-semibold"
              />
            </div>
          ) : (
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">{agentName}</h1>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsEditingName(true)}
                className="ml-1 h-7 w-7"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
          
          {saveStatus === 'saving' && (
            <span className="text-sm text-muted-foreground ml-4">
              Guardando...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-sm text-green-500 ml-4">
              Guardado
            </span>
          )}
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <div className="mr-4">
            <span className="font-medium">Agent ID:</span> {agentId.substring(0, 8)}...
          </div>
          <div className="mr-4">
            <span className="font-medium">LLM:</span> {agent.response_engine?.type || 'GPT-4o'}
          </div>
          <div className="mr-4">
            <span className="font-medium">Costo/min:</span> $0.08
          </div>
          <div>
            <span className="font-medium">Latencia:</span> ~1.2s
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
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
            <span className="truncate max-w-[150px]">
              {agent.voice_name || 'Select Voice'}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <span className="text-base">{selectedLanguage.flag}</span>
                <span>{selectedLanguage.label}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[180px]">
              {languageOptions.map((lang) => (
                <DropdownMenuItem 
                  key={lang.value}
                  onClick={() => onUpdateField('language', lang.value)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onOpenVoiceSettings}
            className="ml-2"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgentEditorHeader;
