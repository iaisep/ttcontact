
import React from 'react';
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
  } = useFunctionForm(functionData, isOpen);

  // Handle form submission
  const handleSubmit = () => {
    if (!validate()) return;
    
    const updatedFunction = buildFunctionObject();
    onClose();
    
    // Use setTimeout to ensure the modal has time to close
    // before triggering potentially heavy state updates
    setTimeout(() => {
      onUpdate(updatedFunction);
    }, 200);
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          onClose();
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
            Update this function's configuration.
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
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
          >
            Update Function
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
