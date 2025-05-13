
import React from 'react';
import { RetellAgent, RetellVoice } from '@/components/dashboard/sections/agents/types/retell-types';
import TestPanel from './components/test-panel';

interface AgentRightColumnProps {
  agent: RetellAgent;
  voice?: RetellVoice | null;
  updateAgentField: (fieldName: string, value: any) => void;
}

const AgentRightColumn: React.FC<AgentRightColumnProps> = ({
  agent,
  voice,
  updateAgentField
}) => {
  return (
    <div className="bg-[hsl(var(--muted)/.3)] rounded-lg p-4 border shadow-sm w-full max-w-[280px]">
      {/* Test Agent Section */}
      <TestPanel agent={agent} voice={voice} />
    </div>
  );
};

export default AgentRightColumn;
