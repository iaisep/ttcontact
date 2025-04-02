
import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';

interface UseLanguageSelectorProps {
  initialLanguage: string;
  updateAgentField: (fieldName: string, value: any) => void;
}

export const useLanguageSelector = ({ initialLanguage, updateAgentField }: UseLanguageSelectorProps) => {
  const { fetchWithAuth } = useApiContext();
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);

  // Language options with icons and API-compatible language codes
  const languageOptions = [
    { value: 'en-US', label: 'English (US)', icon: '🇺🇸' },
    { value: 'en-GB', label: 'English (UK)', icon: '🇬🇧' },
    { value: 'en-IN', label: 'English (India)', icon: '🇮🇳' },
    { value: 'es-ES', label: 'Spanish (Spain)', icon: '🇪🇸' },
    { value: 'es-419', label: 'Spanish (Latin America)', icon: '🇲🇽' },
    { value: 'de-DE', label: 'German', icon: '🇩🇪' },
    { value: 'fr-FR', label: 'French', icon: '🇫🇷' },
    { value: 'it-IT', label: 'Italian', icon: '🇮🇹' },
    { value: 'pt-PT', label: 'Portuguese (Portugal)', icon: '🇵🇹' },
    { value: 'pt-BR', label: 'Portuguese (Brazil)', icon: '🇧🇷' },
    { value: 'nl-NL', label: 'Dutch', icon: '🇳🇱' },
    { value: 'zh-CN', label: 'Chinese', icon: '🇨🇳' },
    { value: 'ja-JP', label: 'Japanese', icon: '🇯🇵' },
    { value: 'ko-KR', label: 'Korean', icon: '🇰🇷' },
    { value: 'ru-RU', label: 'Russian', icon: '🇷🇺' },
    { value: 'hi-IN', label: 'Hindi', icon: '🇮🇳' },
    { value: 'pl-PL', label: 'Polish', icon: '🇵🇱' },
    { value: 'ro-RO', label: 'Romanian', icon: '🇷🇴' },
    { value: 'tr-TR', label: 'Turkish', icon: '🇹🇷' },
    { value: 'vi-VN', label: 'Vietnamese', icon: '🇻🇳' },
    { value: 'multi', label: 'Multilingual', icon: '🌎' }
  ];

  // Set initial language from props
  useEffect(() => {
    // If initialLanguage is provided and valid, use it
    if (initialLanguage) {
      setSelectedLanguage(initialLanguage);
    }
  }, [initialLanguage]);

  // Handle language change
  const handleLanguageChange = async (languageCode: string): Promise<void> => {
    try {
      console.log(`Updating language to: ${languageCode}`);
      
      // Update UI state immediately for better UX
      setSelectedLanguage(languageCode);
      
      // Update the agent in the database using updateAgentField
      // This function should handle the API call to update the agent
      await updateAgentField('language', languageCode);
      
      toast.success(`Language updated to ${languageOptions.find(lang => lang.value === languageCode)?.label || languageCode}`);
    } catch (error) {
      console.error('Error updating language:', error);
      toast.error('Failed to update language. Please try again.');
      
      // Revert to the previous language if the update fails
      setSelectedLanguage(initialLanguage);
    }
    
    return Promise.resolve();
  };

  return {
    selectedLanguage,
    languageOptions,
    handleLanguageChange
  };
};
