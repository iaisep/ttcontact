
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface AgentsToolbarProps {
  onAddAgent: () => void;
  onImportAgents: () => void;
  onRefreshAgents: () => void;
}

const AgentsToolbar: React.FC<AgentsToolbarProps> = ({
  onAddAgent,
  onImportAgents,
  onRefreshAgents,
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [folderFilter, setFolderFilter] = useState('');
  
  // Mock folders for demonstration
  const folders = ['Personal', 'Business', 'Support'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('agents')}</h1>
        <div className="flex gap-2">
          <Button onClick={onAddAgent}>
            <Plus className="mr-2 h-4 w-4" />
            {t('create_agent')}
          </Button>
          <Button variant="outline" onClick={onImportAgents}>
            {t('import')}
          </Button>
          <Button variant="ghost" size="icon" onClick={onRefreshAgents} title={t('refresh')}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('search_agents')}
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
            <option value="">{t('all_folders')}</option>
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
