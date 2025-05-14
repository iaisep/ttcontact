
import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Settings2, Cog, Plus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { AccordionSectionProps } from './types';

const SpeechSettingsSection: React.FC<AccordionSectionProps> = ({ agent, updateAgentField }) => {
  const { t } = useLanguage();
  const agentId = agent?.agent_id || agent?.id;

  return (
    <AccordionItem value="speech-settings" className="mt-4 border rounded-md overflow-hidden">
      <AccordionTrigger className="px-4 py-2 text-sm font-medium bg-gray-50 hover:bg-gray-100 flex items-center">
        <Settings2 className="h-4 w-4 mr-2" />
        {t('speech_settings')}
      </AccordionTrigger>
      <AccordionContent className="p-4">
        <div className="space-y-6">
          {/* Background Sound Setting */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-amber-600">Background Sound</Label>
            <div className="flex items-center justify-between">
              <span className="text-sm">Call Center</span>
              <Cog className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Responsiveness Setting */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-amber-600">Responsiveness</Label>
              <span className="text-xs text-gray-500">{agent?.responsiveness?.toFixed(2) || "0.85"}</span>
            </div>
            <p className="text-xs text-gray-500">Control how fast the agent responds after users finish speaking.</p>
            <Slider 
              defaultValue={[agent?.responsiveness || 0.85]} 
              max={1} 
              step={0.01} 
              className="w-full"
              agentId={agentId}
              fieldName="responsiveness"
            />
          </div>

          {/* Interruption Sensitivity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-amber-600">Interruption Sensitivity</Label>
              <span className="text-xs text-gray-500">{agent?.interruption_sensitivity?.toFixed(2) || "0.8"}</span>
            </div>
            <p className="text-xs text-gray-500">Control how sensitively AI can be interrupted by human speech.</p>
            <Slider 
              defaultValue={[agent?.interruption_sensitivity || 0.8]} 
              max={1} 
              step={0.01} 
              className="w-full"
              agentId={agentId}
              fieldName="interruption_sensitivity"
            />
          </div>

          {/* Enable Backchanneling */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-medium text-amber-600">Enable Backchanneling</Label>
                <p className="text-xs text-gray-500">Enables the agent to use affirmatives like 'yeah' or 'uh-huh' during conversations, indicating active listening and engagement.</p>
              </div>
              <Switch 
                checked={agent?.enable_backchannel || false} 
                onCheckedChange={(value) => updateAgentField('enable_backchannel', value)}
              />
            </div>
          </div>

          {/* Backchannel Frequency */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-amber-600">Backchannel Frequency</Label>
              <span className="text-xs text-gray-500">{agent?.backchannel_frequency?.toFixed(2) || "0.8"}</span>
            </div>
            <Slider 
              defaultValue={[agent?.backchannel_frequency || 0.8]} 
              max={1} 
              step={0.01} 
              className="w-full"
              agentId={agentId}
              fieldName="backchannel_frequency"
            />
          </div>

          {/* Backchannel Words */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-amber-600">Backchannel Words</Label>
            <p className="text-xs text-gray-500">A list of words that the agent would use for backchanneling</p>
            <Textarea 
              placeholder="Vale, entiendo, aja, comprendo, mmmm"
              defaultValue={agent?.backchannel_words?.join(", ") || "Vale, entiendo, aja, comprendo, mmmm"}
              className="w-full text-sm"
              rows={2}
              onChange={(e) => {
                const words = e.target.value.split(',').map(word => word.trim());
                updateAgentField('backchannel_words', words);
              }}
            />
          </div>

          {/* Boosted Keywords */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-amber-600">Boosted Keywords</Label>
            <p className="text-xs text-gray-500">Provide a customized list of keywords to expand our model's vocabulary.</p>
            <Input 
              placeholder="Keywords separated by commas"
              defaultValue={agent?.boosted_keywords?.join(", ") || "información de mi cuenta"}
              className="w-full text-sm"
              onChange={(e) => {
                const keywords = e.target.value.split(',').map(keyword => keyword.trim());
                updateAgentField('boosted_keywords', keywords);
              }}
            />
          </div>

          {/* Enable Speech Normalization */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-medium text-amber-600">Enable Speech Normalization</Label>
                <p className="text-xs text-gray-500">It converts text elements like numbers, currency, and dates into human-like spoken expressions.</p>
              </div>
              <Switch 
                checked={agent?.normalize_for_speech || false} 
                onCheckedChange={(value) => updateAgentField('normalize_for_speech', value)}
              />
            </div>
          </div>

          {/* Enable Transcript Formatting */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-medium text-amber-600">Enable Transcript Formatting</Label>
                <p className="text-xs text-gray-500">The agent writes like phone numbers being formatted as timestamps.</p>
              </div>
              <Switch 
                checked={agent?.enable_transcription_formatting || false} 
                onCheckedChange={(value) => updateAgentField('enable_transcription_formatting', value)}
              />
            </div>
          </div>

          {/* Reminder Message Frequency */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-amber-600">Reminder Message Frequency</Label>
            <p className="text-xs text-gray-500">Control how often AI will send a reminder message.</p>
            <div className="flex items-center space-x-2">
              <Input 
                type="number"
                defaultValue={agent?.reminder_trigger_ms ? Math.round(agent.reminder_trigger_ms / 1000) : "5"}
                className="w-16 text-sm"
                onChange={(e) => {
                  const seconds = parseInt(e.target.value);
                  if (!isNaN(seconds)) {
                    updateAgentField('reminder_trigger_ms', seconds * 1000);
                  }
                }}
              />
              <span className="text-xs text-gray-500">seconds</span>
              <Input 
                type="number"
                defaultValue={agent?.reminder_max_count || "1"}
                className="w-16 text-sm"
                onChange={(e) => {
                  const count = parseInt(e.target.value);
                  if (!isNaN(count)) {
                    updateAgentField('reminder_max_count', count);
                  }
                }}
              />
              <span className="text-xs text-gray-500">times</span>
            </div>
          </div>

          {/* Pronunciation */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-amber-600">Pronunciation</Label>
            <p className="text-xs text-gray-500">Guide the model to pronounce a word, name, or phrase in a specific way. (Learn more)</p>
            <div className="flex justify-start">
              <Button variant="outline" size="sm" className="text-xs">
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default SpeechSettingsSection;
