
import { useLanguage } from '@/context/LanguageContext';
import { helpCenterContent } from '@/data/helpCenterContent';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface HelpCenterContentProps {
  selectedCategory: string;
  searchQuery: string;
}

const HelpCenterContent = ({ selectedCategory, searchQuery }: HelpCenterContentProps) => {
  const { t } = useLanguage();
  const [filteredContent, setFilteredContent] = useState<any[]>([]);
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);

  useEffect(() => {
    if (searchQuery) {
      // Filtrar contenido basado en la búsqueda en todas las categorías
      const results = Object.values(helpCenterContent).flat().filter(article => {
        const searchLower = searchQuery.toLowerCase();
        return (
          article.title.toLowerCase().includes(searchLower) ||
          article.content.toLowerCase().includes(searchLower)
        );
      });
      setFilteredContent(results);
    } else {
      // Mostrar contenido para la categoría seleccionada
      setFilteredContent(helpCenterContent[selectedCategory] || []);
    }
  }, [selectedCategory, searchQuery]);

  const toggleArticle = (articleId: string) => {
    setExpandedArticleId(expandedArticleId === articleId ? null : articleId);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      {searchQuery ? (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
            {t('search_results_for')} "{searchQuery}"
          </h2>
          <p className="text-muted-foreground text-sm">
            {filteredContent.length} {filteredContent.length === 1 ? t('result_found') : t('results_found')}
          </p>
        </div>
      ) : (
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          {t(selectedCategory)}
        </h2>
      )}

      {filteredContent.length > 0 ? (
        <div className="space-y-4">
          {filteredContent.map((article) => (
            <Card 
              key={article.id} 
              className="overflow-hidden border-0 shadow-sm hover:shadow transition-shadow"
            >
              <div 
                className="p-5 cursor-pointer"
                onClick={() => toggleArticle(article.id)}
              >
                <h3 className="text-lg font-medium mb-2">{article.title}</h3>
                {expandedArticleId !== article.id && (
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {article.excerpt || article.content.substring(0, 150) + '...'}
                  </p>
                )}
              </div>
              
              {expandedArticleId === article.id && (
                <div className="px-5 pb-5 pt-0 border-t dark:border-gray-700">
                  <div 
                    className="prose dark:prose-invert max-w-none text-sm pt-4"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                  <div className="mt-6 flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleArticle(article.id);
                      }}
                      className="text-xs"
                    >
                      {t('close')}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <h3 className="text-lg font-medium">{t('no_results_found')}</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            {searchQuery 
              ? t('try_different_search_terms') 
              : t('no_content_for_category')}
          </p>
        </div>
      )}
    </div>
  );
};

export default HelpCenterContent;
