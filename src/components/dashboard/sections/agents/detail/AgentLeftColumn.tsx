
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import EditablePrompt from './EditablePrompt';
import WelcomeMessageEditor from './WelcomeMessageEditor';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import { Globe, User, Settings, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import VoiceSelectionModal from './VoiceSelectionModal';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
  
  // Voice settings state
  const [voiceModel, setVoiceModel] = useState('elevenlabs_turbo_v2.5');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voiceTemperature, setVoiceTemperature] = useState(1.0);
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);

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

  const voiceModelOptions = [
    { id: 'auto_elevenlabs_multilingual_v2', label: 'Auto(Elevenlabs Multilingual v2)', description: 'Multilingual, fast, high quality' },
    { id: 'elevenlabs_turbo_v2.5', label: 'Elevenlabs Turbo V2.5', description: 'Multilingual, fast, high quality' },
    { id: 'elevenlabs_flash_v2.5', label: 'Elevenlabs Flash V2.5', description: 'Multilingual, fastest, medium quality' },
    { id: 'elevenlabs_multilingual_v2', label: 'Elevenlabs Multilingual v2', description: 'Multilingual, slow, highest quality' },
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

  const handleSaveVoiceSettings = () => {
    updateAgentField('voice_model', voiceModel);
    updateAgentField('voice_speed', voiceSpeed);
    updateAgentField('voice_temperature', voiceTemperature);
    updateAgentField('voice_volume', voiceVolume);
    setIsVoiceSettingsOpen(false);
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
        <Popover open={isVoiceSettingsOpen} onOpenChange={setIsVoiceSettingsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full bg-gray-50">
              <Settings className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h3 className="font-medium">Voice Model</h3>
              <RadioGroup 
                value={voiceModel} 
                onValueChange={setVoiceModel}
                className="space-y-2"
              >
                {voiceModelOptions.map((option) => (
                  <div key={option.id} className="flex items-start space-x-2">
                    <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                    <div className="grid gap-1">
                      <Label htmlFor={option.id} className="font-normal">{option.label}</Label>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Voice Speed</Label>
                  <span className="text-sm">{voiceSpeed.toFixed(2)}</span>
                </div>
                <Slider
                  value={[voiceSpeed]}
                  min={0.25}
                  max={2.0}
                  step={0.01}
                  onValueChange={([value]) => setVoiceSpeed(value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Voice Temperature</Label>
                  <span className="text-sm">{voiceTemperature.toFixed(2)}</span>
                </div>
                <Slider
                  value={[voiceTemperature]}
                  min={0}
                  max={1.0}
                  step={0.01}
                  onValueChange={([value]) => setVoiceTemperature(value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Voice Volume</Label>
                  <span className="text-sm">{voiceVolume.toFixed(2)}</span>
                </div>
                <Slider
                  value={[voiceVolume]}
                  min={0}
                  max={1.0}
                  step={0.01}
                  onValueChange={([value]) => setVoiceVolume(value)}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsVoiceSettingsOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleSaveVoiceSettings}
                >
                  Save
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
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
