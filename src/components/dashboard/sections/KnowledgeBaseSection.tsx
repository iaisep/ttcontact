
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
  DialogTitle 
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Pencil, Trash2, Search, BookText } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { PaginationControls } from '@/components/ui/pagination';

interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  agent_id?: string;
  created_at: string;
  updated_at: string;
}

const KnowledgeBaseSection = () => {
  const { fetchWithAuth } = useApiContext();
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<KnowledgeEntry | null>(null);
  const [agents, setAgents] = useState<any[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchEntries();
    fetchAgents();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const data = await fetchWithAuth('/knowledge-base');
      setEntries(data);
    } catch (error) {
      toast.error('Failed to fetch knowledge base entries');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const data = await fetchWithAuth('/agents');
      setAgents(data);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    }
  };

  const createEntry = async (formData: any) => {
    try {
      const newEntry = await fetchWithAuth('/knowledge-base', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setEntries([...entries, newEntry]);
      toast.success('Knowledge base entry created');
      setDialogOpen(false);
    } catch (error) {
      toast.error('Failed to create knowledge base entry');
      console.error(error);
    }
  };

  const updateEntry = async (id: string, formData: any) => {
    try {
      const updatedEntry = await fetchWithAuth(`/knowledge-base/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      setEntries(entries.map(entry => entry.id === id ? updatedEntry : entry));
      toast.success('Knowledge base entry updated');
      setDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update knowledge base entry');
      console.error(error);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      await fetchWithAuth(`/knowledge-base/${id}`, {
        method: 'DELETE',
      });
      setEntries(entries.filter(entry => entry.id !== id));
      toast.success('Knowledge base entry deleted');
    } catch (error) {
      toast.error('Failed to delete knowledge base entry');
      console.error(error);
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get paginated data
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset to first page when search query or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  const handleCreateClick = () => {
    setIsCreating(true);
    setCurrentEntry(null);
    setDialogOpen(true);
  };

  const handleEditClick = (entry: KnowledgeEntry) => {
    setIsCreating(false);
    setCurrentEntry(entry);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Knowledge Base</h1>
        <Button onClick={handleCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </div>

      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search knowledge base..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
                  <TableHead>Title</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <BookText className="h-8 w-8 text-muted-foreground" />
                        <p>No knowledge base entries found</p>
                        <Button variant="outline" size="sm" onClick={handleCreateClick}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Your First Entry
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.title}</TableCell>
                      <TableCell>
                        {entry.content.length > 100
                          ? `${entry.content.substring(0, 100)}...`
                          : entry.content}
                      </TableCell>
                      <TableCell>
                        {entry.agent_id
                          ? agents.find(a => a.id === entry.agent_id)?.name || entry.agent_id
                          : 'All Agents'}
                      </TableCell>
                      <TableCell>{new Date(entry.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(entry)}>
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
                                <AlertDialogTitle>Delete Entry</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{entry.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-destructive text-destructive-foreground"
                                  onClick={() => deleteEntry(entry.id)}
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
          
          {filteredEntries.length > 0 && (
            <PaginationControls
              totalItems={filteredEntries.length}
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
            <DialogTitle>{isCreating ? 'Add Knowledge Base Entry' : 'Edit Knowledge Base Entry'}</DialogTitle>
            <DialogDescription>
              {isCreating 
                ? 'Add information that your AI agents can reference during calls.' 
                : 'Update knowledge base entry information.'}
            </DialogDescription>
          </DialogHeader>
          <EntryForm 
            entry={currentEntry} 
            agents={agents}
            onSubmit={isCreating ? createEntry : (data) => updateEntry(currentEntry!.id, data)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface EntryFormProps {
  entry: KnowledgeEntry | null;
  agents: any[];
  onSubmit: (data: any) => void;
}

const EntryForm: React.FC<EntryFormProps> = ({ entry, agents, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: entry?.title || '',
      content: entry?.content || '',
      agent_id: entry?.agent_id || '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...register('title', { required: 'Title is required' })}
            placeholder="Entry title"
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            {...register('content', { required: 'Content is required' })}
            placeholder="Knowledge base content"
            rows={5}
          />
          {errors.content && (
            <p className="text-sm text-destructive">{errors.content.message}</p>
          )}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="agent_id">Agent (Optional)</Label>
          <select
            id="agent_id"
            {...register('agent_id')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="">All Agents</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
          <p className="text-sm text-muted-foreground">
            Leave empty to make this knowledge available to all agents
          </p>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">{entry ? 'Update Entry' : 'Add Entry'}</Button>
      </DialogFooter>
    </form>
  );
};

export default KnowledgeBaseSection;
