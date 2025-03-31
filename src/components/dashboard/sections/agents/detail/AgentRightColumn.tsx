
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, TestTube } from 'lucide-react';
import AgentSettingsAccordion from './AgentSettingsAccordion';
import TestPanel from './TestPanel';
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
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" className="w-[49%]">
          <Mic className="mr-2 h-4 w-4" />
          Test Audio
        </Button>
        <Button variant="outline" className="w-[49%]">
          <TestTube className="mr-2 h-4 w-4" />
          Test LLM
        </Button>
      </div>

      <AgentSettingsAccordion 
        agent={agent}
        updateAgentField={updateAgentField}
      />

      <div className="mt-4 text-center py-8">
        <TestPanel agent={agent} />
      </div>
    </div>
  );
};

export default AgentRightColumn;
