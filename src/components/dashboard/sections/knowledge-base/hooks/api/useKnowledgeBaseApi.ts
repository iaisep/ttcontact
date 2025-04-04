import { useState } from 'react';
import { useKnowledgeBaseListApi } from './knowledge-base';
import { useKnowledgeBaseManageApi } from './knowledge-base';
import { useKnowledgeBaseCreateApi } from './knowledge-base';
import { useSitemapApi } from './knowledge-base';
import { useSourceApi } from './knowledge-base';
import { KnowledgeBase, KnowledgeBaseSource, WebPage } from '../../types';

export const useKnowledgeBaseApi = () => {
  const [loading, setLoading] = useState(false);
  
  const { fetchKnowledgeBases: fetchKnowledgeBasesList } = useKnowledgeBaseListApi();
  const { updateKnowledgeBase, deleteKnowledgeBase } = useKnowledgeBaseManageApi();
  const { createKnowledgeBase } = useKnowledgeBaseCreateApi();
  const { fetchSitemap } = useSitemapApi();
  const { 
    addSourceToKnowledgeBaseApi, 
    deleteSourceApi, 
    createMockSource 
  } = useSourceApi();

  const fetchKnowledgeBases = async (): Promise<KnowledgeBase[]> => {
    return await fetchKnowledgeBasesList();
  };

  const createKnowledgeBaseWrapper = async (nameOrData: string | {
    name: string;
    urls?: string[];
    autoSync?: boolean;
  }): Promise<KnowledgeBase> => {
    return await createKnowledgeBase(nameOrData);
  };

  const updateKnowledgeBaseWrapper = async (kb: KnowledgeBase): Promise<KnowledgeBase> => {
    return await updateKnowledgeBase(kb);
  };
  
  const deleteKnowledgeBaseWrapper = async (kbId: string): Promise<void> => {
    return await deleteKnowledgeBase(kbId);
  };
  
  const addSourceToKnowledgeBase = async (
    kbId: string,
    sourceType: 'url' | 'file' | 'text',
    sourceData: any
  ): Promise<KnowledgeBase> => {
    return await addSourceToKnowledgeBaseApi(kbId, sourceType, sourceData);
  };
  
  const deleteSource = async (
    kbId: string, 
    sourceId: string
  ): Promise<KnowledgeBase> => {
    return await deleteSourceApi(kbId, sourceId);
  };
  
  const fetchSitemapWrapper = async (url: string): Promise<WebPage[]> => {
    return await fetchSitemap(url);
  };

  return {
    loading,
    setLoading,
    fetchKnowledgeBases,
    createKnowledgeBase: createKnowledgeBaseWrapper,
    updateKnowledgeBase: updateKnowledgeBaseWrapper,
    deleteKnowledgeBase: deleteKnowledgeBaseWrapper,
    addSourceToKnowledgeBase,
    deleteSource,
    fetchSitemap: fetchSitemapWrapper
  };
};
