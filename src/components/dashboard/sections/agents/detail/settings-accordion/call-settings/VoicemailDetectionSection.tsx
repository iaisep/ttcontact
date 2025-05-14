
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

  // Handle voicemail detection toggle
  const handleVoicemailDetectionChange = (checked: boolean) => {
    updateAgentField('enable_voicemail_detection', checked);
  };

  // Handle radio button change for voicemail action
  const handleVoicemailActionChange = (value: string) => {
    const action = value as 'hangup' | 'message';
    setVoicemailAction(action);
    
    if (action === 'message' && !agent.voicemail_message) {
      // Set a default message when switching to message option
      updateAgentField('voicemail_message', 'Hello, I\'m not able to take your call right now. Please leave a message and I\'ll get back to you.');
    } else if (action === 'hangup') {
      // Clear the message when switching to hangup option
      updateAgentField('voicemail_message', '');
    }
  };

  // Handle voicemail message content change
  const handleVoicemailMessageChange = (message: string) => {
    updateAgentField('voicemail_message', message);
  };

  // Handle detection duration change
  const handleVoicemailDetectionDurationChange = (values: number[]) => {
    const duration = values[0];
    setDetectionDuration(duration);
    updateAgentField('voicemail_detection_timeout_ms', duration * 1000); // Convert to milliseconds
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-medium text-amber-600 flex items-center gap-1">
              <Voicemail className="h-3.5 w-3.5" />
              Voicemail Detection
            </Label>
            <p className="text-xs text-gray-500">Hang up or leave a voicemail if a voicemail is detected.</p>
          </div>
          <Switch 
            checked={!!agent.enable_voicemail_detection} 
            onCheckedChange={handleVoicemailDetectionChange}
          />
        </div>

        {/* Voicemail Detection Duration - Only visible when voicemail detection is enabled */}
        {agent.enable_voicemail_detection && (
          <div className="space-y-2 mt-2 px-0">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-medium text-amber-600">Voicemail Detection Duration</Label>
                <p className="text-xs text-gray-500">Duration for which voicemail detection will be active during the call</p>
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
              fieldName="voicemail_detection_timeout_ms"
            />
          </div>
        )}

        <div className={`ml-0 mt-2 space-y-2 bg-blue-50 p-3 rounded-md ${!agent.enable_voicemail_detection ? 'opacity-50' : ''}`}>
          <RadioGroup 
            value={voicemailAction} 
            onValueChange={handleVoicemailActionChange}
            disabled={!agent.enable_voicemail_detection}
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
                  disabled={!agent.enable_voicemail_detection || voicemailAction === 'hangup'}
                  value={agent.voicemail_message || ''}
                  onChange={(e) => handleVoicemailMessageChange(e.target.value)}
                />
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>
    </>
  );
};

export default VoicemailDetectionSection;
