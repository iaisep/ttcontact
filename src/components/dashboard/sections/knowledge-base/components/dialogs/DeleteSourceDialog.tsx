
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
import { KnowledgeBaseSource, KnowledgeBase } from '../../types';

interface DeleteSourceDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<KnowledgeBase>;
  source: KnowledgeBaseSource | null;
}

const DeleteSourceDialog: React.FC<DeleteSourceDialogProps> = ({
  open,
  onClose,
  onConfirm,
  source,
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
    } catch (error) {
      console.error('Error deleting source:', error);
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Source</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this source?
            {source && <div className="font-semibold mt-1">{source.type === 'url' ? source.url : source.file_name}</div>}
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

export default DeleteSourceDialog;
