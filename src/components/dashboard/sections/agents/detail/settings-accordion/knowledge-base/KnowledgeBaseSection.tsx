
import React, { useEffect } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { KnowledgeBaseSectionProps } from '../types';
import { useKnowledgeBaseApi } from '@/components/dashboard/sections/knowledge-base/hooks/api/useKnowledgeBaseApi';
import { toast } from 'sonner';
import { useApiContext } from '@/context/ApiContext';
import SelectedKnowledgeBaseList from './components/SelectedKnowledgeBaseList';
import KnowledgeBaseSelectionDialog from './components/KnowledgeBaseSelectionDialog';

const KnowledgeBaseSection: React.FC<KnowledgeBaseSectionProps> = ({ agent, updateAgentField, knowledgeBases: propKnowledgeBases }) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useApiContext();
  const { fetchKnowledgeBases: apiFetchKnowledgeBases } = useKnowledgeBaseApi();
  
  const [knowledgeBases, setKnowledgeBases] = React.useState<any[]>([]);
  const [selectedKbs, setSelectedKbs] = React.useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Get the LLM ID from the agent
  const llmId = agent?.response_engine?.llm_id;

  // Effect to fetch LLM data and get knowledge base IDs when component mounts or LLM ID changes
  useEffect(() => {
    console.log('KnowledgeBaseSection useEffect running with llmId:', llmId);
    if (!llmId) {
      console.log('No LLM ID found in agent');
      setLoading(false);
      return;
    }
    
    fetchLlmKnowledgeBases();
  }, [llmId]);

  // Load initial knowledge bases from props if available
  useEffect(() => {
    if (propKnowledgeBases && propKnowledgeBases.length > 0) {
      console.log('Setting knowledge bases from props:', propKnowledgeBases);
      setKnowledgeBases(propKnowledgeBases);
    } else if (!loading && knowledgeBases.length === 0) {
      console.log('No knowledge bases from props, fetching all');
      fetchAllKnowledgeBases();
    }
  }, [propKnowledgeBases, loading]);

  // Function to fetch knowledge bases associated with the LLM
  const fetchLlmKnowledgeBases = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching LLM knowledge bases for:', llmId);
      const llmData = await fetchWithAuth(`/get-retell-llm/${llmId}`);
      console.log('LLM data retrieved:', llmData);
      
      if (llmData && llmData.knowledge_base_ids && Array.isArray(llmData.knowledge_base_ids)) {
        // Set the selected knowledge bases from the LLM
        console.log('Setting selected knowledge bases:', llmData.knowledge_base_ids);
        setSelectedKbs(llmData.knowledge_base_ids);
        
        // If we have prop knowledge bases, filter them to match the LLM's knowledge bases
        if (propKnowledgeBases && propKnowledgeBases.length > 0) {
          const filtered = propKnowledgeBases.filter(kb => 
            llmData.knowledge_base_ids.includes(kb.id)
          );
          console.log('Filtered knowledge bases from props:', filtered);
          setKnowledgeBases(filtered);
        } else {
          // Fetch all knowledge bases and filter them
          await fetchAllKnowledgeBases(llmData.knowledge_base_ids);
        }
      } else {
        console.log('No knowledge_base_ids found in LLM data');
        setSelectedKbs([]);
      }
    } catch (error) {
      console.error('Error fetching LLM knowledge bases:', error);
      setError('Failed to load knowledge bases from LLM');
      toast.error('Failed to load knowledge bases from LLM');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch all knowledge bases
  const fetchAllKnowledgeBases = async (filterIds?: string[]) => {
    try {
      setLoading(true);
      console.log('Fetching all knowledge bases');
      
      const allKnowledgeBases = await apiFetchKnowledgeBases();
      console.log('All knowledge bases fetched:', allKnowledgeBases);
      
      if (filterIds && filterIds.length > 0) {
        // Filter knowledge bases by the provided IDs
        const filtered = allKnowledgeBases.filter(kb => 
          filterIds.includes(kb.id)
        );
        console.log('Filtered knowledge bases by IDs:', filtered);
        setKnowledgeBases(filtered);
      } else {
        console.log('Setting all knowledge bases');
        setKnowledgeBases(allKnowledgeBases);
      }
    } catch (error) {
      console.error('Error fetching all knowledge bases:', error);
      toast.error('Failed to load knowledge bases');
    } finally {
      setLoading(false);
    }
  };

  // Function to get knowledge base name from ID
  const getKnowledgeBaseName = (kbId: string) => {
    const kb = knowledgeBases.find(kb => kb.id === kbId);
    return kb ? kb.name : kbId;
  };

  // Function to handle removing a knowledge base
  const handleDeleteKnowledgeBase = (kbId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newSelectedKbs = selectedKbs.filter(id => id !== kbId);
    setSelectedKbs(newSelectedKbs);
    updateAgentField('knowledge_base_ids', newSelectedKbs);
    toast.success('Knowledge base removed');
  };

  // Function to handle opening the knowledge base manager
  const handleOpenKnowledgeBaseManager = () => {
    window.open('/dashboard?section=knowledge-base', '_blank');
  };

  // Function to update knowledge bases in the LLM
  const updateLlmKnowledgeBases = async (kbIds: string[]) => {
    try {
      console.log('Updating LLM knowledge bases:', kbIds);
      await fetchWithAuth(`/update-retell-llm/${llmId}`, {
        method: 'PATCH',
        body: JSON.stringify({ knowledge_base_ids: kbIds })
      });
      toast.success('Knowledge bases updated in LLM');
      return true;
    } catch (error) {
      console.error('Error updating LLM knowledge bases:', error);
      toast.error('Failed to update knowledge bases in LLM');
      return false;
    }
  };

  // Render loading state
  if (loading) {
    return (
      <AccordionItem value="knowledge-base" className="mt-4 border rounded-md overflow-hidden">
        <AccordionTrigger className="px-4 py-2 text-sm font-medium bg-gray-50 hover:bg-gray-100 flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          {t('knowledge_base')}
        </AccordionTrigger>
        <AccordionContent className="p-4">
          <div className="flex justify-center items-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  }

  // Render error state
  if (error) {
    return (
      <AccordionItem value="knowledge-base" className="mt-4 border rounded-md overflow-hidden">
        <AccordionTrigger className="px-4 py-2 text-sm font-medium bg-gray-50 hover:bg-gray-100 flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          {t('knowledge_base')}
        </AccordionTrigger>
        <AccordionContent className="p-4">
          <div className="text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchLlmKnowledgeBases}>
              Retry
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  }

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
          <SelectedKnowledgeBaseList 
            selectedKbs={selectedKbs}
            getKnowledgeBaseName={getKnowledgeBaseName}
            handleDeleteKnowledgeBase={handleDeleteKnowledgeBase}
          />

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
      <KnowledgeBaseSelectionDialog 
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        knowledgeBases={knowledgeBases}
        selectedKbs={selectedKbs}
        agent={agent}
        updateAgentField={updateAgentField}
        handleOpenKnowledgeBaseManager={handleOpenKnowledgeBaseManager}
      />
    </AccordionItem>
  );
};

export default KnowledgeBaseSection;
