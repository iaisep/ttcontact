
import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { File, Shield, Webhook, Plus, Trash } from 'lucide-react';
import AgentFunctionsPanel from './AgentFunctionsPanel';
import SpeechSettings from './SpeechSettings';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';

interface AgentSettingsAccordionProps {
  agent: RetellAgent;
  updateAgentField: (fieldName: string, value: any) => void;
}

const AgentSettingsAccordion: React.FC<AgentSettingsAccordionProps> = ({
  agent,
  updateAgentField
}) => {
  return (
    <Accordion type="multiple" defaultValue={[]}>
      <AccordionItem value="functions" className="border rounded-md px-2 mb-2">
        <AccordionTrigger className="py-2">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
              <rect width="8" height="8" x="2" y="2" rx="2"></rect>
              <rect width="8" height="8" x="14" y="2" rx="2"></rect>
              <rect width="8" height="8" x="2" y="14" rx="2"></rect>
              <rect width="8" height="8" x="14" y="14" rx="2"></rect>
            </svg>
            Functions
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="py-2 text-sm">
            <p className="text-muted-foreground mb-4">
              Enable your agent with capabilities such as calendar bookings, call termination, etc.
            </p>
            <AgentFunctionsPanel
              functions={agent.functions || [
                { id: "fn_1", name: "correo", description: "Send email" },
                { id: "fn_2", name: "end_call", description: "End the call" },
                { id: "fn_3", name: "agendar", description: "Schedule appointment" }
              ]}
              onUpdate={(value) => updateAgentField('functions', value)}
            />
            <Button variant="outline" size="sm" className="mt-4">
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="knowledge" className="border rounded-md px-2 mb-2">
        <AccordionTrigger className="py-2">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
            </svg>
            Knowledge Base
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="py-2">
            <p className="text-sm text-muted-foreground mb-4">
              Add knowledge base to provide context to the agent.
            </p>
            <div className="space-y-2">
              <div className="border p-2 rounded-md flex justify-between items-center">
                <div className="flex items-center">
                  <File className="h-4 w-4 mr-2" />
                  <span className="text-sm">AD-opc titulación_opc practicas_modalida</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
              <div className="border p-2 rounded-md flex justify-between items-center">
                <div className="flex items-center">
                  <File className="h-4 w-4 mr-2" />
                  <span className="text-sm">AD-Perfiles de ingreso y validez</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
              <div className="border p-2 rounded-md flex justify-between items-center">
                <div className="flex items-center">
                  <File className="h-4 w-4 mr-2" />
                  <span className="text-sm">Planes de estudio de la oferta académica</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-4">
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="speech" className="border rounded-md px-2 mb-2">
        <AccordionTrigger className="py-2">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
              <path d="M12 2c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4v5c0 .5-.2 1-.6 1.4-.4.4-.9.6-1.4.6s-1-.2-1.4-.6c-.4-.4-.6-.9-.6-1.4V4c0-.5.2-1 .6-1.4C11 2.2 11.5 2 12 2Z"></path>
              <path d="M6 10v1c0 1.7.7 3.4 1.9 4.6 1.2 1.2 2.9 1.9 4.6 1.9 1.7 0 3.4-.7 4.6-1.9 1.2-1.2 1.9-2.9 1.9-4.6v-1"></path>
              <path d="M18 19c-.5 1.1-1.3 2-2.2 2.7-.9.7-2 1.1-3.2 1.2-2.5.3-4.9-.6-6.5-2.2"></path>
            </svg>
            Speech Settings
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <SpeechSettings
            settings={agent.speech_settings || { stability: 0.5, similarity: 0.75, style: 0.5, speed: 1 }}
            onUpdate={(value) => updateAgentField('speech_settings', value)}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="call" className="border rounded-md px-2 mb-2">
        <AccordionTrigger className="py-2">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            Call Settings
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="py-2">
            <p className="text-sm text-muted-foreground">
              Configure call settings for this agent.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="analysis" className="border rounded-md px-2 mb-2">
        <AccordionTrigger className="py-2">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
              <path d="M3 3v18h18"></path>
              <path d="m19 9-5 5-4-4-3 3"></path>
            </svg>
            Post-Call Analysis
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="py-2">
            <p className="text-sm text-muted-foreground">
              Configure post-call analysis settings.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="security" className="border rounded-md px-2 mb-2">
        <AccordionTrigger className="py-2">
          <div className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Security & Fallback Settings
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="py-2">
            <p className="text-sm text-muted-foreground">
              Configure security and fallback settings.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="webhook" className="border rounded-md px-2 mb-2">
        <AccordionTrigger className="py-2">
          <div className="flex items-center">
            <Webhook className="h-4 w-4 mr-2" />
            Webhook Settings
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="py-2">
            <p className="text-sm text-muted-foreground">
              Configure webhook settings.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AgentSettingsAccordion;
