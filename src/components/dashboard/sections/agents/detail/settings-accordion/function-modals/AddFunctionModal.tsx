
import React, { useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddFunctionModalProps } from './types';
import FunctionForm from './components/FunctionForm';
import { useFunctionForm } from './hooks/useFunctionForm';

export const AddFunctionModal: React.FC<AddFunctionModalProps> = ({ 
  isOpen, 
  onClose, 
  onAdd, 
  functionData 
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isMountedRef = useRef(true);

  // Use our custom hook to manage form state and validation
  const {
    formData,
    errors,
    handleChange,
    validate,
    buildFunctionObject,
    isCustomFunction
  } = useFunctionForm(functionData, isOpen);

  // Update the mounted ref on cleanup
  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(() => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // Build the function object from form data
    const newFunction = buildFunctionObject();
    
    // First close the modal cleanly to prevent UI freezes
    onClose();
    
    // Use a small delay to ensure modal is unmounted before processing
    setTimeout(() => {
      // Only proceed if component is still mounted
      if (isMountedRef.current) {
        onAdd(newFunction);
      }
    }, 100);
  }, [isSubmitting, validate, buildFunctionObject, onClose, onAdd]);

  // Use a memoized close handler to avoid recreating it on each render
  const handleCleanClose = useCallback(() => {
    if (isSubmitting) return;
    onClose();
  }, [isSubmitting, onClose]);

  // Use useEffect for cleanup on unmount
  React.useEffect(() => {
    return () => {
      // Cleanup any pending state or operations when modal is closed
      setIsSubmitting(false);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open && !isSubmitting) handleCleanClose();
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add New Function
          </DialogTitle>
          <DialogDescription>
            Create a new function or tool for your agent to use during conversations.
          </DialogDescription>
        </DialogHeader>
        
        <FunctionForm 
          formData={formData}
          errors={errors}
          onChange={handleChange}
          isCustomFunction={isCustomFunction}
        />
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCleanClose();
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            Add Function
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
