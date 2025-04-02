
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface LanguageSelectorProps {
  selectedLanguage: string;
  languageOptions: {value: string; label: string; icon?: string}[];
  onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  selectedLanguage, 
  languageOptions,
  onLanguageChange 
}) => {
  const { t } = useLanguage();
  
  // Find the currently selected language
  const currentLanguage = languageOptions.find(lang => lang.value === selectedLanguage) || 
    { value: selectedLanguage, label: selectedLanguage || t('select_language'), icon: '' };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center justify-between w-full bg-white text-gray-900 border-gray-200 rounded-full hover:bg-gray-50 px-2 sm:px-4 py-1 sm:py-2 h-auto"
        >
          <div className="flex items-center gap-1 sm:gap-2 min-w-0 max-w-full">
            <div className="h-6 w-6 sm:h-6 sm:w-6 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600">
              <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <span className="text-xs sm:text-sm truncate flex-grow min-w-0 text-ellipsis overflow-hidden">
              {currentLanguage.label}
            </span>
          </div>
          <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1 sm:ml-2 text-gray-600 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px] max-h-[300px] overflow-y-auto">
        {languageOptions.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
            onClick={() => onLanguageChange(lang.value)}
          >
            {selectedLanguage === lang.value && (
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
            )}
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
