
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { RetellAgent, RetellVoice, RetellFolder } from '@/components/dashboard/sections/agents/types/retell-types';
import { debounce } from 'lodash';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface AgentEditorFormProps {
  agent: RetellAgent;
  voices: RetellVoice[];
  folders: RetellFolder[];
  onUpdateField: (fieldName: string, value: any) => void;
  onOpenVoiceSelector: () => void;
}

const AgentEditorForm: React.FC<AgentEditorFormProps> = ({
  agent,
  voices,
  folders,
  onUpdateField,
  onOpenVoiceSelector
}) => {
  // Extract initial values from agent with safe fallbacks
  const initialPrompt = agent.response_engine && 
    typeof agent.response_engine === 'object' ? 
    (agent.response_engine as any).prompt || 
    (agent.response_engine as any).general_prompt || 
    '' : '';
  
  const initialWelcomeMessage = agent.begin_message || agent.welcome_message || '';
  
  // Create state for editable fields
  const [prompt, setPrompt] = useState(initialPrompt);
  const [welcomeMessage, setWelcomeMessage] = useState(initialWelcomeMessage);
  
  // Create debounced update functions
  const debouncedUpdatePrompt = debounce((value) => {
    if (agent.response_engine?.type === 'retell-llm') {
      onUpdateField('response_engine.general_prompt', value);
    } else {
      onUpdateField('response_engine.prompt', value);
    }
  }, 1000);
  
  const debouncedUpdateWelcomeMessage = debounce((value) => {
    onUpdateField('begin_message', value);
  }, 1000);
  
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPrompt(value);
    debouncedUpdatePrompt(value);
  };
  
  const handleWelcomeMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setWelcomeMessage(value);
    debouncedUpdateWelcomeMessage(value);
  };
  
  return (
    <div className="container px-4 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-2">Agent Prompt</h2>
            <Textarea
              value={prompt}
              onChange={handlePromptChange}
              rows={15}
              className="font-mono text-sm resize-vertical"
              placeholder="Enter agent instructions here..."
            />
          </div>
          
          <div>
            <h2 className="text-lg font-medium mb-2">Welcome Message</h2>
            <Textarea
              value={welcomeMessage}
              onChange={handleWelcomeMessageChange}
              rows={4}
              className="resize-vertical"
              placeholder="Enter a welcome message for the agent..."
            />
          </div>
          
          <div className="flex flex-col items-center justify-center mt-12 p-8 border border-dashed rounded-lg bg-muted/30">
            <div className="bg-muted rounded-full p-4 mb-4">
              <Mic className="h-6 w-6 text-muted-foreground" />
            </div>
            <Button className="mb-2">Test Agent</Button>
            <p className="text-sm text-muted-foreground">
              Click to test your agent voice and responses
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="functions">
              <AccordionTrigger>Functions</AccordionTrigger>
              <AccordionContent>
                <div className="py-2">
                  <p className="text-sm text-muted-foreground">
                    Manage the functions your agent can use to interact with external systems.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    Add Function
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="knowledge-base">
              <AccordionTrigger>Knowledge Base</AccordionTrigger>
              <AccordionContent>
                <div className="py-2">
                  <p className="text-sm text-muted-foreground">
                    Add or update the knowledge base for your agent.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    Manage Knowledge
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="speech-settings">
              <AccordionTrigger>Speech Settings</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 py-2">
                  <div>
                    <label className="text-sm font-medium">Stability</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1" 
                      value={agent.speech_settings?.stability || 0.5}
                      onChange={(e) => onUpdateField('speech_settings.stability', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Similarity</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1" 
                      value={agent.speech_settings?.similarity || 0.5}
                      onChange={(e) => onUpdateField('speech_settings.similarity', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="call-settings">
              <AccordionTrigger>Call Settings</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 py-2">
                  <div>
                    <label className="text-sm font-medium">Max Call Duration (ms)</label>
                    <input 
                      type="number"
                      value={agent.max_call_duration_ms || 3600000}
                      onChange={(e) => onUpdateField('max_call_duration_ms', parseInt(e.target.value))}
                      className="w-full border rounded-md px-3 py-1.5 mt-1"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableVoicemail"
                      checked={agent.enable_voicemail_detection || false}
                      onChange={(e) => onUpdateField('enable_voicemail_detection', e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="enableVoicemail" className="text-sm">Enable voicemail detection</label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="post-call">
              <AccordionTrigger>Post-Call Analysis</AccordionTrigger>
              <AccordionContent>
                <div className="py-2">
                  <p className="text-sm text-muted-foreground">
                    Configure post-call analysis settings.
                  </p>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="enablePostCallAnalysis"
                      checked={agent.enable_post_call_analysis || false}
                      onChange={(e) => onUpdateField('enable_post_call_analysis', e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="enablePostCallAnalysis" className="text-sm">Enable analysis</label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="security">
              <AccordionTrigger>Security & Fallback</AccordionTrigger>
              <AccordionContent>
                <div className="py-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="optOutStorage"
                      checked={agent.opt_out_sensitive_data_storage || false}
                      onChange={(e) => onUpdateField('opt_out_sensitive_data_storage', e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="optOutStorage" className="text-sm">Opt out of sensitive data storage</label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="webhook">
              <AccordionTrigger>Webhook Settings</AccordionTrigger>
              <AccordionContent>
                <div className="py-2">
                  <label className="text-sm font-medium">Webhook URL</label>
                  <input 
                    type="text"
                    value={agent.webhook_url || ''}
                    onChange={(e) => onUpdateField('webhook_url', e.target.value)}
                    className="w-full border rounded-md px-3 py-1.5 mt-1"
                    placeholder="https://example.com/webhook"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default AgentEditorForm;
