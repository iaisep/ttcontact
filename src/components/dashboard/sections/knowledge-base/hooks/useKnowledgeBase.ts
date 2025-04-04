import { useState, useEffect } from 'react';
import { useKnowledgeBaseApi } from './api/useKnowledgeBaseApi';
import { KnowledgeBase } from '../types';

export const useKnowledgeBase = () => {
  const {
    knowledgeBases,
    loading,
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
  } = useKnowledgeBases();

  // Function to add a source to a knowledge base
  const addSourceToKnowledgeBase = async (kbId, sourceType, sourceData) => {
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

  // Function to delete a source from a knowledge base
  const deleteSource = async (kbId, sourceId) => {
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

  // Function to resync a knowledge base
  const resyncKnowledgeBase = async (kbId) => {
    try {
      setLoading(true);
      // Assuming there's a specific API endpoint for resyncing a knowledge base
      // const updatedKb = await apiResyncKnowledgeBase(kbId); 
      // setKnowledgeBases((prev) =>
      //   prev.map((item) => (item.id === kb.id ? updatedKb : item))
      // );
      console.log(`Resyncing knowledge base: ${kb.name} (${kb.id})`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return kb;
    } finally {
      setLoading(false);
    }
  };

  // Function to check if a knowledge base has URL sources
  const hasUrlSources = (kb) => {
    return kb ? kb.sources.some(source => source.type === 'url') : false;
  };

  // Function to fetch the sitemap for a URL
  const fetchSitemap = async (url) => {
    try {
      setLoading(true);
      return await apiFetchSitemap(url);
    } finally {
      setLoading(false);
    }
  };

  return {
    knowledgeBases,
    loading,
    currentPage,
    pageSize,
    searchQuery,
    paginatedKnowledgeBases,
    filteredKnowledgeBases,
    setCurrentPage,
    setPageSize,
    setSearchQuery,
    createKnowledgeBase,
    updateKnowledgeBase,
    deleteKnowledgeBase,
    addSourceToKnowledgeBase,
    deleteSource,
    resyncKnowledgeBase,
    fetchKnowledgeBases,
    fetchSitemap,
    hasUrlSources
  };
};

// Import this at the top of the file
import { useKnowledgeBases } from './useKnowledgeBases';
