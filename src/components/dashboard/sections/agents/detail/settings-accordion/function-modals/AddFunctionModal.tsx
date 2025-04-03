
import React, { useCallback, useState, useEffect } from 'react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnmounting, setIsUnmounting] = useState(false);

  // Use our custom hook to manage form state and validation
  const {
    formData,
    errors,
    handleChange,
    validate,
    buildFunctionObject,
    isCustomFunction,
    resetForm
  } = useFunctionForm(functionData, isOpen);

  // Reset the unmounting state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsUnmounting(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = useCallback(() => {
    if (isSubmitting || isUnmounting) return;
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // Build the function object from form data
    const newFunction = buildFunctionObject();
    
    // Mark as unmounting and close the modal
    setIsUnmounting(true);
    onClose();
    
    // Use requestAnimationFrame to ensure the modal has time to animate out
    // before triggering potentially heavy state updates
    requestAnimationFrame(() => {
      onAdd(newFunction);
      setIsSubmitting(false);
    });
  }, [isSubmitting, isUnmounting, validate, buildFunctionObject, onClose, onAdd]);

  // Handle clean close
  const handleCleanClose = useCallback(() => {
    if (isSubmitting || isUnmounting) return;
    
    setIsUnmounting(true);
    resetForm();
    onClose();
    
    // Reset state after animation completes
    const timer = setTimeout(() => {
      setIsUnmounting(false);
      setIsSubmitting(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [isSubmitting, isUnmounting, onClose, resetForm]);

  // Prevent rendering modal content when not open
  if (!isOpen) return null;

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open && !isSubmitting && !isUnmounting) {
          handleCleanClose();
        }
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
            disabled={isSubmitting || isUnmounting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || isUnmounting}
          >
            Add Function
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
