
import { useState, useEffect, useMemo } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';

interface KnowledgeBase {
  id: string;
  name: string;
  created_at?: string;
}

interface UseKnowledgeBaseSettingsProps {
  agent: RetellAgent;
  updateAgentField: (field: string, value: any) => void;
  propKnowledgeBases?: KnowledgeBase[];
}

export const useKnowledgeBaseSettings = ({ 
  agent, 
  updateAgentField,
  propKnowledgeBases = []
}: UseKnowledgeBaseSettingsProps) => {
  const { fetchWithAuth } = useApiContext();
  const navigate = useNavigate();
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>(propKnowledgeBases || []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Extract knowledge base IDs from agent data
  const selectedKbs = useMemo(() => {
    if (!agent) return [];
    
    if (agent.knowledge_base_ids && Array.isArray(agent.knowledge_base_ids)) {
      console.log('[useKnowledgeBaseSettings] Using knowledge_base_ids from agent:', agent.knowledge_base_ids);
      return agent.knowledge_base_ids;
    } else if (agent.knowledge_base) {
      // Backward compatibility
      console.log('[useKnowledgeBaseSettings] Using legacy knowledge_base from agent:', agent.knowledge_base);
      return [agent.knowledge_base];
    }
    return [];
  }, [agent]);

  // Fetch knowledge bases if they weren't provided through props
  useEffect(() => {
    const fetchKnowledgeBases = async () => {
      if (propKnowledgeBases && propKnowledgeBases.length > 0) {
        console.log('[useKnowledgeBaseSettings] Using provided knowledge bases:', propKnowledgeBases);
        setKnowledgeBases(propKnowledgeBases);
        return;
      }

      try {
        setIsLoading(true);
        console.log('[useKnowledgeBaseSettings] Fetching knowledge bases...');
        const data = await fetchWithAuth('/list-knowledge-bases');
        
        // Format the data consistently
        const formattedData = data.map((kb: any) => ({
          id: kb.knowledge_base_id || kb.id,
          name: kb.knowledge_base_name || kb.name,
          created_at: kb.user_modified_timestamp 
            ? new Date(kb.user_modified_timestamp).toISOString() 
            : kb.created_at
        }));
        
        console.log('[useKnowledgeBaseSettings] Fetched knowledge bases:', formattedData);
        setKnowledgeBases(formattedData);
      } catch (error) {
        console.error('Failed to fetch knowledge bases:', error);
        toast.error('Failed to fetch knowledge bases');
      } finally {
        setIsLoading(false);
      }
    };

    fetchKnowledgeBases();
  }, [fetchWithAuth, propKnowledgeBases]);

  // Log changes to selected knowledge bases for debugging
  useEffect(() => {
    console.log('[useKnowledgeBaseSettings] Selected KBs:', selectedKbs);
    console.log('[useKnowledgeBaseSettings] Available KBs:', knowledgeBases);
  }, [selectedKbs, knowledgeBases]);

  // Function to get knowledge base name by ID
  const getKnowledgeBaseName = (kbId: string): string => {
    const kb = knowledgeBases.find(kb => kb.id === kbId);
    return kb ? kb.name : kbId;
  };

  // Function to handle deletion of a knowledge base from the agent
  const handleDeleteKnowledgeBase = (kbId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const newKbIds = selectedKbs.filter(id => id !== kbId);
    console.log(`[useKnowledgeBaseSettings] Removing KB ${kbId}, new selection:`, newKbIds);
    
    // Update the agent with the new knowledge base IDs
    updateAgentField('knowledge_base_ids', newKbIds);
    
    toast.success('Knowledge base removed');
  };

  // Function to open the Knowledge Base manager page
  const handleOpenKnowledgeBaseManager = () => {
    setDialogOpen(false);
    navigate('/knowledge-base');
  };

  return {
    knowledgeBases,
    selectedKbs,
    dialogOpen,
    setDialogOpen,
    isLoading,
    getKnowledgeBaseName,
    handleDeleteKnowledgeBase,
    handleOpenKnowledgeBaseManager,
  };
};
