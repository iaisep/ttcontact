
import { useState } from 'react';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';
import { KnowledgeBase } from '../../../types';

export const useKnowledgeBaseManageApi = () => {
  const { fetchWithAuth } = useApiContext();
  const [loading, setLoading] = useState(false);

  const updateKnowledgeBase = async (kb: KnowledgeBase) => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('knowledge_base_id', kb.id);
      formData.append('knowledge_base_name', kb.name);
      
      formData.append('enable_auto_refresh', String(kb.auto_sync));
      
      await fetchWithAuth(`/add-knowledge-base-sources/${kb.id}`, {
        method: 'POST',
        // Don't set Content-Type header when using FormData
        body: formData,
      });
      
      toast.success('Knowledge base updated');
      return kb;
    } catch (error) {
      console.error('Failed to update knowledge base:', error);
      toast.error('Failed to update knowledge base');
      
      return kb;
    } finally {
      setLoading(false);
    }
  };

  const deleteKnowledgeBase = async (kbId: string) => {
    try {
      setLoading(true);
      
      await fetchWithAuth(`/delete-knowledge-base/${kbId}`, {
        method: 'DELETE',
      });
      
      toast.success('Knowledge base deleted');
    } catch (error) {
      console.error('Failed to delete knowledge base:', error);
      toast.error('Failed to delete knowledge base');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    setLoading,
    updateKnowledgeBase,
    deleteKnowledgeBase
  };
};
