
import { useState, useEffect } from 'react';
import { useApiContext } from '@/context/ApiContext';
import { toast } from 'sonner';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';

interface KnowledgeBase {
  id: string;
  name: string;
  created_at: string;
}

interface UseKnowledgeBaseSettingsProps {
  agent: RetellAgent;
  updateAgentField: (field: string, value: any) => void;
  propKnowledgeBases?: KnowledgeBase[];
}

export const useKnowledgeBaseSettings = ({ 
  agent, 
  updateAgentField, 
  propKnowledgeBases 
}: UseKnowledgeBaseSettingsProps) => {
  const { fetchWithAuth } = useApiContext();
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [selectedKbs, setSelectedKbs] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('useKnowledgeBaseSettings - agent:', agent);
    
    // Debug logs
    console.log('useKnowledgeBaseSettings - propKnowledgeBases:', propKnowledgeBases);
    console.log('useKnowledgeBaseSettings - agent.knowledge_base_ids:', agent?.knowledge_base_ids);
    console.log('useKnowledgeBaseSettings - agent.knowledge_base:', agent?.knowledge_base);
    
    // Use knowledge bases from props if provided
    if (propKnowledgeBases && propKnowledgeBases.length > 0) {
      setKnowledgeBases(propKnowledgeBases);
    } else {
      // If props don't have knowledge bases, fetch them
      fetchKnowledgeBases();
    }
    
    // Get selected knowledge bases from agent data
    const selectedIds: string[] = [];
    
    // Check for knowledge_base_ids array first (preferred)
    if (agent?.knowledge_base_ids && Array.isArray(agent.knowledge_base_ids)) {
      selectedIds.push(...agent.knowledge_base_ids);
      console.log('Setting selected KBs from knowledge_base_ids:', agent.knowledge_base_ids);
    } 
    // Then check for single knowledge_base field (legacy)
    else if (agent?.knowledge_base && typeof agent.knowledge_base === 'string') {
      selectedIds.push(agent.knowledge_base);
      console.log('Setting selected KBs from knowledge_base:', agent.knowledge_base);
    }
    
    // Update selected knowledge bases
    if (selectedIds.length > 0) {
      setSelectedKbs(selectedIds);
      console.log('Setting selectedKbs to:', selectedIds);
    }
  }, [agent, propKnowledgeBases]);

  const fetchKnowledgeBases = async () => {
    // If we already have knowledge bases from props, don't fetch again
    if (propKnowledgeBases && propKnowledgeBases.length > 0) {
      console.log('Using knowledge bases from props:', propKnowledgeBases);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching knowledge bases...');
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
        console.log('Knowledge bases set:', formattedKbs);
      } else {
        // Fallback to mock data for development
        const mockKbs: KnowledgeBase[] = [
          { id: 'kb_123', name: 'Product Documentation', created_at: new Date().toISOString() },
          { id: 'kb_456', name: 'Customer FAQs', created_at: new Date().toISOString() },
          { id: 'kb_789', name: 'Pricing Information', created_at: new Date().toISOString() }
        ];
        setKnowledgeBases(mockKbs);
        console.log('Using mock knowledge bases:', mockKbs);
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

  const handleDeleteKnowledgeBase = (kbId: string, event: React.MouseEvent) => {
    // Stop propagation to prevent the parent from handling the click
    event.stopPropagation();
    
    // Remove this KB from selected KBs
    const updatedKbs = selectedKbs.filter(id => id !== kbId);
    setSelectedKbs(updatedKbs);
    
    // Update the agent right away
    updateAgentField('knowledge_base_ids', updatedKbs);
    
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

  return {
    knowledgeBases,
    selectedKbs,
    dialogOpen,
    setDialogOpen,
    loading,
    getKnowledgeBaseName,
    handleDeleteKnowledgeBase,
    handleOpenKnowledgeBaseManager,
  };
};
