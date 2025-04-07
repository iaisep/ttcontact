
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
      
      // Fetch sitemap from the URL
      const pages = await onFetchSitemap(formattedUrl);
      
      console.log('Fetched pages:', pages);
      
      if (pages.length === 0) {
        toast.warning('No pages found for this URL');
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
    if (selectedPageUrls.length === 0) {
      console.warn('No pages selected, cannot proceed');
      toast.error('Please select at least one page');
      return;
    }

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
    handleSelectionToggle,
    handleToggleAll,
    handleConfirmSelection,
    resetState
  };
};
