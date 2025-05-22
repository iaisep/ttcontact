
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KanbanBoard from '@/components/crm/KanbanBoard';

const CRMPage = () => {
  return (
    <div className="container mx-auto p-6 h-full">
      <Tabs defaultValue="kanban" className="h-full">
        <TabsList>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
        </TabsList>
        <TabsContent value="contacts" className="h-[calc(100%-40px)]">
          <div className="border rounded-md p-4 h-full">
            <h1 className="text-2xl font-bold mb-4">Contacts</h1>
            <div className="text-center py-10 text-gray-500">
              Contact management view will be implemented here.
            </div>
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
