
import { useLanguage } from '@/context/LanguageContext';
import { helpCenterContent } from '@/data/helpCenter';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';

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
      // Filter content based on search query across all categories
      const results = Object.values(helpCenterContent).flat().filter(article => {
        const searchLower = searchQuery.toLowerCase();
        return (
          article.title.toLowerCase().includes(searchLower) ||
          article.content.toLowerCase().includes(searchLower)
        );
      });
      setFilteredContent(results);
    } else {
      // Show content for the selected category
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
              className="overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow transition-shadow"
            >
              <div 
                className="p-5 cursor-pointer"
                onClick={() => toggleArticle(article.id)}
              >
                <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-100">{article.title}</h3>
                {expandedArticleId !== article.id && (
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {article.excerpt || article.content.substring(0, 150) + '...'}
                  </p>
                )}
              </div>
              
              {expandedArticleId === article.id && (
                <div className="px-6 pb-6 pt-0 border-t dark:border-gray-700">
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute right-0 top-2 rounded-full p-1 h-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleArticle(article.id);
                      }}
                    >
                      <X size={16} className="text-gray-500" />
                    </Button>
                  </div>
                  
                  <div 
                    className="prose dark:prose-invert max-w-none text-sm pt-4 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mt-6 [&>h2]:mb-3 
                    [&>h3]:text-lg [&>h3]:font-medium [&>h3]:mt-5 [&>h3]:mb-2 
                    [&>p]:my-3 [&>p]:leading-relaxed 
                    [&>ul]:pl-5 [&>ul]:my-3 [&>ol]:pl-5 [&>ol]:my-3
                    [&>ul>li]:mb-1 [&>ol>li]:mb-1 [&>*:first-child]:mt-0
                    [&>blockquote]:border-l-4 [&>blockquote]:border-gray-200 [&>blockquote]:pl-4 [&>blockquote]:py-0.5 [&>blockquote]:my-4
                    [&>pre]:bg-gray-50 [&>pre]:dark:bg-gray-800 [&>pre]:p-4 [&>pre]:rounded [&>pre]:overflow-x-auto [&>pre]:my-4"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
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
