import React, { useState } from 'react';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/context/LanguageContext';
import { VoiceSelectionModal } from './voice-selection';
import { Voice } from './voice-selection/types';
import VoiceSelector from './components/VoiceSelector';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Plus, Settings2, Cog, FileText, Radio, Headphones, BarChart3, Shield, Webhook } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface KnowledgeBase {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

interface AgentSettingsAccordionProps {
  agent: RetellAgent;
  knowledgeBases?: KnowledgeBase[];
  updateAgentField: (fieldName: string, value: any) => void;
}

const defaultSpeechSettings = {
  stability: 0.5,
  similarity: 0.8,
  style: 0.5,
  speed: 1.0
};

const AgentSettingsAccordion: React.FC<AgentSettingsAccordionProps> = ({
  agent,
  knowledgeBases = [],
  updateAgentField
}) => {
  const { t } = useLanguage();
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  
  const speechSettings = {
    ...defaultSpeechSettings,
    ...(agent.speech_settings || {})
  };

  const handleVoiceSelect = (voice: Voice) => {
    updateAgentField('voice_id', voice.voice_id || voice.id);
  };
  
  return (
    <>
      <Accordion 
        type="single" 
        collapsible 
        defaultValue=""
        className="w-full"
      >
        {/* Functions Section */}
        <AccordionItem value="functions" className="mt-4 border rounded-md overflow-hidden">
          <AccordionTrigger className="px-4 py-2 text-sm font-medium bg-gray-50 hover:bg-gray-100 flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            {t('functions')}
          </AccordionTrigger>
          <AccordionContent className="p-4">
            <div className="space-y-4">
              <p className="text-xs text-blue-600">
                Enable your agent with capabilities such as calendar bookings, call termination, etc.
              </p>

              <div className="space-y-2">
                {/* Function Items */}
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Radio className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">correo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Radio className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">end_call</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Radio className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">agendar</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" size="sm" className="text-xs">
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Knowledge Base Section */}
        <AccordionItem value="knowledge-base" className="mt-4 border rounded-md overflow-hidden">
          <AccordionTrigger className="px-4 py-2 text-sm font-medium bg-gray-50 hover:bg-gray-100 flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            {t('knowledge_base')}
          </AccordionTrigger>
          <AccordionContent className="p-4">
            <div className="space-y-4">
              <p className="text-xs text-blue-600">
                Add knowledge base to provide context to the agent.
              </p>

              <div className="space-y-2">
                {/* Knowledge Base Items */}
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">base de conocimientos 1</span>
                  </div>
                  <div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-start">
                <Button variant="outline" size="sm" className="text-xs">
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Speech Settings Section */}
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
                  <span className="text-xs text-gray-500">0.85</span>
                </div>
                <p className="text-xs text-gray-500">Control how fast the agent responds after users finish speaking.</p>
                <Slider defaultValue={[0.85]} max={1} step={0.01} className="w-full" />
              </div>

              {/* Interruption Sensitivity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-amber-600">Interruption Sensitivity</Label>
                  <span className="text-xs text-gray-500">0.8</span>
                </div>
                <p className="text-xs text-gray-500">Control how sensitively AI can be interrupted by human speech.</p>
                <Slider defaultValue={[0.8]} max={1} step={0.01} className="w-full" />
              </div>

              {/* Enable Backchanneling */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-medium text-amber-600">Enable Backchanneling</Label>
                    <p className="text-xs text-gray-500">Enables the agent to use affirmatives like 'yeah' or 'uh-huh' during conversations, indicating active listening and engagement.</p>
                  </div>
                  <Switch checked={true} />
                </div>
              </div>

              {/* Backchannel Frequency */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-amber-600">Backchannel Frequency</Label>
                  <span className="text-xs text-gray-500">0.8</span>
                </div>
                <Slider defaultValue={[0.8]} max={1} step={0.01} className="w-full" />
              </div>

              {/* Backchannel Words */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-amber-600">Backchannel Words</Label>
                <p className="text-xs text-gray-500">A list of words that the agent would use for backchanneling</p>
                <Textarea 
                  placeholder="Vale, entiendo, aja, comprendo, mmmm"
                  defaultValue="Vale, entiendo, aja, comprendo, mmmm"
                  className="w-full text-sm"
                  rows={2}
                />
              </div>

              {/* Boosted Keywords */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-amber-600">Boosted Keywords</Label>
                <p className="text-xs text-gray-500">Provide a customized list of keywords to expand our model's vocabulary.</p>
                <Input 
                  placeholder="Keywords separated by commas"
                  defaultValue="información de mi cuenta"
                  className="w-full text-sm"
                />
              </div>

              {/* Enable Speech Normalization */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-medium text-amber-600">Enable Speech Normalization</Label>
                    <p className="text-xs text-gray-500">It converts text elements like numbers, currency, and dates into human-like spoken expressions.</p>
                  </div>
                  <Switch checked={false} />
                </div>
              </div>

              {/* Enable Transcript Formatting */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-medium text-amber-600">Enable Transcript Formatting</Label>
                    <p className="text-xs text-gray-500">The agent writes like phone numbers being formatted as timestamps.</p>
                  </div>
                  <Switch checked={false} />
                </div>
              </div>

              {/* Reminder Message Frequency */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-amber-600">Reminder Message Frequency</Label>
                <p className="text-xs text-gray-500">Control how often AI will send a reminder message.</p>
                <div className="flex items-center space-x-2">
                  <Input 
                    type="number"
                    defaultValue="5"
                    className="w-16 text-sm"
                  />
                  <span className="text-xs text-gray-500">seconds</span>
                  <Input 
                    type="number"
                    defaultValue="1"
                    className="w-16 text-sm"
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

        {/* Call Settings Section */}
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

        {/* Post-Call Analysis Section */}
        <AccordionItem value="post-call-analysis" className="mt-4 border rounded-md overflow-hidden">
          <AccordionTrigger className="px-4 py-2 text-sm font-medium bg-gray-50 hover:bg-gray-100 flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            {t('post_call_analysis')}
          </AccordionTrigger>
          <AccordionContent className="p-4">
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-medium text-amber-600">Post Call Data Retrieval</Label>
                <p className="text-xs text-gray-500">Define the information that you need to extract from the call. (Learn more)</p>
              </div>

              <div className="space-y-2">
                {/* Data Retrieval Items */}
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Radio className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">Oportunidad</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" className="text-xs">
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
                
                <div className="flex items-center space-x-2">
                  <Cog className="h-4 w-4 text-gray-400" />
                  <span className="text-xs">GPT-4o Mini</span>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Security & Fallback Settings */}
        <AccordionItem value="security-fallback" className="mt-4 border rounded-md overflow-hidden">
          <AccordionTrigger className="px-4 py-2 text-sm font-medium bg-gray-50 hover:bg-gray-100 flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            {t('security_fallback_settings')}
          </AccordionTrigger>
          <AccordionContent className="p-4">
            <div className="space-y-6">
              {/* Opt Out Sensitive Data Storage */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-amber-600">Opt Out Sensitive Data Storage</Label>
                <p className="text-xs text-gray-500">Control whether Retell should store sensitive data. (Learn more)</p>
              </div>

              {/* Fallback Voice ID */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-amber-600">Fallback Voice ID</Label>
                <p className="text-xs text-gray-500">If the current voice provider fails, assign a fallback voice to continue the call.</p>
                <Button variant="outline" size="sm" className="text-xs">
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>

              {/* Default Dynamic Variables */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-amber-600">Default Dynamic Variables</Label>
                <p className="text-xs text-gray-500">Set fallback values for dynamic variables across all endpoints if they are not provided.</p>
                <Button variant="outline" size="sm" className="text-xs">
                  <Cog className="h-3 w-3 mr-1" /> Set Up
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Webhook Settings */}
        <AccordionItem value="webhook-settings" className="mt-4 border rounded-md overflow-hidden">
          <AccordionTrigger className="px-4 py-2 text-sm font-medium bg-gray-50 hover:bg-gray-100 flex items-center">
            <Webhook className="h-4 w-4 mr-2" />
            {t('webhook_settings')}
          </AccordionTrigger>
          <AccordionContent className="p-4">
            <div className="space-y-6">
              {/* Inbound Call Webhook URL */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-amber-600">Inbound Call Webhook URL</Label>
                <p className="text-xs text-gray-500">The webhook has been migrated to phone level webhooks. (Learn more)</p>
                <Input 
                  placeholder="Webhook URL"
                  className="w-full text-sm"
                />
              </div>

              {/* Agent Level Webhook URL */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-amber-600">Agent Level Webhook URL</Label>
                <p className="text-xs text-gray-500">Webhook URL to receive events from Retell. (Learn more)</p>
                <Input 
                  placeholder="Webhook URL"
                  defaultValue="https://workflow.universidadisep.com/webhook/c27c"
                  className="w-full text-sm"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Voice Settings - Keeping this for compatibility with the original component */}
        <AccordionItem value="voice-settings" className="hidden">
          <AccordionTrigger>
            {t('voice')}
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500">{t('selected_voice')}</label>
              <VoiceSelector 
                selectedVoice={agent.voice_id || 'Select a voice'} 
                openVoiceModal={() => setVoiceModalOpen(true)}
                onSettingsClick={() => setVoiceModalOpen(true)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <VoiceSelectionModal
        open={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onSelectVoice={handleVoiceSelect}
        selectedVoice={agent.voice_id}
        agent={agent}
        updateAgentField={updateAgentField}
      />
    </>
  );
};

export default AgentSettingsAccordion;
