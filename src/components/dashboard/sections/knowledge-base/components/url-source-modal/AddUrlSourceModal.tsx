
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus } from 'lucide-react';
import { useUrlSourceModal } from './hooks/useUrlSourceModal';
import UrlSourceInputView from './UrlSourceInputView';
import SitemapSelectionView from './SitemapSelectionView';

interface AddUrlSourceModalProps {
  open: boolean;
  onClose: () => void;
  onAddSource: (kbId: string, sourceType: 'url', sourceData: any) => Promise<any>;
  knowledgeBaseId: string;
}

const AddUrlSourceModal: React.FC<AddUrlSourceModalProps> = ({
  open,
  onClose,
  onAddSource,
  knowledgeBaseId
}) => {
  const {
    currentView,
    setCurrentView,
    url,
    setUrl,
    isLoading,
    setIsLoading,
    webPages,
    setWebPages,
    selectedPages,
    setSelectedPages,
    autoSync,
    setAutoSync,
    knowledgeBaseName,
    setKnowledgeBaseName,
    fetchSitemapData,
    handleAddUrl,
    handleCancel,
    validateUrl
  } = useUrlSourceModal({
    onClose,
    onAddSource,
    knowledgeBaseId
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add URL Source</DialogTitle>
          <DialogDescription>
            Add a website URL to include in your knowledge base
          </DialogDescription>
        </DialogHeader>

        {currentView === 'url-input' && (
          <UrlSourceInputView 
            url={url}
            setUrl={setUrl}
            autoSync={autoSync}
            setAutoSync={setAutoSync}
            knowledgeBaseName={knowledgeBaseName}
            setKnowledgeBaseName={setKnowledgeBaseName}
            isNewKnowledgeBase={knowledgeBaseId.startsWith('temp_')}
            onFetchSitemap={fetchSitemapData}
            onAddUrl={handleAddUrl}
            onCancel={handleCancel}
            isLoading={isLoading}
            validateUrl={validateUrl}
          />
        )}

        {currentView === 'sitemap-selection' && (
          <SitemapSelectionView
            webPages={webPages}
            selectedPages={selectedPages}
            setSelectedPages={setSelectedPages}
            onAddSelected={handleAddUrl}
            onBack={() => setCurrentView('url-input')}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddUrlSourceModal;
