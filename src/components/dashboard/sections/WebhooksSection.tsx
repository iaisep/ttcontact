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
import { Loader2, Plus, Webhook, Trash2, RefreshCw, Check, X, Search } from 'lucide-react';
import { toast } from 'sonner';
import { PaginationControls } from '@/components/ui/pagination';

interface Webhook {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  created_at: string;
  last_triggered?: string;
}

const WebhooksSection = () => {
  const { fetchWithAuth } = useApiContext();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const mockWebhooks: Webhook[] = [
    {
      id: '1',
      url: 'https://example.com/webhook',
      events: ['call.started', 'call.ended', 'call.failed'],
      status: 'active',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      last_triggered: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: '2',
      url: 'https://api.myapp.com/retell-webhook',
      events: ['agent.created', 'agent.updated', 'agent.deleted'],
      status: 'active',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
      last_triggered: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      id: '3',
      url: 'https://dev.example.org/hooks/retell',
      events: ['call.transcription.available'],
      status: 'inactive',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
  ];

  const eventOptions = [
    { id: 'call.started', name: 'Call Started', description: 'Triggered when a call begins' },
    { id: 'call.ended', name: 'Call Ended', description: 'Triggered when a call completes successfully' },
    { id: 'call.failed', name: 'Call Failed', description: 'Triggered when a call fails' },
    { id: 'call.transcription.available', name: 'Transcription Available', description: 'Triggered when a call transcription is ready' },
    { id: 'agent.created', name: 'Agent Created', description: 'Triggered when a new agent is created' },
    { id: 'agent.updated', name: 'Agent Updated', description: 'Triggered when an agent is updated' },
    { id: 'agent.deleted', name: 'Agent Deleted', description: 'Triggered when an agent is deleted' },
  ];

  useEffect(() => {
    setWebhooks(mockWebhooks);
    setLoading(false);
  }, []);

  const fetchWebhooks = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWebhooks(mockWebhooks);
    } catch (error) {
      console.error('Failed to fetch webhooks:', error);
      toast.error('Failed to load webhooks');
    } finally {
      setLoading(false);
    }
  };

  const createWebhook = async () => {
    if (!newWebhookUrl.trim()) {
      toast.error('Please enter a webhook URL');
      return;
    }

    if (selectedEvents.length === 0) {
      toast.error('Please select at least one event');
      return;
    }

    try {
      const mockResponse = {
        id: 'new_' + Math.random().toString(36).substring(2, 9),
        url: newWebhookUrl,
        events: selectedEvents,
        status: 'active',
        created_at: new Date().toISOString(),
      };

      setWebhooks([...webhooks, mockResponse as Webhook]);
      
      setNewWebhookUrl('');
      setSelectedEvents([]);
      setDialogOpen(false);
      
      toast.success('Webhook created successfully');
    } catch (error) {
      console.error('Failed to create webhook:', error);
      toast.error('Failed to create webhook');
    }
  };

  const deleteWebhook = async (id: string) => {
    try {
      setWebhooks(webhooks.filter(webhook => webhook.id !== id));
      toast.success('Webhook deleted successfully');
    } catch (error) {
      console.error('Failed to delete webhook:', error);
      toast.error('Failed to delete webhook');
    }
  };

  const toggleWebhookStatus = async (id: string, currentStatus: 'active' | 'inactive') => {
    try {
      setWebhooks(webhooks.map(webhook => 
        webhook.id === id 
          ? { ...webhook, status: currentStatus === 'active' ? 'inactive' : 'active' } 
          : webhook
      ));
      
      toast.success(`Webhook ${currentStatus === 'active' ? 'deactivated' : 'activated'}`);
    } catch (error) {
      console.error('Failed to update webhook status:', error);
      toast.error('Failed to update webhook status');
    }
  };

  const testWebhook = async (id: string) => {
    try {
      toast.success('Test event sent to webhook');
    } catch (error) {
      console.error('Failed to test webhook:', error);
      toast.error('Failed to test webhook');
    }
  };

  const handleEventToggle = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const filteredWebhooks = webhooks.filter(webhook =>
    webhook.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    webhook.events.some(event => event.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const paginatedWebhooks = filteredWebhooks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Webhooks</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Webhook
        </Button>
      </div>

      <div className="border rounded-lg p-4 bg-muted/30">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-2 rounded">
            <Webhook className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Webhooks</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Webhooks allow your application to receive real-time notifications about events that happen in your Retell AI account.
              Configure webhooks to integrate with your systems and automate workflows.
            </p>
          </div>
        </div>
      </div>

      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search webhooks..."
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
          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">URL</TableHead>
                  <TableHead className="w-[25%]">Events</TableHead>
                  <TableHead className="w-[10%]">Status</TableHead>
                  <TableHead className="w-[10%]">Created</TableHead>
                  <TableHead className="w-[10%]">Last Triggered</TableHead>
                  <TableHead className="w-[5%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedWebhooks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Webhook className="h-8 w-8 text-muted-foreground" />
                        <p>No webhooks found</p>
                        <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Create Your First Webhook
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedWebhooks.map((webhook) => (
                    <TableRow key={webhook.id}>
                      <TableCell className="font-medium max-w-0">
                        <code className="text-xs bg-muted px-2 py-1 rounded whitespace-nowrap block overflow-hidden text-ellipsis">
                          {webhook.url}
                        </code>
                      </TableCell>
                      <TableCell className="max-w-0">
                        <div className="flex flex-wrap gap-1 overflow-hidden">
                          {webhook.events.map((eventId) => {
                            const event = eventOptions.find(e => e.id === eventId);
                            return (
                              <span 
                                key={eventId} 
                                className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full whitespace-nowrap"
                                title={event?.description}
                              >
                                {event?.name || eventId}
                              </span>
                            );
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span 
                          className={`px-2 py-1 rounded-full text-xs ${
                            webhook.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {webhook.status.charAt(0).toUpperCase() + webhook.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(webhook.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {webhook.last_triggered 
                          ? new Date(webhook.last_triggered).toLocaleDateString() 
                          : 'Never'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => testWebhook(webhook.id)}
                          >
                            Test
                          </Button>
                          <Button 
                            variant={webhook.status === 'active' ? 'outline' : 'default'} 
                            size="sm"
                            onClick={() => toggleWebhookStatus(webhook.id, webhook.status)}
                          >
                            {webhook.status === 'active' ? 'Deactivate' : 'Activate'}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Webhook</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this webhook? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-destructive text-destructive-foreground"
                                  onClick={() => deleteWebhook(webhook.id)}
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

          {filteredWebhooks.length > 0 && (
            <PaginationControls
              totalItems={filteredWebhooks.length}
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
            <DialogTitle>Create Webhook</DialogTitle>
            <DialogDescription>
              Create a new webhook to receive event notifications.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">Webhook URL</Label>
              <Input
                id="url"
                placeholder="https://example.com/webhook"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Enter the URL where we should send webhook events.
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label>Select Events</Label>
              <div className="border rounded-md divide-y max-h-64 overflow-y-auto">
                {eventOptions.map((event) => (
                  <div key={event.id} className="flex items-center p-3">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{event.name}</div>
                      <div className="text-xs text-muted-foreground">{event.description}</div>
                    </div>
                    <div>
                      <Button
                        variant={selectedEvents.includes(event.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleEventToggle(event.id)}
                      >
                        {selectedEvents.includes(event.id) ? (
                          <Check className="h-4 w-4 mr-1" />
                        ) : null}
                        {selectedEvents.includes(event.id) ? "Selected" : "Select"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Select which events should trigger this webhook.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createWebhook}>
              Create Webhook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebhooksSection;
