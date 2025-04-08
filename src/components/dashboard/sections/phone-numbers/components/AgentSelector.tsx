
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

const AgentSelector = ({ value, agents, onChange, isLoading = false }: AgentSelectorProps) => {
  const [currentValue, setCurrentValue] = useState<string>(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setCurrentValue(newValue);
    onChange(newValue);
  };

  return (
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
        {agents.map(agent => (
          <SelectItem key={agent.id} value={agent.id}>
            {agent.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AgentSelector;
