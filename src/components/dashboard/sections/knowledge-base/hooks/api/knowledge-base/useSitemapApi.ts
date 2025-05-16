
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
      
      // Check if we have cached sitemap pages in localStorage
      const cachedPages = localStorage.getItem('sitemap_pages');
      
      // If we have cached pages, use them and clear the cache
      if (cachedPages) {
        console.log('Using cached sitemap pages from localStorage');
        localStorage.removeItem('sitemap_pages'); // Clear the cache after using it
        
        const parsedPages = JSON.parse(cachedPages);
        if (Array.isArray(parsedPages) && parsedPages.length > 0) {
          // Transform string URLs into WebPage objects
          return parsedPages.map((item: string | any) => {
            if (typeof item === 'string') {
              return {
                url: item,
                title: item.split('/').pop() || 'Page', // Extract page name from URL
                selected: false
              };
            } else if (typeof item === 'object' && item.url) {
              return {
                url: item.url,
                title: item.title || item.url.split('/').pop() || 'Page',
                selected: false
              };
            }
            return null;
          }).filter(Boolean) as WebPage[];
        }
      }
      
      // If no cached pages, proceed with the API call
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
      
      console.log('Sitemap API response:', response);
      
      let pages: WebPage[] = [];
      
      // Handle different possible response formats
      if (Array.isArray(response)) {
        // If response is already an array of URLs
        pages = response.map((url: string) => ({
          url: url,
          title: url.split('/').pop() || 'Page', // Extract page name from URL
          selected: false
        }));
      } else if (response.results && Array.isArray(response.results)) {
        pages = response.results.map((page: any) => ({
          url: page.url || '',
          title: page.title || 'Untitled Page',
          selected: false
        }));
      } else if (response.website_pages && Array.isArray(response.website_pages)) {
        pages = response.website_pages.map((page: any) => ({
          url: page.url || '',
          title: page.title || 'Untitled Page',
          selected: false
        }));
      }
      
      // Ensure we have some reasonable default in case API doesn't return pages
      if (pages.length === 0) {
        console.log('Sitemap API returned no results, creating mock page for:', formattedUrl);
        pages = [
          {
            url: formattedUrl,
            title: 'Main Page',
            selected: false
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
          selected: false
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
