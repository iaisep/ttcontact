
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KanbanBoard from '@/components/crm/KanbanBoard';
import ContactsTable from '@/components/crm/ContactsTable';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CRMPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto p-6 h-full">
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link to="/dashboard">
            <ChevronLeft className="h-4 w-4" />
            {t('back_to_dashboard')}
          </Link>
        </Button>
      </div>
      
      <Tabs defaultValue="contacts" className="h-full">
        <TabsList>
          <TabsTrigger value="contacts">{t('contacts')}</TabsTrigger>
          <TabsTrigger value="kanban">{t('kanban')}</TabsTrigger>
        </TabsList>
        <TabsContent value="contacts" className="h-[calc(100%-40px)]">
          <div className="border rounded-md p-4 h-full">
            <ContactsTable />
          </div>
        </TabsContent>
        <TabsContent value="kanban" className="h-[calc(100%-40px)]">
          <div className="border rounded-md p-4 h-full">
            <KanbanBoard />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMPage;
