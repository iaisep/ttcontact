
import { useState } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { WebPage } from '../../../types';
import { toast } from 'sonner';

export const useSitemapApi = () => {
  const { fetchWithAuth } = useApiContext();
  const [loading, setLoading] = useState(false);

  const fetchSitemap = async (url: string): Promise<WebPage[]> => {
    try {
      setLoading(true);
      
      // Format URL if needed
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }
      
      console.log('Fetching sitemap for URL:', formattedUrl);
      
      // Create JSON payload instead of FormData for this endpoint
      const payload = {
        website_url: formattedUrl
      };
      
      const response = await fetchWithAuth('/list-sitemap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      console.log('Sitemap response:', response);
      
      let pages: WebPage[] = [];
      
      if (response.results && Array.isArray(response.results)) {
        pages = response.results.map((page: any) => ({
          url: page.url || '',
          title: page.title || 'Untitled Page',
          description: page.description || '',
          lastModified: page.last_modified || new Date().toISOString()
        }));
      } else if (response.website_pages && Array.isArray(response.website_pages)) {
        pages = response.website_pages.map((page: any) => ({
          url: page.url || '',
          title: page.title || 'Untitled Page',
          description: page.description || '',
          lastModified: page.last_modified || new Date().toISOString()
        }));
      }
      
      // Ensure we have some reasonable default in case API doesn't return pages
      if (pages.length === 0) {
        console.log('Sitemap API returned no results, creating mock page for:', formattedUrl);
        pages = [
          {
            url: formattedUrl,
            title: 'Main Page',
            description: 'Main page of the website',
            lastModified: new Date().toISOString()
          }
        ];
      }
      
      console.log('Processed sitemap pages:', pages);
      return pages;
    } catch (error) {
      console.error('Failed to fetch sitemap:', error);
      toast.error('Failed to fetch sitemap');
      
      // Return a basic fallback page based on the input URL
      return [
        {
          url: url,
          title: 'Website Page',
          description: 'Could not fetch details for this page',
          lastModified: new Date().toISOString()
        }
      ];
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
