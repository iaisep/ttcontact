
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { useAgentsAndBots } from '@/hooks/useAgentsAndBots';

interface AgentSelectorProps {
  selectedAgents: string[];
  onAgentsChange: (agents: string[]) => void;
  onSave: () => void;
  saving?: boolean;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({
  selectedAgents,
  onAgentsChange,
  onSave,
  saving = false
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const { agents, loading } = useAgentsAndBots();

  const handleAddAgent = () => {
    if (selectedAgentId && !selectedAgents.includes(selectedAgentId)) {
      onAgentsChange([...selectedAgents, selectedAgentId]);
      setSelectedAgentId('');
    }
  };

  const handleRemoveAgent = (agentId: string) => {
    onAgentsChange(selectedAgents.filter(id => id !== agentId));
  };

  const getAgentName = (agentId: string) => {
    const agent = agents.find(a => a.id.toString() === agentId);
    return agent?.name || agentId;
  };

  const getAvailableAgents = () => {
    return agents.filter(agent => !selectedAgents.includes(agent.id.toString()));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Label>Agents</Label>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Agents</Label>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Add or remove agents from this inbox
        </p>
        
        <div className="flex gap-2 mb-4">
          <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select an agent to add" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableAgents().map((agent) => (
                <SelectItem key={agent.id} value={agent.id.toString()}>
                  {agent.name} {agent.email && `(${agent.email})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleAddAgent} 
            disabled={!selectedAgentId}
            variant="outline"
          >
            Add
          </Button>
        </div>

        {selectedAgents.length > 0 && (
          <div className="space-y-2">
            {selectedAgents.map((agentId) => (
              <div key={agentId} className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-md border border-blue-200 dark:border-blue-800">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  {getAgentName(agentId)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAgent(agentId)}
                  className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button onClick={onSave} disabled={saving}>
        {saving ? 'Updating...' : 'Update'}
      </Button>
    </div>
  );
};

export default AgentSelector;
