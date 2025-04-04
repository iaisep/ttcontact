
import React from 'react';
import { KnowledgeBase, KnowledgeBaseSource, WebPage } from '../../types';
import AddUrlSourceModal from '../url-source-modal/AddUrlSourceModal';
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
  currentKnowledgeBase
}) => {
  console.log('KnowledgeBaseSourceModals - current KB:', currentKnowledgeBase);
  
  return (
    <>
      <AddUrlSourceModal
        open={currentSourceType === 'url'}
        onOpenChange={(open) => !open && setCurrentSourceType(null)}
        onSubmit={async (url, autoSync, selectedPages) => {
          return await onAddUrlSource(url, autoSync, selectedPages);
        }}
        onFetchSitemap={onFetchSitemap}
        currentKnowledgeBase={currentKnowledgeBase}
      />

      <AddFileSourceModal
        open={currentSourceType === 'file'}
        onOpenChange={(open) => !open && setCurrentSourceType(null)}
        onSubmit={async (file) => {
          return await onAddFileSource(file);
        }}
      />

      <AddTextSourceModal
        open={currentSourceType === 'text'}
        onOpenChange={(open) => !open && setCurrentSourceType(null)}
        onSubmit={async (fileName, content) => {
          return await onAddTextSource(fileName, content);
        }}
      />

      {deleteSourceDialogOpen && (
        <SourceDeleteDialog
          open={deleteSourceDialogOpen}
          onOpenChange={setDeleteSourceDialogOpen}
          source={sourceToDelete}
          onConfirm={async () => {
            return await onDeleteSource();
          }}
        />
      )}
    </>
  );
};

export default KnowledgeBaseSourceModals;
