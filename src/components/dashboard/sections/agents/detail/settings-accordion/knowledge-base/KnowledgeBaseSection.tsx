
import React, { useEffect } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { KnowledgeBaseSectionProps } from '../types';
import { useKnowledgeBaseSettings } from './hooks/useKnowledgeBaseSettings';
import SelectedKnowledgeBaseList from './components/SelectedKnowledgeBaseList';
import KnowledgeBaseSelectionDialog from './components/KnowledgeBaseSelectionDialog';

const KnowledgeBaseSection: React.FC<KnowledgeBaseSectionProps> = ({ agent, updateAgentField, knowledgeBases: propKnowledgeBases }) => {
  const { t } = useLanguage();
  const { 
    knowledgeBases,
    selectedKbs, 
    dialogOpen, 
    setDialogOpen,
    getKnowledgeBaseName,
    handleDeleteKnowledgeBase,
    handleOpenKnowledgeBaseManager,
  } = useKnowledgeBaseSettings({ agent, updateAgentField, propKnowledgeBases });

  // Add debug logs to track the knowledge base data
  useEffect(() => {
    console.log('[KnowledgeBaseSection] Initial render with agent:', agent);
    console.log('[KnowledgeBaseSection] agent knowledge_base_ids:', agent?.knowledge_base_ids);
    console.log('[KnowledgeBaseSection] selectedKbs:', selectedKbs);
    console.log('[KnowledgeBaseSection] Available knowledgeBases:', knowledgeBases);
  }, [agent, selectedKbs, knowledgeBases]);

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
