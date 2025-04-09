
import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { BatchCall, Agent } from './types';
import FileUploadStep from './FileUploadStep';
import AgentSelectionStep from './AgentSelectionStep';
import BatchCallGuide from './BatchCallGuide';

const BatchCallSection = () => {
  const { fetchWithAuth } = useApiContext();
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [uploadStep, setUploadStep] = useState(1);

  const fetchAgents = async () => {
    try {
      const data = await fetchWithAuth('/agents');
      setAgents(data);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      // Mock data for UI demonstration
      setAgents([
        { id: 'agent_1', name: 'Sales Agent', agent_id: 'agent_1', voice_id: 'voice_1', agent_type: 'sales', last_modification_timestamp: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 'agent_2', name: 'Support Agent', agent_id: 'agent_2', voice_id: 'voice_2', agent_type: 'support', last_modification_timestamp: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 'agent_3', name: 'Appointment Scheduler', agent_id: 'agent_3', voice_id: 'voice_3', agent_type: 'scheduler', last_modification_timestamp: new Date().toISOString(), updated_at: new Date().toISOString() },
      ]);
    }
  };

  // Use mock data for UI demonstration
  useEffect(() => {
    fetchAgents();
  }, []);

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
      toast.success('Batch call started successfully');
      
      // Reset form
      setUploadedFile(null);
      setFilePreview(null);
      setSelectedAgent('');
      setUploadStep(1);
      
      // Notify user that they can view the batch history in Analytics
      toast.info('You can view batch call history in the Analytics section');
    } catch (error) {
      toast.error('Failed to start batch call');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Batch Call</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload Contacts</CardTitle>
              <CardDescription>
                Upload a CSV or JSON file with phone numbers to make batch calls.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadStep === 1 ? (
                <FileUploadStep 
                  uploadedFile={uploadedFile}
                  setUploadedFile={setUploadedFile}
                  filePreview={filePreview}
                  setFilePreview={setFilePreview}
                  onContinue={() => setUploadStep(2)}
                />
              ) : (
                <AgentSelectionStep 
                  agents={agents}
                  selectedAgent={selectedAgent}
                  setSelectedAgent={setSelectedAgent}
                  onBack={() => setUploadStep(1)}
                  onStartBatch={startBatchCall}
                  loading={loading}
                />
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <BatchCallGuide />
        </div>
      </div>
    </div>
  );
};

export default BatchCallSection;
