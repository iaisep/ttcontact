
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import translations from '@/utils/translations';

// Define our supported languages
export type Language = 'es' | 'en';

// Interface for our context
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'es',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Hook for using our language context
export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get initial language from localStorage or default to Spanish
  const [language, setLanguage] = useState<Language>(() => {
    const storedLanguage = localStorage.getItem('language');
    return (storedLanguage as Language) || 'es';
  });

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
    // Update HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  // Function to get translation by key
  const t = (key: string): string => {
    if (!key) return '';
    
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    
    // Fallback to English if translation doesn't exist in current language
    if (language !== 'en' && translations['en'] && translations['en'][key]) {
      return translations['en'][key];
    }
    
    // Return key as fallback if no translation found
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Default export for the provider
export default LanguageProvider;
