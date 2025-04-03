
import { useState } from 'react';
import { WebPage } from '../../../types';

export const useUrlSourceModal = (
  onSubmit: (url: string, autoSync: boolean, selectedPages: WebPage[]) => Promise<void>,
  onFetchSitemap: (url: string) => Promise<WebPage[]>
) => {
  const [sourceUrl, setSourceUrl] = useState('');
  const [autoSync, setAutoSync] = useState(false);
  const [webPages, setWebPages] = useState<WebPage[]>([]);
  const [sitemapDialogOpen, setSitemapDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    setSourceUrl('');
    setAutoSync(false);
    setWebPages([]);
    setSitemapDialogOpen(false);
  };

  const handleFetchSitemap = async () => {
    if (!sourceUrl) return;
    
    try {
      setLoading(true);
      const pages = await onFetchSitemap(sourceUrl);
      setWebPages(pages);
      setSitemapDialogOpen(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await onSubmit(sourceUrl, autoSync, webPages.filter(p => p.selected));
      handleReset();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const toggleWebPageSelection = (index: number) => {
    const updatedPages = [...webPages];
    updatedPages[index].selected = !updatedPages[index].selected;
    setWebPages(updatedPages);
  };

  const selectAllPages = () => {
    setWebPages(webPages.map(p => ({...p, selected: true})));
  };

  const deselectAllPages = () => {
    setWebPages(webPages.map(p => ({...p, selected: false})));
  };

  return {
    sourceUrl,
    setSourceUrl,
    autoSync,
    setAutoSync,
    webPages,
    sitemapDialogOpen,
    setSitemapDialogOpen,
    loading,
    handleReset,
    handleFetchSitemap,
    handleSubmit,
    toggleWebPageSelection,
    selectAllPages,
    deselectAllPages
  };
};
