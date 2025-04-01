
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check } from 'lucide-react';

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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-gray-50 text-gray-700">
          <span className="text-base">
            {languageOptions.find(l => l.label === selectedLanguage)?.icon || '🌐'}
          </span>
          <span>{selectedLanguage}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-white w-48">
        {languageOptions.map((option) => (
          <DropdownMenuItem 
            key={option.value} 
            onClick={() => handleLanguageChange(option.label)}
            className="flex items-center justify-between py-2 px-3 hover:bg-gray-100"
          >
            <div className="flex items-center">
              <span className="mr-2 text-base">{option.icon}</span>
              <span>{option.label}</span>
            </div>
            {selectedLanguage === option.label && (
              <Check className="h-4 w-4 text-green-500" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
