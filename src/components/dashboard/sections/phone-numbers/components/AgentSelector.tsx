
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Agent } from '../hooks/useAgents';

interface AgentSelectorProps {
  value: string;
  agents: Agent[];
  onChange: (value: string) => void;
}

const AgentSelector = ({ value, agents, onChange }: AgentSelectorProps) => {
  return (
    <Select 
      value={value} 
      onValueChange={onChange}
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
