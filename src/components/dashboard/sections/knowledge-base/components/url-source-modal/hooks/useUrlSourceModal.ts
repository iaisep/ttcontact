
import { useState } from 'react';
import { WebPage, KnowledgeBase } from '../../../types';
import { toast } from 'sonner';

interface UseUrlSourceModalProps {
  onFetchSitemap: (url: string) => Promise<WebPage[]>;
  onSubmit: (url: string, autoSync: boolean, selectedPages: WebPage[]) => Promise<KnowledgeBase>;
  currentKnowledgeBase?: KnowledgeBase | null;
}

export const useUrlSourceModal = ({ onFetchSitemap, onSubmit, currentKnowledgeBase }: UseUrlSourceModalProps) => {
  const [url, setUrl] = useState('');
  const [autoSync, setAutoSync] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'url-input' | 'sitemap-selection'>('url-input');
  const [webPages, setWebPages] = useState<WebPage[]>([]);
  const [selectedPageUrls, setSelectedPageUrls] = useState<string[]>([]);

  const resetState = () => {
    setUrl('');
    setAutoSync(false);
    setIsLoading(false);
    setView('url-input');
    setWebPages([]);
    setSelectedPageUrls([]);
  };

  const handleUrlSubmit = async () => {
    if (!url) return;

    try {
      setIsLoading(true);
      
      // Format the URL if needed
      let formattedUrl = url;
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }
      
      console.log('Fetching sitemap for URL:', formattedUrl);
      
      // Fetch sitemap from the URL
      const pages = await onFetchSitemap(formattedUrl);
      
      console.log('Fetched pages:', pages);
      
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
      toast.error('Failed to fetch sitemap');
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
    if (!currentKnowledgeBase) {
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
        knowledgeBase: currentKnowledgeBase
      });
      
      // Call the API with the selected pages
      await onSubmit(url, autoSync, selectedPages);
      
      // Don't reset state here - the parent component will handle closing the modal after successful API call
      // This ensures we don't get flashes of the URL input screen before the modal closes
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
    handleUrlSubmit,
    handleSelectionToggle,
    handleToggleAll,
    handleConfirmSelection,
    resetState
  };
};
