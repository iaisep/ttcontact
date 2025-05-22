
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, BookText, Phone, History, Code, Key, 
  FileText, Settings, Shield, FileQuestion, Headphones
} from 'lucide-react';

interface HelpCenterSidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const HelpCenterSidebar = ({ 
  selectedCategory, 
  onSelectCategory 
}: HelpCenterSidebarProps) => {
  const { t } = useLanguage();

  const categories = [
    { id: 'introduction', name: t('introduction'), icon: BookOpen },
    { id: 'guides', name: t('guides'), icon: BookText },
    { id: 'agents', name: t('agents'), icon: Headphones },
    { id: 'phone-numbers', name: t('phone_numbers'), icon: Phone },
    { id: 'call-history', name: t('call_history'), icon: History },
    { id: 'api', name: t('api'), icon: Code },
    { id: 'api-keys', name: t('api_keys'), icon: Key },
    { id: 'knowledge-base', name: t('knowledge_base'), icon: FileText },
    { id: 'security', name: t('security'), icon: Shield },
    { id: 'settings', name: t('settings'), icon: Settings },
    { id: 'faq', name: t('faq'), icon: FileQuestion },
  ];

  return (
    <aside className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold px-2 text-gray-800 dark:text-gray-100">{t('documentation')}</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="p-3">
          <nav className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => onSelectCategory(category.id)}
                  className={cn(
                    "flex items-center w-full px-3 py-2.5 text-sm rounded-md transition-colors",
                    selectedCategory === category.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  <Icon size={16} className="mr-3 shrink-0" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default HelpCenterSidebar;
