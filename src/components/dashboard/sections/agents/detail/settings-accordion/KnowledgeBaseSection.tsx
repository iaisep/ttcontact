import React, { useState, useEffect } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Trash, X, UploadCloud, Globe, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { AccordionSectionProps, KnowledgeBaseSectionProps } from './types';
import { useApiContext } from '@/context/ApiContext';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface KnowledgeBase {
  id: string;
  name: string;
  created_at: string;
}

const KnowledgeBaseSection: React.FC<KnowledgeBaseSectionProps> = ({ agent, updateAgentField, knowledgeBases: propKnowledgeBases }) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [selectedKbs, setSelectedKbs] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchKnowledgeBases();
    
    // If agent has knowledge_base_ids, set them as selected
    if (agent?.knowledge_base_ids && Array.isArray(agent.knowledge_base_ids)) {
      setSelectedKbs(agent.knowledge_base_ids);
    } else if (agent?.knowledge_base && typeof agent.knowledge_base === 'string') {
      // For backward compatibility, if there's a single knowledge_base
      setSelectedKbs([agent.knowledge_base]);
    }
  }, [agent]);

  // Use knowledge bases from props if provided
  useEffect(() => {
    if (propKnowledgeBases && propKnowledgeBases.length > 0) {
      const formattedKbs = propKnowledgeBases.map(kb => ({
        id: kb.knowledge_base_id || kb.id,
        name: kb.knowledge_base_name || kb.name,
        created_at: kb.created_at || new Date().toISOString()
      }));
      setKnowledgeBases(formattedKbs);
    }
  }, [propKnowledgeBases]);

  const fetchKnowledgeBases = async () => {
    // If we already have knowledge bases from props, don't fetch again
    if (propKnowledgeBases && propKnowledgeBases.length > 0) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetchWithAuth('/list-knowledge-bases', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Fetched knowledge bases:', response);
      
      if (Array.isArray(response)) {
        // Transform API response to our KnowledgeBase format
        const formattedKbs = response.map(kb => ({
          id: kb.knowledge_base_id || kb.id,
          name: kb.knowledge_base_name || kb.name,
          created_at: kb.created_at || new Date().toISOString()
        }));
        setKnowledgeBases(formattedKbs);
      } else {
        // Fallback to mock data for development
        const mockKbs: KnowledgeBase[] = [
          { id: 'kb_123', name: 'Product Documentation', created_at: new Date().toISOString() },
          { id: 'kb_456', name: 'Customer FAQs', created_at: new Date().toISOString() },
          { id: 'kb_789', name: 'Pricing Information', created_at: new Date().toISOString() }
        ];
        setKnowledgeBases(mockKbs);
      }
    } catch (error) {
      console.error('Failed to fetch knowledge bases:', error);
      toast.error('Failed to load knowledge bases');
      
      // Use mock data as fallback
      const mockKbs: KnowledgeBase[] = [
        { id: 'kb_123', name: 'Product Documentation', created_at: new Date().toISOString() },
        { id: 'kb_456', name: 'Customer FAQs', created_at: new Date().toISOString() },
        { id: 'kb_789', name: 'Pricing Information', created_at: new Date().toISOString() }
      ];
      setKnowledgeBases(mockKbs);
    } finally {
      setLoading(false);
    }
  };

  const toggleKnowledgeBase = (kbId: string) => {
    setSelectedKbs(prev => {
      if (prev.includes(kbId)) {
        return prev.filter(id => id !== kbId);
      } else {
        return [...prev, kbId];
      }
    });
  };

  const saveKnowledgeBases = async () => {
    try {
      setLoading(true);
      
      // Update agent with selected knowledge bases
      await updateAgentField('knowledge_base_ids', selectedKbs);
      
      toast.success('Knowledge bases updated');
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to update knowledge bases:', error);
      toast.error('Failed to update knowledge bases');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKnowledgeBase = (kbId: string, event: React.MouseEvent) => {
    // Stop propagation to prevent the parent from handling the click
    event.stopPropagation();
    
    // Remove this KB from selected KBs
    setSelectedKbs(prev => prev.filter(id => id !== kbId));
    
    // Update the agent right away
    updateAgentField('knowledge_base_ids', selectedKbs.filter(id => id !== kbId));
    
    toast.success('Knowledge base removed');
  };

  const handleOpenKnowledgeBaseManager = () => {
    // Open knowledge base management in a new tab/window
    window.open('/dashboard?section=knowledge-base', '_blank');
  };

  const getKnowledgeBaseName = (kbId: string) => {
    const kb = knowledgeBases.find(kb => kb.id === kbId);
    return kb ? kb.name : kbId;
  };

  return (
    <AccordionItem value="knowledge-base" className="mt-4 border rounded-md overflow-hidden">
      <AccordionTrigger className="px-4 py-2 text-sm font-medium bg-gray-50 hover:bg-gray-100 flex items-center">
        <FileText className="h-4 w-4 mr-2" />
        {t('knowledge_base')}
      </AccordionTrigger>
      <AccordionContent className="p-4">
        <div className="space-y-4">
          <p className="text-xs text-blue-600">
            Add knowledge base to provide context to the agent.
          </p>

          {/* Selected Knowledge Bases */}
          <div className="space-y-2">
            {selectedKbs.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No knowledge bases selected</p>
            ) : (
              selectedKbs.map((kbId) => (
                <div key={kbId} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">{getKnowledgeBaseName(kbId)}</span>
                  </div>
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={(e) => handleDeleteKnowledgeBase(kbId, e)}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-start gap-2">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setDialogOpen(true)}>
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={handleOpenKnowledgeBaseManager}>
              <FileText className="h-3 w-3 mr-1" /> Manage Knowledge Bases
            </Button>
          </div>
        </div>
      </AccordionContent>

      {/* Knowledge Base Selection Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Knowledge Base</DialogTitle>
            <DialogDescription>
              Select knowledge bases to provide context to your agent during calls.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="max-h-[300px] overflow-y-auto border rounded-md divide-y">
              {knowledgeBases.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  No knowledge bases available. Create one first.
                </div>
              ) : (
                <>
                  {knowledgeBases.map((kb) => (
                    <div 
                      key={kb.id} 
                      className={`flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer ${
                        selectedKbs.includes(kb.id) ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => toggleKnowledgeBase(kb.id)}
                    >
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">{kb.name}</span>
                      </div>
                      {selectedKbs.includes(kb.id) && (
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                  ))}
                  <div 
                    className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer bg-gray-50"
                    onClick={handleOpenKnowledgeBaseManager}
                  >
                    <div className="flex items-center">
                      <Plus className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">Add New Knowledge Base</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveKnowledgeBases} disabled={loading}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AccordionItem>
  );
};

export default KnowledgeBaseSection;
