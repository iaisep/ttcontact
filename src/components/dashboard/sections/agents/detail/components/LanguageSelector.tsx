
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      <DropdownMenuContent align="start" className="bg-white">
        {languageOptions.map((option) => (
          <DropdownMenuItem key={option.value} onClick={() => handleLanguageChange(option.label)}>
            <span className="mr-2">{option.icon}</span>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
