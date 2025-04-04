import { useState, useEffect } from 'react';
import { useKnowledgeBaseApi } from './api/useKnowledgeBaseApi';
import { KnowledgeBase, WebPage } from '../types';

export const useKnowledgeBase = () => {
  const {
    loading: apiLoading,
    fetchKnowledgeBases: apiFetchKnowledgeBases,
    fetchAgents: apiFetchAgents,
    createKnowledgeBase: apiCreateKnowledgeBase,
    updateKnowledgeBase: apiUpdateKnowledgeBase,
    deleteKnowledgeBase: apiDeleteKnowledgeBase,
    addSourceToKnowledgeBase: apiAddSourceToKnowledgeBase,
    deleteSource: apiDeleteSource,
    fetchSitemap: apiFetchSitemap,
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

  const fetchSitemap = async (url: string): Promise<WebPage[]> => {
    try {
      setLoading(true);
      return await apiFetchSitemap(url);
    } finally {
      setLoading(false);
    }
  };

  const createKnowledgeBase = async (name: string, urls: string[] = [], autoSync: boolean = false) => {
    try {
      setLoading(true);
      const newKb = await apiCreateKnowledgeBase({ name, urls, autoSync });
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

  const addSourceToKnowledgeBase = async (
    kbId: string,
    sourceType: 'url' | 'file' | 'text',
    sourceData: any
  ) => {
    try {
      setLoading(true);
      const updatedKb = await apiAddSourceToKnowledgeBase(kbId, sourceType, sourceData);
      setKnowledgeBases((prev) =>
        prev.map((kb) => (kb.id === kbId ? updatedKb : kb))
      );
      return updatedKb;
    } finally {
      setLoading(false);
    }
  };

  const deleteSource = async (kbId: string, sourceId: string) => {
    try {
      setLoading(true);
      const updatedKb = await apiDeleteSource(kbId, sourceId);
      setKnowledgeBases((prev) =>
        prev.map((kb) => (kb.id === kbId ? updatedKb : kb))
      );
      return updatedKb;
    } finally {
      setLoading(false);
    }
  };

  const resyncKnowledgeBase = async (kbId: string) => {
    try {
      setLoading(true);
      // Assuming there's a specific API endpoint for resyncing a knowledge base
      // You might need to adjust the endpoint and method accordingly
      // const updatedKb = await apiResyncKnowledgeBase(kbId); 
      // setKnowledgeBases((prev) =>
      //   prev.map((kb) => (kb.id === kbId ? updatedKb : kb))
      // );
      // return updatedKb;
      console.log(`Resyncing knowledge base with ID: ${kbId}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false);
      return knowledgeBases.find(kb => kb.id === kbId);
    } catch (error) {
      console.error('Error resyncing knowledge base:', error);
      setLoading(false);
      throw error;
    }
  };

  const hasUrlSources = (kbId: string): boolean => {
    const kb = knowledgeBases.find(kb => kb.id === kbId);
    return kb ? kb.sources.some(source => source.type === 'url') : false;
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
    fetchSitemap,
    createKnowledgeBase,
    updateKnowledgeBase,
    deleteKnowledgeBase,
    addSourceToKnowledgeBase,
    deleteSource,
    resyncKnowledgeBase,
    hasUrlSources
  };
};
