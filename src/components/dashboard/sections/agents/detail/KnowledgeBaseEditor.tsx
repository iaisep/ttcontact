
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { debounce } from 'lodash';

interface KnowledgeBaseEditorProps {
  knowledgeBase: string;
  onUpdate: (value: string) => void;
}

const KnowledgeBaseEditor: React.FC<KnowledgeBaseEditorProps> = ({ knowledgeBase, onUpdate }) => {
  const { t } = useLanguage();
  const [value, setValue] = useState(knowledgeBase);
  
  useEffect(() => {
    setValue(knowledgeBase);
  }, [knowledgeBase]);

  // Create debounced update function
  const debouncedUpdate = debounce((value) => onUpdate(value), 1000);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedUpdate(newValue);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setValue(content);
      onUpdate(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <input
          type="file"
          id="knowledge-file"
          className="hidden"
          accept=".txt,.md,.csv"
          onChange={handleFileUpload}
        />
        <Button 
          variant="outline" 
          onClick={() => document.getElementById('knowledge-file')?.click()}
        >
          {t('upload_knowledge_file')}
        </Button>
      </div>

      <Textarea
        value={value}
        onChange={handleChange}
        className="min-h-[400px] font-mono text-sm"
        placeholder={t('knowledge_base_placeholder')}
      />
      <p className="mt-2 text-sm text-muted-foreground">
        {t('knowledge_base_description')}
      </p>
    </div>
  );
};

export default KnowledgeBaseEditor;
