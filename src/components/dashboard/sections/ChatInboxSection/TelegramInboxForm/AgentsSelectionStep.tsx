
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  email: string;
}

interface AgentsSelectionStepProps {
  agents: Agent[];
  selectedAgents: string[];
  onAgentSelect: (agentIds: string[]) => void;
  onBack?: () => void; // Make onBack optional
  onNext: () => void;
  loading?: boolean;
}

const AgentsSelectionStep: React.FC<AgentsSelectionStepProps> = ({
  agents,
  selectedAgents,
  onAgentSelect,
  onBack,
  onNext,
  loading = false
}) => {
  const handleAgentToggle = (agentId: string) => {
    if (selectedAgents.includes(agentId)) {
      onAgentSelect(selectedAgents.filter(id => id !== agentId));
    } else {
      onAgentSelect([...selectedAgents, agentId]);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Add agents</h2>
          <p className="text-gray-600 mb-6">
            Loading available agents...
          </p>
        </div>

        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>

        <div className="flex justify-between">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          {!onBack && <div />} {/* Empty div to maintain spacing */}
          <Button disabled>
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Add agents</h2>
        <p className="text-gray-600 mb-6">
          Add agents to this inbox to receive the messages.
        </p>
      </div>

      <div className="space-y-4">
        {agents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No agents available
          </div>
        ) : (
          agents.map((agent) => (
            <div key={agent.id} className="flex items-center space-x-3 p-3 border rounded-lg">
              <Checkbox
                id={`agent-${agent.id}`}
                checked={selectedAgents.includes(agent.id)}
                onCheckedChange={() => handleAgentToggle(agent.id)}
              />
              <div className="flex-1">
                <label
                  htmlFor={`agent-${agent.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {agent.name}
                </label>
                <p className="text-sm text-gray-500">{agent.email}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-between">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
        {!onBack && <div />} {/* Empty div to maintain spacing when no back button */}
        <Button 
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AgentsSelectionStep;
