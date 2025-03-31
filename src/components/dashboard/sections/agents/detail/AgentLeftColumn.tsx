
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import EditablePrompt from './EditablePrompt';
import WelcomeMessageEditor from './WelcomeMessageEditor';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import { Globe, User, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import VoiceSelectionModal from './VoiceSelectionModal';

interface AgentLeftColumnProps {
  agent: RetellAgent;
  updateAgentField: (fieldName: string, value: any) => void;
}

const AgentLeftColumn: React.FC<AgentLeftColumnProps> = ({
  agent,
  updateAgentField
}) => {
  const [selectedLlmModel, setSelectedLlmModel] = useState('GPT 4o');
  const [selectedVoice, setSelectedVoice] = useState('Adrian');
  const [selectedLanguage, setSelectedLanguage] = useState('Spanish');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const languageOptions = [
    { value: 'es', label: 'Spanish', icon: '🇪🇸' },
    { value: 'en', label: 'English', icon: '🇺🇸' },
    { value: 'fr', label: 'French', icon: '🇫🇷' },
    { value: 'de', label: 'German', icon: '🇩🇪' },
    { value: 'pt', label: 'Portuguese', icon: '🇵🇹' },
    { value: 'it', label: 'Italian', icon: '🇮🇹' },
  ];

  const llmOptions = [
    'GPT 4o',
    'GPT 4o Mini',
    'Claude 3 Opus',
    'Claude 3 Sonnet',
  ];

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    updateAgentField('language', lang);
  };

  const handleLlmChange = (llm: string) => {
    setSelectedLlmModel(llm);
    updateAgentField('llm_model', llm);
  };

  const handleVoiceChange = (voice: any) => {
    setSelectedVoice(voice.name);
    updateAgentField('voice', voice.name);
    updateAgentField('voice_id', voice.voice_id);
  };

  const openVoiceModal = () => {
    setIsVoiceModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        {/* LLM Model Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 bg-gray-50 text-gray-700">
              <Globe className="h-4 w-4" />
              <span>{selectedLlmModel}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {llmOptions.map((option) => (
              <DropdownMenuItem key={option} onClick={() => handleLlmChange(option)}>
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Voice Selector */}
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-gray-50 text-gray-700"
          onClick={openVoiceModal}
        >
          <div className="h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center text-white">
            <User className="h-3 w-3" />
          </div>
          <span>{selectedVoice}</span>
        </Button>

        {/* Settings Button */}
        <Button variant="outline" size="icon" className="rounded-full bg-gray-50">
          <Settings className="h-4 w-4" />
        </Button>
        
        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 bg-gray-50 text-gray-700">
              <span className="text-base">
                {languageOptions.find(l => l.label === selectedLanguage)?.icon || '🌐'}
              </span>
              <span>{selectedLanguage}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {languageOptions.map((option) => (
              <DropdownMenuItem key={option.value} onClick={() => handleLanguageChange(option.label)}>
                <span className="mr-2">{option.icon}</span>
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Voice Selection Modal */}
      <VoiceSelectionModal
        open={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSelectVoice={handleVoiceChange}
        selectedVoice={agent.voice_id}
      />

      {/* Prompt Editor */}
      <EditablePrompt
        prompt={agent.prompt || ''}
        onUpdate={(value) => updateAgentField('prompt', value)}
      />

      {/* Welcome Message */}
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-2">Welcome Message</h3>
        <WelcomeMessageEditor
          welcomeMessage={agent.welcome_message || 'User initiates: AI remains silent until users speak first.'}
          onUpdate={(value) => updateAgentField('welcome_message', value)}
        />
      </div>
    </div>
  );
};

export default AgentLeftColumn;
