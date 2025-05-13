
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FunctionForm } from './components';
import { EditFunctionModalProps } from './types';
import { useFunctionForm } from './hooks/useFunctionForm';

const EditFunctionModal: React.FC<EditFunctionModalProps> = ({ isOpen, onClose, onSave, functionData }) => {
  const { formData, errors, handleChange, validate, buildFunctionObject, isCustomFunction } = useFunctionForm(functionData, isOpen);

  const handleUpdateFunction = () => {
    if (validate()) {
      const updatedFunction = buildFunctionObject();
      
      // Preserve the ID if it exists
      if (functionData && functionData.id) {
        updatedFunction.id = functionData.id;
      }
      
      onSave(updatedFunction);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Function</DialogTitle>
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
          <Button type="button" onClick={handleUpdateFunction}>
            Update Function
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditFunctionModal;
