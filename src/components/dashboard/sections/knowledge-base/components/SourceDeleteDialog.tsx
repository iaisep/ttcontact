
import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { KnowledgeBaseSource, KnowledgeBase } from '../types';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

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
    if (!source) {
      console.error("Cannot delete source: Source is null");
      onOpenChange(false);
      return;
    }

    setIsDeleting(true);
    
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Delete operation timed out")), 8000)
    );

    try {
      await Promise.race([onConfirm(), timeoutPromise]);
      toast.success("Source deleted successfully");
      // Dispatch event to refresh KB list
      window.dispatchEvent(new CustomEvent("refreshKnowledgeBase"));
    } catch (error) {
      console.error("Error or timeout deleting source:", error);
      toast.error("Error deleting source. The UI will continue to function.");
    } finally {
      setIsDeleting(false);
      onOpenChange(false);
    }
  };

  // Prevent closing the dialog while deletion is in progress
  const handleOpenChange = (newOpen: boolean) => {
    if (isDeleting && !newOpen) {
      // Don't allow closing the dialog while deleting
      return;
    }
    onOpenChange(newOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <Trash2 className="h-5 w-5 mr-2 text-destructive" />
            Delete Source
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this source?
            {source && (
              <span className="block font-semibold mt-1">{source.title}</span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
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
