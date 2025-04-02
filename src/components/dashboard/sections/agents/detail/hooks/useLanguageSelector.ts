
import { useState } from 'react';

interface UseLanguageSelectorProps {
  initialLanguage: string;
  updateAgentField: (fieldName: string, value: any) => void;
}

export const useLanguageSelector = ({ initialLanguage, updateAgentField }: UseLanguageSelectorProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);

  // Language options with icons
  const languageOptions = [
    { value: 'English', label: 'English', icon: '🇺🇸' },
    { value: 'Spanish', label: 'Spanish', icon: '🇪🇸' },
    { value: 'French', label: 'French', icon: '🇫🇷' },
    { value: 'German', label: 'German', icon: '🇩🇪' },
    { value: 'Italian', label: 'Italian', icon: '🇮🇹' },
    { value: 'Portuguese', label: 'Portuguese', icon: '🇵🇹' },
    { value: 'Dutch', label: 'Dutch', icon: '🇳🇱' },
    { value: 'Chinese', label: 'Chinese', icon: '🇨🇳' },
    { value: 'Japanese', label: 'Japanese', icon: '🇯🇵' },
    { value: 'Korean', label: 'Korean', icon: '🇰🇷' },
    { value: 'Arabic', label: 'Arabic', icon: '🇸🇦' },
    { value: 'Russian', label: 'Russian', icon: '🇷🇺' },
    { value: 'Hindi', label: 'Hindi', icon: '🇮🇳' }
  ];

  // Handle language change as async to align with expected type
  const handleLanguageChange = async (language: string): Promise<void> => {
    setSelectedLanguage(language);
    await updateAgentField('language', language);
    return Promise.resolve();
  };

  return {
    selectedLanguage,
    languageOptions,
    handleLanguageChange
  };
};
