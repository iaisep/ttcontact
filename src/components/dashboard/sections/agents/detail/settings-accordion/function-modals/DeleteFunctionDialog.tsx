
import React, { useCallback, useState, useEffect } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { DeleteFunctionDialogProps } from './types';

export const DeleteFunctionDialog: React.FC<DeleteFunctionDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  functionName,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUnmounting, setIsUnmounting] = useState(false);

  // Reset states when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsUnmounting(false);
      setIsDeleting(false);
    }
  }, [isOpen]);

  // Handle clean close
  const handleCleanClose = useCallback(() => {
    if (isDeleting || isUnmounting) return;
    
    setIsUnmounting(true);
    // Use setTimeout to allow time for animation
    setTimeout(() => {
      onClose();
      // Reset state after animation completes
      setTimeout(() => {
        setIsUnmounting(false);
        setIsDeleting(false);
      }, 100);
    }, 100);
  }, [isDeleting, isUnmounting, onClose]);

  // Handle confirm action
  const handleConfirm = useCallback(() => {
    if (isDeleting || isUnmounting) return;
    
    setIsDeleting(true);
    setIsUnmounting(true);
    // Use setTimeout to allow time for animation
    setTimeout(() => {
      onClose();
      // Use setTimeout to ensure the dialog has time to animate out
      // before triggering potentially heavy state updates
      setTimeout(() => {
        onConfirm();
        setIsDeleting(false);
      }, 100);
    }, 100);
  }, [isDeleting, isUnmounting, onClose, onConfirm]);

  // Prevent rendering content when not open
  if (!isOpen) return null;

  return (
    <AlertDialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open && !isDeleting && !isUnmounting) {
          handleCleanClose();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <Trash2 className="h-5 w-5 mr-2 text-destructive" />
            Delete Function
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the function "{functionName}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCleanClose();
            }}
            disabled={isDeleting || isUnmounting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting || isUnmounting}
            className="bg-destructive hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
