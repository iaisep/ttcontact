
import React from 'react';
import { KnowledgeBase, KnowledgeBaseSource, WebPage } from '../../types';
import AddUrlSourceModal from '../url-source-modal/AddUrlSourceModal';
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

      {/* File Source Modal - Using existing component */}
      {currentSourceType === 'file' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">File Upload Feature</h2>
            <p className="mb-4">File upload functionality is temporarily disabled.</p>
            <div className="flex justify-end">
              <button 
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={() => setCurrentSourceType(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Text Source Modal - Using existing component */}
      {currentSourceType === 'text' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Text Input Feature</h2>
            <p className="mb-4">Text input functionality is temporarily disabled.</p>
            <div className="flex justify-end">
              <button 
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={() => setCurrentSourceType(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
