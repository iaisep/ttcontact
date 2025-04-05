
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { KnowledgeBaseSource, KnowledgeBase } from '../types';

interface SourceDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: KnowledgeBaseSource | null;
  onConfirm: () => Promise<KnowledgeBase>;
}

const SourceDeleteDialog: React.FC<SourceDeleteDialogProps> = ({
  open,
  onOpenChange,
  source,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Reset state when dialog opens or closes
  React.useEffect(() => {
    if (!open) {
      setIsDeleting(false);
    }
  }, [open]);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      // Close dialog after successful deletion
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting source:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog 
      open={open} 
      onOpenChange={(open) => {
        if (!isDeleting) {
          onOpenChange(open);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Source</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this source?
            {source && <div className="font-semibold mt-1">{source.title}</div>}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isDeleting}
            className={isDeleting ? "opacity-50 cursor-not-allowed" : ""}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SourceDeleteDialog;
