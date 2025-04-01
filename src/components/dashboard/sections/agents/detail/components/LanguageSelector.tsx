
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Globe } from 'lucide-react';

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
  // Find the current language option
  const currentLanguage = languageOptions.find(l => l.label === selectedLanguage) || languageOptions[0];
  
  return (
    <Button 
      variant="outline" 
      className="flex items-center justify-between w-full max-w-full gap-1 sm:gap-2 bg-white text-gray-900 border-gray-200 rounded-full hover:bg-gray-50 px-2 sm:px-4 py-1 sm:py-2 h-auto overflow-hidden"
    >
      <div className="flex items-center gap-1 sm:gap-2 overflow-hidden">
        <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
        <span className="truncate text-xs sm:text-sm max-w-[100px] sm:max-w-[120px]">{selectedLanguage}</span>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8 p-0 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" className="h-3 w-3 sm:h-4 sm:w-4">
              <path d="M9.99956 10.879L13.7121 7.1665L14.7726 8.227L9.99956 13L5.22656 8.227L6.28706 7.1665L9.99956 10.879Z" fill="currentColor"></path>
            </svg>
          </Button>
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
  );
};

export default LanguageSelector;
