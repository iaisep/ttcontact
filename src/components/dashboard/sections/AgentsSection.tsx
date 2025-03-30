
import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import AgentsToolbar from './agents/AgentsToolbar';
import AgentsTable from './agents/AgentsTable';
import AgentForm from './agents/AgentForm';
import { Agent } from './agents/types';

const AgentsSection = () => {
  const { fetchWithAuth } = useApiContext();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [folderFilter, setFolderFilter] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const data = await fetchWithAuth('/list-agents');
      setAgents(data);
    } catch (error) {
      toast.error('Failed to fetch agents');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createAgent = async (formData: any) => {
    try {
      const newAgent = await fetchWithAuth('/agents', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setAgents([...agents, newAgent]);
      toast.success('Agent created successfully');
      setDialogOpen(false);
    } catch (error) {
      toast.error('Failed to create agent');
      console.error(error);
    }
  };

  const updateAgent = async (id: string, formData: any) => {
    try {
      const updatedAgent = await fetchWithAuth(`/update-agent/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(formData),
      });
      setAgents(agents.map(agent => agent.agent_id === id ? updatedAgent : agent));
      toast.success('Agent updated successfully');
      setDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update agent');
      console.error(error);
    }
  };

  const deleteAgent = async (id: string) => {
    try {
      await fetchWithAuth(`/agents/${id}`, {
        method: 'DELETE',
      });
      setAgents(agents.filter(agent => agent.agent_id !== id));
      toast.success('Agent deleted successfully');
    } catch (error) {
      toast.error('Failed to delete agent');
      console.error(error);
    }
  };

  const filteredAgents = agents.filter(agent => {
    // Safeguard against undefined properties
    const agentName = agent.name || '';
    const agentDescription = agent.agent_type || '';
    const agentFolder = agent.folder || '';
    
    const matchesSearch = agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agentDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = folderFilter ? agentFolder === folderFilter : true;
    return matchesSearch && matchesFolder;
  });

  const folders = [...new Set(agents.map(agent => agent.folder).filter(Boolean))];

  const handleCreateClick = () => {
    setIsCreating(true);
    setIsEditing(false);
    setCurrentAgent(null);
    setDialogOpen(true);
  };

  const handleEditClick = (agent: Agent) => {
    setIsEditing(true);
    setIsCreating(false);
    setCurrentAgent(agent);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <AgentsToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        folderFilter={folderFilter}
        setFolderFilter={setFolderFilter}
        folders={folders}
        onCreateClick={handleCreateClick}
      />

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <AgentsTable
          agents={filteredAgents}
          onEditAgent={handleEditClick}
          onDeleteAgent={deleteAgent}
          isLoading={loading}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{isCreating ? 'Create Agent' : 'Edit Agent'}</DialogTitle>
            <DialogDescription>
              {isCreating 
                ? 'Create a new AI voice agent to handle your calls.' 
                : 'Update your AI voice agent details.'}
            </DialogDescription>
          </DialogHeader>
          <AgentForm 
            agent={currentAgent} 
            onSubmit={isCreating ? createAgent : (data) => updateAgent(currentAgent!.agent_id, data)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentsSection;
