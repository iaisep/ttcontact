
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { chatwootApi } from '@/services/chatwootApi';
import { toast } from 'sonner';
import type { Agent } from './types';

interface AgentsSelectionStepProps {
  selectedAgents: string[];
  onAgentSelect: (agents: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const AgentsSelectionStep: React.FC<AgentsSelectionStepProps> = ({
  selectedAgents,
  onAgentSelect,
  onBack,
  onNext
}) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
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
      
      setAgents(transformedAgents);
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

  const handleRetry = () => {
    fetchAgents();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Agents</h2>
          <p className="text-gray-600 mb-4">Loading agents...</p>
        </div>
        
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading agents...</span>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button disabled className="bg-blue-600 hover:bg-blue-700">
            <ArrowRight className="ml-2 h-4 w-4" />
            Add agents
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Agents</h2>
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
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button disabled className="bg-blue-600 hover:bg-blue-700">
            <ArrowRight className="ml-2 h-4 w-4" />
            Add agents
          </Button>
        </div>
      </div>
    );
  }

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
        <Label>Agents ({agents.length} available)</Label>
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
                <div className="flex items-center space-x-2">
                  {agent.thumbnail && (
                    <img src={agent.thumbnail} alt={agent.name} className="w-6 h-6 rounded-full" />
                  )}
                  <div>
                    <span className="font-medium">{agent.name}</span>
                    <span className="text-gray-500 text-sm ml-2">({agent.email})</span>
                    {agent.role && (
                      <span className="text-blue-600 text-xs ml-2">{agent.role}</span>
                    )}
                  </div>
                </div>
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
