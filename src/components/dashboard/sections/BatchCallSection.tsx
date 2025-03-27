
import { useState } from 'react';
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, Phone, FileText, Play, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface BatchCall {
  id: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  total_calls: number;
  completed_calls: number;
  failed_calls: number;
  agent_id: string;
  created_at: string;
}

const BatchCallSection = () => {
  const { fetchWithAuth } = useApiContext();
  const [batches, setBatches] = useState<BatchCall[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [agents, setAgents] = useState<any[]>([]);
  const [uploadStep, setUploadStep] = useState(1);

  // Mock data for UI demonstration
  const mockBatches: BatchCall[] = [
    {
      id: '1',
      status: 'completed',
      total_calls: 50,
      completed_calls: 48,
      failed_calls: 2,
      agent_id: 'agent_1',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      status: 'in-progress',
      total_calls: 100,
      completed_calls: 45,
      failed_calls: 3,
      agent_id: 'agent_2',
      created_at: new Date().toISOString(),
    },
  ];

  const fetchAgents = async () => {
    try {
      const data = await fetchWithAuth('/agents');
      setAgents(data);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      // Mock data for UI demonstration
      setAgents([
        { id: 'agent_1', name: 'Sales Agent' },
        { id: 'agent_2', name: 'Support Agent' },
        { id: 'agent_3', name: 'Appointment Scheduler' },
      ]);
    }
  };

  // Use mock data for UI demonstration
  useState(() => {
    fetchAgents();
    setBatches(mockBatches);
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      
      // For CSV or JSON preview
      if (file.type === 'text/csv' || file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFilePreview(event.target?.result as string);
        };
        reader.readAsText(file);
      } else {
        toast.error('Please upload a CSV or JSON file');
        setUploadedFile(null);
      }
    }
  };

  const startBatchCall = async () => {
    if (!uploadedFile || !selectedAgent) {
      toast.error('Please select a file and an agent');
      return;
    }

    setLoading(true);
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('agent_id', selectedAgent);

      // In a real app, this would be the API call
      /*
      const newBatch = await fetchWithAuth('/batch-call', {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type when using FormData, browser will set it
        }
      });
      */

      // Mock success for UI demonstration
      const newBatch = {
        id: `batch_${Date.now()}`,
        status: 'pending',
        total_calls: Math.floor(Math.random() * 50) + 50,
        completed_calls: 0,
        failed_calls: 0,
        agent_id: selectedAgent,
        created_at: new Date().toISOString(),
      };

      setBatches([newBatch, ...batches]);
      toast.success('Batch call started successfully');
      
      // Reset form
      setUploadedFile(null);
      setFilePreview(null);
      setSelectedAgent('');
      setUploadStep(1);
    } catch (error) {
      toast.error('Failed to start batch call');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return (completed / total) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Batch Call</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Contacts</CardTitle>
              <CardDescription>
                Upload a CSV or JSON file with phone numbers to make batch calls.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadStep === 1 ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Upload your file</h3>
                    <p className="text-sm text-muted-foreground mb-4 text-center">
                      Drag and drop your CSV or JSON file, or click to browse
                    </p>
                    <Input
                      type="file"
                      accept=".csv,.json"
                      className="hidden"
                      id="file-upload"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="file-upload">
                      <Button asChild variant="outline">
                        <span>Browse Files</span>
                      </Button>
                    </label>
                  </div>
                  
                  {uploadedFile && (
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{uploadedFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(uploadedFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <Button onClick={() => setUploadStep(2)}>Continue</Button>
                      </div>
                      
                      {filePreview && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">File Preview:</h4>
                          <pre className="bg-card p-2 rounded text-xs overflow-auto max-h-40">
                            {filePreview.slice(0, 500)}
                            {filePreview.length > 500 && '...'}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">File Format Requirements:</h4>
                    <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                      <li>CSV: Include columns "phone", "name" (optional), "variables" (optional)</li>
                      <li>JSON: Array with objects containing "phone", "name" (optional), "variables" (optional)</li>
                      <li>Phone numbers should be in E.164 format (e.g., +1234567890)</li>
                      <li>Maximum file size: 10MB</li>
                    </ul>
                  </div>
                </div>
              ) : (
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
                    <Button variant="outline" onClick={() => setUploadStep(1)}>
                      Back
                    </Button>
                    <Button onClick={startBatchCall} disabled={!selectedAgent || loading}>
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
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Batch Call History</CardTitle>
              <CardDescription>
                View and manage your batch call campaigns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batches.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          <div className="flex flex-col items-center gap-2">
                            <Phone className="h-8 w-8 text-muted-foreground" />
                            <p>No batch calls found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      batches.map((batch) => {
                        const progressPercentage = getProgressPercentage(batch.completed_calls, batch.total_calls);
                        
                        return (
                          <TableRow key={batch.id}>
                            <TableCell>
                              {new Date(batch.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {agents.find(a => a.id === batch.agent_id)?.name || batch.agent_id}
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(batch.status)}`}>
                                {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center text-xs justify-between">
                                  <span>
                                    {batch.completed_calls} of {batch.total_calls} calls completed
                                  </span>
                                  <span>{progressPercentage.toFixed(0)}%</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${batch.status === 'failed' ? 'bg-destructive' : 'bg-primary'}`} 
                                    style={{ width: `${progressPercentage}%` }} 
                                  />
                                </div>
                                {batch.failed_calls > 0 && (
                                  <div className="flex items-center text-xs text-destructive">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    {batch.failed_calls} failed calls
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Batch Call Guide</CardTitle>
              <CardDescription>
                How to set up batch calls with your AI agents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 inline-flex items-center justify-center text-xs mr-2">1</span>
                  Prepare your contacts file
                </h4>
                <p className="text-sm text-muted-foreground pl-7">
                  Create a CSV or JSON file with phone numbers and optional variables for personalization.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium flex items-center">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 inline-flex items-center justify-center text-xs mr-2">2</span>
                  Select your AI agent
                </h4>
                <p className="text-sm text-muted-foreground pl-7">
                  Choose which agent will handle all calls in this batch.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium flex items-center">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 inline-flex items-center justify-center text-xs mr-2">3</span>
                  Start your batch
                </h4>
                <p className="text-sm text-muted-foreground pl-7">
                  Launch the batch and monitor progress in real-time.
                </p>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-2">Example CSV Format:</h4>
                <pre className="bg-muted p-2 rounded text-xs">
{`phone,name,variables
+14155552671,John Smith,{"company":"Acme Inc"}
+16505557812,Jane Doe,{"appointment":"3pm"}
+12125558901,Alex Wong,{"order_id":"ORD-12345"}`}
                </pre>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Example JSON Format:</h4>
                <pre className="bg-muted p-2 rounded text-xs overflow-auto">
{`[
  {
    "phone": "+14155552671",
    "name": "John Smith",
    "variables": {
      "company": "Acme Inc"
    }
  },
  {
    "phone": "+16505557812",
    "name": "Jane Doe",
    "variables": {
      "appointment": "3pm"
    }
  }
]`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BatchCallSection;
