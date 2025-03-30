
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';

interface AgentsToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  folderFilter: string;
  setFolderFilter: (folder: string) => void;
  folders: string[];
  onCreateClick: () => void;
}

const AgentsToolbar: React.FC<AgentsToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  folderFilter,
  setFolderFilter,
  folders,
  onCreateClick,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Agents</h1>
        <Button onClick={onCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Create Agent
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search agents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative w-64">
          <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <select
            className="w-full h-10 rounded-md border border-input bg-background px-8 py-2"
            value={folderFilter}
            onChange={(e) => setFolderFilter(e.target.value)}
          >
            <option value="">All Folders</option>
            {folders.map((folder) => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AgentsToolbar;
