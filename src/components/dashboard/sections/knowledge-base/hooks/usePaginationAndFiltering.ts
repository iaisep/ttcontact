
import { useState, useEffect } from 'react';
import { KnowledgeBase } from '../types';

export const usePaginationAndFiltering = (knowledgeBases: KnowledgeBase[]) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Reset to first page when search query or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  // Safe filtering for knowledgebases with potentially undefined name
  const filteredKnowledgeBases = knowledgeBases.filter(kb =>
    kb.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
  );

  const paginatedKnowledgeBases = filteredKnowledgeBases.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return {
    currentPage,
    pageSize,
    searchQuery,
    filteredKnowledgeBases,
    paginatedKnowledgeBases,
    setCurrentPage,
    setPageSize,
    setSearchQuery
  };
};
