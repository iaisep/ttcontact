
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { KnowledgeBaseSource } from '../types';

interface SourceDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: KnowledgeBaseSource | null;
  onConfirm: () => Promise<void>;
}

const SourceDeleteDialog: React.FC<SourceDeleteDialogProps> = ({
  open,
  onOpenChange,
  source,
  onConfirm
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
    } catch (error) {
      console.error('Error deleting source:', error);
    } finally {
      setIsDeleting(false);
      // Ensure dialog closes after deletion attempt, regardless of success/failure
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Source</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{source?.title}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-destructive text-destructive-foreground"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SourceDeleteDialog;
