
import React from 'react';
import { KnowledgeBase, KnowledgeBaseSource, WebPage } from '../../types';
import AddUrlSourceModal from '../url-source-modal/AddUrlSourceModal';
import AddFileSourceModal from '../file-source-modal/AddFileSourceModal';
import AddTextSourceModal from '../text-source-modal/AddTextSourceModal';
import DeleteSourceDialog from './DeleteSourceDialog';

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
  onSourceAddSuccess?: () => void;
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
  onSourceAddSuccess
}) => {
  return (
    <>
      {/* URL Source Modal */}
      <AddUrlSourceModal
        open={currentSourceType === 'url'}
        onClose={() => setCurrentSourceType(null)}
        onAddSource={async (kbId, sourceType, sourceData) => {
          // This is a mock implementation - in reality, AddUrlSourceModal calls handleUrlSourceSubmit
          // which ultimately calls onAddUrlSource
          return {} as KnowledgeBase;
        }}
        onFetchSitemap={onFetchSitemap}
        currentKnowledgeBase={currentKnowledgeBase}
        knowledgeBaseName={knowledgeBaseName}
        onSourceAddSuccess={onSourceAddSuccess}
      />

      {/* File Source Modal */}
      <AddFileSourceModal
        open={currentSourceType === 'file'}
        onClose={() => setCurrentSourceType(null)}
        onAddSource={onAddFileSource}
        currentKnowledgeBase={currentKnowledgeBase}
        knowledgeBaseName={knowledgeBaseName}
        onSourceAddSuccess={onSourceAddSuccess}
      />

      {/* Text Source Modal */}
      <AddTextSourceModal
        open={currentSourceType === 'text'}
        onClose={() => setCurrentSourceType(null)}
        onAddSource={onAddTextSource}
        currentKnowledgeBase={currentKnowledgeBase}
        knowledgeBaseName={knowledgeBaseName}
        onSourceAddSuccess={onSourceAddSuccess}
      />

      {/* Delete Source Dialog */}
      <DeleteSourceDialog
        open={deleteSourceDialogOpen}
        onClose={() => setDeleteSourceDialogOpen(false)}
        onConfirm={onDeleteSource}
        source={sourceToDelete}
      />
    </>
  );
};

export default KnowledgeBaseSourceModals;
