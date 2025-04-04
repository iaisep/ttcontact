
import { useKnowledgeBases } from './useKnowledgeBases';
import { useKnowledgeBaseSources } from './useKnowledgeBaseSources';
import { useKnowledgeBaseSync } from './useKnowledgeBaseSync';
import { usePaginationAndFiltering } from './usePaginationAndFiltering';

export const useKnowledgeBase = () => {
  const {
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
  } = useKnowledgeBases();

  const {
    addSourceToKnowledgeBase,
    deleteSource
  } = useKnowledgeBaseSources(knowledgeBases, setKnowledgeBases, setLoading);

  const {
    resyncKnowledgeBase,
    fetchSitemap,
    hasUrlSources
  } = useKnowledgeBaseSync(setLoading);

  return {
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
    deleteKnowledgeBase,
    addSourceToKnowledgeBase,
    deleteSource,
    resyncKnowledgeBase,
    fetchSitemap,
    hasUrlSources
  };
};
