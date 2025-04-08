
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Agent } from '../../agents/types';
import { useEffect, useState } from 'react';

interface AgentSelectorProps {
  value: string;
  agents: Agent[];
  onChange: (value: string) => void;
  isLoading?: boolean;
}

const AgentSelector = ({ value, agents = [], onChange, isLoading = false }: AgentSelectorProps) => {
  const [currentValue, setCurrentValue] = useState<string>(value);

  // Update local state when value changes from parent
  useEffect(() => {
    console.log("AgentSelector: Value prop changed to:", value);
    setCurrentValue(value);
  }, [value]);

  // Debug logs
  useEffect(() => {
    console.log("AgentSelector: Agents data updated, count:", agents.length);
    console.log("AgentSelector: Current selected value:", currentValue);
    
    // Check if the current value exists in the agents list
    const selectedAgent = agents.find(agent => agent.id === currentValue);
    console.log("AgentSelector: Selected agent:", selectedAgent);
  }, [agents, currentValue]);

  const handleChange = (newValue: string) => {
    console.log("AgentSelector: Selected new agent:", newValue);
    setCurrentValue(newValue);
    onChange(newValue);
  };

  // Find the name of the currently selected agent for display
  const selectedAgentName = currentValue && currentValue !== 'none' 
    ? agents.find(agent => agent.id === currentValue)?.name || 'Unknown Agent'
    : '';

  return (
    <div>
      <Select 
        value={currentValue} 
        onValueChange={handleChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an agent">
            {currentValue === 'none' ? 'None (Unassigned)' : selectedAgentName}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None (Unassigned)</SelectItem>
          {agents && agents.length > 0 ? (
            agents.map(agent => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.name || agent.agent_name || 'Unnamed Agent'}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="loading" disabled>
              {isLoading ? 'Loading agents...' : 'No agents available'}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      {isLoading && <p className="text-xs text-muted-foreground mt-1">Loading agents...</p>}
    </div>
  );
};

export default AgentSelector;
