
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
import { Textarea } from '@/components/ui/textarea';
import { KnowledgeBase } from '../types';
import { toast } from 'sonner';

interface AddTextSourceModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  onSubmit: (fileName: string, content: string) => Promise<KnowledgeBase>;
  currentKnowledgeBase: KnowledgeBase | null;
}

const AddTextSourceModal: React.FC<AddTextSourceModalProps> = ({
  open,
  onOpenChange,
  onClose,
  onSubmit,
  currentKnowledgeBase
}) => {
  const [fileName, setFileName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = () => {
    setFileName('');
    setContent('');
    setIsSubmitting(false);
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      handleReset();
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!fileName || !content) return;
    
    try {
      setIsSubmitting(true);
      console.log("Submitting text content:", { fileName, contentLength: content.length });
      
      // Solo validamos que exista una KB si no estamos en el proceso de creación
      // La creación de KB temporal se maneja en useKnowledgeBaseDialog
      await onSubmit(fileName, content);
      handleReset();
      toast.success('Text source added successfully');
      
      // Use onClose callback if provided
      if (onClose) {
        onClose();
      } else if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Failed to add text source:', error);
      toast.error('Failed to add text source');
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Text</DialogTitle>
          <DialogDescription>
            Add custom text content to your knowledge base.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {currentKnowledgeBase && (
            <div className="text-sm text-muted-foreground mb-2">
              Adding text to: <span className="font-medium">{currentKnowledgeBase.name}</span>
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="fileName">File Name</Label>
            <Input
              id="fileName"
              placeholder="e.g., Product FAQ"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="content">Text Content</Label>
            <Textarea
              id="content"
              placeholder="Enter your text content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
            />
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
            disabled={!fileName || !content || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTextSourceModal;
