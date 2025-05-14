
import React, { useState } from 'react';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';

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
  const [tempSelectedKbs, setTempSelectedKbs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize temp selection when dialog opens
  React.useEffect(() => {
    if (dialogOpen) {
      setTempSelectedKbs([...selectedKbs]);
    }
  }, [dialogOpen, selectedKbs]);

  const toggleKnowledgeBase = (kbId: string) => {
    setTempSelectedKbs(prev => {
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
      await updateAgentField('knowledge_base_ids', tempSelectedKbs);
      
      toast.success('Knowledge bases updated');
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to update knowledge bases:', error);
      toast.error('Failed to update knowledge bases');
    } finally {
      setLoading(false);
    }
  };

  return (
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
                      tempSelectedKbs.includes(kb.id) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => toggleKnowledgeBase(kb.id)}
                  >
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">{kb.name}</span>
                    </div>
                    {tempSelectedKbs.includes(kb.id) && (
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
  );
};

export default KnowledgeBaseSelectionDialog;
