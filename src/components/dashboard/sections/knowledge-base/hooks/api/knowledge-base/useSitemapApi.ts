
import { useState } from 'react';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';
import { WebPage } from '../../../types';

export const useSitemapApi = () => {
  const { fetchWithAuth } = useApiContext();
  const [loading, setLoading] = useState(false);

  const fetchSitemap = async (url: string): Promise<WebPage[]> => {
    try {
      setLoading(true);
      console.log('Fetching sitemap for URL:', url);
      
      const formData = new FormData();
      formData.append('website_url', url);
      
      const response = await fetchWithAuth('/list-sitemap', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: formData,
      });
      
      if (response && response.pages) {
        return response.pages.map((page: any) => ({
          url: page.url,
          title: page.title || page.url,
          selected: true
        }));
      }
      
      const mockPages: WebPage[] = [
        {
          url: `${url}/page1`,
          title: 'Page 1',
          selected: true
        },
        {
          url: `${url}/page2`,
          title: 'Page 2',
          selected: true
        },
        {
          url: `${url}/page3`,
          title: 'Page 3',
          selected: true
        }
      ];
      
      return mockPages;
    } catch (error) {
      console.error('Failed to fetch sitemap:', error);
      toast.error('Failed to fetch sitemap');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    setLoading,
    fetchSitemap
  };
};
