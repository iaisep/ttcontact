
import React from 'react';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import TestPanel from './TestPanel';

interface AgentRightColumnProps {
  agent: RetellAgent;
  updateAgentField: (fieldName: string, value: any) => void;
}

const AgentRightColumn: React.FC<AgentRightColumnProps> = ({
  agent,
  updateAgentField
}) => {
  return (
    <div className="bg-card border rounded-lg shadow-sm">
      <TestPanel agent={agent} />
    </div>
  );
};

export default AgentRightColumn;
