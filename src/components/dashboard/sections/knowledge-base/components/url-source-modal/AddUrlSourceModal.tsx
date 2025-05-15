
import React from 'react';
import { Globe, Loader2 } from 'lucide-react';
import { useUrlSourceModal } from './hooks/useUrlSourceModal';
import UrlInputView from './UrlInputView';
import SitemapSelectionView from './SitemapSelectionView';
import { KnowledgeBase } from '../../types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';

interface AddUrlSourceModalProps {
  isOpen: boolean;
  onCancel: () => void;
  knowledgeBaseName?: string;
  onSave: (urls: string[], autoSync: boolean, knowledgeBaseName: string) => Promise<void>;
}

const AddUrlSourceModal: React.FC<AddUrlSourceModalProps> = ({
  onCancel,
  knowledgeBaseName = '',
  onSave,
  isOpen
}) => {
  const { fetchWithAuth } = useApiContext();
  
  // Implement fetch sitemap functionality
  const handleFetchSitemap = async (url: string) => {
    try {
      console.log('Fetching sitemap for URL:', url);
      
      const response = await fetchWithAuth('/list-sitemap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ website_url: url }),
      });
      
      console.log('Sitemap API response:', response);
      
      // Store the response in localStorage for other components to use
      localStorage.setItem('sitemap_pages', JSON.stringify(response));
      
      // Convert the response to WebPage objects
      const pages = Array.isArray(response) 
        ? response.map((item) => {
            if (typeof item === 'string') {
              return {
                url: item,
                title: item.split('/').pop() || 'Page',
                selected: true
              };
            }
            return {
              url: item.url || url,
              title: item.title || 'Page',
              selected: true
            };
          })
        : [{ url, title: 'Main Page', selected: true }];
      
      console.log('Converted pages:', pages);
      return pages;
    } catch (error) {
      console.error('Error fetching sitemap:', error);
      toast.error('Error fetching sitemap');
      // Return a default page on error
      return [{ url, title: 'Main Page', selected: true }];
    }
  };

  const {
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
  } = useUrlSourceModal({
    onFetchSitemap: handleFetchSitemap,
    onSubmit: async (url, autoSync, selectedPages) => {
      try {
        // Get the URLs from selected pages
        const urls = selectedPages.map(page => page.url);
        
        console.log('Submitting URLs:', urls, 'autoSync:', autoSync, 'knowledgeBaseName:', knowledgeBaseName);
        await onSave(urls, autoSync, knowledgeBaseName);
        
        return {} as KnowledgeBase; // Just to satisfy the interface
      } catch (error) {
        console.error('Error in onSubmit:', error);
        throw error;
      }
    },
    currentKnowledgeBase: null,
    knowledgeBaseName: knowledgeBaseName
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onCancel();
      }
    }}>
      <DialogContent className="max-w-2xl w-full">
        <div className="p-6 border-b">
          <div className="flex items-center">
            <Globe className="h-5 w-5 mr-2 text-blue-500" />
            <h2 className="text-lg font-medium">Add Web Pages</h2>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500 mb-4" />
              <p>Processing your request...</p>
            </div>
          </div>
        ) : (
          <>
            {view === 'url-input' ? (
              <UrlInputView 
                url={url}
                setUrl={setUrl}
                isLoading={isLoading}
                error={error}
                onSubmit={handleUrlSubmit}
                onCancel={onCancel}
                knowledgeBaseName={knowledgeBaseName}
              />
            ) : (
              <SitemapSelectionView 
                url={url}
                autoSync={autoSync}
                setAutoSync={setAutoSync}
                webPages={webPages}
                selectedPageUrls={selectedPageUrls}
                onSelectionToggle={handleSelectionToggle}
                onToggleAll={handleToggleAll}
                onConfirm={handleConfirmSelection}
                onBack={() => resetState()}
                isLoading={isLoading}
                currentKnowledgeBase={null}
                knowledgeBaseName={knowledgeBaseName}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddUrlSourceModal;
