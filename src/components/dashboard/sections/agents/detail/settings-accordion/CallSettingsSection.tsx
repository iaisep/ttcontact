
import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Headphones } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { AccordionSectionProps } from './types';

const CallSettingsSection: React.FC<AccordionSectionProps> = ({ agent, updateAgentField }) => {
  const { t } = useLanguage();
  
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

  const handleEndCallOnSilenceChange = (checked: boolean) => {
    // This will send a payload like { "end_call_after_silence_ms": 40000 } or { "end_call_after_silence_ms": 0 }
    if (checked && !agent.end_call_after_silence_ms) {
      updateAgentField('end_call_after_silence_ms', 40000); // 40 seconds in milliseconds
    } else if (!checked) {
      updateAgentField('end_call_after_silence_ms', 0); // Disable the feature
    }
  };

  const handleSilenceDurationChange = (values: number[]) => {
    const duration = values[0];
    updateAgentField('end_call_after_silence_ms', duration * 1000); // Convert to milliseconds
  };

  const handleMaxCallDurationChange = (values: number[]) => {
    const duration = values[0];
    updateAgentField('max_call_duration_ms', duration * 60 * 1000); // Convert minutes to milliseconds
  };

  const handlePauseBeforeSpeakingChange = (values: number[]) => {
    const duration = values[0];
    updateAgentField('begin_message_delay_ms', duration * 1000); // Convert seconds to milliseconds
  };

  const handleRingDurationChange = (values: number[]) => {
    // This would be implemented if there's a specific field for ring duration
    // For now, we'll assume it's part of the agent configuration
    // updateAgentField('ring_duration_ms', values[0] * 1000); // Convert seconds to milliseconds
  };

  return (
    <AccordionItem value="call-settings" className="mt-4 border rounded-md overflow-hidden">
      <AccordionTrigger className="px-4 py-2 text-sm font-medium bg-gray-50 hover:bg-gray-100 flex items-center">
        <Headphones className="h-4 w-4 mr-2" />
        {t('call_settings')}
      </AccordionTrigger>
      <AccordionContent className="p-4">
        <div className="space-y-6">
          {/* Voicemail Detection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-medium text-amber-600">Voicemail Detection</Label>
                <p className="text-xs text-gray-500">Hang up or leave a voicemail if a voicemail is detected.</p>
              </div>
              <Switch 
                checked={agent.enable_voicemail_detection || false} 
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

          {/* End Call on Silence */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-medium text-amber-600">End Call on Silence</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={!!agent.end_call_after_silence_ms} 
                  onCheckedChange={handleEndCallOnSilenceChange}
                />
                <span className="text-xs text-gray-500">
                  {agent.end_call_after_silence_ms ? (agent.end_call_after_silence_ms / 1000) : 40} s
                </span>
              </div>
            </div>
            <Slider 
              defaultValue={[agent.end_call_after_silence_ms ? (agent.end_call_after_silence_ms / 1000) : 40]} 
              min={0} 
              max={120} 
              step={1} 
              className="w-full"
              onValueChange={handleSilenceDurationChange}
              agentId={agent.agent_id}
              fieldName="end_call_after_silence_ms"
              debounceMs={300}
            />
          </div>

          {/* Max Call Duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-amber-600">Max Call Duration</Label>
              <span className="text-xs text-gray-500">
                {agent.max_call_duration_ms ? (agent.max_call_duration_ms / 1000 / 60).toFixed(1) : 20.6} m
              </span>
            </div>
            <Slider 
              defaultValue={[agent.max_call_duration_ms ? (agent.max_call_duration_ms / 1000 / 60) : 20.6]} 
              min={1} 
              max={60} 
              step={0.1} 
              className="w-full"
              onValueChange={handleMaxCallDurationChange}
              agentId={agent.agent_id}
              fieldName="max_call_duration_ms"
            />
          </div>

          {/* Pause Before Speaking */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-medium text-amber-600">Pause Before Speaking</Label>
                <p className="text-xs text-gray-500">The duration before the assistant starts speaking at the beginning of the call.</p>
              </div>
              <span className="text-xs text-gray-500">
                {agent.begin_message_delay_ms ? (agent.begin_message_delay_ms / 1000) : 0} s
              </span>
            </div>
            <Slider 
              defaultValue={[agent.begin_message_delay_ms ? (agent.begin_message_delay_ms / 1000) : 0]} 
              min={0} 
              max={10} 
              step={0.1} 
              className="w-full"
              onValueChange={handlePauseBeforeSpeakingChange}
              agentId={agent.agent_id}
              fieldName="begin_message_delay_ms"
            />
          </div>

          {/* Ring Duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-medium text-amber-600">Ring Duration</Label>
                <p className="text-xs text-gray-500">The duration for which the phone will ring before the call is answered or terminated.</p>
              </div>
              <span className="text-xs text-gray-500">30 s</span>
            </div>
            <Slider 
              defaultValue={[30]} 
              min={0} 
              max={60} 
              step={1} 
              className="w-full"
              onValueChange={handleRingDurationChange}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CallSettingsSection;
