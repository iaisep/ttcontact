
import React from 'react';
import AddUrlSourceModal from '../url-source-modal';
import AddFileSourceModal from '../AddFileSourceModal';
import AddTextSourceModal from '../AddTextSourceModal';
import SourceDeleteDialog from '../SourceDeleteDialog';
import { KnowledgeBase, KnowledgeBaseSource, WebPage } from '../../types';

interface KnowledgeBaseSourceModalsProps {
  currentSourceType: 'url' | 'file' | 'text' | null;
  setCurrentSourceType: (type: 'url' | 'file' | 'text' | null) => void;
  sourceToDelete: KnowledgeBaseSource | null;
  deleteSourceDialogOpen: boolean;
  setDeleteSourceDialogOpen: (open: boolean) => void;
  onAddUrlSource: (url: string, autoSync: boolean, selectedPages: WebPage[]) => Promise<KnowledgeBase>;
  onAddFileSource: (file: File) => Promise<KnowledgeBase>;
  onAddTextSource: (fileName: string, content: string) => Promise<KnowledgeBase>;
  onDeleteSource: () => Promise<KnowledgeBase>;
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
  knowledgeBaseName,
  onSourceAdded,
  onCloseMainDialog
}) => {
  const handleCloseSourceModal = () => {
    setCurrentSourceType(null);
  };

  const handleSourceAdded = () => {
    // Dispatch refresh event to update the UI
    const refreshEvent = new CustomEvent('refreshKnowledgeBase');
    window.dispatchEvent(refreshEvent);
    
    // Call the optional callback to handle source addition
    if (onSourceAdded) {
      onSourceAdded();
    }

    // If we're adding to a new knowledge base, close the main dialog as well
    // This handles the case where we're creating a new KB and adding sources in one go
    if (currentKnowledgeBase?.id?.startsWith('temp_') && onCloseMainDialog) {
      onCloseMainDialog();
    }
  };

  console.log("KnowledgeBaseSourceModals - currentKnowledgeBase:", currentKnowledgeBase);

  return (
    <>
      {/* URL Source Modal */}
      <AddUrlSourceModal
        open={currentSourceType === 'url'}
        onClose={() => {
          handleCloseSourceModal();
          handleSourceAdded();
        }}
        onAddSource={(kbId, sourceType, sourceData) => {
          // This is called from the URL source modal's hooks
          return onAddUrlSource(
            sourceData.url,
            sourceData.autoSync,
            sourceData.webPages || []
          );
        }}
        onFetchSitemap={onFetchSitemap}
        currentKnowledgeBase={currentKnowledgeBase}
        knowledgeBaseName={knowledgeBaseName}
      />

      {/* File Source Modal */}
      <AddFileSourceModal
        open={currentSourceType === 'file'}
        onOpenChange={handleCloseSourceModal}
        onClose={() => {
          handleCloseSourceModal();
          handleSourceAdded();
        }}
        onSubmit={(file) => onAddFileSource(file)}
        currentKnowledgeBase={currentKnowledgeBase}
      />

      {/* Text Source Modal */}
      <AddTextSourceModal
        open={currentSourceType === 'text'}
        onOpenChange={handleCloseSourceModal}
        onClose={() => {
          handleCloseSourceModal();
          handleSourceAdded();
        }}
        onSubmit={(fileName, content) => onAddTextSource(fileName, content)}
        currentKnowledgeBase={currentKnowledgeBase}
      />

      {/* Source Delete Dialog */}
      <SourceDeleteDialog
        open={deleteSourceDialogOpen}
        onOpenChange={setDeleteSourceDialogOpen}
        source={sourceToDelete}
        onConfirm={async () => {
          const result = await onDeleteSource();
          handleSourceAdded();
          return result; // Make sure we return the KnowledgeBase result
        }}
      />
    </>
  );
};

export default KnowledgeBaseSourceModals;
