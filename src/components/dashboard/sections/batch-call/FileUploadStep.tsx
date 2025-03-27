
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadStepProps {
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  filePreview: string | null;
  setFilePreview: (preview: string | null) => void;
  onContinue: () => void;
}

const FileUploadStep = ({
  uploadedFile,
  setUploadedFile,
  filePreview,
  setFilePreview,
  onContinue,
}: FileUploadStepProps) => {
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

  return (
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
            <Button onClick={onContinue}>Continue</Button>
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
  );
};

export default FileUploadStep;
