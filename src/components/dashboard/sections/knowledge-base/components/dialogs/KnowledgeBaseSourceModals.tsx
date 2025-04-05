
import React from 'react';
import { KnowledgeBase, KnowledgeBaseSource, WebPage } from '../../types';
import AddUrlSourceModal from '../AddUrlSourceModal';
import AddFileSourceModal from '../AddFileSourceModal';
import AddTextSourceModal from '../AddTextSourceModal';
import SourceDeleteDialog from '../SourceDeleteDialog';

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
  onFetchSitemap: (url: string) => Promise<WebPage[]>;
  currentKnowledgeBase: KnowledgeBase | null;
  knowledgeBaseName?: string;
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
  knowledgeBaseName
}) => {
  // Handler for closing all source modals
  const handleCloseModal = () => {
    setCurrentSourceType(null);
  };

  return (
    <>
      {/* URL Source Modal */}
      <AddUrlSourceModal
        open={currentSourceType === 'url'}
        onClose={handleCloseModal}
        onAddSource={(kbId, sourceType, sourceData) => {
          if (sourceType === 'url') {
            return onAddUrlSource(sourceData.url, sourceData.autoSync, sourceData.webPages);
          }
          throw new Error('Invalid source type in URL modal');
        }}
        onFetchSitemap={onFetchSitemap}
        currentKnowledgeBase={currentKnowledgeBase}
        knowledgeBaseName={knowledgeBaseName}
      />

      {/* File Source Modal */}
      <AddFileSourceModal
        open={currentSourceType === 'file'}
        onOpenChange={(open: boolean) => {
          if (!open) handleCloseModal();
        }}
        onSubmit={onAddFileSource}
        currentKnowledgeBase={currentKnowledgeBase}
      />

      {/* Text Source Modal */}
      <AddTextSourceModal
        open={currentSourceType === 'text'}
        onOpenChange={(open: boolean) => {
          if (!open) handleCloseModal();
        }}
        onSubmit={onAddTextSource}
        currentKnowledgeBase={currentKnowledgeBase}
      />

      {/* Delete Source Dialog */}
      <SourceDeleteDialog
        open={deleteSourceDialogOpen}
        onOpenChange={setDeleteSourceDialogOpen}
        source={sourceToDelete}
        onConfirm={onDeleteSource}
      />
    </>
  );
};

export default KnowledgeBaseSourceModals;
