
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Agent } from '../hooks/useAgents';
import { useEffect, useState } from 'react';

interface AgentSelectorProps {
  value: string;
  agents: Agent[];
  onChange: (value: string) => void;
  isLoading?: boolean;
}

const AgentSelector = ({ value, agents = [], onChange, isLoading = false }: AgentSelectorProps) => {
  const [currentValue, setCurrentValue] = useState<string>(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    console.log("AgentSelector rendering with agents:", agents);
    console.log("Current selected value:", value);
  }, [agents, value]);

  const handleChange = (newValue: string) => {
    console.log("Selected new agent:", newValue);
    setCurrentValue(newValue);
    onChange(newValue);
  };

  return (
    <div>
      <Select 
        value={currentValue} 
        onValueChange={handleChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an agent" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None (Unassigned)</SelectItem>
          {agents && agents.length > 0 ? (
            agents.map(agent => (
              <SelectItem key={agent.agent_id} value={agent.agent_id}>
                {agent.agent_name || 'Unnamed Agent'}
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
