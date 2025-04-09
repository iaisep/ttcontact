
import { useState, useEffect } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { BatchCall } from './types';
import FileUploadStep from './FileUploadStep';
import BatchCallGuide from './BatchCallGuide';

const BatchCallSection = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const startBatchCall = async () => {
    if (!uploadedFile) {
      toast.error('Please select a file');
      return;
    }

    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', uploadedFile);

      // Mock success for UI demonstration
      toast.success('Batch call started successfully');
      
      // Reset form
      setUploadedFile(null);
      setFilePreview(null);
      
      // Notify user that they can view the batch history in Analytics
      toast.info('You can view batch call history in the Analytics section');
    } catch (error) {
      toast.error('Failed to start batch call');
      console.error(error);
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
              <FileUploadStep 
                uploadedFile={uploadedFile}
                setUploadedFile={setUploadedFile}
                filePreview={filePreview}
                setFilePreview={setFilePreview}
                onContinue={startBatchCall}
              />
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
