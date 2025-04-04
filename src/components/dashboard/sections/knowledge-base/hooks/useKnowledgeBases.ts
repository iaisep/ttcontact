
import { useState } from 'react';
import { useKnowledgeBaseApi } from './api/useKnowledgeBaseApi';
import { KnowledgeBase } from '../types';

export const useKnowledgeBases = () => {
  const {
    loading,
    fetchKnowledgeBases,
    createKnowledgeBase: apiCreateKnowledgeBase,
    updateKnowledgeBase: apiUpdateKnowledgeBase,
    deleteKnowledgeBase: apiDeleteKnowledgeBase,
  } = useKnowledgeBaseApi();

  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);

  const fetchAll = async () => {
    const data = await fetchKnowledgeBases();
    setKnowledgeBases(data);
    return data;
  };

  const createKnowledgeBase = async (name: string, urls: string[] = [], autoSync: boolean = false) => {
    // Using the updated API function with a single object parameter
    const newKb = await apiCreateKnowledgeBase({ 
      name, 
      urls, 
      autoSync 
    });
    
    setKnowledgeBases((prev) => [...prev, newKb]);
    return newKb;
  };

  const updateKnowledgeBase = async (updatedKb: KnowledgeBase) => {
    const result = await apiUpdateKnowledgeBase(updatedKb);
    
    setKnowledgeBases((prev) =>
      prev.map((kb) => (kb.id === updatedKb.id ? result : kb))
    );
    
    return result;
  };

  const deleteKnowledgeBase = async (kbId: string) => {
    await apiDeleteKnowledgeBase(kbId);
    setKnowledgeBases((prev) => prev.filter((kb) => kb.id !== kbId));
  };

  return {
    loading,
    knowledgeBases,
    fetchKnowledgeBases: fetchAll,
    createKnowledgeBase,
    updateKnowledgeBase,
    deleteKnowledgeBase,
  };
};
