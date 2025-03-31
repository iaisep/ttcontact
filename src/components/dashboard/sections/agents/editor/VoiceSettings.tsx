
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
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
  
  const handleSave = () => {
    // Save all voice settings in parallel
    onUpdate('voice_model', voiceModel);
    onUpdate('voice_speed', voiceSpeed);
    onUpdate('voice_temperature', voiceTemperature);
    onUpdate('volume', voiceVolume);
    onClose();
  };
  
  const voiceModelOptions = [
    { value: 'Auto', label: 'Auto' },
    { value: 'eleven_turbo_v2_5', label: 'Turbo' },
    { value: 'eleven_multilingual_v2', label: 'Multilingual' },
    { value: 'eleven_monolingual_v1', label: 'Monolingual' },
    { value: 'eleven_english_sts_v2', label: 'Flash' }
  ];
  
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Configuración de voz</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="voiceModel">Modelo de voz</Label>
            <select
              id="voiceModel"
              value={voiceModel}
              onChange={(e) => setVoiceModel(e.target.value)}
              className="w-full mt-1 border border-input rounded-md h-10 px-3 py-2"
            >
              {voiceModelOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="voiceSpeed">Velocidad</Label>
              <span className="text-sm">{voiceSpeed.toFixed(2)}x</span>
            </div>
            <Slider
              id="voiceSpeed"
              min={0.5}
              max={2}
              step={0.01}
              value={[voiceSpeed]}
              onValueChange={(values) => setVoiceSpeed(values[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="voiceTemperature">Temperatura</Label>
              <span className="text-sm">{voiceTemperature.toFixed(2)}</span>
            </div>
            <Slider
              id="voiceTemperature"
              min={0}
              max={2}
              step={0.01}
              value={[voiceTemperature]}
              onValueChange={(values) => setVoiceTemperature(values[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="voiceVolume">Volumen</Label>
              <span className="text-sm">{voiceVolume.toFixed(2)}</span>
            </div>
            <Slider
              id="voiceVolume"
              min={0.5}
              max={2}
              step={0.01}
              value={[voiceVolume]}
              onValueChange={(values) => setVoiceVolume(values[0])}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceSettings;
