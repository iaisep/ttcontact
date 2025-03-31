
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/LanguageContext';

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
  
  const handleChange = (key: string, value: number[]) => {
    const newSettings = {
      ...settings,
      [key]: value[0]
    };
    onUpdate(newSettings);
  };

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="stability" className="text-sm">{t('stability')}</Label>
          <span className="text-xs text-muted-foreground">{Math.round(settings.stability * 100)}%</span>
        </div>
        <Slider
          id="stability"
          min={0}
          max={1}
          step={0.01}
          value={[settings.stability]}
          onValueChange={(value) => handleChange('stability', value)}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="similarity" className="text-sm">{t('similarity')}</Label>
          <span className="text-xs text-muted-foreground">{Math.round(settings.similarity * 100)}%</span>
        </div>
        <Slider
          id="similarity"
          min={0}
          max={1}
          step={0.01}
          value={[settings.similarity]}
          onValueChange={(value) => handleChange('similarity', value)}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="style" className="text-sm">{t('style')}</Label>
          <span className="text-xs text-muted-foreground">{Math.round(settings.style * 100)}%</span>
        </div>
        <Slider
          id="style"
          min={0}
          max={1}
          step={0.01}
          value={[settings.style]}
          onValueChange={(value) => handleChange('style', value)}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="speed" className="text-sm">{t('speed')}</Label>
          <span className="text-xs text-muted-foreground">{settings.speed.toFixed(1)}x</span>
        </div>
        <Slider
          id="speed"
          min={0.5}
          max={2}
          step={0.1}
          value={[settings.speed]}
          onValueChange={(value) => handleChange('speed', value)}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default SpeechSettings;
