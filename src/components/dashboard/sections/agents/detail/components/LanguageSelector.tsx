
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Globe, ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: string;
  languageOptions: Array<{ value: string, label: string, icon: string }>;
  handleLanguageChange: (lang: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  languageOptions,
  handleLanguageChange,
}) => {
  // Find the current language option for display
  const currentLanguage = languageOptions.find(l => l.label === selectedLanguage) || languageOptions[0];
  
  return (
    <div className="relative">
      <Button 
        variant="outline" 
        className="flex items-center justify-between w-full max-w-full gap-1 sm:gap-2 bg-white text-gray-900 border-gray-200 rounded-full hover:bg-gray-50 px-2 sm:px-4 py-1 sm:py-2 h-auto overflow-hidden"
      >
        <div className="flex items-center gap-1 sm:gap-2 overflow-hidden flex-wrap">
          <div className="h-6 w-6 sm:h-6 sm:w-6 rounded-full flex-shrink-0 flex items-center justify-center">
            <Globe className="h-5 w-5 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
          </div>
          <span className="truncate text-[10px] sm:text-xs max-w-[100px] sm:max-w-[120px]">{selectedLanguage}</span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="h-6 w-6 sm:h-6 sm:w-6 p-0 flex-shrink-0 flex items-center justify-center">
              <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-[200px] bg-white border border-gray-200 shadow-lg z-50 rounded-lg"
          >
            {languageOptions.map((option) => (
              <DropdownMenuItem 
                key={option.value} 
                onClick={() => handleLanguageChange(option.label)}
                className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 cursor-pointer text-xs sm:text-sm"
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="mr-1 sm:mr-2">{option.icon}</span>
                  <span className="truncate">{option.label}</span>
                </div>
                {selectedLanguage === option.label && (
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </Button>
    </div>
  );
};

export default LanguageSelector;
