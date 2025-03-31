
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
  
  const handleSave = () => {
    // Save all voice settings in parallel
    onUpdate('voice_model', voiceModel);
    onUpdate('voice_speed', voiceSpeed);
    onUpdate('voice_temperature', voiceTemperature);
    onUpdate('volume', voiceVolume);
    onClose();
  };
  
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-5">Voice Model</h2>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="model-auto"
                name="voiceModel"
                value="Auto"
                checked={voiceModel === 'Auto'}
                onChange={() => setVoiceModel('Auto')}
                className="mr-2"
              />
              <div>
                <Label htmlFor="model-auto" className="text-base font-medium">Auto(Elevenlabs Multilingual v2)</Label>
                <p className="text-sm text-gray-500">Multilingual, fast, high quality</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="model-turbo"
                name="voiceModel"
                value="eleven_turbo_v2_5"
                checked={voiceModel === 'eleven_turbo_v2_5'}
                onChange={() => setVoiceModel('eleven_turbo_v2_5')}
                className="mr-2"
              />
              <div>
                <Label htmlFor="model-turbo" className="text-base font-medium">Elevenlabs Turbo V2.5</Label>
                <p className="text-sm text-gray-500">Multilingual, fast, high quality</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="model-flash"
                name="voiceModel"
                value="eleven_english_sts_v2"
                checked={voiceModel === 'eleven_english_sts_v2'}
                onChange={() => setVoiceModel('eleven_english_sts_v2')}
                className="mr-2"
              />
              <div>
                <Label htmlFor="model-flash" className="text-base font-medium">Elevenlabs Flash V2.5</Label>
                <p className="text-sm text-gray-500">Multilingual, fastest, medium quality</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="model-multilingual"
                name="voiceModel"
                value="eleven_multilingual_v2"
                checked={voiceModel === 'eleven_multilingual_v2'}
                onChange={() => setVoiceModel('eleven_multilingual_v2')}
                className="mr-2"
              />
              <div>
                <Label htmlFor="model-multilingual" className="text-base font-medium">Elevenlabs Multilingual v2</Label>
                <p className="text-sm text-gray-500">Multilingual, slow, highest quality</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <h2 className="text-base font-semibold mb-2">Voice Speed</h2>
            <div className="flex items-center gap-2">
              <Slider
                id="voiceSpeed"
                min={0.5}
                max={2}
                step={0.01}
                value={[voiceSpeed]}
                onValueChange={(values) => setVoiceSpeed(values[0])}
                className="flex-1"
              />
              <span className="w-12 text-right">{voiceSpeed.toFixed(2)}</span>
            </div>
          </div>
          
          <div>
            <h2 className="text-base font-semibold mb-2">Voice Temperature</h2>
            <div className="flex items-center gap-2">
              <Slider
                id="voiceTemperature"
                min={0}
                max={2}
                step={0.01}
                value={[voiceTemperature]}
                onValueChange={(values) => setVoiceTemperature(values[0])}
                className="flex-1"
              />
              <span className="w-12 text-right">{voiceTemperature.toFixed(2)}</span>
            </div>
          </div>
          
          <div>
            <h2 className="text-base font-semibold mb-2">Voice Volume</h2>
            <div className="flex items-center gap-2">
              <Slider
                id="voiceVolume"
                min={0.5}
                max={2}
                step={0.01}
                value={[voiceVolume]}
                onValueChange={(values) => setVoiceVolume(values[0])}
                className="flex-1"
              />
              <span className="w-12 text-right">{voiceVolume.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-black hover:bg-gray-800">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceSettings;
