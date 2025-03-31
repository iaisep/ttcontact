
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';

interface AgentRightColumnProps {
  agent: RetellAgent;
  updateAgentField: (fieldName: string, value: any) => void;
}

const AgentRightColumn: React.FC<AgentRightColumnProps> = ({
  agent,
  updateAgentField
}) => {
  return (
    <div className="space-y-4">
      {/* Settings Accordion */}
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="functions">
          <AccordionTrigger className="py-2 text-sm">
            Functions
          </AccordionTrigger>
          <AccordionContent>
            <div className="text-sm text-muted-foreground p-2">
              Configure function calling capabilities for your agent.
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="knowledge-base">
          <AccordionTrigger className="py-2 text-sm">
            Knowledge Base
          </AccordionTrigger>
          <AccordionContent>
            <div className="text-sm text-muted-foreground p-2">
              Upload documents or connect to existing knowledge bases.
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="speech-settings">
          <AccordionTrigger className="py-2 text-sm">
            Speech Settings
          </AccordionTrigger>
          <AccordionContent>
            <div className="text-sm text-muted-foreground p-2">
              Configure voice settings like speed, pitch, and accent.
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="call-settings">
          <AccordionTrigger className="py-2 text-sm">
            Call Settings
          </AccordionTrigger>
          <AccordionContent>
            <div className="text-sm text-muted-foreground p-2">
              Configure call behavior, timeout settings, and connection options.
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="post-call-analysis">
          <AccordionTrigger className="py-2 text-sm">
            Post-Call Analysis
          </AccordionTrigger>
          <AccordionContent>
            <div className="text-sm text-muted-foreground p-2">
              Configure how calls are analyzed and what data is collected.
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="security-fallback">
          <AccordionTrigger className="py-2 text-sm">
            Security & Fallback Settings
          </AccordionTrigger>
          <AccordionContent>
            <div className="text-sm text-muted-foreground p-2">
              Configure security settings and fallback behavior.
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="webhook-settings">
          <AccordionTrigger className="py-2 text-sm">
            Webhook Settings
          </AccordionTrigger>
          <AccordionContent>
            <div className="text-sm text-muted-foreground p-2">
              Configure webhook URLs and events that trigger notifications.
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Test Agent Section */}
      <div className="flex flex-col items-center justify-center mt-8 pt-8 pb-4">
        <div className="mb-4 rounded-full bg-gray-100 p-6 flex items-center justify-center">
          <Mic className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-500 mb-4">Test your agent</p>
        <div className="flex space-x-4">
          <Button variant="outline" className="px-6">
            Test Audio
          </Button>
          <Button variant="outline" className="px-6">
            Test LLM
          </Button>
        </div>
        <Button className="mt-4 w-full">
          Test
        </Button>
      </div>
    </div>
  );
};

export default AgentRightColumn;
