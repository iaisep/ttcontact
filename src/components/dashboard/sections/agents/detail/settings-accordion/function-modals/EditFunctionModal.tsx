
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { EditFunctionModalProps } from './types';
import FunctionForm from './components/FunctionForm';
import { useFunctionForm } from './hooks/useFunctionForm';

export const EditFunctionModal: React.FC<EditFunctionModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpdate, 
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

  // Reset form data when modal opens with new data or closes
  useEffect(() => {
    if (!isOpen) {
      // Only reset when closed to prevent issues during unmounting
      resetForm();
    }
  }, [isOpen, resetForm]);

  // Handle form submission
  const handleSubmit = () => {
    if (!validate()) return;
    
    const updatedFunction = buildFunctionObject();
    
    // First close the modal
    onClose();
    
    // Then update the function after a short delay
    window.setTimeout(() => {
      onUpdate(updatedFunction);
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
            <Edit className="h-5 w-5 mr-2" />
            Edit Function
          </DialogTitle>
          <DialogDescription>
            Update the function configuration for your agent.
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
            Update Function
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
