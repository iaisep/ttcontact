
import React from 'react';
import { RetellAgent } from '@/components/dashboard/sections/agents/types/retell-types';
import { useLanguage } from '@/context/LanguageContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';

interface KnowledgeBase {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

interface KnowledgeBaseEditorProps {
  agent: RetellAgent;
  knowledgeBases: KnowledgeBase[];
  onUpdate: (value: string[]) => void;
}

const KnowledgeBaseEditor: React.FC<KnowledgeBaseEditorProps> = ({
  agent,
  knowledgeBases,
  onUpdate
}) => {
  const { t } = useLanguage();
  const [selectedKbs, setSelectedKbs] = React.useState<string[]>(() => {
    if (agent.knowledge_base_ids && Array.isArray(agent.knowledge_base_ids)) {
      return agent.knowledge_base_ids;
    } else if (agent.knowledge_base) {
      return [agent.knowledge_base];
    }
    return [];
  });

  const handleKbChange = (kbId: string, checked: boolean) => {
    let newSelectedKbs;
    if (checked) {
      newSelectedKbs = [...selectedKbs, kbId];
    } else {
      newSelectedKbs = selectedKbs.filter(id => id !== kbId);
    }
    setSelectedKbs(newSelectedKbs);
    onUpdate(newSelectedKbs);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-medium">{t('knowledge_bases')}</h3>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {t('add_knowledge_base')}
        </Button>
      </div>

      {knowledgeBases.length === 0 ? (
        <div className="py-4 text-center text-gray-500">
          {t('no_knowledge_bases')}
        </div>
      ) : (
        <div className="space-y-2">
          {knowledgeBases.map((kb) => (
            <div key={kb.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id={`kb-${kb.id}`}
                  checked={selectedKbs.includes(kb.id)}
                  onCheckedChange={(checked) => handleKbChange(kb.id, !!checked)}
                />
                <label 
                  htmlFor={`kb-${kb.id}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {kb.name || kb.id}
                </label>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleKbChange(kb.id, false)}
                disabled={!selectedKbs.includes(kb.id)}
              >
                <Trash className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KnowledgeBaseEditor;
