
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { chatwootApi } from '@/services/chatwootApi';

interface Agent {
  id: string;
  name: string;
  email?: string;
  role?: string;
}

interface AgentSelectorProps {
  selectedAgents: string[];
  onAgentsChange: (agents: string[]) => void;
  onSave: () => void;
  saving?: boolean;
  inboxId?: number;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({
  selectedAgents,
  onAgentsChange,
  onSave,
  saving = false,
  inboxId
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching agents from Chatwoot API...');
        const agents = await chatwootApi.getAgents();
        console.log('Raw agents data:', agents);
        
        // Transform Chatwoot agent data to our Agent interface
        const transformedAgents: Agent[] = agents.map(agent => ({
          id: agent.id.toString(),
          name: agent.name || 'Unnamed Agent',
          email: agent.email,
          role: agent.role
        }));
        
        console.log('Transformed agents:', transformedAgents);
        setAvailableAgents(transformedAgents);
      } catch (err) {
        console.error('Failed to fetch agents:', err);
        setError('Failed to load agents. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  useEffect(() => {
    const fetchInboxMembers = async () => {
      if (!inboxId) {
        console.log('No inbox ID provided, skipping inbox members fetch');
        return;
      }

      try {
        console.log('Fetching inbox members for inbox:', inboxId);
        const members = await chatwootApi.getInboxMembers(inboxId);
        console.log('Inbox members:', members);
        
        // Convert member IDs to strings and update selected agents
        const memberIds = members.map(member => member.id.toString());
        console.log('Member IDs:', memberIds);
        onAgentsChange(memberIds);
        
      } catch (err) {
        console.error('Failed to fetch inbox members:', err);
        setError('Failed to load inbox members. Please try again.');
      }
    };

    if (inboxId && availableAgents.length > 0) {
      fetchInboxMembers();
    }
  }, [inboxId, availableAgents, onAgentsChange]);

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
    const agent = availableAgents.find(a => a.id === agentId);
    return agent?.name || agentId;
  };

  const getAvailableAgents = () => {
    return availableAgents.filter(agent => !selectedAgents.includes(agent.id));
  };

  const handleSave = async () => {
    if (!inboxId) {
      console.error('No inbox ID provided');
      return;
    }

    try {
      // Convert string IDs to numbers for the API call
      const userIds = selectedAgents.map(id => parseInt(id, 10));
      
      console.log('Updating inbox members:', { inboxId, userIds });
      
      // Update inbox members
      await chatwootApi.updateInboxMembers(inboxId, userIds);
      
      // Fetch updated inbox members
      const updatedMembers = await chatwootApi.getInboxMembers(inboxId);
      console.log('Updated inbox members:', updatedMembers);
      
      // Update the selected agents with the fresh data
      const memberIds = updatedMembers.map(member => member.id.toString());
      onAgentsChange(memberIds);
      
      // Call the original onSave callback
      onSave();
      
    } catch (error) {
      console.error('Failed to update inbox members:', error);
      setError('Failed to update inbox members. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <Label>Agents</Label>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Loading agents...
          </p>
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div>
          <Label>Agents</Label>
          <p className="text-sm text-red-600 mb-3">
            {error}
          </p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            size="sm"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  console.log('Available agents for dropdown:', getAvailableAgents());
  console.log('Selected agents:', selectedAgents);

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
              {getAvailableAgents().length > 0 ? (
                getAvailableAgents().map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name} {agent.email && `(${agent.email})`}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-agents" disabled>
                  No agents available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleAddAgent} 
            disabled={!selectedAgentId || selectedAgentId === 'no-agents'}
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

      <Button onClick={handleSave} disabled={saving}>
        {saving ? 'Updating...' : 'Update'}
      </Button>
    </div>
  );
};

export default AgentSelector;
