
import { useState } from 'react';

interface UseLanguageSelectorProps {
  initialLanguage?: string;
  updateAgentField: (fieldName: string, value: any) => void;
}

export const useLanguageSelector = ({ initialLanguage = 'Spanish', updateAgentField }: UseLanguageSelectorProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  
  const languageOptions = [
    { value: 'es', label: 'Spanish', icon: '🇪🇸' },
    { value: 'en', label: 'English', icon: '🇺🇸' },
    { value: 'fr', label: 'French', icon: '🇫🇷' },
    { value: 'de', label: 'German', icon: '🇩🇪' },
    { value: 'pt', label: 'Portuguese', icon: '🇵🇹' },
    { value: 'it', label: 'Italian', icon: '🇮🇹' },
  ];

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    updateAgentField('language', lang);
  };

  return {
    selectedLanguage,
    languageOptions,
    handleLanguageChange
  };
};
