
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, RefreshCw, Link, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import AgentTemplateDialog from './AgentTemplateDialog';

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
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  
  // Mock folders for demonstration
  const folders = ['Personal', 'Business', 'Support'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('agents')}</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('create_agent')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem 
                onClick={() => setShowTemplateDialog(true)}
                className="flex items-center py-2"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                <div>
                  <p className="font-medium">Single Prompt Agent</p>
                  <p className="text-xs text-muted-foreground">For short calls and straightforward tasks</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                disabled
                className="flex items-center py-2 opacity-50"
              >
                <Link className="mr-2 h-4 w-4" />
                <div>
                  <p className="font-medium">Conversation Flow Agent</p>
                  <p className="text-xs text-muted-foreground">For tasks with complex transitions</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
      
      {showTemplateDialog && (
        <AgentTemplateDialog 
          open={showTemplateDialog} 
          onClose={() => setShowTemplateDialog(false)}
          onSelectTemplate={() => {
            setShowTemplateDialog(false);
            onAddAgent();
          }}
        />
      )}
    </div>
  );
};

export default AgentsToolbar;
