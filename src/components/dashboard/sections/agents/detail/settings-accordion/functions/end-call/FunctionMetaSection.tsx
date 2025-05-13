
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/LanguageContext';

interface FunctionMetaSectionProps {
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
}

const FunctionMetaSection: React.FC<FunctionMetaSectionProps> = ({
  name,
  setName,
  description,
  setDescription
}) => {
  const { t } = useLanguage();
  
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">{t('name')}</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('function_name')}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">
          {t('description')} <span className="text-xs text-muted-foreground">({t('optional')})</span>
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('function_description')}
          rows={3}
        />
      </div>
    </>
  );
};

export default FunctionMetaSection;
