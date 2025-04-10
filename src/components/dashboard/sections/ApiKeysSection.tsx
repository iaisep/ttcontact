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
import { Loader2, Plus, Key, Copy, RefreshCw, Eye, EyeOff, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  created_at: string;
  last_used?: string;
}

const ApiKeysSection = () => {
  const { fetchWithAuth } = useApiContext();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newApiKeyName, setNewApiKeyName] = useState('');
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [showNewApiKey, setShowNewApiKey] = useState(false);

  // Mock data for UI demonstration
  const mockApiKeys: ApiKey[] = [
    {
      id: '1',
      name: 'Production API Key',
      prefix: 'ak_prod_',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      last_used: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: '2',
      name: 'Development API Key',
      prefix: 'ak_dev_',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
      last_used: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      id: '3',
      name: 'Testing API Key',
      prefix: 'ak_test_',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
  ];

  const [revealedApiKeys, setRevealedApiKeys] = useState<{ [key: string]: boolean }>({});

  const toggleApiKeyVisibility = (apiKeyId: string) => {
    setRevealedApiKeys(prev => ({
      ...prev,
      [apiKeyId]: !prev[apiKeyId]
    }));
  };

  // Use mock data for UI demonstration
  useEffect(() => {
    setApiKeys(mockApiKeys);
    setLoading(false);
  }, []);

  const fetchApiKeys = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from API
      // const data = await fetchWithAuth('/api-keys');
      
      // Using mock data for UI demonstration
      setApiKeys(mockApiKeys);
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
      toast.error('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newApiKeyName.trim()) {
      toast.error('Please enter a name for your API key');
      return;
    }

    try {
      // In a real app, this would be an API call
      /*
      const response = await fetchWithAuth('/api-keys', {
        method: 'POST',
        body: JSON.stringify({ name: newApiKeyName }),
      });
      */

      // Mock response for UI demonstration
      const prefix = 'ak_' + Math.random().toString(36).substring(2, 8) + '_';
      const newKey = prefix + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const mockResponse = {
        id: 'new_' + Math.random().toString(36).substring(2, 9),
        name: newApiKeyName,
        prefix: prefix,
        created_at: new Date().toISOString(),
        key: newKey, // This would be returned only once when creating
      };

      // Update UI with new key
      setApiKeys([...apiKeys, {
        id: mockResponse.id,
        name: mockResponse.name,
        prefix: mockResponse.prefix,
        created_at: mockResponse.created_at,
      }]);
      
      // Store the full key for display
      setNewApiKey(mockResponse.key);
      
      // Reset form
      setNewApiKeyName('');
      
      toast.success('API key created successfully');
    } catch (error) {
      console.error('Failed to create API key:', error);
      toast.error('Failed to create API key');
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      // In a real app, this would be an API call
      // await fetchWithAuth(`/api-keys/${id}`, { method: 'DELETE' });

      // Update UI by removing the deleted key
      setApiKeys(apiKeys.filter(key => key.id !== id));
      toast.success('API key deleted successfully');
    } catch (error) {
      console.error('Failed to delete API key:', error);
      toast.error('Failed to delete API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success('Copied to clipboard');
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast.error('Failed to copy to clipboard');
      }
    );
  };

  const handleCreateClick = () => {
    setNewApiKey(null);
    setNewApiKeyName('');
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">API Keys</h1>
        <Button onClick={handleCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Create API Key
        </Button>
      </div>

      <div className="border rounded-lg p-4 bg-muted/30">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-2 rounded">
            <Key className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">API Keys</h3>
            <p className="text-sm text-muted-foreground mt-1">
              API keys allow applications to authenticate with our API. Keep your API keys secure and never share them publicly.
              If you believe an API key has been compromised, you should revoke it immediately and create a new one.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Key className="h-8 w-8 text-muted-foreground" />
                      <p>No API keys found</p>
                      <Button variant="outline" size="sm" onClick={handleCreateClick}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First API Key
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium">{apiKey.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="bg-muted px-2 py-1 rounded">
                          {revealedApiKeys[apiKey.id] 
                            ? apiKey.prefix + '••••••••••••'
                            : apiKey.prefix + '••••••••••••'}
                        </code>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toggleApiKeyVisibility(apiKey.id)}
                          title={revealedApiKeys[apiKey.id] ? "Hide API key" : "Reveal API key"}
                        >
                          {revealedApiKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(apiKey.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {apiKey.last_used 
                        ? new Date(apiKey.last_used).toLocaleDateString() 
                        : 'Never used'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => copyToClipboard(`${apiKey.prefix}XXXXXXXXXXXX`)}
                        title="Copy API key prefix"
                      >
                        <Copy className="h-4 w-4" />
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
                            <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the API key "{apiKey.name}"? This action cannot be undone
                              and any applications using this key will no longer be able to access the API.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground"
                              onClick={() => deleteApiKey(apiKey.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>
              Create a new API key to authenticate with the Retell AI API.
            </DialogDescription>
          </DialogHeader>

          {newApiKey ? (
            <div className="space-y-4">
              <div className="rounded-md bg-amber-50 p-4 text-amber-700 border border-amber-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">Important: Save your API key</h3>
                    <div className="mt-2 text-sm">
                      <p>This is the only time your API key will be visible. Please save it in a secure location.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-md relative">
                <div className="flex justify-between items-center">
                  <Label htmlFor="api-key" className="sr-only">API Key</Label>
                  <div className="flex-1 font-mono text-sm break-all mr-8">
                    {showNewApiKey ? newApiKey : newApiKey!.replace(/(?<=^.{4}).*(?=.{4}$)/, '•'.repeat(newApiKey!.length - 8))}
                  </div>
                  <div className="absolute right-4 flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setShowNewApiKey(!showNewApiKey)}
                      title={showNewApiKey ? "Hide API key" : "Show API key"}
                    >
                      {showNewApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => copyToClipboard(newApiKey!)}
                      title="Copy API key"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setDialogOpen(false);
                    setNewApiKey(null);
                  }}
                >
                  Done
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">API Key Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Production API Key"
                    value={newApiKeyName}
                    onChange={(e) => setNewApiKeyName(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Give your API key a descriptive name to identify its purpose.
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={createApiKey}>
                  Create API Key
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApiKeysSection;
