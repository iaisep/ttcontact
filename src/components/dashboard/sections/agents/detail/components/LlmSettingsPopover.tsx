
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/LanguageContext';

interface LlmSettingsPopoverProps {
  isLlmSettingsOpen: boolean;
  setIsLlmSettingsOpen: (open: boolean) => void;
  llmTemperature: number;
  setLlmTemperature: (temp: number) => void;
  structuredOutput: boolean;
  setStructuredOutput: (structured: boolean) => void;
  highPriority: boolean;
  setHighPriority: (priority: boolean) => void;
  handleSaveLlmSettings: () => void;
}

const LlmSettingsPopover: React.FC<LlmSettingsPopoverProps> = ({
  isLlmSettingsOpen,
  setIsLlmSettingsOpen,
  llmTemperature,
  setLlmTemperature,
  structuredOutput,
  setStructuredOutput,
  highPriority,
  setHighPriority,
  handleSaveLlmSettings
}) => {
  const { t } = useLanguage();
  
  const handleTemperatureChange = (values: number[]) => {
    setLlmTemperature(values[0]);
  };
  
  const handleClose = () => {
    handleSaveLlmSettings();
    setIsLlmSettingsOpen(false);
  };

  return (
    <Popover open={isLlmSettingsOpen} onOpenChange={setIsLlmSettingsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span>{t('llm_settings')}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px]" align="start">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">{t('llm_settings')}</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="temperature">{t('temperature')}</Label>
              <span className="text-sm text-muted-foreground">{llmTemperature.toFixed(1)}</span>
            </div>
            <Slider 
              id="temperature"
              min={0} 
              max={1} 
              step={0.1} 
              value={[llmTemperature]} 
              onValueChange={handleTemperatureChange} 
            />
            <p className="text-xs text-muted-foreground">
              {t('temperature_description')}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="structured-output">{t('structured_output')}</Label>
              <p className="text-xs text-muted-foreground">
                {t('structured_output_description')}
              </p>
            </div>
            <Switch 
              id="structured-output"
              checked={structuredOutput} 
              onCheckedChange={setStructuredOutput} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="high-priority">{t('high_priority')}</Label>
              <p className="text-xs text-muted-foreground">
                {t('high_priority_description')}
              </p>
            </div>
            <Switch 
              id="high-priority"
              checked={highPriority} 
              onCheckedChange={setHighPriority} 
            />
          </div>
          
          <div className="flex justify-end">
            <Button size="sm" onClick={handleClose}>
              {t('save')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LlmSettingsPopover;
