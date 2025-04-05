
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
import { Label } from '@/components/ui/label';
import { File, X } from 'lucide-react';
import { KnowledgeBase } from '../types';
import { toast } from 'sonner';

interface AddFileSourceModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void; // Added onClose prop
  onSubmit: (file: File) => Promise<KnowledgeBase>;
  currentKnowledgeBase: KnowledgeBase | null;
}

const AddFileSourceModal: React.FC<AddFileSourceModalProps> = ({
  open,
  onOpenChange,
  onClose,
  onSubmit,
  currentKnowledgeBase
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = () => {
    setSelectedFile(null);
    setIsSubmitting(false);
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      handleReset();
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(selectedFile);
      handleReset();
      toast.success('File source added successfully');
      
      // Use onClose callback if provided
      if (onClose) {
        onClose();
      } else if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Failed to add file source:', error);
      toast.error('Failed to add file source');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle dialog open state changes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isSubmitting) {
      if (!isOpen && onClose) {
        onClose();
      }
      if (onOpenChange) {
        onOpenChange(isOpen);
      }
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Upload documents to add to your knowledge base.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {currentKnowledgeBase && (
            <div className="text-sm text-muted-foreground mb-2">
              Adding file to: <span className="font-medium">{currentKnowledgeBase.name}</span>
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="file">Select File</Label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6">
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                className="hidden"
              />
              {selectedFile ? (
                <div className="flex items-center gap-2">
                  <File className="h-5 w-5 text-blue-500" />
                  <span>{selectedFile.name}</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setSelectedFile(null)}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <File className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop a file here, or click to select
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => document.getElementById('file')?.click()}
                    disabled={isSubmitting}
                  >
                    Select File
                  </Button>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, DOCX, TXT, CSV (max 20MB)
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              handleReset();
              if (onClose) {
                onClose();
              } else if (onOpenChange) {
                onOpenChange(false);
              }
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleSubmit}
            disabled={!selectedFile || isSubmitting}
          >
            {isSubmitting ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFileSourceModal;
