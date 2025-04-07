import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Search } from 'lucide-react';
import { useKnowledgeBase } from './hooks/useKnowledgeBase';
import KnowledgeBaseTable from './components/KnowledgeBaseTable';
import KnowledgeBaseDialog from './components/dialogs/KnowledgeBaseDialog';
import KnowledgeBaseDeleteDialog from './components/KnowledgeBaseDeleteDialog';
import { KnowledgeBase, WebPage } from './types';
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
    fetchKnowledgeBases,
    fetchSitemap,
    hasUrlSources
  } = useKnowledgeBase();

  const [kbDialogOpen, setKbDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentKb, setCurrentKb] = useState<KnowledgeBase | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [kbToDelete, setKbToDelete] = useState<KnowledgeBase | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  useEffect(() => {
    console.log('Fetching knowledge bases, refresh counter:', refreshCounter);
    fetchKnowledgeBases();
  }, [fetchKnowledgeBases, refreshCounter]);

  useEffect(() => {
    const handleRefresh = () => {
      console.log("Refreshing knowledge bases list");
      setRefreshCounter(prev => prev + 1);
    };
    
    window.addEventListener('refreshKnowledgeBase', handleRefresh);
    
    return () => {
      window.removeEventListener('refreshKnowledgeBase', handleRefresh);
    };
  }, []);

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
        console.log('Creating knowledge base with data:', {
          name: data.name,
          urls: [],
          autoSync: false
        });
        
        await createKnowledgeBase({
          name: data.name,
          urls: [],
          autoSync: false
        });
        
        toast.success('Knowledge base created successfully');
        fetchKnowledgeBases();
      } else if (currentKb) {
        const updatedKb = { ...currentKb, name: data.name };
        await updateKnowledgeBase(updatedKb);
        setKbDialogOpen(false);
        fetchKnowledgeBases();
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
        fetchKnowledgeBases();
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
      
      const isNewKnowledgeBase = kbId.startsWith('temp_');
      
      let requestData: any = {};
      
      if (sourceType === 'url') {
        console.log('Adding url source to KB', kbId, ':', sourceData);
        
        if (isNewKnowledgeBase) {
          const kbName = sourceData.knowledgeBaseName || 'New Knowledge Base';
          const urls = sourceData.webPages && sourceData.webPages.map((page: any) => page.url) || [];
          const autoSync = sourceData.autoSync || false;
          
          console.log('Creating new knowledge base with URLs:', {
            name: kbName,
            urls,
            autoSync
          });
          
          const newKb = await createKnowledgeBase({
            name: kbName,
            urls: urls,
            autoSync: autoSync
          });
          
          toast.success(`Created knowledge base with ${urls.length} URLs`);
          setKbDialogOpen(false);
          setRefreshCounter(prev => prev + 1);
          
          return newKb;
        } else {
          requestData = {
            url: sourceData.url,
            autoSync: sourceData.autoSync,
            webPages: sourceData.webPages || []
          };
        }
      } else if (sourceType === 'file') {
        requestData = {
          file: sourceData.file
        };
      } else if (sourceType === 'text') {
        requestData = {
          fileName: sourceData.fileName,
          content: sourceData.content
        };
      }
      
      const updatedKb = await addSourceToKnowledgeBase(
        isNewKnowledgeBase ? 'create_new' : kbId, 
        sourceType, 
        requestData
      );
      
      setRefreshCounter(prev => prev + 1);
      
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
      
      setRefreshCounter(prev => prev + 1);
      
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
