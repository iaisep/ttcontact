
import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Pencil, Trash2, Search, Filter, FileUp } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { PaginationControls } from '@/components/ui/pagination';

interface Agent {
  agent_id: string;
  name: string;
  agent_type: string;
  voice_id: string;
  folder?: string;
  last_modification_timestamp: string;
  updated_at: string;
}

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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchAgents();
  }, []);

  // Reset to first page when search query, folder filter, or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, folderFilter, pageSize]);

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

  // Get paginated data
  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Agents</h1>
        <Button onClick={handleCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Create Agent
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search agents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative w-64">
          <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <select
            className="w-full h-10 rounded-md border border-input bg-background px-8 py-2"
            value={folderFilter}
            onChange={(e) => setFolderFilter(e.target.value)}
          >
            <option value="">All Folders</option>
            {folders.map((folder) => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Folder</TableHead>
                  <TableHead>Voice ID</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAgents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No agents found. Create one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAgents.map((agent) => (
                    <TableRow key={agent.agent_id}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell>{agent.agent_type ? agent.agent_type.substring(0, 50) + '...' : '-'}</TableCell>
                      <TableCell>{agent.folder || '-'}</TableCell>
                      <TableCell>{agent.voice_id}</TableCell>
                      <TableCell>{new Date(agent.last_modification_timestamp).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(agent)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Agent</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the agent "{agent.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-destructive text-destructive-foreground"
                                  onClick={() => deleteAgent(agent.agent_id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredAgents.length > 0 && (
            <PaginationControls
              totalItems={filteredAgents.length}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[10, 25, 50]}
            />
          )}
        </>
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

interface AgentFormProps {
  agent: Agent | null;
  onSubmit: (data: any) => void;
}

const AgentForm: React.FC<AgentFormProps> = ({ agent, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: agent?.name || '',
      description: agent?.agent_type || '',
      voice_id: agent?.voice_id || 'eleven_labs_emily',
      folder: agent?.folder || '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register('name', { required: 'Name is required' })}
            placeholder="Agent name"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description', { required: 'Description is required' })}
            placeholder="Describe what this agent does"
            rows={3}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="voice_id">Voice ID</Label>
          <select
            id="voice_id"
            {...register('voice_id', { required: 'Voice ID is required' })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="eleven_labs_emily">Eleven Labs - Emily</option>
            <option value="eleven_labs_josh">Eleven Labs - Josh</option>
            <option value="eleven_labs_rachel">Eleven Labs - Rachel</option>
            <option value="eleven_labs_sam">Eleven Labs - Sam</option>
            <option value="deepgram_nova">Deepgram - Nova</option>
            <option value="deepgram_aura">Deepgram - Aura</option>
          </select>
          {errors.voice_id && (
            <p className="text-sm text-destructive">{errors.voice_id.message}</p>
          )}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="folder">Folder (Optional)</Label>
          <Input
            id="folder"
            {...register('folder')}
            placeholder="Optional folder to organize agents"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">{agent ? 'Update Agent' : 'Create Agent'}</Button>
      </DialogFooter>
    </form>
  );
};

export default AgentsSection;
