
import React from 'react';
import { KnowledgeBase, KnowledgeBaseSource, WebPage } from '../../types';
import AddUrlSourceModal from '../url-source-modal';
import AddFileSourceModal from '../file-source-modal';
import AddTextSourceModal from '../text-source-modal';
import DeleteSourceDialog from '../DeleteSourceDialog';

interface KnowledgeBaseSourceModalsProps {
  currentSourceType: 'url' | 'file' | 'text' | null;
  setCurrentSourceType: (type: 'url' | 'file' | 'text' | null) => void;
  sourceToDelete: KnowledgeBaseSource | null;
  deleteSourceDialogOpen: boolean;
  setDeleteSourceDialogOpen: (open: boolean) => void;
  onAddUrlSource: (
    url: string,
    autoSync: boolean,
    selectedPages: WebPage[],
    currentKnowledgeBase: KnowledgeBase | null,
    knowledgeBaseName?: string
  ) => Promise<any>;
  onAddFileSource: (
    file: File,
    currentKnowledgeBase: KnowledgeBase | null,
    knowledgeBaseName?: string
  ) => Promise<any>;
  onAddTextSource: (
    fileName: string,
    content: string,
    currentKnowledgeBase: KnowledgeBase | null,
    knowledgeBaseName?: string
  ) => Promise<any>;
  onDeleteSource: (
    currentKnowledgeBase: KnowledgeBase | null,
    sourceToDelete: KnowledgeBaseSource | null,
    setDeleteSourceDialogOpen: (open: boolean) => void,
    setSourceToDelete: (source: KnowledgeBaseSource | null) => void
  ) => Promise<any>;
  onFetchSitemap: (url: string) => Promise<any[]>;
  currentKnowledgeBase: KnowledgeBase | null;
  knowledgeBaseName?: string;
  onSourceAdded?: () => void;
  onCloseMainDialog?: () => void;
}

const KnowledgeBaseSourceModals: React.FC<KnowledgeBaseSourceModalsProps> = ({
  currentSourceType,
  setCurrentSourceType,
  sourceToDelete,
  deleteSourceDialogOpen,
  setDeleteSourceDialogOpen,
  onAddUrlSource,
  onAddFileSource,
  onAddTextSource,
  onDeleteSource,
  onFetchSitemap,
  currentKnowledgeBase,
  knowledgeBaseName = '',
  onSourceAdded,
  onCloseMainDialog
}) => {
  // Log the knowledge base data for debugging
  console.log('KnowledgeBaseSourceModals - effectiveKnowledgeBase:', currentKnowledgeBase);
  console.log('KnowledgeBaseSourceModals - knowledgeBaseName:', knowledgeBaseName);

  // Handle URLs
  const handleUrlSave = async (urls: string[], autoSync: boolean, kbName: string) => {
    try {
      // Create web page objects for all URLs
      const selectedPages = urls.map(url => ({
        url,
        title: url.split('/').pop() || 'Page',
        selected: true
      }));
      
      console.log('Handling URL source save with knowledge base name:', kbName);
      
      // Call the parent component's handler
      await onAddUrlSource(
        urls[0] || '',  // First URL or empty string
        autoSync,
        selectedPages,
        currentKnowledgeBase,
        kbName  // Pass the knowledge base name explicitly
      );
      
      // Reset the current source type
      setCurrentSourceType(null);
      
      // Notify parent component about the added source
      if (onSourceAdded) {
        onSourceAdded();
      }
      
      // Close the main dialog if needed (e.g. when creating a new KB)
      if (onCloseMainDialog) {
        onCloseMainDialog();
      }
    } catch (error) {
      console.error('Error saving URL source:', error);
    }
  };

  const handleFileCancel = () => {
    setCurrentSourceType(null);
  };

  const handleTextCancel = () => {
    setCurrentSourceType(null);
  };

  const handleSetSourceToDelete = (source: KnowledgeBaseSource | null) => {
    sourceToDelete = source;
  };

  return (
    <>
      {/* URL Source Modal */}
      {currentSourceType === 'url' && (
        <AddUrlSourceModal
          isOpen={true}
          onCancel={() => setCurrentSourceType(null)}
          onSave={handleUrlSave}
          knowledgeBaseName={knowledgeBaseName}
        />
      )}
      
      {/* File Source Modal */}
      {currentSourceType === 'file' && (
        <AddFileSourceModal
          isOpen={true}
          onCancel={handleFileCancel}
          onSave={(file) => onAddFileSource(file, currentKnowledgeBase, knowledgeBaseName)}
          knowledgeBaseName={knowledgeBaseName}
        />
      )}
      
      {/* Text Source Modal */}
      {currentSourceType === 'text' && (
        <AddTextSourceModal
          isOpen={true}
          onCancel={handleTextCancel}
          onSave={(fileName, content) => 
            onAddTextSource(fileName, content, currentKnowledgeBase, knowledgeBaseName)}
          knowledgeBaseName={knowledgeBaseName}
        />
      )}
      
      {/* Delete Source Dialog */}
      <DeleteSourceDialog
        open={deleteSourceDialogOpen}
        onOpenChange={setDeleteSourceDialogOpen}
        source={sourceToDelete}
        onConfirm={() => 
          onDeleteSource(
            currentKnowledgeBase, 
            sourceToDelete, 
            setDeleteSourceDialogOpen,
            handleSetSourceToDelete
          )
        }
      />
    </>
  );
};

export default KnowledgeBaseSourceModals;
