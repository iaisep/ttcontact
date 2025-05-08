
import React, { useEffect } from 'react';
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
  // Use our custom hook to manage form state and validation
  const {
    formData,
    errors,
    handleChange,
    validate,
    buildFunctionObject,
    isCustomFunction,
    resetForm
  } = useFunctionForm(functionData);

  // Reset form data when modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      // Only reset when closed to prevent issues during unmounting
      resetForm();
    }
  }, [isOpen, resetForm]);

  // Handle form submission
  const handleSubmit = () => {
    if (!validate()) return;
    
    const newFunction = buildFunctionObject();
    
    // First close the modal
    onClose();
    
    // Then add the function after a short delay
    window.setTimeout(() => {
      onAdd(newFunction);
    }, 50);
  };

  // Handle close safely
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
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
            onClick={handleClose}
            type="button"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            type="button"
          >
            Add Function
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
