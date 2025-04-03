
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

interface DeleteFunctionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  functionName: string;
}

export const DeleteFunctionDialog: React.FC<DeleteFunctionDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  functionName,
}) => {
  // Safely handle confirmation with clean modal closure
  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Close first to ensure UI stays responsive
    onClose();
    
    // Small delay to ensure UI has time to update
    window.setTimeout(() => {
      onConfirm();
    }, 100);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Function</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the function "{functionName}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
