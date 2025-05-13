
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FunctionForm } from './components';
import { AddFunctionModalProps } from './types';
import { useFunctionForm } from './hooks/useFunctionForm';

const AddFunctionModal: React.FC<AddFunctionModalProps> = ({ isOpen, onClose, onAdd, functionData }) => {
  const { formData, errors, handleChange, validate, buildFunctionObject, isCustomFunction, resetForm } = useFunctionForm(functionData, isOpen);

  const handleAddFunction = () => {
    if (validate()) {
      const newFunction = buildFunctionObject();
      onAdd(newFunction);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Function</DialogTitle>
        </DialogHeader>
        
        <FunctionForm 
          formData={formData}
          errors={errors}
          onChange={handleChange}
          isCustomFunction={isCustomFunction}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleAddFunction}>
            Add Function
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFunctionModal;
