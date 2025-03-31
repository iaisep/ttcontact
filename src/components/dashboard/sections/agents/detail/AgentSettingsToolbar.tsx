
import React from 'react';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Flag } from 'lucide-react';

interface AgentSettingsToolbarProps {
  defaultLanguage: string;
  selectedLlmModel: string;
  onLanguageChange: (value: string) => void;
  onLlmModelChange: (value: string) => void;
  llmOptions: string[];
}

const AgentSettingsToolbar: React.FC<AgentSettingsToolbarProps> = ({
  defaultLanguage,
  selectedLlmModel,
  onLanguageChange,
  onLlmModelChange,
  llmOptions
}) => {
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
    <div className="flex items-center space-x-2 mb-4">
      <div className="flex items-center space-x-2 bg-muted rounded-md p-2">
        <Globe className="h-4 w-4" />
        <DropdownMenu>
          <DropdownMenuTrigger className="bg-transparent border-none focus:outline-none text-sm">
            {selectedLlmModel}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-white">
            {llmOptions.map((option) => (
              <DropdownMenuItem 
                key={option}
                onClick={() => onLlmModelChange(option)}
                className="cursor-pointer"
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center space-x-2 bg-muted rounded-md p-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M12 20v-8"></path><rect x="8" y="2" width="8" height="10" rx="2"></rect>
        </svg>
        <span className="text-sm">Angie vendedora</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 rounded-md p-2 cursor-pointer">
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
        <DropdownMenuContent align="end" className="w-[220px] bg-white">
          {languageOptions.map((lang) => (
            <DropdownMenuItem 
              key={lang.value}
              onClick={() => onLanguageChange(lang.value)}
              className="flex items-center gap-2 cursor-pointer"
            >
              {lang.icon}
              <span>{lang.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AgentSettingsToolbar;
