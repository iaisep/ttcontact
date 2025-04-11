
import { useState } from 'react';
import { Helmet } from 'react-helmet-async'; // Changed to react-helmet-async for better React 18 compatibility
import { useLanguage } from '@/context/LanguageContext';
import HelpCenterLayout from '@/components/help-center/HelpCenterLayout';
import HelpCenterSidebar from '@/components/help-center/HelpCenterSidebar';
import HelpCenterContent from '@/components/help-center/HelpCenterContent';
import HelpCenterSearch from '@/components/help-center/HelpCenterSearch';

const HelpCenterPage = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('introduction');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Clear search when selecting a category
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>{t('help_center')} | Retell</title>
      </Helmet>

      <HelpCenterLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
              {t('help_center')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              {t('help_center_description')}
            </p>
            <HelpCenterSearch onSearch={handleSearch} />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64 shrink-0">
              <HelpCenterSidebar 
                selectedCategory={selectedCategory} 
                onSelectCategory={handleCategorySelect} 
              />
            </div>
            <div className="flex-1">
              <HelpCenterContent 
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        </div>
      </HelpCenterLayout>
    </div>
  );
};

export default HelpCenterPage;
