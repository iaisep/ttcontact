
import { useState } from 'react';
import { toast } from 'sonner';
import { KnowledgeBase } from '../types';

export const useKnowledgeBaseSync = (setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  const resyncKnowledgeBase = async (kb: KnowledgeBase) => {
    try {
      setLoading(true);
      const urlSources = kb.sources.filter(src => src.type === 'url');
      
      if (urlSources.length === 0) {
        toast.error('No URL sources to resync');
        return;
      }
      
      for (const source of urlSources) {
        if (source.url) {
          // In a real implementation, this would call the API
          // await fetchWithAuth('/list-sitemap', {
          //   method: 'POST',
          //   body: JSON.stringify({ website_url: source.url }),
          // });
        }
      }
      
      toast.success('Knowledge base resynced');
    } catch (error) {
      toast.error('Failed to resync knowledge base');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSitemap = async (url: string) => {
    try {
      setLoading(true);
      const mockPages = [
        { url: `${url}/about`, title: 'About Us', selected: false },
        { url: `${url}/products`, title: 'Products', selected: false },
        { url: `${url}/contact`, title: 'Contact', selected: false },
        { url: `${url}/blog`, title: 'Blog', selected: false }
      ];
      
      return mockPages;
    } catch (error) {
      toast.error('Failed to fetch sitemap');
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const hasUrlSources = (kb: KnowledgeBase) => {
    return kb.sources.some(source => source.type === 'url');
  };

  return {
    resyncKnowledgeBase,
    fetchSitemap,
    hasUrlSources
  };
};
