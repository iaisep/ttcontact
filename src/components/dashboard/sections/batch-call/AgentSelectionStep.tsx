
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Play } from 'lucide-react';
import { Agent } from './types';

interface AgentSelectionStepProps {
  agents: Agent[];
  selectedAgent: string;
  setSelectedAgent: (agentId: string) => void;
  onBack: () => void;
  onStartBatch: () => void;
  loading: boolean;
}

const AgentSelectionStep = ({
  agents,
  selectedAgent,
  setSelectedAgent,
  onBack,
  onStartBatch,
  loading,
}: AgentSelectionStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="agent-select">Select Agent for Calls</Label>
        <select
          id="agent-select"
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="">Select an agent</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="call-variables">Call Variables (Optional)</Label>
        <Textarea
          id="call-variables"
          placeholder="Enter any global variables for all calls in JSON format"
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          Variables defined here will be available to all calls, but can be overridden by per-contact variables.
        </p>
      </div>
      
      <div className="flex items-center space-x-2 pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onStartBatch} disabled={!selectedAgent || loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start Batch Calls
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AgentSelectionStep;
