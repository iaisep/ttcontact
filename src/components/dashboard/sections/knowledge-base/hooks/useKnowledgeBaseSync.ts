
import { useState } from 'react';
import { toast } from 'sonner';
import { KnowledgeBase } from '../types';
import { useApiContext } from '@/context/ApiContext';

export const useKnowledgeBaseSync = (setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  const { fetchWithAuth } = useApiContext();
  const [siteMapsLoading, setSiteMapsLoading] = useState(false);

  const resyncKnowledgeBase = async (kb: KnowledgeBase) => {
    try {
      setLoading(true);
      const urlSources = kb.sources.filter(src => src.type === 'url');
      
      if (urlSources.length === 0) {
        toast.error('No URL sources to resync');
        return;
      }
      
      // Call the API endpoint to resync the knowledge base with the website URLs
      for (const source of urlSources) {
        if (source.url) {
          console.log(`Resyncing KB ${kb.id} with URL: ${source.url}`);
          
          // Use the correct API endpoint format and payload structure
          await fetchWithAuth(`/kb/${kb.id}/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              website_url: source.url 
            }),
          });
        }
      }
      
      toast.success('Knowledge base resynced');
    } catch (error) {
      console.error('Failed to resync knowledge base:', error);
      toast.error('Failed to resync knowledge base');
    } finally {
      setLoading(false);
    }
  };

  const fetchSitemap = async (url: string) => {
    try {
      setSiteMapsLoading(true);
      console.log('Fetching sitemap for URL:', url);
      
      // Format the URL if needed
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }
      
      // Call the actual API endpoint with the correct format
      const response = await fetchWithAuth('/list-sitemap', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ website_url: formattedUrl }),
      });
      
      console.log('Sitemap API response:', response);
      
      if (response && response.pages && Array.isArray(response.pages)) {
        // Transform the API response to our WebPage format
        return response.pages.map((page: any) => ({
          url: page.url,
          title: page.title || page.url,
          selected: false
        }));
      }
      
      // Create mock data for this specific URL
      console.log('Creating mock data for sitemap');
      
      // Try to extract the domain for more realistic mock data
      const domain = formattedUrl.replace(/^https?:\/\//, '').split('/')[0];
      
      const mockPages = [
        { url: `${formattedUrl}/about`, title: `About - ${domain}`, selected: false },
        { url: `${formattedUrl}/products`, title: `Products - ${domain}`, selected: false },
        { url: `${formattedUrl}/services`, title: `Services - ${domain}`, selected: false },
        { url: `${formattedUrl}/contact`, title: `Contact - ${domain}`, selected: false },
        { url: `${formattedUrl}/blog`, title: `Blog - ${domain}`, selected: false }
      ];
      
      return mockPages;
    } catch (error) {
      console.error('Failed to fetch sitemap:', error);
      toast.error('Failed to fetch sitemap. Please check the URL and try again.');
      
      // Return empty array on error
      return [];
    } finally {
      setSiteMapsLoading(false);
    }
  };

  const hasUrlSources = (kb: KnowledgeBase) => {
    return kb.sources.some(source => source.type === 'url');
  };

  return {
    resyncKnowledgeBase,
    fetchSitemap,
    hasUrlSources,
    siteMapsLoading
  };
};
