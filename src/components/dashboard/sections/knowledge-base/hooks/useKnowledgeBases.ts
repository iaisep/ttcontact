
import { useState, useEffect } from 'react';
import { KnowledgeBase } from '../types';
import { useKnowledgeBaseApi } from './api/useKnowledgeBaseApi';
import { usePaginationAndFiltering } from './usePaginationAndFiltering';

export const useKnowledgeBases = () => {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  
  const {
    loading,
    setLoading,
    fetchKnowledgeBases: apiFetchKnowledgeBases,
    fetchAgents: apiFetchAgents,
    createKnowledgeBase: apiCreateKnowledgeBase,
    updateKnowledgeBase: apiUpdateKnowledgeBase,
    deleteKnowledgeBase: apiDeleteKnowledgeBase
  } = useKnowledgeBaseApi();

  const {
    currentPage,
    pageSize,
    searchQuery,
    filteredKnowledgeBases,
    paginatedKnowledgeBases,
    setCurrentPage,
    setPageSize,
    setSearchQuery
  } = usePaginationAndFiltering(knowledgeBases);

  useEffect(() => {
    fetchKnowledgeBases();
    fetchAgents();
  }, []);

  const fetchKnowledgeBases = async () => {
    const data = await apiFetchKnowledgeBases();
    setKnowledgeBases(data);
  };

  const fetchAgents = async () => {
    const data = await apiFetchAgents();
    setAgents(data);
  };

  const createKnowledgeBase = async (name: string) => {
    const newKb = await apiCreateKnowledgeBase(name);
    setKnowledgeBases([...knowledgeBases, newKb]);
    return newKb;
  };

  const updateKnowledgeBase = async (kb: KnowledgeBase) => {
    const updatedKb = await apiUpdateKnowledgeBase(kb);
    setKnowledgeBases(knowledgeBases.map(item => 
      item.id === kb.id ? updatedKb : item
    ));
    return updatedKb;
  };

  const deleteKnowledgeBase = async (kbId: string) => {
    await apiDeleteKnowledgeBase(kbId);
    setKnowledgeBases(knowledgeBases.filter(kb => kb.id !== kbId));
  };

  return {
    knowledgeBases,
    setKnowledgeBases,
    loading,
    setLoading,
    currentPage,
    pageSize,
    searchQuery,
    agents,
    filteredKnowledgeBases,
    paginatedKnowledgeBases,
    setCurrentPage,
    setPageSize,
    setSearchQuery,
    fetchKnowledgeBases,
    createKnowledgeBase,
    updateKnowledgeBase,
    deleteKnowledgeBase
  };
};
