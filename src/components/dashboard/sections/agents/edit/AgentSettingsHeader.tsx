
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Settings, Flag, Check } from 'lucide-react';
import { RetellAgent, RetellLLM } from '@/components/dashboard/sections/agents/types/retell-types';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
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
import { toast } from 'sonner';
import { debounce } from 'lodash';

interface AgentSettingsHeaderProps {
  agent: RetellAgent;
  llms: RetellLLM[];
  onUpdate: (updates: Partial<RetellAgent>) => Promise<boolean>;
}

export const AgentSettingsHeader: React.FC<AgentSettingsHeaderProps> = ({
  agent,
  llms,
  onUpdate
}) => {
  const { t } = useLanguage();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [speed, setSpeed] = useState(agent.speech_settings?.speed || 1);
  const [stability, setStability] = useState(agent.speech_settings?.stability || 0.5);
  const [similarity, setSimilarity] = useState(agent.speech_settings?.similarity || 0.75);
  const [selectedLlmModel, setSelectedLlmModel] = useState(agent.llm_id || 'll-openai-gpt-4o');
  const [saving, setSaving] = useState(false);
  const [defaultLanguage, setDefaultLanguage] = useState(agent.language || 'en');
  
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

  // Debounced update functions for voice settings
  const debouncedUpdateSpeechSettings = debounce(async () => {
    setSaving(true);
    
    try {
      const updates = {
        speech_settings: {
          stability,
          similarity,
          speed,
          style: agent.speech_settings?.style || 0,
        }
      };
      
      const success = await onUpdate(updates);
      if (success) {
        toast.success(t('settings_saved'));
      }
    } catch (error) {
      console.error('Error updating speech settings:', error);
    } finally {
      setSaving(false);
    }
  }, 500);
  
  // Handle language change
  const handleLanguageChange = async (value: string) => {
    setSaving(true);
    setDefaultLanguage(value);
    
    try {
      const success = await onUpdate({ language: value });
      if (success) {
        toast.success(t('language_updated'));
      }
    } catch (error) {
      console.error('Error updating language:', error);
    } finally {
      setSaving(false);
    }
  };
  
  // Handle LLM model change
  const handleLlmModelChange = async (value: string) => {
    setSaving(true);
    setSelectedLlmModel(value);
    
    try {
      const success = await onUpdate({ llm_id: value });
      if (success) {
        toast.success(t('model_updated'));
      }
    } catch (error) {
      console.error('Error updating LLM model:', error);
    } finally {
      setSaving(false);
    }
  };
  
  // Handle slider changes
  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
    debouncedUpdateSpeechSettings();
  };
  
  const handleStabilityChange = (value: number[]) => {
    setStability(value[0]);
    debouncedUpdateSpeechSettings();
  };
  
  const handleSimilarityChange = (value: number[]) => {
    setSimilarity(value[0]);
    debouncedUpdateSpeechSettings();
  };
  
  // Find the current language and LLM model display data
  const currentLanguage = languageOptions.find(lang => lang.value === defaultLanguage) || languageOptions[1]; // Default to English
  const currentLlmModel = llms.find(llm => llm.id === selectedLlmModel)?.name || 'Auto';
  
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{agent.agent_name || agent.name}</h1>
            <p className="text-gray-500 mt-1">
              {agent.description?.substring(0, 100)}
              {agent.description && agent.description.length > 100 ? '...' : ''}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <TooltipProvider>
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center space-x-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-md p-2 cursor-pointer">
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
                      onClick={() => handleLanguageChange(lang.value)}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 py-2"
                    >
                      {lang.icon}
                      <span className="text-sm">{lang.label}</span>
                      {lang.value === defaultLanguage && (
                        <Check className="ml-auto h-4 w-4 text-green-500" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipProvider>
            
            <Button 
              variant="outline" 
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center"
            >
              <Settings className="h-4 w-4 mr-2" />
              {t('voice_settings')}
            </Button>
          </div>
        </div>
        
        {/* Status indicator for saving */}
        {saving && (
          <div className="mt-2 text-sm text-blue-500 animate-pulse">
            {t('saving')}...
          </div>
        )}
      </div>
      
      {/* Voice settings panel */}
      <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>{t('voice_settings')}</SheetTitle>
            <SheetDescription>
              {t('adjust_voice_settings_description')}
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6 space-y-6">
            {/* LLM Model Selection */}
            <div className="space-y-2">
              <Label>{t('llm_model')}</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {currentLlmModel}
                    <svg 
                      width="12" 
                      height="12" 
                      viewBox="0 0 12 12" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2"
                    >
                      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-full">
                  {llms.map((llm) => (
                    <DropdownMenuItem 
                      key={llm.id}
                      onClick={() => handleLlmModelChange(llm.id)}
                      className="flex items-center justify-between"
                    >
                      {llm.name}
                      {llm.id === selectedLlmModel && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Speed slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>{t('voice_speed')}</Label>
                <span className="text-sm text-gray-500">{speed.toFixed(2)}x</span>
              </div>
              <Slider 
                value={[speed]} 
                min={0.5} 
                max={2.0} 
                step={0.01} 
                onValueChange={handleSpeedChange}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{t('slower')}</span>
                <span>{t('faster')}</span>
              </div>
            </div>
            
            {/* Stability slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>{t('voice_stability')}</Label>
                <span className="text-sm text-gray-500">{Math.round(stability * 100)}%</span>
              </div>
              <Slider 
                value={[stability]} 
                min={0} 
                max={1} 
                step={0.01} 
                onValueChange={handleStabilityChange}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{t('less_stable')}</span>
                <span>{t('more_stable')}</span>
              </div>
            </div>
            
            {/* Similarity slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>{t('voice_similarity')}</Label>
                <span className="text-sm text-gray-500">{Math.round(similarity * 100)}%</span>
              </div>
              <Slider 
                value={[similarity]} 
                min={0} 
                max={1} 
                step={0.01} 
                onValueChange={handleSimilarityChange}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{t('less_similar')}</span>
                <span>{t('more_similar')}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <SheetClose asChild>
              <Button variant="outline">{t('close')}</Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
