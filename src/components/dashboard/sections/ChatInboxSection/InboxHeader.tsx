
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

interface InboxHeaderProps {
  onAddInbox: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

const InboxHeader: React.FC<InboxHeaderProps> = ({ 
  onAddInbox, 
  searchQuery = '',
  setSearchQuery 
}) => {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inboxes</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage your communication channels
        </p>
      </div>
      
      <div className="flex items-center space-x-4">
        {setSearchQuery && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search inboxes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        )}
        
        <Button onClick={onAddInbox} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Inbox
        </Button>
      </div>
    </div>
  );
};

export default InboxHeader;
