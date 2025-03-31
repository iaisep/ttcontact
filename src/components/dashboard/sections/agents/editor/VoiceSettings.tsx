
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';

interface VoiceSettingsProps {
  agent: RetellAgent;
  onUpdate: (fieldName: string, value: any) => void;
  onClose: () => void;
}

const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  agent,
  onUpdate,
  onClose
}) => {
  const [voiceModel, setVoiceModel] = useState(agent.voice_model || 'Auto');
  const [voiceSpeed, setVoiceSpeed] = useState(agent.voice_speed || 1);
  const [voiceTemperature, setVoiceTemperature] = useState(agent.voice_temperature || 1);
  const [voiceVolume, setVoiceVolume] = useState(agent.volume || 1);
  
  const handleModelChange = (model: string) => {
    setVoiceModel(model);
    onUpdate('voice_model', model);
  };
  
  const handleSpeedChange = (values: number[]) => {
    const value = values[0];
    setVoiceSpeed(value);
    onUpdate('voice_speed', value);
  };
  
  const handleTemperatureChange = (values: number[]) => {
    const value = values[0];
    setVoiceTemperature(value);
    onUpdate('voice_temperature', value);
  };
  
  const handleVolumeChange = (values: number[]) => {
    const value = values[0];
    setVoiceVolume(value);
    onUpdate('volume', value);
  };
  
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Voice Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-medium">Voice Model</h3>
            
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="voiceModel"
                  checked={voiceModel === 'Auto'}
                  onChange={() => handleModelChange('Auto')}
                  className="radio"
                />
                <div>
                  <p className="text-sm font-medium">Auto (Elevenlabs Multilingual v2)</p>
                  <p className="text-xs text-muted-foreground">Multilingual, fast, high quality</p>
                </div>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="voiceModel"
                  checked={voiceModel === 'eleven_turbo_v2_5'}
                  onChange={() => handleModelChange('eleven_turbo_v2_5')}
                  className="radio"
                />
                <div>
                  <p className="text-sm font-medium">Elevenlabs Turbo V2.5</p>
                  <p className="text-xs text-muted-foreground">Multilingual, fast, high quality</p>
                </div>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="voiceModel"
                  checked={voiceModel === 'eleven_english_sts_v2'}
                  onChange={() => handleModelChange('eleven_english_sts_v2')}
                  className="radio"
                />
                <div>
                  <p className="text-sm font-medium">Elevenlabs Flash V2.5</p>
                  <p className="text-xs text-muted-foreground">Multilingual, fastest, medium quality</p>
                </div>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="voiceModel"
                  checked={voiceModel === 'eleven_multilingual_v2'}
                  onChange={() => handleModelChange('eleven_multilingual_v2')}
                  className="radio"
                />
                <div>
                  <p className="text-sm font-medium">Elevenlabs Multilingual v2</p>
                  <p className="text-xs text-muted-foreground">Multilingual, slow, highest quality</p>
                </div>
              </label>
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-2">Voice Speed</h3>
            <div className="flex items-center gap-2">
              <Slider
                min={0.5}
                max={2}
                step={0.01}
                value={[voiceSpeed]}
                onValueChange={handleSpeedChange}
                className="flex-1"
              />
              <span className="w-12 text-right text-sm">{voiceSpeed.toFixed(2)}</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-2">Voice Temperature</h3>
            <div className="flex items-center gap-2">
              <Slider
                min={0}
                max={2}
                step={0.01}
                value={[voiceTemperature]}
                onValueChange={handleTemperatureChange}
                className="flex-1"
              />
              <span className="w-12 text-right text-sm">{voiceTemperature.toFixed(2)}</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-2">Voice Volume</h3>
            <div className="flex items-center gap-2">
              <Slider
                min={0.5}
                max={2}
                step={0.01}
                value={[voiceVolume]}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
              <span className="w-12 text-right text-sm">{voiceVolume.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceSettings;
