
import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Headphones } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { AccordionSectionProps } from './types';

const CallSettingsSection: React.FC<AccordionSectionProps> = ({ agent }) => {
  const { t } = useLanguage();

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
              <Switch checked={true} />
            </div>

            <div className="ml-4 mt-2 space-y-2 bg-blue-50 p-3 rounded-md">
              <div className="flex items-start space-x-2">
                <div className="flex h-4 items-center">
                  <input
                    type="radio"
                    id="hangup"
                    name="voicemailAction"
                    className="h-4 w-4"
                    defaultChecked
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
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="leaveMessage" className="text-xs">Leave a message if reaching voicemail</Label>
                  <Textarea
                    placeholder="Message content, use [[]] to add variable"
                    className="mt-2 w-full text-xs"
                    disabled
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
              <span className="text-xs text-gray-500">10 s</span>
            </div>
            <Slider defaultValue={[10]} min={0} max={30} step={1} className="w-full" />
          </div>

          {/* End Call on Silence */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-medium text-amber-600">End Call on Silence</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch checked={true} />
                <span className="text-xs text-gray-500">40 s</span>
              </div>
            </div>
            <Slider defaultValue={[40]} min={0} max={120} step={1} className="w-full" />
          </div>

          {/* Max Call Duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-amber-600">Max Call Duration</Label>
              <span className="text-xs text-gray-500">20.6 m</span>
            </div>
            <Slider defaultValue={[20.6]} min={1} max={60} step={0.1} className="w-full" />
          </div>

          {/* Pause Before Speaking */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-medium text-amber-600">Pause Before Speaking</Label>
                <p className="text-xs text-gray-500">The duration before the assistant starts speaking at the beginning of the call.</p>
              </div>
              <span className="text-xs text-gray-500">0 s</span>
            </div>
            <Slider defaultValue={[0]} min={0} max={10} step={0.1} className="w-full" />
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
            <Slider defaultValue={[30]} min={0} max={60} step={1} className="w-full" />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CallSettingsSection;
