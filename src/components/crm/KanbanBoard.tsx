
import React, { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';

interface KanbanTask {
  id: string;
  title: string;
  description?: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  tasks: KanbanTask[];
}

const KanbanBoard = () => {
  const { t } = useLanguage();
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: 'initial-stage',
      title: 'Initial Stage',
      tasks: []
    },
    {
      id: 'to-do',
      title: 'To Do',
      tasks: []
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleAddTask = (columnId: string) => {
    const newTaskId = `task-${Date.now()}`;
    
    setColumns(columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: [
            ...column.tasks,
            { id: newTaskId, title: 'New Contact' }
          ]
        };
      }
      return column;
    }));
  };

  const handleAddColumn = () => {
    const newColumnId = `column-${Date.now()}`;
    
    setColumns([
      ...columns,
      {
        id: newColumnId,
        title: 'New Column',
        tasks: []
      }
    ]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Kanban Board Header */}
      <div className="flex justify-between items-center mb-4 pb-4 border-b">
        <div className="flex space-x-2">
          <h1 className="text-2xl font-semibold">CRM</h1>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <span>test</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder={t('Search')}
              className="pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-2 top-2.5">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
          <Button variant="outline" className="flex items-center gap-1">
            <span>Filter</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            Call
          </Button>
          <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
            Create Campaign
          </Button>
          <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
            <Plus className="h-4 w-4 mr-1" /> Add Column
          </Button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="flex space-x-4 overflow-x-auto pb-4 flex-1">
        {columns.map((column) => (
          <div key={column.id} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-w-[300px] max-w-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">{column.title}</h3>
              <span className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                {column.tasks.length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px]">
              {column.tasks.map((task) => (
                <Card key={task.id} className="p-3 bg-white dark:bg-gray-700 cursor-pointer hover:shadow-md">
                  <div className="font-medium">{task.title}</div>
                  {task.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{task.description}</p>
                  )}
                </Card>
              ))}
            </div>
            
            <Button 
              variant="ghost" 
              className="mt-3 justify-center text-gray-500 hover:text-gray-800"
              onClick={() => handleAddTask(column.id)}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Contact
            </Button>
          </div>
        ))}
        
        <div className="flex-shrink-0">
          <Button 
            variant="outline" 
            className="h-16 w-16 rounded-full"
            onClick={handleAddColumn}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
