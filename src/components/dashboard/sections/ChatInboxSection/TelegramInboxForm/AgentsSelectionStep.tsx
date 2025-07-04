
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { chatwootApi } from '@/services/chatwootApi';
import { toast } from 'sonner';

interface Agent {
  id: string;
  name: string;
  email: string;
  role?: string;
  thumbnail?: string;
  availability_status?: string;
}

interface AgentsSelectionStepProps {
  selectedAgents: string[];
  onAgentSelect: (agentIds: string[]) => void;
  onBack?: () => void;
  onNext: () => void;
  loading?: boolean;
  agents?: Agent[]; // Optional agents prop for external data
}

const AgentsSelectionStep: React.FC<AgentsSelectionStepProps> = ({
  selectedAgents,
  onAgentSelect,
  onBack,
  onNext,
  agents: externalAgents,
}) => {
  const [internalAgents, setInternalAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(!externalAgents); // Don't load if external agents provided
  const [error, setError] = useState<string | null>(null);

  // Use external agents if provided, otherwise use internal agents
  const agents = externalAgents || internalAgents;

  const fetchAgents = async () => {
    if (externalAgents) return; // Skip fetching if external agents are provided
    
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching agents from Chatwoot API...');
      
      const apiAgents = await chatwootApi.getAgents();
      console.log('Received agents:', apiAgents);
      
      // Transform API agents to our format
      const transformedAgents: Agent[] = apiAgents.map(agent => ({
        id: agent.id.toString(),
        name: agent.name,
        email: agent.email,
        role: agent.role,
        thumbnail: agent.thumbnail,
        availability_status: agent.availability_status
      }));
      
      setInternalAgents(transformedAgents);
      console.log('Transformed agents:', transformedAgents);
    } catch (error) {
      console.error('Error fetching agents:', error);
      setError(error instanceof Error ? error.message : 'Failed to load agents');
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleAgentToggle = (agentId: string) => {
    if (selectedAgents.includes(agentId)) {
      onAgentSelect(selectedAgents.filter(id => id !== agentId));
    } else {
      onAgentSelect([...selectedAgents, agentId]);
    }
  };

  const handleRetry = () => {
    fetchAgents();
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
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading agents...</span>
        </div>

        <div className="flex justify-between">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          {!onBack && <div />}
          <Button disabled>
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Add agents</h2>
          <p className="text-gray-600 mb-4">Failed to load agents</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <h3 className="text-red-800 font-medium">Error loading agents</h3>
          </div>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <Button onClick={handleRetry} size="sm" variant="outline">
            Try Again
          </Button>
        </div>

        <div className="flex justify-between">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          {!onBack && <div />}
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
                <div className="flex items-center space-x-2">
                  {agent.thumbnail && (
                    <img src={agent.thumbnail} alt={agent.name} className="w-6 h-6 rounded-full" />
                  )}
                  <div>
                    <label
                      htmlFor={`agent-${agent.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {agent.name}
                    </label>
                    <p className="text-sm text-gray-500">{agent.email}</p>
                    {agent.role && (
                      <span className="text-blue-600 text-xs">{agent.role}</span>
                    )}
                  </div>
                </div>
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
        {!onBack && <div />}
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
