
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
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
  const [stability, setStability] = useState(settings.stability);
  const [similarity, setSimilarity] = useState(settings.similarity);
  const [style, setStyle] = useState(settings.style);
  const [speed, setSpeed] = useState(settings.speed);

  useEffect(() => {
    setStability(settings.stability);
    setSimilarity(settings.similarity);
    setStyle(settings.style);
    setSpeed(settings.speed);
  }, [settings]);

  const updateSettings = (field: string, value: number) => {
    const newSettings = { ...settings, [field]: value };
    onUpdate(newSettings);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-sm font-medium">{t('stability')}</label>
          <span className="text-sm text-muted-foreground">{Math.round(stability * 100)}%</span>
        </div>
        <Slider
          value={[stability * 100]}
          min={0}
          max={100}
          step={1}
          onValueChange={(values) => {
            const value = values[0] / 100;
            setStability(value);
            updateSettings('stability', value);
          }}
        />
        <p className="text-xs text-muted-foreground mt-1">{t('stability_description')}</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-sm font-medium">{t('similarity')}</label>
          <span className="text-sm text-muted-foreground">{Math.round(similarity * 100)}%</span>
        </div>
        <Slider
          value={[similarity * 100]}
          min={0}
          max={100}
          step={1}
          onValueChange={(values) => {
            const value = values[0] / 100;
            setSimilarity(value);
            updateSettings('similarity', value);
          }}
        />
        <p className="text-xs text-muted-foreground mt-1">{t('similarity_description')}</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-sm font-medium">{t('style')}</label>
          <span className="text-sm text-muted-foreground">{Math.round(style * 100)}%</span>
        </div>
        <Slider
          value={[style * 100]}
          min={0}
          max={100}
          step={1}
          onValueChange={(values) => {
            const value = values[0] / 100;
            setStyle(value);
            updateSettings('style', value);
          }}
        />
        <p className="text-xs text-muted-foreground mt-1">{t('style_description')}</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-sm font-medium">{t('speech_speed')}</label>
          <span className="text-sm text-muted-foreground">{speed.toFixed(1)}x</span>
        </div>
        <Slider
          value={[speed * 10]}
          min={5}
          max={20}
          step={1}
          onValueChange={(values) => {
            const value = values[0] / 10;
            setSpeed(value);
            updateSettings('speed', value);
          }}
        />
        <p className="text-xs text-muted-foreground mt-1">{t('speed_description')}</p>
      </div>
    </div>
  );
};

export default SpeechSettings;
