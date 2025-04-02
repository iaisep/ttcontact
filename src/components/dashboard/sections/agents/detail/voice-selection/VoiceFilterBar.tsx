
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus, Search, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface VoiceFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  genderFilter: string;
  setGenderFilter: (filter: string) => void;
  accentFilter: string;
  setAccentFilter: (filter: string) => void;
  typeFilter: string;
  setTypeFilter: (filter: string) => void;
}

const VoiceFilterBar: React.FC<VoiceFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  genderFilter,
  setGenderFilter,
  accentFilter,
  setAccentFilter,
  typeFilter,
  setTypeFilter
}) => {
  const { t } = useLanguage();

  const resetFilters = () => {
    // Reset filters to default values without reloading the page
    setSearchTerm('');
    setGenderFilter('all');
    setAccentFilter('all');
    setTypeFilter('all');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Button 
          variant="outline" 
          className="h-9 gap-2 bg-white hover:bg-gray-50 text-gray-700 border-gray-200 rounded-full"
        >
          <Plus className="h-4 w-4" />
          {t('add_custom_voice') || 'Add custom voice'}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={resetFilters}
          className="h-9 gap-2 text-gray-500 hover:text-gray-700"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {t('reset_filters') || 'Reset filters'}
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder={t('search_voices') || 'Search voices...'} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-10 border-gray-200 bg-white rounded-full"
        />
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Select value={genderFilter} onValueChange={setGenderFilter}>
          <SelectTrigger className="w-32 h-9 bg-white border-gray-200 rounded-full">
            <SelectValue placeholder={t('gender') || 'Gender'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all_genders') || 'All Genders'}</SelectItem>
            <SelectItem value="male">{t('male') || 'Male'}</SelectItem>
            <SelectItem value="female">{t('female') || 'Female'}</SelectItem>
            <SelectItem value="neutral">{t('neutral') || 'Neutral'}</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={accentFilter} onValueChange={setAccentFilter}>
          <SelectTrigger className="w-32 h-9 bg-white border-gray-200 rounded-full">
            <SelectValue placeholder={t('accent') || 'Accent'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all_accents') || 'All Accents'}</SelectItem>
            <SelectItem value="american">{t('american') || 'American'}</SelectItem>
            <SelectItem value="british">{t('british') || 'British'}</SelectItem>
            <SelectItem value="indian">{t('indian') || 'Indian'}</SelectItem>
            <SelectItem value="australian">{t('australian') || 'Australian'}</SelectItem>
            <SelectItem value="spanish">{t('spanish') || 'Spanish'}</SelectItem>
            <SelectItem value="french">{t('french') || 'French'}</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-32 h-9 bg-white border-gray-200 rounded-full">
            <SelectValue placeholder={t('types') || 'Types'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all_types') || 'All Types'}</SelectItem>
            <SelectItem value="retail">{t('retail') || 'Retail'}</SelectItem>
            <SelectItem value="provider">{t('provider') || 'Provider'}</SelectItem>
            <SelectItem value="custom">{t('custom') || 'Custom'}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default VoiceFilterBar;
