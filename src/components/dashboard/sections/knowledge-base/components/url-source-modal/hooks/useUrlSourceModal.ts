import { useState, useCallback } from 'react';
import { WebPage, KnowledgeBase } from '../../../types';
import { toast } from 'sonner';

interface UseUrlSourceModalProps {
  onFetchSitemap: (url: string) => Promise<WebPage[]>;
  onSubmit: (url: string, autoSync: boolean, selectedPages: WebPage[], knowledgeBaseName?: string) => Promise<KnowledgeBase>;
  currentKnowledgeBase?: KnowledgeBase | null;
  knowledgeBaseName?: string;
}

export const useUrlSourceModal = ({ 
  onFetchSitemap, 
  onSubmit, 
  currentKnowledgeBase,
  knowledgeBaseName
}: UseUrlSourceModalProps) => {
  const [url, setUrl] = useState('');
  const [autoSync, setAutoSync] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'url-input' | 'sitemap-selection'>('url-input');
  const [webPages, setWebPages] = useState<WebPage[]>([]);
  const [selectedPageUrls, setSelectedPageUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setUrl('');
    setAutoSync(false);
    setIsLoading(false);
    setView('url-input');
    setWebPages([]);
    setSelectedPageUrls([]);
    setError(null);
    localStorage.removeItem('sitemap_pages');
  }, []);

  const formatUrl = useCallback((inputUrl: string): string => {
    let formattedUrl = inputUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }
    return formattedUrl;
  }, []);

  const handleUrlSubmit = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setError(null);
    
    try {
      setIsLoading(true);
      
      // Format the URL if needed
      const formattedUrl = formatUrl(url);
      
      console.log('Fetching sitemap for URL:', formattedUrl);
      console.log('Using knowledge base:', currentKnowledgeBase?.id, knowledgeBaseName);
      
      // Check if we have cached sitemap pages in localStorage
      const cachedPages = localStorage.getItem('sitemap_pages');
      
      let pages: WebPage[] = [];
      
      if (cachedPages) {
        console.log('Using cached sitemap pages from localStorage');
        try {
          const parsedPages = JSON.parse(cachedPages);
          if (Array.isArray(parsedPages) && parsedPages.length > 0) {
            // Transform string URLs into WebPage objects
            pages = parsedPages.map((item: string | any) => {
              if (typeof item === 'string') {
                return {
                  url: item,
                  title: item.split('/').pop() || 'Page', // Extract page name from URL
                  selected: false
                };
              } 
              return {
                url: formattedUrl,
                title: 'Website Page',
                selected: false
              };
            });
          }
          
          // Clear the cache after using it
          localStorage.removeItem('sitemap_pages');
        } catch (e) {
          console.error('Error parsing cached sitemap pages:', e);
        }
      }
      
      // If no valid cached pages, fetch from API
      if (pages.length === 0) {
        // Fetch sitemap from the URL
        pages = await onFetchSitemap(formattedUrl);
      }
      
      console.log('Fetched pages:', pages);
      
      if (pages.length === 0) {
        toast.warning('No pages found for this URL');
        
        // Create at least one fallback page if none were found
        pages = [{
          url: formattedUrl,
          title: 'Main Page',
          selected: false
        }];
      }
      
      // Update state with fetched pages
      setWebPages(pages);
      
      // Pre-select all pages by default
      setSelectedPageUrls(pages.map(page => page.url));
      
      // Update the URL state with the formatted URL
      setUrl(formattedUrl);
      
      // Switch to sitemap selection view
      setView('sitemap-selection');
    } catch (error) {
      console.error('Failed to fetch sitemap:', error);
      toast.error('Failed to fetch sitemap from URL');
      setError('Could not retrieve sitemap from this URL');
      
      // Even after error, proceed to next step with at least one fallback page
      // This allows users to continue even when the sitemap fetch fails
      const fallbackPage: WebPage = {
        url: formatUrl(url),
        title: 'Main Page',
        selected: false
      };
      
      setWebPages([fallbackPage]);
      setSelectedPageUrls([fallbackPage.url]);
      setView('sitemap-selection');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectionToggle = (pageUrl: string) => {
    setSelectedPageUrls(prevSelected => {
      if (prevSelected.includes(pageUrl)) {
        return prevSelected.filter(url => url !== pageUrl);
      } else {
        return [...prevSelected, pageUrl];
      }
    });
  };

  const handleToggleAll = () => {
    if (selectedPageUrls.length === webPages.length) {
      // Deselect all
      setSelectedPageUrls([]);
    } else {
      // Select all
      setSelectedPageUrls(webPages.map(page => page.url));
    }
  };

  const handleConfirmSelection = async () => {
    // Changed logic: Allow submitting even with no selected pages
    // This is useful when the sitemap API fails but we still want to create a KB
    
    // Validate that we have a knowledge base before proceeding
    const hasKnowledgeBase = (!!currentKnowledgeBase && !!currentKnowledgeBase.id) || !!knowledgeBaseName;
    
    if (!hasKnowledgeBase) {
      console.error('No knowledge base selected');
      toast.error('No knowledge base selected');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create selected pages array with full WebPage objects
      const selectedPages = webPages.filter(page => 
        selectedPageUrls.includes(page.url)
      );
      
      // If no pages are selected but we have web pages, create a fallback
      if (selectedPages.length === 0 && webPages.length > 0) {
        toast.warning('No pages selected. Using main URL as fallback.');
        const fallbackPage: WebPage = {
          url,
          title: 'Main Page',
          selected: true
        };
        selectedPages.push(fallbackPage);
      }
      
      console.log('Confirming selection for URL:', url);
      console.log('Submitting selected pages:', {
        url,
        autoSync,
        selectedPages,
        selectedUrls: selectedPageUrls,
        knowledgeBase: currentKnowledgeBase,
        knowledgeBaseName
      });
      
      // Call the API with the selected pages and knowledge base info
      // Pass the knowledgeBaseName explicitly to ensure it gets used
      await onSubmit(url, autoSync, selectedPages, knowledgeBaseName);
      
      toast.success('URL source added successfully');
      
      // Reset state here - the parent component will handle closing the modal after successful API call
    } catch (error) {
      console.error('Failed to add URL source:', error);
      toast.error('Failed to add URL source');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    url,
    setUrl,
    autoSync,
    setAutoSync,
    isLoading,
    view,
    webPages,
    selectedPageUrls,
    error,
    handleUrlSubmit,
    handleSelectionToggle: (pageUrl: string) => {
      setSelectedPageUrls(prevSelected => {
        if (prevSelected.includes(pageUrl)) {
          return prevSelected.filter(url => url !== pageUrl);
        } else {
          return [...prevSelected, pageUrl];
        }
      });
    },
    handleToggleAll: () => {
      if (selectedPageUrls.length === webPages.length) {
        // Deselect all
        setSelectedPageUrls([]);
      } else {
        // Select all
        setSelectedPageUrls(webPages.map(page => page.url));
      }
    },
    handleConfirmSelection: async () => {
      // Changed logic: Allow submitting even with no selected pages
      // This is useful when the sitemap API fails but we still want to create a KB
      
      // Validate that we have a knowledge base before proceeding
      const hasKnowledgeBase = (!!currentKnowledgeBase && !!currentKnowledgeBase.id) || !!knowledgeBaseName;
      
      if (!hasKnowledgeBase) {
        console.error('No knowledge base selected');
        toast.error('No knowledge base selected');
        return;
      }

      try {
        setIsLoading(true);
        
        // Create selected pages array with full WebPage objects
        const selectedPages = webPages.filter(page => 
          selectedPageUrls.includes(page.url)
        );
        
        // If no pages are selected but we have web pages, create a fallback
        if (selectedPages.length === 0 && webPages.length > 0) {
          toast.warning('No pages selected. Using main URL as fallback.');
          const fallbackPage: WebPage = {
            url,
            title: 'Main Page',
            selected: true
          };
          selectedPages.push(fallbackPage);
        }
        
        console.log('Confirming selection for URL:', url);
        console.log('Submitting selected pages:', {
          url,
          autoSync,
          selectedPages,
          selectedUrls: selectedPageUrls,
          knowledgeBase: currentKnowledgeBase,
          knowledgeBaseName
        });
        
        // Call the API with the selected pages and knowledge base info
        // Pass the knowledgeBaseName explicitly to ensure it gets used
        await onSubmit(url, autoSync, selectedPages, knowledgeBaseName);
        
        toast.success('URL source added successfully');
        
        // Reset state here - the parent component will handle closing the modal after successful API call
      } catch (error) {
        console.error('Failed to add URL source:', error);
        toast.error('Failed to add URL source');
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    resetState
  };
};
