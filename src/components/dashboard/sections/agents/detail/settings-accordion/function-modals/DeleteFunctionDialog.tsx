
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
import { Trash2 } from 'lucide-react';

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
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <Trash2 className="h-5 w-5 mr-2 text-red-500" />
            Delete Function
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the function <span className="font-semibold">{functionName}</span>? 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
