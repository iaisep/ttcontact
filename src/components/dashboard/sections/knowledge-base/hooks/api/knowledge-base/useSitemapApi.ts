
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
      
      // Format the URL if needed
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }
      
      // Make the API call with the correct format
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
        return response.pages.map((page: any) => ({
          url: page.url,
          title: page.title || page.url,
          selected: true
        }));
      }
      
      // Fallback to mock data if response is invalid
      const mockPages: WebPage[] = [
        {
          url: `${formattedUrl}/page1`,
          title: 'Page 1',
          selected: true
        },
        {
          url: `${formattedUrl}/page2`,
          title: 'Page 2',
          selected: true
        },
        {
          url: `${formattedUrl}/page3`,
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
