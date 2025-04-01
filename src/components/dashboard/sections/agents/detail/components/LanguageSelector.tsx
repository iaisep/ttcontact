
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
      className="flex items-center justify-between w-full gap-2 bg-white text-gray-900 border-gray-200 rounded-full hover:bg-gray-50 px-4 py-2 h-auto"
    >
      <div className="flex items-center gap-2">
        <Globe className="h-5 w-5 text-blue-500" />
        <span>{selectedLanguage}</span>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9.99956 10.879L13.7121 7.1665L14.7726 8.227L9.99956 13L5.22656 8.227L6.28706 7.1665L9.99956 10.879Z" fill="var(--icon-soft-400)"></path>
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
              className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center">
                <span className="mr-2">{option.icon}</span>
                <span>{option.label}</span>
              </div>
              {selectedLanguage === option.label && (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </Button>
  );
};

export default LanguageSelector;
