
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KnowledgeBase } from '../types';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

interface AddFileSourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (file: File) => Promise<KnowledgeBase>;
  currentKnowledgeBase: KnowledgeBase | null;
}

const AddFileSourceModal: React.FC<AddFileSourceModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  currentKnowledgeBase
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleReset = () => {
    setFile(null);
    setIsSubmitting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      handleReset();
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(file);
      handleReset();
      toast.success('File uploaded successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to upload file:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        if (!isSubmitting) { 
          onOpenChange(open);
          if (!open) handleReset();
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Upload a file to your knowledge base.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {currentKnowledgeBase && (
            <div className="text-sm text-muted-foreground mb-2">
              Uploading file to: <span className="font-medium">{currentKnowledgeBase.name}</span>
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="file">File</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Input
                ref={fileInputRef}
                id="file"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              {!file ? (
                <div className="flex flex-col items-center justify-center gap-2">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Select File
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOCX, CSV, TXT (100MB max)
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  >
                    Change
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              handleReset();
              onOpenChange(false);
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!file || isSubmitting}
          >
            {isSubmitting ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFileSourceModal;
