
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Agent } from './types';

interface AgentsSelectionStepProps {
  agents: Agent[];
  selectedAgents: string[];
  onAgentSelect: (agents: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const AgentsSelectionStep: React.FC<AgentsSelectionStepProps> = ({
  agents,
  selectedAgents,
  onAgentSelect,
  onBack,
  onNext
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Agents</h2>
        <p className="text-gray-600 mb-4">
          Here you can add agents to manage your newly created inbox. Only these selected agents will have access to your inbox. 
          Agents which are not part of this inbox will not be able to see or respond to messages in this inbox when they login.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          <strong>PS:</strong> As an administrator, if you need access to all inboxes, you should add yourself as agent to all inboxes that you create.
        </p>
      </div>

      <div>
        <Label>Agents</Label>
        <Select 
          value={selectedAgents.length > 0 ? selectedAgents[0] : ''} 
          onValueChange={(value) => onAgentSelect([value])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pick agents for the inbox" />
          </SelectTrigger>
          <SelectContent>
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.name} ({agent.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={selectedAgents.length === 0}
        >
          Add agents
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AgentsSelectionStep;
