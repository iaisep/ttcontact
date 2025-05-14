
import React, { useState } from 'react';
import { Globe, Loader2 } from 'lucide-react';
import { useUrlSourceModal } from './hooks/useUrlSourceModal';
import UrlInputView from './UrlInputView';
import SitemapSelectionView from './SitemapSelectionView';

interface AddUrlSourceModalProps {
  onCancel: () => void;
  knowledgeBaseName?: string;
  onSave: (urls: string[], autoSync: boolean, knowledgeBaseName: string) => Promise<void>;
  isOpen: boolean;
}

const AddUrlSourceModal: React.FC<AddUrlSourceModalProps> = ({
  onCancel,
  knowledgeBaseName = '',
  onSave,
  isOpen
}) => {
  const {
    view,
    url,
    autoSync,
    webPages,
    selectedPages,
    isLoading,
    fetchingSitemap,
    kbNameValue,
    setKbNameValue,
    setUrl,
    setAutoSync,
    togglePageSelection,
    toggleAllPages,
    handleFetchSitemap,
    handleSaveChanges,
    goBack
  } = useUrlSourceModal({
    onSave,
    onCancel,
    initialKnowledgeBaseName: knowledgeBaseName
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
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
                autoSync={autoSync}
                knowledgeBaseName={kbNameValue}
                onKnowledgeBaseNameChange={setKbNameValue}
                onUrlChange={setUrl}
                onAutoSyncChange={setAutoSync}
                onCancel={onCancel}
                onNext={handleFetchSitemap}
                isCreatingKnowledgeBase={!knowledgeBaseName}
                fetchingSitemap={fetchingSitemap}
              />
            ) : (
              <SitemapSelectionView 
                webPages={webPages}
                selectedPages={selectedPages}
                onTogglePageSelection={togglePageSelection}
                onToggleAllPages={toggleAllPages}
                onCancel={onCancel}
                onBack={goBack}
                onSave={handleSaveChanges}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AddUrlSourceModal;
