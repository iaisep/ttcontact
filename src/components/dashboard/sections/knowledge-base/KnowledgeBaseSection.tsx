
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Search } from 'lucide-react';
import { useKnowledgeBase } from './hooks/useKnowledgeBase';
import KnowledgeBaseTable from './components/KnowledgeBaseTable';
import KnowledgeBaseDialog from './components/KnowledgeBaseDialog';
import KnowledgeBaseDeleteDialog from './components/KnowledgeBaseDeleteDialog';
import { KnowledgeBase } from './types';

const KnowledgeBaseSection: React.FC = () => {
  const {
    knowledgeBases,
    loading,
    currentPage,
    pageSize,
    searchQuery,
    paginatedKnowledgeBases,
    filteredKnowledgeBases,
    setCurrentPage,
    setPageSize,
    setSearchQuery,
    createKnowledgeBase,
    updateKnowledgeBase,
    deleteKnowledgeBase,
    addSourceToKnowledgeBase,
    deleteSource,
    resyncKnowledgeBase,
    fetchSitemap,
    hasUrlSources
  } = useKnowledgeBase();

  const [kbDialogOpen, setKbDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentKb, setCurrentKb] = useState<KnowledgeBase | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [kbToDelete, setKbToDelete] = useState<KnowledgeBase | null>(null);

  // Reset to first page when search query or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  const handleCreateClick = () => {
    setCurrentKb(null);
    setIsCreating(true);
    setKbDialogOpen(true);
  };

  const handleEditClick = (kb: KnowledgeBase) => {
    setCurrentKb(kb);
    setIsCreating(false);
    setKbDialogOpen(true);
  };

  const handleSaveKnowledgeBase = async (name: string, kb: KnowledgeBase | null) => {
    if (isCreating) {
      return await createKnowledgeBase(name);
    } else if (kb) {
      const updatedKb = { ...kb, name };
      return await updateKnowledgeBase(updatedKb);
    }
    throw new Error('Invalid operation');
  };

  const handleDeleteClick = (kb: KnowledgeBase) => {
    setKbToDelete(kb);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (kbToDelete) {
      await deleteKnowledgeBase(kbToDelete.id);
      setDeleteDialogOpen(false);
      setKbToDelete(null);
    }
  };

  const handleAddSource = async (
    kbId: string,
    sourceType: 'url' | 'file' | 'text',
    sourceData: any
  ) => {
    return await addSourceToKnowledgeBase(kbId, sourceType, sourceData);
  };

  const handleDeleteSource = async (kbId: string, sourceId: string) => {
    return await deleteSource(kbId, sourceId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Knowledge Base</h1>
        <Button onClick={handleCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Knowledge Base
        </Button>
      </div>

      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search knowledge bases..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <KnowledgeBaseTable
          knowledgeBases={paginatedKnowledgeBases}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onResync={resyncKnowledgeBase}
          hasUrlSources={hasUrlSources}
          onCreateClick={handleCreateClick}
        />
      )}

      {/* Knowledge Base Dialog (Add/Edit) */}
      <KnowledgeBaseDialog
        open={kbDialogOpen}
        onOpenChange={setKbDialogOpen}
        isCreating={isCreating}
        knowledgeBase={currentKb}
        onSave={handleSaveKnowledgeBase}
        onAddSource={handleAddSource}
        onDeleteSource={handleDeleteSource}
        onFetchSitemap={fetchSitemap}
      />

      {/* Delete Knowledge Base Dialog */}
      <KnowledgeBaseDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        knowledgeBase={kbToDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default KnowledgeBaseSection;
