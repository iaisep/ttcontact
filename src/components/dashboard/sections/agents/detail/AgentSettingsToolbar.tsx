
import React from 'react';
import { Globe } from 'lucide-react';
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

interface AgentSettingsToolbarProps {
  defaultLanguage: string;
  selectedLlmModel: string;
  onLanguageChange: (value: string) => void;
  onLlmModelChange: (value: string) => void;
}

const AgentSettingsToolbar: React.FC<AgentSettingsToolbarProps> = ({
  defaultLanguage,
  selectedLlmModel,
  onLanguageChange,
  onLlmModelChange
}) => {
  // Language options with flags - extended to match the image
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
    <div className="flex items-center space-x-2 mb-4">
      <div className="flex items-center space-x-2 bg-muted rounded-md p-2">
        <Globe className="h-4 w-4" />
        <select 
          value={selectedLlmModel}
          onChange={(e) => onLlmModelChange(e.target.value)}
          className="bg-transparent border-none focus:outline-none text-sm"
        >
          <option value="GPT 4o mini">GPT 4o mini</option>
          <option value="GPT 4o">GPT 4o</option>
          <option value="Claude 3 Opus">Claude 3 Opus</option>
        </select>
      </div>

      <div className="flex items-center space-x-2 bg-muted rounded-md p-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M12 20v-8"></path><rect x="8" y="2" width="8" height="10" rx="2"></rect>
        </svg>
        <span className="text-sm">Angie vendedora</span>
      </div>

      <TooltipProvider>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-md p-2 cursor-pointer">
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
          <DropdownMenuContent align="start" className="w-[200px] max-h-[350px] overflow-y-auto">
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
    </div>
  );
};

export default AgentSettingsToolbar;
