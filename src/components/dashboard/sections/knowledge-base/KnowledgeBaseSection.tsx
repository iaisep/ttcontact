
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Search } from 'lucide-react';
import { useKnowledgeBase } from './hooks/useKnowledgeBase';
import KnowledgeBaseTable from './components/KnowledgeBaseTable';
import KnowledgeBaseDialog from './components/dialogs/KnowledgeBaseDialog';
import KnowledgeBaseDeleteDialog from './components/KnowledgeBaseDeleteDialog';
import { KnowledgeBase } from './types';
import { toast } from 'sonner';

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
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSaveKnowledgeBase = async (data: { name: string }) => {
    setIsSaving(true);
    try {
      console.log('Saving knowledge base with name:', data.name);
      
      if (isCreating) {
        // Format the request data according to the API requirements
        const requestData = {
          knowledge_base_name: data.name,
          knowledge_base_texts: [],
          knowledge_base_urls: [],
          enable_auto_refresh: false
        };
        
        console.log('Creating knowledge base with data:', requestData);
        
        const newKb = await createKnowledgeBase(data.name);
        console.log('Created new knowledge base:', newKb);
        // No cerramos el diálogo aquí para permitir añadir fuentes
        setCurrentKb(newKb);
        toast.success('Knowledge base created successfully');
      } else if (currentKb) {
        const updatedKb = { ...currentKb, name: data.name };
        await updateKnowledgeBase(updatedKb);
        setKbDialogOpen(false);
      }
    } catch (error) {
      console.error('Error saving knowledge base:', error);
      toast.error('Failed to save knowledge base');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (kb: KnowledgeBase) => {
    setKbToDelete(kb);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (kbToDelete) {
      try {
        await deleteKnowledgeBase(kbToDelete.id);
        setDeleteDialogOpen(false);
        setKbToDelete(null);
        toast.success('Knowledge base deleted successfully');
      } catch (error) {
        console.error('Error deleting knowledge base:', error);
        toast.error('Failed to delete knowledge base');
      }
    }
  };

  const handleAddSource = async (
    kbId: string,
    sourceType: 'url' | 'file' | 'text',
    sourceData: any
  ) => {
    try {
      console.log(`Adding ${sourceType} source to KB ${kbId}:`, sourceData);
      
      // Prepare the request data based on the source type
      let requestData: any = {};
      
      if (sourceType === 'url') {
        // Handle URL source
        requestData = {
          url: sourceData.url,
          autoSync: sourceData.autoSync,
          webPages: sourceData.selectedPages || []
        };
      } else if (sourceType === 'file') {
        // Handle file source
        requestData = {
          file: sourceData
        };
      } else if (sourceType === 'text') {
        // Handle text source
        requestData = {
          fileName: sourceData.fileName,
          content: sourceData.content
        };
      }
      
      const updatedKb = await addSourceToKnowledgeBase(kbId, sourceType, requestData);
      toast.success(`${sourceType} source added successfully`);
      return updatedKb;
    } catch (error) {
      console.error(`Error adding ${sourceType} source:`, error);
      toast.error(`Failed to add ${sourceType} source`);
      throw error;
    }
  };

  const handleDeleteSource = async (kbId: string, sourceId: string) => {
    try {
      const updatedKb = await deleteSource(kbId, sourceId);
      toast.success('Source deleted successfully');
      return updatedKb;
    } catch (error) {
      console.error('Error deleting source:', error);
      toast.error('Failed to delete source');
      throw error;
    }
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
        isSaving={isSaving}
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
