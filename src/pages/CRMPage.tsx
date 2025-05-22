
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KanbanBoard from '@/components/crm/KanbanBoard';
import ContactsTable from '@/components/crm/ContactsTable';
import { useLanguage } from '@/context/LanguageContext';

const CRMPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto p-6 h-full">
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
