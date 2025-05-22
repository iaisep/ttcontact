
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { Plus, Import } from 'lucide-react';

interface ContactHeaderProps {
  onAddContact: () => void;
  onImport: () => void;
}

export const ContactHeader: React.FC<ContactHeaderProps> = ({ 
  onAddContact, 
  onImport 
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">{t('contacts')}</h1>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onImport} className="flex gap-1 items-center">
          <Import className="h-4 w-4" />
          <span>{t('importar')}</span>
        </Button>
        <Button onClick={onAddContact} className="flex gap-1 items-center">
          <Plus className="h-4 w-4" />
          <span>{t('add_contact')}</span>
        </Button>
      </div>
    </div>
  );
};

export default ContactHeader;
