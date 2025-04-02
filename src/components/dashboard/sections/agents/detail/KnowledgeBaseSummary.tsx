
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface KnowledgeBase {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

interface KnowledgeBaseSummaryProps {
  knowledgeBases: KnowledgeBase[];
}

const KnowledgeBaseSummary: React.FC<KnowledgeBaseSummaryProps> = ({ 
  knowledgeBases
}) => {
  const { t } = useLanguage();
  
  if (knowledgeBases.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <h3 className="text-sm font-medium mb-2">{t('knowledge_bases')}</h3>
      <div className="flex flex-wrap gap-2">
        {knowledgeBases.map(kb => (
          <div key={kb.id} className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full text-xs">
            {kb.name || kb.id}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeBaseSummary;
