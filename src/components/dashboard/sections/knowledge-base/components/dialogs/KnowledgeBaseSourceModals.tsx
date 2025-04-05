
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
  onSourceAdded?: () => void; // Nueva prop para notificar cuando se ha agregado una fuente
  onCloseMainDialog?: () => void; // Nueva prop para cerrar el diálogo principal
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
  // Handler for closing all source modals
  const handleCloseModal = () => {
    setCurrentSourceType(null);
  };

  // Handler for when a source has been successfully added
  const handleSourceAdded = (knowledgeBase: KnowledgeBase) => {
    handleCloseModal(); // Cierra el modal de fuente
    if (onSourceAdded) {
      onSourceAdded(); // Notifica que se ha agregado una fuente
    }
  };

  return (
    <>
      {/* URL Source Modal */}
      <AddUrlSourceModal
        open={currentSourceType === 'url'}
        onClose={handleCloseModal}
        onAddSource={(kbId, sourceType, sourceData) => {
          if (sourceType === 'url') {
            return onAddUrlSource(sourceData.url, sourceData.autoSync, sourceData.webPages)
              .then(result => {
                handleSourceAdded(result);
                if (onCloseMainDialog) {
                  onCloseMainDialog(); // Cierra el diálogo principal
                }
                return result;
              });
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
        onSubmit={(file) => {
          return onAddFileSource(file).then(result => {
            handleSourceAdded(result);
            return result;
          });
        }}
        currentKnowledgeBase={currentKnowledgeBase}
      />

      {/* Text Source Modal */}
      <AddTextSourceModal
        open={currentSourceType === 'text'}
        onOpenChange={(open: boolean) => {
          if (!open) handleCloseModal();
        }}
        onSubmit={(fileName, content) => {
          return onAddTextSource(fileName, content).then(result => {
            handleSourceAdded(result);
            return result;
          });
        }}
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
