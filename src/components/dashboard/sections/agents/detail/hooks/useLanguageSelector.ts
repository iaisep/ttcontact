
import { useState } from 'react';

interface UseLanguageSelectorProps {
  initialLanguage: string;
  updateAgentField: (fieldName: string, value: any) => void;
}

export const useLanguageSelector = ({ initialLanguage, updateAgentField }: UseLanguageSelectorProps) => {
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

  // Find the matching language option or default to English (US)
  const findLanguageOption = (langCode: string) => {
    return languageOptions.find(opt => opt.value === langCode) || 
           languageOptions.find(opt => opt.label.includes(langCode)) || 
           languageOptions[0]; // default to English (US)
  };

  // Initialize with the correct language option based on initialLanguage
  useState(() => {
    const langOption = findLanguageOption(initialLanguage);
    setSelectedLanguage(langOption.label);
  });

  // Handle language change as async to align with expected type
  const handleLanguageChange = async (displayName: string): Promise<void> => {
    try {
      // Find the selected language option
      const selectedOption = languageOptions.find(opt => opt.label === displayName);
      
      if (selectedOption) {
        // Set the display name in UI
        setSelectedLanguage(displayName);
        
        // Use the API-compatible value for the update
        await updateAgentField('language', selectedOption.value);
        
        console.log(`Language updated to: ${selectedOption.value}`);
      } else {
        console.error(`Language option not found: ${displayName}`);
      }
    } catch (error) {
      console.error('Error updating language:', error);
    }
    
    return Promise.resolve();
  };

  return {
    selectedLanguage,
    languageOptions,
    handleLanguageChange
  };
};
