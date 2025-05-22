
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
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
      <div className="relative">
        <Input
          type="text"
          placeholder={t('search_help_center')}
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
          className="pr-24 pl-10 h-12 rounded-full border border-gray-200 bg-white dark:bg-gray-800 shadow-sm"
        />
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
          size={20} 
        />
        <Button 
          type="submit" 
          className="absolute right-1 top-1/2 -translate-y-1/2 h-10 rounded-full px-6"
        >
          {t('search')}
        </Button>
      </div>
    </form>
  );
};

export default HelpCenterSearch;
