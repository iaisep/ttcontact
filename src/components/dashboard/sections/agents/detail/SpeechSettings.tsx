
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ResponsivenessSection, 
  InterruptionSection,
  BackchannelSection,
  KeywordsSection
} from './settings-accordion/speech-settings';

interface SpeechSettingsProps {
  settings: {
    stability: number;
    similarity: number;
    style: number;
    speed: number;
  };
  onUpdate: (settings: any) => void;
}

const SpeechSettings: React.FC<SpeechSettingsProps> = ({ settings, onUpdate }) => {
  const { t } = useLanguage();
  
  const handleChange = (key: string, value: number) => {
    const newSettings = {
      ...settings,
      [key]: value
    };
    onUpdate(newSettings);
  };

  return (
    <div className="space-y-4 py-2">
      <ResponsivenessSection 
        responsiveness={settings.stability}
        onUpdate={(value) => handleChange('stability', value)}
      />
      
      <InterruptionSection 
        sensitivity={settings.similarity}
        onUpdate={(value) => handleChange('similarity', value)}
      />
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{t('style')}</span>
          <span className="text-xs text-muted-foreground">{Math.round(settings.style * 100)}%</span>
        </div>
        <p className="text-xs text-gray-500">Control the expressiveness of the voice.</p>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={settings.style}
          onChange={(e) => handleChange('style', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{t('speed')}</span>
          <span className="text-xs text-muted-foreground">{settings.speed.toFixed(1)}x</span>
        </div>
        <p className="text-xs text-gray-500">Control how fast the agent speaks.</p>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={settings.speed}
          onChange={(e) => handleChange('speed', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};

export default SpeechSettings;
