
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ContactSearchBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ContactSearchBar: React.FC<ContactSearchBarProps> = ({
  searchTerm,
  onSearchChange
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          className="pl-9"
          placeholder={t('search')}
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      <Button variant="outline">{t('filter')}</Button>
    </div>
  );
};

export default ContactSearchBar;
