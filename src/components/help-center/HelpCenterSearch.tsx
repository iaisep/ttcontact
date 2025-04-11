
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface HelpCenterSearchProps {
  onSearch: (query: string) => void;
}

const HelpCenterSearch = ({ onSearch }: HelpCenterSearchProps) => {
  const { t } = useLanguage();
  const [searchInputValue, setSearchInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInputValue);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      <div className="relative">
        <Input
          type="text"
          placeholder={t('search_help_center')}
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
          className="pr-12 pl-10 h-12 rounded-full border border-gray-300 dark:border-gray-600"
        />
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
          size={20} 
        />
        <Button 
          type="submit" 
          size="sm" 
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full h-8"
        >
          {t('search')}
        </Button>
      </div>
    </form>
  );
};

export default HelpCenterSearch;
