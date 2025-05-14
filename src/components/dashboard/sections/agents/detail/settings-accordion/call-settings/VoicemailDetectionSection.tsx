
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { AccordionSectionProps } from '../types';

const VoicemailDetectionSection: React.FC<AccordionSectionProps> = ({ agent, updateAgentField }) => {
  const handleVoicemailDetectionChange = (checked: boolean) => {
    // This will send a payload like { "enable_voicemail_detection": false } to the API
    updateAgentField('enable_voicemail_detection', checked);
  };

  const handleVoicemailActionChange = (action: 'hangup' | 'message') => {
    // If selecting message option but no message is set, provide a default one
    if (action === 'message' && !agent.voicemail_message) {
      updateAgentField('voicemail_message', 'Hello, I\'m not able to take your call right now. Please leave a message and I\'ll get back to you.');
    }
  };

  const handleVoicemailMessageChange = (message: string) => {
    updateAgentField('voicemail_message', message);
  };

  const handleVoicemailDetectionDurationChange = (values: number[]) => {
    const duration = values[0];
    updateAgentField('voicemail_detection_timeout_ms', duration * 1000); // Convert to milliseconds
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-medium text-amber-600">Voicemail Detection</Label>
            <p className="text-xs text-gray-500">Hang up or leave a voicemail if a voicemail is detected.</p>
          </div>
          <Switch 
            checked={!!agent.enable_voicemail_detection} 
            onCheckedChange={handleVoicemailDetectionChange}
          />
        </div>

        <div className="ml-4 mt-2 space-y-2 bg-blue-50 p-3 rounded-md">
          <div className="flex items-start space-x-2">
            <div className="flex h-4 items-center">
              <input
                type="radio"
                id="hangup"
                name="voicemailAction"
                className="h-4 w-4"
                defaultChecked={!agent.voicemail_message}
                onChange={() => handleVoicemailActionChange('hangup')}
              />
            </div>
            <Label htmlFor="hangup" className="text-xs">Hang up if reaching voicemail</Label>
          </div>
          
          <div className="flex items-start space-x-2">
            <div className="flex h-4 items-center">
              <input
                type="radio"
                id="leaveMessage"
                name="voicemailAction"
                className="h-4 w-4"
                defaultChecked={!!agent.voicemail_message}
                onChange={() => handleVoicemailActionChange('message')}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="leaveMessage" className="text-xs">Leave a message if reaching voicemail</Label>
              <Textarea
                placeholder="Message content, use [[]] to add variable"
                className="mt-2 w-full text-xs"
                disabled={!agent.voicemail_message}
                value={agent.voicemail_message || ''}
                onChange={(e) => handleVoicemailMessageChange(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Voicemail Detection Duration */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-medium text-amber-600">Voicemail Detection Duration</Label>
            <p className="text-xs text-gray-500">Duration for which voicemail detection will be active during the call</p>
          </div>
          <span className="text-xs text-gray-500">{agent.voicemail_detection_timeout_ms ? (agent.voicemail_detection_timeout_ms / 1000) : 10} s</span>
        </div>
        <Slider 
          defaultValue={[agent.voicemail_detection_timeout_ms ? (agent.voicemail_detection_timeout_ms / 1000) : 10]} 
          min={0} 
          max={30} 
          step={1} 
          className="w-full"
          onValueChange={handleVoicemailDetectionDurationChange}
          agentId={agent.agent_id}
          fieldName="voicemail_detection_timeout_ms"
        />
      </div>
    </>
  );
};

export default VoicemailDetectionSection;
