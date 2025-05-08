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

  // Update local state when initialLanguage prop changes
  useEffect(() => {
    if (initialLanguage && initialLanguage !== selectedLanguage) {
      setSelectedLanguage(initialLanguage);
    }
  }, [initialLanguage]);

  // Handle language change
  const handleLanguageChange = async (languageCode: string): Promise<void> => {
    try {
      console.log(`Updating language to: ${languageCode}`);
      
      // Update UI state immediately for better UX
      setSelectedLanguage(languageCode);
      
      // Try to update the agent in the database
      try {
        await updateAgentField('language', languageCode);
        
        const languageName = languageOptions.find(lang => lang.value === languageCode)?.label || languageCode;
        toast.success(`Language updated to ${languageName}`);
      } catch (error: any) {
        // If there's an API error, show the error message in a toast
        // but keep the UI updated with the user's selection
        console.error('Error updating language:', error);
        
        // Display specific error message if available, or a generic one
        const errorMessage = error.message || 'Failed to update language on the server';
        toast.error(errorMessage);
        
        // Important: We don't revert the UI state here to avoid refreshing the page
        // The UI will show the selected language even if the server update failed
      }
    } catch (error) {
      console.error('Unexpected error in handleLanguageChange:', error);
      toast.error('An unexpected error occurred');
    }
    
    return Promise.resolve();
  };

  return {
    selectedLanguage,
    languageOptions,
    handleLanguageChange
  };
};
