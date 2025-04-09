
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Upload, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  // Template CSV content
  const csvTemplateContent = `phone number,dynamic variable1,dynamic variable2
+14001231234,value1 (optional),value2 (optional),Only the phone number is required. Feel free to add or remove the other columns.,
,,
,,`;

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

  const downloadTemplate = () => {
    // Create a blob with the CSV content
    const blob = new Blob([csvTemplateContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'batch-call-template.csv';
    
    // Append to body, click to download, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Template downloaded successfully');
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center">
        <Upload className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Upload your file</h3>
        <p className="text-sm text-muted-foreground mb-6 text-center">
          Drag and drop your CSV or JSON file, or click to browse
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
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
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="mr-1" size={16} />
                  Download the template
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Download a CSV template for batch calls</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
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
