
import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { AgentFunction } from './types';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';

export const useFunctions = (agent: RetellAgent) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [functions, setFunctions] = useState<AgentFunction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState<AgentFunction | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const llmId = agent?.response_engine?.llm_id;

  // Fetch functions data
  const fetchFunctions = async () => {
    if (!llmId) return;
    
    setIsLoading(true);
    try {
      const response = await fetchWithAuth(`/get-retell-llm/${llmId}`);
      if (response && response.general_tools) {
        setFunctions(response.general_tools);
      }
    } catch (error) {
      console.error('Error fetching LLM functions:', error);
      toast.error(t('error_fetching_functions'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFunctions();
  }, [llmId]);

  // Function to update LLM with modified functions
  const updateLLMFunctions = async (updatedFunctions: AgentFunction[]) => {
    if (!llmId) return false;
    
    setIsLoading(true);
    try {
      await fetchWithAuth(`/update-retell-llm/${llmId}`, {
        method: 'PATCH',
        body: JSON.stringify({ general_tools: updatedFunctions })
      });
      
      setFunctions(updatedFunctions);
      toast.success(t('functions_updated_successfully'));
      return true;
    } catch (error) {
      console.error('Error updating LLM functions:', error);
      toast.error(t('error_updating_functions'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle function edit
  const handleEditFunction = (func: AgentFunction) => {
    setSelectedFunction(func);
    setEditModalOpen(true);
  };

  // Handle function delete 
  const handleDeleteFunction = (func: AgentFunction) => {
    setSelectedFunction(func);
    setDeleteDialogOpen(true);
  };
  
  // Perform function delete
  const confirmDeleteFunction = async () => {
    if (!selectedFunction) return;
    
    const updatedFunctions = functions.filter(f => f.name !== selectedFunction.name);
    const success = await updateLLMFunctions(updatedFunctions);
    
    if (success) {
      setDeleteDialogOpen(false);
      setSelectedFunction(null);
    }
  };

  // Handle function update
  const handleUpdateFunction = async (updatedFunction: AgentFunction) => {
    const updatedFunctions = functions.map(f => 
      f.name === selectedFunction?.name ? updatedFunction : f
    );
    
    const success = await updateLLMFunctions(updatedFunctions);
    if (success) {
      setEditModalOpen(false);
      setSelectedFunction(null);
    }
  };

  // Handle function add
  const handleAddFunction = async (newFunction: AgentFunction) => {
    const updatedFunctions = [...functions, newFunction];
    const success = await updateLLMFunctions(updatedFunctions);
    
    if (success) {
      setAddModalOpen(false);
    }
  };

  return {
    functions,
    isLoading,
    selectedFunction,
    editModalOpen,
    addModalOpen,
    deleteDialogOpen,
    setEditModalOpen,
    setAddModalOpen,
    setDeleteDialogOpen,
    setSelectedFunction,
    handleEditFunction,
    handleDeleteFunction,
    handleUpdateFunction,
    handleAddFunction,
    confirmDeleteFunction
  };
};
