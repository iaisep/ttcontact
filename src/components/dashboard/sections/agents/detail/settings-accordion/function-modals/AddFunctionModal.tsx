
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FunctionForm } from './components';
import { AddFunctionModalProps } from './types';
import { useFunctionForm } from './hooks/useFunctionForm';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';

const AddFunctionModal: React.FC<AddFunctionModalProps> = ({ isOpen, onClose, onAdd, functionData }) => {
  const { formData, errors, handleChange, validate, buildFunctionObject, isCustomFunction, resetForm } = useFunctionForm(functionData, isOpen);
  const { fetchWithAuth } = useApiContext();

  const handleAddFunction = async () => {
    if (validate()) {
      try {
        const newFunction = buildFunctionObject();
        
        // If we're within an agent edit context, also update the agent's functions on the server
        if (window.location.pathname.includes('/agentes/')) {
          const agentId = window.location.pathname.split('/').pop();
          if (agentId && agentId.startsWith('agent_')) {
            const llmId = `llm_${agentId.substring(6)}`; // Convert agent_XXX to llm_XXX
            
            // Fetch current agent data to get all functions
            const llmData = await fetchWithAuth(`/get-retell-llm/${llmId}`);
            
            // Get existing functions from the LLM (general_tools)
            const currentFunctions = llmData.general_tools || [];
            
            // Add the new function to the existing functions
            const updatedFunctions = [...currentFunctions, newFunction];
            
            // Update the LLM with the new functions array using the correct endpoint
            await fetchWithAuth(`/update-retell-llm/${llmId}`, {
              method: 'PATCH',
              body: JSON.stringify({
                general_tools: updatedFunctions
              })
            });
            
            toast.success('Function added successfully');
          }
        }
        
        onAdd(newFunction);
        resetForm();
        onClose();
      } catch (error) {
        console.error('Error adding function:', error);
        toast.error('Failed to add function');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isCustomFunction ? 'Custom Function' : 'Add Function'}</DialogTitle>
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
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFunctionModal;
