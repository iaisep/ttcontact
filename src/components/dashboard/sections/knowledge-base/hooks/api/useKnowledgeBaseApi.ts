
import { useState } from 'react';
import { useKnowledgeBaseListApi } from './knowledge-base/useKnowledgeBaseListApi';
import { useKnowledgeBaseCreateApi } from './knowledge-base/useKnowledgeBaseCreateApi';
import { useKnowledgeBaseManageApi } from './knowledge-base/useKnowledgeBaseManageApi';
import { useSourceApi } from './knowledge-base/useSourceApi';
import { useSitemapApi } from './knowledge-base/useSitemapApi';

export const useKnowledgeBaseApi = () => {
  const [loading, setLoading] = useState(false);
  
  const {
    fetchKnowledgeBases,
    fetchAgents
  } = useKnowledgeBaseListApi();
  
  const {
    createKnowledgeBase
  } = useKnowledgeBaseCreateApi();
  
  const {
    updateKnowledgeBase,
    deleteKnowledgeBase
  } = useKnowledgeBaseManageApi();
  
  const {
    addSourceToKnowledgeBase
  } = useSourceApi();
  
  const {
    fetchSitemap
  } = useSitemapApi();

  return {
    loading,
    setLoading,
    fetchKnowledgeBases,
    fetchAgents,
    createKnowledgeBase,
    updateKnowledgeBase,
    deleteKnowledgeBase,
    addSourceToKnowledgeBase,
    fetchSitemap
  };
};
