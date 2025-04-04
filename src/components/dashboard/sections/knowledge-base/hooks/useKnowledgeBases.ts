
import { useState, useEffect } from 'react';
import { useKnowledgeBaseApi } from './api/useKnowledgeBaseApi';
import { KnowledgeBase } from '../types';

export const useKnowledgeBases = () => {
  const {
    loading: apiLoading,
    fetchKnowledgeBases: apiFetchKnowledgeBases,
    createKnowledgeBase: apiCreateKnowledgeBase,
    updateKnowledgeBase: apiUpdateKnowledgeBase,
    deleteKnowledgeBase: apiDeleteKnowledgeBase,
    setLoading: apiSetLoading,
  } = useKnowledgeBaseApi();

  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(apiLoading);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [agents, setAgents] = useState([]);

  // Update loading state when the API loading state changes
  useEffect(() => {
    setLoading(apiLoading);
  }, [apiLoading]);

  // Filtered knowledge bases based on search query
  const filteredKnowledgeBases = knowledgeBases.filter(kb => 
    searchQuery ? kb.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  // Paginated knowledge bases
  const paginatedKnowledgeBases = filteredKnowledgeBases.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const fetchKnowledgeBases = async () => {
    try {
      setLoading(true);
      const data = await apiFetchKnowledgeBases();
      setKnowledgeBases(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  // Update the createKnowledgeBase function to accept either a string or an object parameter
  const createKnowledgeBase = async (
    nameOrData: string | { name: string; urls?: string[]; autoSync?: boolean }
  ) => {
    try {
      setLoading(true);
      
      // Pass parameters in the format that apiCreateKnowledgeBase expects
      const newKb = await apiCreateKnowledgeBase(nameOrData);
      
      setKnowledgeBases((prev) => [...prev, newKb]);
      return newKb;
    } finally {
      setLoading(false);
    }
  };

  const updateKnowledgeBase = async (updatedKb: KnowledgeBase) => {
    try {
      setLoading(true);
      const result = await apiUpdateKnowledgeBase(updatedKb);
      
      setKnowledgeBases((prev) =>
        prev.map((kb) => (kb.id === updatedKb.id ? result : kb))
      );
      
      return result;
    } finally {
      setLoading(false);
    }
  };

  const deleteKnowledgeBase = async (kbId: string) => {
    try {
      setLoading(true);
      await apiDeleteKnowledgeBase(kbId);
      setKnowledgeBases((prev) => prev.filter((kb) => kb.id !== kbId));
    } finally {
      setLoading(false);
    }
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
