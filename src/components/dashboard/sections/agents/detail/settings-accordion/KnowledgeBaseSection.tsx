
import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Trash } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { AccordionSectionProps } from './types';

const KnowledgeBaseSection: React.FC<AccordionSectionProps> = ({ agent }) => {
  const { t } = useLanguage();

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

          <div className="space-y-2">
            {/* Knowledge Base Items */}
            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">base de conocimientos 1</span>
              </div>
              <div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <Button variant="outline" size="sm" className="text-xs">
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default KnowledgeBaseSection;
