
import { useState, useEffect, useCallback } from 'react';
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
  const [isProcessing, setIsProcessing] = useState(false);

  const llmId = agent?.response_engine?.llm_id;

  // Fetch functions data
  const fetchFunctions = useCallback(async () => {
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
  }, [llmId, fetchWithAuth, t]);

  useEffect(() => {
    fetchFunctions();
  }, [fetchFunctions]);

  // Function to update LLM with modified functions
  const updateLLMFunctions = useCallback(async (updatedFunctions: AgentFunction[]) => {
    if (!llmId || isProcessing) return false;
    
    setIsProcessing(true);
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
      setIsProcessing(false);
    }
  }, [llmId, fetchWithAuth, t, isProcessing]);

  // Handle function edit
  const handleEditFunction = useCallback((func: AgentFunction) => {
    if (isProcessing) return;
    setSelectedFunction(func);
    setEditModalOpen(true);
  }, [isProcessing]);

  // Handle function delete 
  const handleDeleteFunction = useCallback((func: AgentFunction) => {
    if (isProcessing) return;
    setSelectedFunction(func);
    setDeleteDialogOpen(true);
  }, [isProcessing]);
  
  // Perform function delete
  const confirmDeleteFunction = useCallback(async () => {
    if (!selectedFunction || isProcessing) return;
    
    const updatedFunctions = functions.filter(f => f.name !== selectedFunction.name);
    await updateLLMFunctions(updatedFunctions);
  }, [selectedFunction, functions, updateLLMFunctions, isProcessing]);

  // Handle function update
  const handleUpdateFunction = useCallback(async (updatedFunction: AgentFunction) => {
    if (isProcessing) return;
    
    const updatedFunctions = functions.map(f => 
      f.name === selectedFunction?.name ? updatedFunction : f
    );
    
    await updateLLMFunctions(updatedFunctions);
  }, [functions, selectedFunction, updateLLMFunctions, isProcessing]);

  // Handle function add
  const handleAddFunction = useCallback(async (newFunction: AgentFunction) => {
    if (isProcessing) return;
    
    // Check if a function with this name already exists
    const existingFunction = functions.find(f => f.name === newFunction.name);
    
    if (existingFunction) {
      toast.error(t('function_name_already_exists'));
      return;
    }
    
    const updatedFunctions = [...functions, newFunction];
    await updateLLMFunctions(updatedFunctions);
  }, [functions, updateLLMFunctions, t, isProcessing]);

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
