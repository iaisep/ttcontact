
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { AccordionSectionProps } from '../types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Voicemail } from 'lucide-react';

const VoicemailDetectionSection: React.FC<AccordionSectionProps> = ({ agent, updateAgentField }) => {
  const [voicemailAction, setVoicemailAction] = useState<'hangup' | 'message'>(
    agent.voicemail_message ? 'message' : 'hangup'
  );

  const [detectionDuration, setDetectionDuration] = useState(
    agent.voicemail_detection_timeout_ms ? (agent.voicemail_detection_timeout_ms / 1000) : 10
  );

  // ✅ Debounce: solo actualiza el campo tras 500ms de no modificar el valor
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateAgentField('voicemail_detection_timeout_ms', detectionDuration * 1000);
    }, 500);

    return () => clearTimeout(timeout);
  }, [detectionDuration]);

  const handleVoicemailDetectionChange = (checked: boolean) => {
    updateAgentField('enable_voicemail_detection', checked);
  };

  const handleVoicemailActionChange = (value: string) => {
    const action = value as 'hangup' | 'message';
    setVoicemailAction(action);

    updateAgentField('enable_voicemail_detection', true);
    updateAgentField('voicemail_message', action === 'message' ? 'Message content, use [[]] to add variable' : '');
  };

  const handleVoicemailMessageChange = (message: string) => {
    updateAgentField('voicemail_message', message);
  };

  const handleVoicemailDetectionDurationChange = (values: number[]) => {
    setDetectionDuration(values[0]); // solo actualiza el estado local
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-xs font-medium text-amber-600 flex items-center gap-1">
            <Voicemail className="h-3.5 w-3.5" />
            Voicemail Detection
          </Label>
          <p className="text-xs text-gray-500">
            Hang up or leave a voicemail if a voicemail is detected.
          </p>
        </div>
        <Switch 
          checked={!!agent.enable_voicemail_detection} 
          onCheckedChange={handleVoicemailDetectionChange}
        />
      </div>

      {agent.enable_voicemail_detection && (
        <div className="space-y-2 mt-2 px-0">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-medium text-amber-600">Voicemail Detection Duration</Label>
              <p className="text-xs text-gray-500">
                Duration for which voicemail detection will be active during the call
              </p>
            </div>
            <span className="text-xs text-gray-500">{detectionDuration} s</span>
          </div>
          <Slider 
            value={[detectionDuration]}
            min={0} 
            max={30} 
            step={1} 
            className="w-full"
            onValueChange={handleVoicemailDetectionDurationChange}
            agentId={agent.agent_id}
            // ❌ Quitamos fieldName para evitar request duplicadas
            // fieldName="voicemail_detection_timeout_ms"
            debounceMs={0}
          />
        </div>
      )}

      {agent.enable_voicemail_detection && (
        <div className="ml-0 mt-2 space-y-2 bg-blue-50 p-3 rounded-md">
          <RadioGroup 
            value={voicemailAction} 
            onValueChange={handleVoicemailActionChange}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hangup" id="hangup" />
              <Label htmlFor="hangup" className="text-xs">Hang up if reaching voicemail</Label>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="pt-1">
                <RadioGroupItem value="message" id="leaveMessage" />
              </div>
              <div className="flex-1">
                <Label htmlFor="leaveMessage" className="text-xs">Leave a message if reaching voicemail</Label>
                <Textarea
                  placeholder="Message content, use [[]] to add variable"
                  className="mt-2 w-full text-xs"
                  disabled={voicemailAction === 'hangup'}
                  value={agent.voicemail_message || ''}
                  onChange={(e) => handleVoicemailMessageChange(e.target.value)}
                />
              </div>
            </div>
          </RadioGroup>
        </div>
      )}
    </div>
  );
};

export default VoicemailDetectionSection;
