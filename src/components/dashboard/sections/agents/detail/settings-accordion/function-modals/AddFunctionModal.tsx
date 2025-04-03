
import React from 'react';
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
  } = useFunctionForm(functionData, isOpen);

  // Handle form submission
  const handleSubmit = () => {
    if (!validate()) return;
    
    const newFunction = buildFunctionObject();
    onClose();
    
    // Use setTimeout to ensure the modal has time to close
    // before triggering potentially heavy state updates
    setTimeout(() => {
      onAdd(newFunction);
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
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
          >
            Add Function
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
