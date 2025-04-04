
import React, { useState } from 'react';
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

interface AddTextSourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (fileName: string, content: string) => Promise<KnowledgeBase>;
}

const AddTextSourceModal: React.FC<AddTextSourceModalProps> = ({
  open,
  onOpenChange,
  onSubmit
}) => {
  const [fileName, setFileName] = useState('');
  const [content, setContent] = useState('');

  const handleReset = () => {
    setFileName('');
    setContent('');
  };

  const handleSubmit = async () => {
    if (!fileName || !content) return;
    
    try {
      await onSubmit(fileName, content);
      handleReset();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) handleReset();
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Text</DialogTitle>
          <DialogDescription>
            Add custom text content to your knowledge base.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
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
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!fileName || !content}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTextSourceModal;
