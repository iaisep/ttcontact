
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Plus, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';

interface KnowledgeBase {
  id: string;
  name: string;
  created_at: string;
}

interface KnowledgeBaseSelectionDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  knowledgeBases: KnowledgeBase[];
  selectedKbs: string[];
  agent: RetellAgent;
  updateAgentField: (field: string, value: any) => void;
  handleOpenKnowledgeBaseManager: () => void;
}

const KnowledgeBaseSelectionDialog: React.FC<KnowledgeBaseSelectionDialogProps> = ({
  dialogOpen,
  setDialogOpen,
  knowledgeBases,
  selectedKbs,
  agent,
  updateAgentField,
  handleOpenKnowledgeBaseManager
}) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const [localSelectedKbs, setLocalSelectedKbs] = useState<string[]>([...selectedKbs]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Reset local selection when dialog opens
  useEffect(() => {
    if (dialogOpen) {
      console.log('[KnowledgeBaseSelectionDialog] Dialog opened, resetting selection to:', selectedKbs);
      setLocalSelectedKbs([...selectedKbs]);
    }
  }, [dialogOpen, selectedKbs]);

  const handleSaveSelection = async () => {
    setIsUpdating(true);
    try {
      // Update the agent's knowledge base IDs
      console.log('[KnowledgeBaseSelectionDialog] Saving knowledge base selection:', localSelectedKbs);
      
      // Update agent field
      updateAgentField('knowledge_base_ids', localSelectedKbs);
      
      // Also update the LLM directly to ensure consistency
      if (agent?.response_engine?.llm_id) {
        await fetchWithAuth(`/update-retell-llm/${agent.response_engine.llm_id}`, {
          method: 'PATCH',
          body: JSON.stringify({ knowledge_base_ids: localSelectedKbs })
        });
      }
      
      setDialogOpen(false);
      toast.success('Knowledge bases updated');
    } catch (error) {
      console.error('Error updating knowledge bases:', error);
      toast.error('Failed to update knowledge bases');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleKnowledgeBase = (kbId: string, checked: boolean) => {
    setLocalSelectedKbs(prev => {
      const updated = checked 
        ? [...prev, kbId] 
        : prev.filter(id => id !== kbId);
      console.log(`[KnowledgeBaseSelectionDialog] Toggle KB ${kbId} to ${checked}, new selection:`, updated);
      return updated;
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('select_knowledge_bases')}</DialogTitle>
          <DialogDescription>
            {t('knowledge_base_description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4 max-h-[300px] overflow-y-auto">
          {knowledgeBases.length === 0 ? (
            <div className="text-center p-4 text-gray-500">
              <p>No knowledge bases available.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={handleOpenKnowledgeBaseManager}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Knowledge Base
              </Button>
            </div>
          ) : (
            knowledgeBases.map(kb => (
              <div key={kb.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md">
                <Checkbox
                  id={`kb-${kb.id}`}
                  checked={localSelectedKbs.includes(kb.id)}
                  onCheckedChange={(checked) => handleToggleKnowledgeBase(kb.id, !!checked)}
                />
                <label 
                  htmlFor={`kb-${kb.id}`} 
                  className="flex-1 text-sm cursor-pointer flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{kb.name}</span>
                </label>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleOpenKnowledgeBaseManager}
          >
            <Plus className="h-4 w-4 mr-2" />
            Manage Knowledge Bases
          </Button>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleSaveSelection}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KnowledgeBaseSelectionDialog;
