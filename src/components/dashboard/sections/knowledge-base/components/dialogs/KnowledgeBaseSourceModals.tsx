
import React from 'react';
import { KnowledgeBaseSource, WebPage } from '../../types';
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
  onAddUrlSource: (url: string, autoSync: boolean, selectedPages: WebPage[]) => Promise<boolean | void>;
  onAddFileSource: (file: File) => Promise<boolean | void>;
  onAddTextSource: (fileName: string, content: string) => Promise<boolean | void>;
  onDeleteSource: () => Promise<boolean | void>;
  onFetchSitemap: (url: string) => Promise<WebPage[]>;
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
  onFetchSitemap
}) => {
  return (
    <>
      <AddUrlSourceModal
        open={currentSourceType === 'url'}
        onOpenChange={(open) => !open && setCurrentSourceType(null)}
        onSubmit={onAddUrlSource}
        onFetchSitemap={onFetchSitemap}
      />

      <AddFileSourceModal
        open={currentSourceType === 'file'}
        onOpenChange={(open) => !open && setCurrentSourceType(null)}
        onSubmit={onAddFileSource}
      />

      <AddTextSourceModal
        open={currentSourceType === 'text'}
        onOpenChange={(open) => !open && setCurrentSourceType(null)}
        onSubmit={onAddTextSource}
      />

      {deleteSourceDialogOpen && (
        <SourceDeleteDialog
          open={deleteSourceDialogOpen}
          onOpenChange={setDeleteSourceDialogOpen}
          source={sourceToDelete}
          onConfirm={onDeleteSource}
        />
      )}
    </>
  );
};

export default KnowledgeBaseSourceModals;
